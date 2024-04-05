from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

from mylotto import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.main_page, name='index'),
    path('get-lotto-data/', views.get_lotto_data, name='get-lotto-data'),
    path('robots.txt', TemplateView.as_view())
    ]
