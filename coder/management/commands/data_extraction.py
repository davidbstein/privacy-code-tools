import os
from django.core.management.base import BaseCommand, CommandError
import datetime
import json
import csv
from coder.api import models
from collections import defaultdict
DATA_FOLDER = os.path.realpath(os.path.dirname(__file__) + "/../../../data_folder/")

MERGE_CODER = "florencia.m.wurgler@gmail.com"
ADMINS = ('davidbstein@gmail.com', 'dbs438@nyu.edu')

TIMESTAMP = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
TESTING = False

def _open_csv(fname, write=True):
    fpath = "{folder}/{test}{ts}/".format(folder=DATA_FOLDER, fname=fname, ts=TIMESTAMP, test="TEST" if TESTING else "")
    fname = "{ts}-{fname}.csv".format(folder=DATA_FOLDER, fname=fname, ts=TIMESTAMP)
    if not os.path.exists(os.path.realpath(fpath)):
        os.makedirs(os.path.realpath(fpath))
    return open("{}/{}".format(fpath, fname), 'w' if write else 'r', newline="")

def _serialize_cvs(cvs):
    """
    Input: a list of coding values
    Output: a dict, keyed on identifier, with a dict value as described above
    """
    return {
        k: _serialize_values(k, v)
        for k, v in cvs.items() if k.startswith('v')
    }

def _serialize_values(k, vs):
    return {
        'confidence': vs['confidence'] and int(vs['confidence']),
        'values': list(sorted([k for k, v in vs['values'].items() if v])),
        'sentences': sum([
            sum([len(paragraph_sentences) for paragraph_sentences in policy_sentences.values()])
            for policy_sentences in vs['sentences'].values()
        ])
    }

def _serialize_ci(ci):
    """
    Input: a CodingInstance
    Output: a dictionary with fields:
        email: coder's email
        policy_instance_id: policy website (ie google.com)
        codign values: a dict keyed on the coding identifier.
            each coding_value is a dict of {OPP, confidence, values (list of strings), sentences (count)}
    """
    return dict(
        email = ci.coder_email,
        policy_instance_id = models.Policy.objects.get(
            id=models.PolicyInstance.objects.get(
                id=ci.policy_instance_id
                ).policy_id
            ).site_name,
        coding_values = _serialize_cvs(ci.coding_values)
        )

def get_serialized_coding_instances(coding_id):
    if TESTING:
        cis = list(models.CodingInstance.objects.all().filter(coding_id=coding_id)[:10])
    else:
        cis = list(models.CodingInstance.objects.all().filter(coding_id=coding_id))
    return [_serialize_ci(ci) for ci in cis if ci.coder_email not in ADMINS]

def get_questions(coding_id):
    """
    returns a lsit of questions with fields:
        info: the question
        details: instructions
        type: singleselect, multiselect, ect.
        values: a list of {label, value} dicts
        values_raw: a comma-seporated list of values
        opp_info: informatino from OPP if appropriate
        ccpa_info / gdpr_info / threshold
        identifier: the key for references to this question
    """
    return models.Coding.objects.get(id=coding_id).questions

def get_opp_categories(questions):
    """
    extracts [category, attribute] tuples from OPP questions
    returns a dict keyed on question ID containing the tuple
    """
    pp_to_opp = {}
    for q in questions:
        if q.get('opp_info'):
            clean_q = q['opp_info'].split("Does/Does Not")[0].replace("\n", '').replace(":", "")
            split = clean_q.split("[")
            if len(split) == 1:
                pp_to_opp[q['identifier']] = [split[0].strip(), None]
                continue
            cat, values = split
            cat = cat.strip()
            values = values.strip()
            for i, val in enumerate(values[:-1].split(',')):
                val = val.strip()
                pp_to_opp["{}({})".format(q['identifier'],i)] = [cat, val]
    return pp_to_opp

############################################
########## retrieval logic #################
############################################

def _format_question_values(q):
    """ make question values human readable """
    return "\n".join(
            "({}) - {}".format(v.get("value"), v.get('label'))
            for v in q['values']
        )

def gen_questions_csv(coding_id, questions):
    fieldnames = (
        'identifier,type,info,values,opp_category,'
        'opp_attribute,question,details,opp_info,ccpa_info,gdpr_info,threshold,values_raw,'
        ).split(',')
    id2opp = get_opp_categories(questions)
    with _open_csv('questions-v{}'.format(coding_id)) as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        cur_breakout = ''
        for q in questions:
            cat, attr = id2opp.get(q.get('identifier'), ('',''))
            q['opp_category'] = cat
            q['opp_attribute'] = attr
            q['values'] = _format_question_values(q)
            writer.writerow(q)

def _gen_raw_codings_csv(coding_id, field, fn, questions, coding_instances, title=None):
    fieldnames = ["policy_instance_id", "email"]
    fieldnames.extend([q['identifier'] for q in questions])
    header = {f:f for f in fieldnames}
    header['policy_instance_id'] = 'site'
    header['email'] = 'coder'
    with _open_csv('raw_{}_by_coder--coding_v{}'.format(title or field, coding_id)) as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writerow(header)
        for ci in coding_instances:
            if 'gmail.com' in ci['email']:
                # this is an admin
                continue
            row = {k: fn(v) for k, v in ci['coding_values'].items()}
            row.update({k: ci[k] for k in ("policy_instance_id", "email")})
            writer.writerow(row)

def gen_all_raw_csvs(coding_id, questions, coding_instances):
    fns = {
        "reported_confidence": lambda cv: cv['confidence'],
        "values": lambda cv: ','.join(cv['values']),
        "sentences_highlighted": lambda cv: cv['sentences'],
    }
    for field in fns.keys():
        _gen_raw_codings_csv(coding_id, field, fns[field], questions, coding_instances)

##########################################
########## merging logic #################
##########################################

def _cluster_cis_by_policy(coding_instances):
    """
    input: a list of serialized coding instances
    returns: an iterable of (policy_id, list<coding_instance>) tuples
    """
    pid_to_ci_list = defaultdict(list)
    for ci in coding_instances:
        pid_to_ci_list[ci['policy_instance_id']].append(ci)
    return pid_to_ci_list.items()

def _get_normalized_value(q_id, coding_values):
    v = coding_values.get("coding_values", {}).get(q_id, {}).get("values", [])
    if v:
        return ','.join(sorted(v))
    else:
        return ''

def _merge_codings(questions, codings):
    """
    Input: a set of codings from the same policy
    Output: a simple coding with the values specified in _merge_serialized_cis
    """
    to_ret = {}
    final_coding = [c for c in codings if c['email'] == MERGE_CODER]
    final_coding = final_coding[0] if final_coding else {}
    raw_codings = [c for c in codings if c['email'] != MERGE_CODER]
    for q in questions:
        q_id = q['identifier']
        final = _get_normalized_value(q_id, final_coding)
        raws = [_get_normalized_value(q_id, c) for c in raw_codings]
        if final:
            value = final
        elif len(set(raws)) == 1:
            value = raws[0]
        else:
            value=""
        to_ret[q_id] = {
            "agreement": len(raws) and (len([r for r in raws if r == value]) / len(raws)),
            "value": value,
            "mislabled_values": '\n'.join([r for r in raws if r!=value])
        }
    return to_ret

def _merge_serialized_cis(questions, coding_instances):
    """
    input: a list of serialized coding instances
    returns: a iterator of serialized merged coding instances, with fields:
        policy_instance_id: the site
        coders: a common-seporated list of coders
        coder_count: the number of coders
        merged: 1 if merged.
        coding_values: a dict mapping question_id to
            agreement: 1 if everyone matched
            value: the value
            mislabled_value: the value dismissed
    """
    for policy_id, codings in _cluster_cis_by_policy(coding_instances):
        coders = [c['email'] for c in codings if 'gmail' not in c['email']]
        merged = any(c['email'] == MERGE_CODER for c in codings)
        coding_values = _merge_codings(questions, codings)
        yield {
            "policy_instance_id": policy_id,
            "coders": ','.join(coders),
            "coder_count": len(coders),
            "merged": merged,
            "coding_values": coding_values
        }

def _gen_agreement_csv(coding_id, field, fn, questions, coding_instances, title=None):
    fieldnames = ["policy_instance_id", "coders", "coder_count", "merged"]
    fieldnames.extend([q['identifier'] for q in questions])
    header = {f:f for f in fieldnames}
    with _open_csv('merged_{}_by_policy--coding_v{}'.format(title or field, coding_id)) as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for merged_ci in _merge_serialized_cis(questions, coding_instances):
            row = {k: fn(v) for k, v in merged_ci['coding_values'].items()}
            row.update({k: merged_ci[k] for k in ("policy_instance_id", "coders", "coder_count", "merged")})
            writer.writerow(row)

def gen_all_agreement_csvs(coding_id, questions, coding_instances):
    fns = {
        "agreement": lambda cv: cv['agreement'],
        "value": lambda cv: cv['value'],
        "mislabled_values": lambda cv: cv['mislabled_values'],
    }
    for field in fns.keys():
        _gen_agreement_csv(coding_id, field, fns[field], questions, coding_instances)

##########################################
########## scripts #######################
##########################################


class Command(BaseCommand):

    def add_arguments(self, parser):
        pass

    def handle(self, *a, **kw):
        coding_id = 10
        questions = get_questions(coding_id)
        coding_instances = get_serialized_coding_instances(coding_id)
        gen_questions_csv(coding_id, questions)
        gen_all_raw_csvs(coding_id, questions, coding_instances)
        gen_all_agreement_csvs(coding_id, questions, coding_instances)