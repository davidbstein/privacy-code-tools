from django.http import HttpResponse
import pathlib
# Create your views here.

def get_static(request, file_name):
  assert file_name in ('main.css', 'main.js')
  path = str(pathlib.Path(__file__).parent.absolute()) + '/static/frontend/';
  with open(path + file_name) as f:
    return HttpResponse(f.read())
