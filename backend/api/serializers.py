from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task, Track, Notation, Timesheet

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
    class Meta:
        model = Task
        fields = "__all__"

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
        try:
            task = TrackTask.objects.get(track=obj).task
            related_object = TaskSerializer(task, many=False).data
        except Task.DoesNotExist:
            notation = TrackNotation.objects.get(track=obj).notation
            related_object = NotationSerializer(notation, many=False).data
        except Notation.DoesNotExist:
            related_object = False

        return related_object

class TimesheetSerializer(serializers.ModelSerializer):
    # task = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Timesheet
        fields = [
            "user",
            "task",
            "date",
            "time"
        ]

    # def get_task(self, obj):
    #     return TaskSerializer(Task.objects.get(id=obj.))
