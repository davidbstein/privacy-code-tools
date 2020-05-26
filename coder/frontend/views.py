from django.shortcuts import render
from django.contrib.staticfiles.views import serve

# Create your views here.

def get_static(request, file_name):
  assert file_name in ('main.css', 'main.js')
  return serve(request, '/var/app/current/coder/frontend/static/frontend/' + file_name)
