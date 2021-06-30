from coder.api import models
from collections import defaultdict
import datetime


def get_policy_from_policy_instance_id(policy_instance_id):
    pi = models.PolicyInstance.objects.get(id=policy_instance_id)
    return models.Policy.objects.get(id=pi.policy_id)


def kv_get(k, default=None):
    try:
        obj = models.KVStore.objects.get(k=k)
        return obj.v
    except models.KVStore.DoesNotExist:
        return default


def kv_set(k, v):
    try:
        obj = models.KVStore.objects.get(k=k)
        obj.v = v
    except models.KVStore.DoesNotExist:
        obj = models.KVStore(k=k, v=v)
    obj.save()


def get_coder_to_ci_map():
    cis = models.CodingInstance.objects.all()
    to_ret = defaultdict(list)
    for ci in cis:
        to_ret[ci.coder_email].append(ci)
    return to_ret


def coding_status(coding_instance):
    coding = models.Coding.objects.get(id=coding_instance.coding_id)
    categories = coding.categories
    question_count = sum(
        map(lambda question_list: len(question_list), categories))
    answer_count = len(coding_instance.coding_values)
    return [answer_count, question_count]


def get_policy_from_coding_instance(coding_instance):
    policy_instace = models.PolicyInstance.objects.get(
        id=coding_instance.policy_instance_id)
    policy = models.Policy.objects.get(id=policy_instace.policy_id)
    return policy


def get_coder_progress_map(email_filter=None):
    """ 
        returns {
            <coder_email>: {
                <policy.site_name>: [<answer_count>, <question_count>]
                ...
            }
            ...
        }
    """
    coder_to_cis = get_coder_to_ci_map()
    return {
        coder_email: {
            get_policy_from_coding_instance(ci).site_name: coding_status(ci)
            for ci in ci_list
        }
        for coder_email, ci_list in coder_to_cis.items()
        if not email_filter or email_filter in coder_email
    }


def get_progress_diff(current_progress, previous_progress):
    """
        returns {
            <coder_email>: {
                <policy.site_name>: [<last week answer count>, <this week answer count>, <question count>]
            }
        }
    """
    to_ret = defaultdict(dict)
    for coder_email in current_progress.keys():
        if coder_email not in previous_progress:
            to_ret[coder_email] = {
                site_name: [0, answer_count, question_count]
                for site_name, [answer_count, question_count] in
                current_progress[coder_email].items()
            }
        else:
            for site_name in current_progress[coder_email]:
                if site_name not in previous_progress[coder_email]:
                    to_ret[coder_email][site_name] = [0] + \
                        current_progress[coder_email][site_name]
                elif current_progress[coder_email][site_name][0] - previous_progress[coder_email][site_name][0]:
                    to_ret[coder_email][site_name] = [
                        previous_progress[coder_email][site_name][0],
                        current_progress[coder_email][site_name][0],
                        current_progress[coder_email][site_name][1]
                    ]
    return to_ret


def save_progress_map(progress, date=None):
    if not date:
        date = datetime.date.today()
    progress_history = kv_get("progress_map", {})
    progress_history[date.isoformat()] = progress
    kv_set("progress_map", progress_history)


def get_progress_maps():
    return kv_get("progress_map")


def get_previous_date_and_progress(min_age=datetime.timedelta(days=6)):
    for datestring, progress_map in reversed(sorted(get_progress_maps().items())):
        if datetime.date.today() - datetime.date.fromisoformat(datestring) > min_age:
            return datestring, progress_map


def format_progress_email():
    previous_progress_date, previous_progress = get_previous_date_and_progress()
    current_progress = get_coder_progress_map(email_filter="nyu.edu")
    progress_diff = get_progress_diff(current_progress, previous_progress)
    timedelta = (datetime.date.today() -
                 datetime.date.fromisoformat(previous_progress_date)).days
    to_ret = [
        f"""Coding Progress Since {previous_progress_date} ({timedelta} days ago)"""]
    for coder_email, progress in progress_diff.items():
        site_list = []
        for site_name, [previous, current, _] in progress.items():
            site_list.append(
                f"""<it>{site_name} privacy policy</it>: {current-previous} questions coded. ({current}/65 done))""")
        site_list_html = "</li>\n<li>".join(site_list)
        to_ret.append(f"""<b>{coder_email}</b>\n<ul>
        <li>{site_list_html}</li>\n</ul>
        """)
    return "<div>" + "</div>\n<div>".join(to_ret) + "</div>"
