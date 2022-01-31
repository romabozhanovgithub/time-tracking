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
    title = models.CharField(max_length=80, null=True, blank=True)
    time_start = models.DateTimeField(null=True, blank=True)
    time_end = models.DateTimeField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)


class Notation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=80, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=False)


class TrackTask(models.Model):
    track = models.OneToOneField(Track, on_delete=models.CASCADE, null=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True)


class TrackNotation(models.Model):
    track = models.OneToOneField(Track, on_delete=models.CASCADE, null=True)
    notation = models.ForeignKey(Notation, on_delete=models.CASCADE, null=True)


class NotationNotification(models.Model):
    notation = models.ForeignKey(Notation, on_delete=models.CASCADE, null=True)
    notification = models.OneToOneField(Notification, on_delete=models.CASCADE, null=True)


class CalendarNotation(models.Model):
    calendar = models.OneToOneField(Calendar, on_delete=models.CASCADE, null=True)
    notation = models.ForeignKey(Notation, on_delete=models.CASCADE, null=True)


class CalendarTask(models.Model):
    calendar = models.OneToOneField(Calendar, on_delete=models.CASCADE, null=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True)


class CalendarNotification(models.Model):
    calendar = models.OneToOneField(Calendar, on_delete=models.CASCADE, null=True)
    notification = models.OneToOneField(Notification, on_delete=models.CASCADE, null=True)
