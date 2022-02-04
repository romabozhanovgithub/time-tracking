from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task, Track, Timesheet, Calendar
from .db_debugger import query_debugger


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.BooleanField(source="is_staff", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email"
        ]

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

    class Meta:
        model = Task
        fields = "__all__"


class TrackSerializer(serializers.ModelSerializer):
    related = serializers.SerializerMethodField(read_only=True)
    timeStart = serializers.DateTimeField(source="time_start")
    timeEnd = serializers.DateTimeField(source="time_end", required=False)

    class Meta:
        model = Track
        fields = "__all__"

    def get_related(self, obj):
        related_object = False

        task = obj.task

        if task:
            related_object = {}
            related_object["task"] = TaskSerializer(task, many=False).data

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

        task = obj.task

        if task:
            related_object = {}
            related_object["task"] = TaskSerializer(task, many=False).data
            
        return related_object
