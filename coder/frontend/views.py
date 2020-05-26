from django.http import HttpResponse
import pathlib


def get_static(request, file_name):
  assert file_name in ('main.css', 'main.js')
  path = str(pathlib.Path(__file__).parent.absolute()) + '/static/frontend/';
  if (file_name == 'main.css'):
    with open(path + file_name) as f:
      return HttpResponse(f.read(), content_type="text/css")
  if (file_name == 'main.js'):
    with open(path + file_name) as f:
      return HttpResponse(f.read(), content_type="application/javascript")
