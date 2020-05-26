"""coder URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from django.views.generic import TemplateView

from rest_framework import routers
from coder.api import views
from coder.frontend import view as frontend_views

router = routers.DefaultRouter()
router.register(r'coder', views.CoderViewSet)
router.register(r'coding', views.CodingViewSet)
router.register(r'coding_instance', views.CodingInstanceViewSet)
router.register(r'policy', views.PolicyViewSet)
router.register(r'policy_instance', views.PolicyInstanceViewSet)
router.register(r'policy_instance_info', views.PolicyInstanceInfoViewSet)
router.register(r'raw_policy_instance', views.RawPolicyInstanceViewSet)


urlpatterns = [
    path('', TemplateView.as_view(template_name='frontend/index.html')),
    path('code-policy/<int:coding_id>', TemplateView.as_view(template_name='frontend/index.html')),
    path('code-merge/<int:policy_instance_id>', TemplateView.as_view(template_name='frontend/index.html')),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('static/<str:file_name>', frontend_views.get_static)
]
