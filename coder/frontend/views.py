from django.shortcuts import render
from django.contrib.staticfiles.views import serve
import os
# Create your views here.

def get_static(request, file_name):
  assert file_name in ('main.css', 'main.js')
  print('running static request' + os.getcwd())
  return serve(request, '/var/app/current/coder/frontend/static/frontend/' + file_name)
