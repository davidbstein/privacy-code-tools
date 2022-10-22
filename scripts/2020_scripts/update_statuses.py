{
 "cells": [
  {
   "cell_type": "markdown",
   "id": "0f265296",
   "metadata": {},
   "source": [
    "To run the script:\n",
    "```\n",
    "pipenv run python manage.py shell_plus --notebook\n",
    "```"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "id": "81ecf63a",
   "metadata": {},
   "outputs": [],
   "source": [
    "import os\n",
    "os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rest.settings')\n",
    "os.environ[\"DJANGO_ALLOW_ASYNC_UNSAFE\"] = \"true\"\n",
    "\n",
    "cd ~/repos/privacy-code-tools\n",
    "\n",
    "import django;django.setup()\n",
    "from coder.api.models import Policy, PolicyInstance, CodingInstance\n",
    "\n",
    "from tqdm import tqdm\n",
    "\n",
    "def policy_is_coded(p):\n",
    "    pi = PolicyInstance.objects.get(project=2, policy_id=p.id)\n",
    "    ci_list = CodingInstance.objects.filter(project=2, policy_instance_id=pi.id)\n",
    "    return len([\n",
    "        _ for ci in ci_list \n",
    "        if len(ci.coding_values) > 40 and \"gmail\" not in ci.coder_email\n",
    "    ])\n",
    "\n",
    "def policy_is_reviewed(p):\n",
    "    pi = PolicyInstance.objects.get(project=2, policy_id=p.id)\n",
    "    ci_list = CodingInstance.objects.filter(project=2, policy_instance_id=pi.id)\n",
    "    return len([\n",
    "        _ for ci in ci_list \n",
    "        if len(ci.coding_values) > 10 and \"gmail\" in ci.coder_email\n",
    "    ])\n",
    "\n",
    "def get_code_link(p):\n",
    "    pi = PolicyInstance.objects.get(project=2, policy_id=p.id)\n",
    "    return f\"{pi.id}-{p.site_name}\"\n",
    "\n",
    "def update_project_statuses():\n",
    "    for policy in tqdm(Policy.objects.filter(project=2)):\n",
    "        policy.progress['loaded'] = {\"status\": \"done\"}\n",
    "        policy.progress['coded'] = policy_is_coded(policy)\n",
    "        policy.progress['reviewed'] = policy_is_reviewed(policy)\n",
    "        policy.progress['coding_link'] = get_code_link(policy)\n",
    "        policy.save()\n",
    "update_project_statuses()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "36c530e9",
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.8.10"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
