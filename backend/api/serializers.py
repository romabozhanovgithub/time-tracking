from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task, Track, Notation, TrackTask, TrackNotation, Timesheet, Calendar, CalendarTask


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    is_admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "name",
            "is_admin"
        ]

    def get_is_admin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == "":
            name = obj.email

        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "name",
            "is_admin",
            "token"
        ]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class TaskSerializer(serializers.ModelSerializer):
    hours = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Task
        fields = "__all__"

    def get_hours(self, obj):
        tracks_task = obj.tracktask_set.all()
        task_hours = 0

        for track_task in tracks_task:
            if track_task.track.time_end:
                task_hours += track_task.track.time_end.timestamp() - track_task.track.time_start.timestamp()    

        return task_hours


class NotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notation
        fields = "__all__"


class TrackSerializer(serializers.ModelSerializer):
    related = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Track
        fields = "__all__"

    def get_related(self, obj):
        related_object = False

        track_task = TrackTask.objects.filter(track=obj).first()

        if track_task:
            task = track_task.task
            related_object = {}
            related_object["task"] = TaskSerializer(task, many=False).data

        track_notation = TrackNotation.objects.filter(track=obj).first()

        if track_notation:
            notation = track_notation.notation
            related_object = {}
            related_object["notation"] = NotationSerializer(notation, many=False).data

        return related_object


class TimesheetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Timesheet
        fields = [
            "user",
            "task",
            "date",
            "time"
        ]


class CalendarSerializer(serializers.ModelSerializer):
    related = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Calendar
        fields = "__all__"

    def get_related(self, obj):
        related_object = False

        calendar_task = CalendarTask.objects.filter(calendar=obj).first()

        if calendar_task:
            task = calendar_task.task
            related_object = {}
            related_object["task"] = TaskSerializer(task, many=False).data
            
        return related_object
