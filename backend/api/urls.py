from django.urls import path
from . import views

urlpatterns = [
    path("users/login/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("users/register/", views.register_user, name="register"),
    path("tracks/", views.get_tracks, name="tracks"),
    path("tracks/create/", views.create_track, name="track-create"),
    path("tracks/update/<int:pk>/", views.update_track, name="track-update"),
    path("tracks/delete/<int:pk>/", views.delete_track, name="track-delete"),
    path("tasks/", views.get_tasks, name="tasks"),
    path("tasks/create/", views.create_task, name="task-create"),
    path("tasks/update/<int:pk>/", views.update_task, name="task-update"),
    path("tasks/delete/<int:pk>/", views.delete_task, name="task-delete"),
    path("calendars/", views.get_calendars, name="calendars"),
    path("calendars/create/", views.create_calendar, name="calendar-create"),
    path("calendars/update/<int:pk>/", views.update_calendar, name="calendar-update"),
    path("calendars/delete/<int:pk>/", views.delete_calendar, name="calendar-delete"),
]
