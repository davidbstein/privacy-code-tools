import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "coder.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()

from coder.api.models import Project, Policy, PolicyInstance, CodingInstance
import datetime

from tqdm import tqdm

def policy_is_coded(p, project, default_coding):
    pi = PolicyInstance.objects.get(project=project, policy_id=p.id)
    ci_list = CodingInstance.objects.filter(project=project, policy_instance_id=pi.id, coding_id=default_coding)
    return len([
        ci for ci in ci_list 
        if len(ci.coding_values) > 40 and "gmail" not in ci.coder_email
    ])

def policy_is_reviewed(p, project, default_coding):
    pi = PolicyInstance.objects.get(project=project, policy_id=p.id)
    ci_list = CodingInstance.objects.filter(project=project, policy_instance_id=pi.id, coding_id=default_coding)
    return len([
        ci for ci in ci_list 
        if len(ci.coding_values) > 10 and "gmail" in ci.coder_email
    ])

def get_code_link(p, project, default_coding):
    pi = PolicyInstance.objects.get(project=project, policy_id=p.id)
    return f"{pi.id}-{p.site_name}"

def update_project_statuses(project):
    policies = []
    project = Project.objects.filter(id=project)[0]
    default_coding = project.settings.get('default_coding')
    print(project.prefix)
    last_coding_instance_to_update = CodingInstance.objects.filter(project=project.id, coding_id=default_coding).order_by('-last_updated').first()
    if not last_coding_instance_to_update:
        print("No coding instances for this project.")
        return
    elif last_coding_instance_to_update.last_updated < project.last_updated:
        print("already up to date")
        return
    else:
        print(f"Last updates -- {last_coding_instance_to_update.last_updated}(coding) < {project.last_updated}(project)")
    for policy in tqdm(Policy.objects.filter(project=project.id)):
        policy.progress['loaded'] = {"status": "done"}
        policy.progress['coded'] = policy_is_coded(policy, project.id, default_coding)
        policy.progress['reviewed'] = policy_is_reviewed(policy, project.id, default_coding)
        policy.progress['coding_link'] = get_code_link(policy, project.id, default_coding)
        policies.append(policy)
    for p in tqdm(policies):
        p.save()
    project.save()

if __name__ == "__main__":
    import traceback
    import sys
    print(sys.argv)
    project_ids = [2,3,4,5]
    if len(sys.argv) > 1:
        project_ids = map(int, sys.argv[1:])
    for project in project_ids:
        try:
            update_project_statuses(project) # privacy
        except Exception as e:
            traceback.print_exc()
