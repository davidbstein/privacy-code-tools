from coder.api import (
    scripts,
    util,
    models,
)
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):

    def add_arguments(self, parser):
        pass

    def handle(self, *a, **kw):
        scripts.update_all_progress()
        util.assign_unassigned_policies()
        util.assign_completed_policies_to_grader(
            util.kv_get("merger-email-list"))
        util.update_policy_loaded_status()
