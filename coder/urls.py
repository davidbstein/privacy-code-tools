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
from django.contrib.auth.decorators import login_required
from django.contrib import admin
from django.urls import include, path, re_path
from django.conf.urls.static import static
from django.views.generic import TemplateView

from rest_framework import routers
from coder.api import views
from coder.frontend.views import (
    get_static,
    get_raw,
    get_unsafe_raw,
    get_current_user,
)

from coder import settings

from decorator_include import decorator_include


router = routers.DefaultRouter()
router.register(r'assignment',            views.AssignmentViewSet)
router.register(r'assignment_type',       views.AssignmentTypeViewSet)
router.register(r'coding',                views.CodingViewSet)
router.register(r'coding_progress',       views.CodingProgressViewSet,
                basename="coding_progress")
router.register(r'coding_instance',       views.CodingInstanceViewSet)
router.register(r'policy',                views.PolicyViewSet)
router.register(r'project',               views.ProjectViewSet)
router.register(r'policy_instance',       views.PolicyInstanceViewSet)
router.register(r'policy_instance_info',  views.PolicyInstanceInfoViewSet)
router.register(r'raw_policy_instance',   views.RawPolicyInstanceViewSet)
router.register(r'timing_session',        views.TimingSessionViewSet)

urlpatterns = [
    path('', TemplateView.as_view(template_name='frontend/home.html')),
    re_path(r'^c/(.*)$',
            login_required(TemplateView.as_view(template_name='frontend/index.html'))),
    path('raw-policy/<int:policy_instance_id>/<str:field>', get_raw),
    path('unsafe-raw-policy/<int:policy_instance_id>/<str:field>', get_unsafe_raw),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path("me/", login_required(get_current_user)),
    re_path(r'^static/(?P<path>.*css)$', get_static),
    re_path(r'^static/(?P<path>.*)$', login_required(get_static)),

    path('notifications/', include('django_nyt.urls')),
    path('wiki/', decorator_include(login_required, 'wiki.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
