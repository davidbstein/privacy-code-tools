from coder.api import util
import datetime


def update_all_progress():
    current_progress = util.get_coder_progress_map()
    util.save_progress_map(current_progress, date=datetime.date.today())
    policy_to_assignments = util.get_policy_id_to_assignments_map()
    print(f"updating prgress for {len(policy_to_assignments)} policies")
    for policy_id in policy_to_assignments.keys():
        util.update_policy_progress(policy_id)
    assignments = util.get_policy_id_to_assignments_map()
    print(f"updating {len(assignments)} assignments")
    for policy_id, assignments in assignments.items():
        util.update_assignments(policy_id, assignments)

    return f"""Progress updated to {datetime.datetime.now()}"""


def format_progress_email():
    previous_progress_date, previous_progress = util.get_previous_date_and_progress()
    current_progress = util.get_coder_progress_map(email_filter="nyu.edu")
    progress_diff = util.get_progress_diff(current_progress, previous_progress)
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
