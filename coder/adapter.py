from django.conf import settings
from django.contrib.auth import get_user_model
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter

User = get_user_model()

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
  """
  Override the DefaultSocialAccountAdapter from allauth in order to associate
  the social account with a matching User automatically, skipping the email
  confirm form and existing email error
  """
  def get_connect_redirect_url(self, request):
    path = f"/social_login/{request.user.email}/"
    print(path)
    return path

class CustomAccountAdapter(DefaultAccountAdapter):

  def get_login_redirect_url(self, request):
    """ this is the one that actually gets called """
    path = f"/c/{request.user.email}/"
    return path