from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from .models import Task, Track
import datetime

def update_user(sender, instance, **kwargs):
    user = instance

    if user.email != "":
        user.username = user.email

def update_task_hours(sender, instance, **kwargs):
    """
    Updates task hours if track created or updated
    """
    if instance.task:
        track = Track.objects.filter(id=instance.id).select_related("task").first()

        if track:
            task = track.task

            if track.time_end:
                task.hours += int(datetime.datetime.fromisoformat(instance.time_end[:-1] + "+00:00").timestamp() - datetime.datetime.fromisoformat(instance.time_start[:-1] + "+00:00").timestamp())
                task.hours -= int(track.time_end.timestamp() - track.time_start.timestamp())
            else:
                task.hours += int(datetime.datetime.fromisoformat(instance.time_end[:-1] + "+00:00").timestamp() - datetime.datetime.fromisoformat(instance.time_start[:-1] + "+00:00").timestamp())

            task.save()

pre_save.connect(update_user, sender=User)
pre_save.connect(update_task_hours, sender=Track)
