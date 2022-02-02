from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=80, null=True, blank=True)
    color = models.CharField(max_length=8, null=True, blank=True)
    status = models.BooleanField(default=False)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField(null=True, blank=True)


class Track(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=80, null=True, blank=True)
    time_start = models.DateTimeField(null=True, blank=True)
    time_end = models.DateTimeField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=False)


class Timesheet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField(null=True, blank=True)
    time = models.TimeField(null=True, blank=True)


class Calendar(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=80, null=True, blank=True)
    time_start = models.DateTimeField(null=True, blank=True)
    time_end = models.DateTimeField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
