from coder.api import models

import gspread
import environ

env = environ.Env()
# reading .env file
environ.Env.read_env()
gc = gspread.service_account(env('GOOGLE_SERVICE_ACCOUNT_JSON_LOCATION'))


def load_coding():
  coding_sheet = gc.open_by_key("1eKSyLalekWNXlGHHdf6ZCySahEittpLcswbQ08ms6Jg")
  codings = coding_sheet.get_worksheet(0)
  # there is a "human readable" header underneith the true header that we need to discard.
  records = codings.get_all_records()[1:]
  for r in records:
      r['values'] = r['values_raw'].split(',')

  new_c = models.Coding()
  new_c.questions = records
  new_c.save()
  return new_c


def reload_coding(coding_id, migrate=False):
  coding_sheet = gc.open_by_key("1eKSyLalekWNXlGHHdf6ZCySahEittpLcswbQ08ms6Jg")
  codings = coding_sheet.get_worksheet(0)
  # there is a "human readable" header underneith the true header that we need to discard.
  records = codings.get_all_records()[1:]
  for r in records:
      r['values'] = r['values_raw'].split(',')
  c = models.Coding(id=coding_id)
  changes_by_id = [
    (i, a['identifier'], b['identifier'])
    for i,(a,b) in enumerate(zip(c.questions, records))
    if a['identifier'] != b['identifier']
    ]
  assert len(changes_by_id) == 0, "the following changes occured: {}".format(str(changes_by_id))
  c.questions = records
  c.save()


def migrate_to_coding(old_coding_id, new_coding_id):
  c_old = models.Coding.objects.get(id=old_coding_id)
  c_new = models.Coding.objects.get(id=new_coding_id)
  for ci in models.CodingInstance.objects.filter(coding_id=old_coding_id):
    ci.coding_id = c_new
    for k in ci.coding_values.keys():
      ci.coding_values[k]['notes'] = "migrated on 2020-06-22 from coding 4 to coding 5"
    ci.save()


_CATEGORIES = ['Adult', 'Arts', 'Business', 'Computers', 'Games', 'Health', 'Home', 'Kids_and_Teens', 'News', 'Recreation', 'Reference', 'Regional', 'Science', 'Shopping', 'Society', 'Sports', 'World']


def _download_policy_instance(p, pi_id=None, save=False):
  if pi_id:
    pi = models.PolicyInstance.objects.get(id=pi_id)
    assert p.id == pi.policy_id
  else:
    pi = models.PolicyInstance()
  pi.policy_id = p.id
  pi.content = {
    k: scraper.get_paragraphs_from_url(v)['content'] for k, v in p.urls.items() if v
  }
  # RAW DATA
  if pi.raw_policy_id:
    rpi = models.RawPolicyInstance.objects.get(id=pi.raw_policy_id)
    assert rpi.policy_id == p.id
    if save:
      rpi.delete()
  rpi = models.RawPolicyInstance()
  rpi.policy_id = p.id
  rpi.raw_content_blocks = {
    k: scraper.get_paragraphs_from_url(v) for k, v in p.urls.items() if v
  }
  if save:
    rpi.save()
    pi.raw_policy_id = rpi.id
    pi.save()
  return pi

def import_policies():
  gc = gspread.service_account("/Users/stein/drive-service-account.json")
  site_sheet = gc.open_by_key("18ENiqz-DoLKqzMTumtPEzFG_S5qkbJK6y03enP1rM5o")
  rankings = site_sheet.get_worksheet(0)
  records = rankings.get_all_records()

  to_load = [r for r in records if r['Ready To Load'] == 1]
  new_ps = []
  for r in to_load:
    p=models.Policy()
    p.urls = {
        "privacy_policy": r['PP_URL'],
        "tos": r["TOS_URL"],
        "ccpa_policy": r["Cookie_Policy_URL"],
        "gdpr_poicy": r["GDPR_URL"],
        "eu_privacy_policy": r['EU_PRIVACY_URL'],
        "eu_tos": r['EU_TOS_URL'],
    }
    p.alexa_rank = r['GLOBAL_RANK'] or None
    p.company_name = r['site']
    p.site_name = r['site']
    p.categories = [cat for cat in cats if r.get(cat)]
    p.meta = {"PPv7_id:{}": r['PPv7 ID']}
    p.save()
    new_ps.append(p.id)
  pi_list = []
  pi_errors = []
  for p_id in new_ps:
    try:
      p = models.Policy.objects.get(id=p_id)
      pi = download_policy_instance(p, save=True)
      print(p.id, p.site_name, "\thttp://policycoding.com/code-policy/{}".format(pi.id))
      pi_list.append(pi.id)
    except Exception as e:
      print("exception", p_id)
      pi_errors.append([p.site_name, "{}".format(e)])

  col_vals = rankings.col_values(4)
  for pi_id in pi_list:
    pi = models.PolicyInstance.objects.get(id=pi_id)
    p = models.Policy.objects.get(id=pi.policy_id)
    rankings.update("C{}".format(col_vals.index(p.site_name)+1), "http://policycoding.com/code-policy/{}".format(pi.id))
  for site, error in pi_errors:
    rankings.update("B{}".format(col_vals.index(site)+1), "".format(pi.id))
