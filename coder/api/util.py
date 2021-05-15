from coder.api import models

def get_policy_from_policy_instance_id(policy_instance_id):
    pi = models.PolicyInstance.objects.get(id=policy_instance_id)
    return models.Policy.objects.get(id=pi.policy_id)
