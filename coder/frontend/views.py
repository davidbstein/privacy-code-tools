from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import get_template
from django.template import Context
from coder.api.models import Policy, PolicyInstance, RawPolicyInstance
from coder import settings
import pathlib
import mimetypes

def get_static(request, path):
  #assert file_name in ('main.css', 'main.js')
  assert '..' not in path
  file_name = path.split('/')[-1]
  #path = str(pathlib.Path(__file__).parent.absolute()) + '/static/frontend/';
  filepath = settings.BASE_DIR + '/.static/' + path;
  type=mimetypes.guess_type(file_name)[0]
  with open(filepath, 'rb') as f:
    return HttpResponse(f.read(), content_type=type)

def get_raw(request, policy_instance_id, field):
  pi = PolicyInstance.objects.get(id=policy_instance_id)
  p = Policy.objects.get(id=pi.policy_id)
  if (pi.raw_policy_id):
    raw_html = RawPolicyInstance.objects.get(id=pi.raw_policy_id).raw_content_blocks.get(field, {}).get('body', "")
  else:
    raw_html = "there is no copy of the raw data in the database. if you need help, text or slack stein."
  return render(request, "frontend/raw.html",
    {"raw_data": raw_html,  "policy_instance_id": policy_instance_id, "site_name": p.company_name, 'scan_dt': pi.scan_dt})



def get_unsafe_raw(request, policy_instance_id, field):
  pi = PolicyInstance.objects.get(id=policy_instance_id)
  p = Policy.objects.get(id=pi.policy_id)
  if (pi.raw_policy_id):
    raw_html = RawPolicyInstance.objects.get(id=pi.raw_policy_id).raw_content_blocks.get(field, {}).get('raw', "")
  else:
    raw_html = "there is no copy of the raw data in the database. if you need help, text or slack stein."
  return render(request, "frontend/raw.html",
    {"raw_data": raw_html, "policy_instance_id": policy_instance_id, "site_name": p.company_name, 'scan_dt': pi.scan_dt})

