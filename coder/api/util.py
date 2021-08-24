from coder.api import models
from collections import defaultdict
import datetime
from coder import settings

_CODING_ASSIGNMENT_TYPE = 2


def get_unassigned_policies():
    """
        returns a list of Policy objects that have a corresponding PolicyInstance, but no corresponding Assignment
    """
    assigned_ids = set(get_policy_id_to_assignments_map().keys())
    all_policies_with_instances = set(
        policy_instance.policy_id for policy_instance in models.PolicyInstance.objects.all())
    return list(models.Policy.objects.filter(id__in=all_policies_with_instances - assigned_ids))


def get_coder_assignment_status_counts():
    """
        returns a dict mapping coder email to a dict of assignment statuses and counts
    """
    assignment_status_counts = defaultdict(lambda: defaultdict(int))
    for assignment in models.Assignment.objects.all():
        assignment_status_counts[assignment.coder_email][assignment.status] += 1
    return assignment_status_counts


def assign_unassigned_policies():
    """
        for each unassigned policy, assign the policy to the two coders with
        the least number of assignments in the "ASSIGNED" state. Tie-breaker is the number of "PENDING" assignments.
    """
    unassigned_policies = get_unassigned_policies()
    for policy in unassigned_policies:
        coder_assignment_statuses = {
            coder: counts for coder, counts in get_coder_assignment_status_counts().items()
            if coder.endswith("@nyu.edu")
        }
        coder_1, coder_2, *_ = sorted(
            coder_assignment_statuses,
            key=lambda coder: (
                coder_assignment_statuses[coder]["ASSIGNED"],
                coder_assignment_statuses[coder]["PENDING"])
        )
        assign_policy_to_coders(
            policy, [coder_1, coder_2]
        )


"""
POLICY UTILS
"""


def get_most_recent_policy_instance_for_policy(policy):
    return models.PolicyInstance.objects.filter(policy_id=policy.id).order_by("-scan_dt").first()


def get_policies_with_recently_added_instances(start_dt):
    """ return policies that have a corresponding PolicyInstance created after `start_dt`"""
    recent_policy_instances = models.PolicyInstance.objects.filter(
        created_at__gte=start_dt)
    return models.Policy.objects.filter(id__in=recent_policy_instances.values_list('policy_id', flat=True))


def get_policy_from_policy_instance(policy_instance):
    policy = models.Policy.objects.get(id=policy_instance.policy_id)
    return policy


def update_policy_scan_times():
    last_scan_time = kv_get("UTIL--last_policy_scan_time",
                            default=datetime.datetime(2000, 1, 1))
    for policy in get_policies_with_recently_added_instances(last_scan_time):
        policy.last_scan_time = get_most_recent_policy_instance_for_policy(
            policy).scan_dt
        policy.save()


def get_coding_progress_for_policy(policy):
    policy_instance = get_most_recent_policy_instance_for_policy(policy)
    coding_instances = models.CodingInstance.objects.filter(
        policy_instance_id=policy_instance.id)
    return {
        coding_instance.coder_email: coding_status(coding_instance)[0]
        for coding_instance in coding_instances
    }


def update_policy_progress(policy_id):
    """
    sets the following fields in policy.progress:
        "loaded" - information on the most recent policy instance
        "merged" - has a coding instance of type "merge" been completed
        "coding_1" - the email of coder_1 and their progress
        "coding_2" - the email of coder_2 and their progress
    Preserves the value of any unchanged fields.
    """
    policy = models.Policy.objects.get(id=policy_id)
    coding_progress = get_coding_progress_for_policy(policy)
    assignments = get_policy_id_to_assignments_map()[policy.id]
    coders = sorted([
        assignment.coder_email for assignment in assignments
        if assignment.coder_email.endswith("@nyu.edu")
    ])
    mergers = sorted([
        assignment.coder_email for assignment in assignments
        if assignment.coder_email.endswith("@gmail.com")
    ])
    if sum(coding_progress.get(coder, 0) >= 65 for coder in coders) >= 2 and not mergers:
        print(f"assigning {policy.site_name} to {kv_get('merger-email-list')}")
        assign_policy_to_coders(
            policy, kv_get("merger-email-list"), action="code-merge"
        )
    policy.last_scan_dt = get_most_recent_policy_instance_for_policy(
        policy).scan_dt
    print(f"{policy.site_name} mergers:{mergers}, coding_progress: {coding_progress}")
    policy.progress.update({
        "loaded": bool(get_most_recent_policy_instance_for_policy(policy)),
        "merged": [
            {
                "merger": merger,
                "progress": coding_progress.get(merger, 0),
            }
            for merger in mergers
        ],
        "codings": [
            {
                "coder": coder,
                "progress": coding_progress.get(coder, 0)
            } for coder in coders
        ]
    })
    policy.save()


"""
ASSIGNMENT UTIL
"""


def update_assignments(policy_id, assignments):
    """
        for each assignment:
            set progress to "COMPLETE" if 65 questions or more have been answered by the coder
            set progress to "PENDING" if at least one question has been answered by the coder
    """
    policy = models.Policy.objects.get(id=policy_id)
    coder_to_progress = {
        coding['coder']: coding['progress']
        for coding in policy.progress.get('codings', [])
    }
    coder_to_progress.update({
        merge['merger']: merge['progress']
        for merge in policy.progress.get('merged', [])
    })
    for assignment in assignments:
        progress = coder_to_progress.get(assignment.coder_email, 0)
        print(
            f"updaing {policy.company_name}, {assignment.coder_email}: {progress}")
        if progress >= 65:
            assignment.status = "COMPLETE"
        elif progress > 0:
            assignment.status = "PENDING"
        assignment.notes["progress"] = progress
        assignment.save()


def get_policy_id_to_assignments_map():
    assignments = models.Assignment.objects.filter(
        type=_CODING_ASSIGNMENT_TYPE)
    policy_id_to_assignments_map = defaultdict(list)
    for assignment in assignments:
        if assignment.notes.get('policy_id'):
            policy_id_to_assignments_map[assignment.notes.get('policy_id')].append(
                assignment)
    return policy_id_to_assignments_map


def assign_policy_to_coders(policy, coder_emails, action="code-policy"):
    """
        Assigns a policy to multiple coders. Returns the new Assignments
        in a list.
    """
    assignments = []
    policy_instance = get_most_recent_policy_instance_for_policy(policy)
    url = f"/c/2021_PP/{action}/{policy_instance.id}-{policy.site_name}/{settings.CURRENT_CODING_ID}/"
    for coder_email in coder_emails:
        assignment = models.Assignment(
            project=1,
            coder_email=coder_email,
            url=url,
            label=f"{policy.company_name}",
            notes={
                "policy_id": policy.id,
                "policy_instance_id": policy_instance.id,
                "coding_id": settings.CURRENT_CODING_ID,
            },
            due_dt=datetime.datetime.now() + datetime.timedelta(days=7),
            type=_CODING_ASSIGNMENT_TYPE,
            status="PENDING"
        )
        assignment.save()
        assignments.append(assignment)
    return assignments


"""
CACHE UTILS
"""


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


"""
CODING ACCESS UTILS
"""


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


"""
PROGRESS COMPUTATION
"""


def get_coder_progress_by_policy():
    progress_maps = get_progress_maps()
    progress_by_policy = defaultdict(lambda: defaultdict(list))
    for date, progress in progress_maps.items():
        for coder_email, policy_progress in progress.items():
            for policy_site_name, progress_list in policy_progress.items():
                progress_by_policy[policy_site_name][coder_email].append(
                    progress_list)
    return progress_by_policy


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
