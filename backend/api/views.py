from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from .models import Task, Track, Notation, TrackTask, TrackNotation
from .serializers import TaskSerializer
from .permissions import IsOwnerOrReadOnly, IsOwner

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for key, value in serializer.items():
            data[key] = value

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serialzier_class = MyTokenObtainPairSerializer

@api_view(["POST"])
def register_user(request):
    data = request.data

    try:
        user = User.objects.create(
            first_name=data["firstName"],
            last_name=data["lastName"],
            email=data["email"],
            password=make_password(data["password"])
        )
        # serializer = UserSerializerWithToken(user, many=False)
        return Response(status=status.HTTP_201_CREATED)
    except:
        message = {"detail": "User with this email already exists"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    user = request.user
    data = request.data

    task = Task.objects.create(
        user=user,
        title=data["title"],
        color=data["color"],
        description=data["description"]
    )

    serializer = TaskSerializer(task)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    user = request.user
    tasks = user.task_set.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsOwner])
def get_task(request, pk):
    user = request.user
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsOwner])
def update_task(request, pk):
    data = request.data
    task = Task.objects.get(id=pk)

    task.title = data["title"]
    task.color = data["color"]
    task.description = data["description"]
    task.status = data["status"]

    task.save()

    serailizer = TaskSerializer(task, many=False)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsOwner])
def delete_task(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()
    return Response("Deleted")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_track(request):
    user = request.user
    data = request.data

    track = Track.objects.create(
        user=user,
        title=data["title"],
        time_start=data["timeStart"],
        time_end=data["timeEnd"],
        description=data["description"]
    )

    if data["related"]:
        if "task" in data["related"]:
            TrackTask.objects.create(
                track=track,
                task=Task.objects.get(id=data["task"])
            )
        elif "notation" in data["related"]:
            TrackNotation.objects.create(
                track=track,
                notation=Notation.objects.get(id=data["notation"])
            )

    serializer = TrackSerializer(track)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tracks(request):
    user = request.user
    tracks = user.track_set.all()
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsOwner])
def get_track(request, pk):
    user = request.user
    track = Track.objects.get(id=pk)
    serializer = TrackSerializer(track, many=False)
    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsOwner])
def update_track(request, pk):
    data = request.data
    track = Track.objects.get(id=pk)

    track.title = data["title"]
    track.color = data["color"]
    track.description = data["description"]
    track.status = data["status"]

    track.save()

    if data["related"]:
        if "task" in data["related"]:
            try:
                TrackTask.objects.get(track=track)
            except TrackTask.DoesNotExist:
                TrackTask.objects.create(
                    track=track,
                    task=Task.objects.get(id=data["related"]["task"])
                )
            
            try:
                TrackNotation.objects.get(track=track).delete()
            except TrackNotation.DoesNotExist:
                pass
        elif "notation" in data["related"]:
            try:
                TrackNotation.objects.get(track=track)
            except TrackNotation.DoesNotExist:
                TrackNotation.objects.create(
                    track=track,
                    notation=Notation.objects.get(id=data["related"]["notation"])
                )
            
            try:
                TrackTask.objects.get(track=track).delete()
            except TrackTask.DoesNotExist:
                pass
    elif not data["related"]:
        try:
            TrackTask.objects.get(track=track).delete()
        except TrackTask.DoesNotExist:
            TrackNotation.objects.get(track=track).delete()
        except TrackNotation.DoesNotExist:
            pass

    serailizer = TrackSerializer(track, many=False)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsOwner])
def delete_track(request, pk):
    track = Track.objects.get(id=pk)
    track.delete()
    return Response("Deleted")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_timesheet(request):
    user = request.user
    data = request.data

    timesheet = Timesheet.objects.create(
        user=user,
        task=Task.objects.get(id=data["task"]),
        time_start=data["timeStart"],
        time_end=data["timeEnd"],
        description=data["description"]
    )

    serializer = TimesheetSerializer(timesheet)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_timesheets(request):
    user = request.user
    timesheets = user.timesheet_set.all()
    serializer = TimesheetSerializer(timesheets, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsOwner])
def get_timesheet(request, pk):
    user = request.user
    timesheet = Timesheet.objects.get(id=pk)
    serializer = TimesheetSerializer(timesheet, many=False)
    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsOwner])
def update_timesheet(request, pk):
    data = request.data
    timesheet = Timesheet.objects.get(id=pk)

    timesheet.title = data["title"]
    timesheet.color = data["color"]
    timesheet.description = data["description"]
    timesheet.status = data["status"]

    timesheet.save()

    serailizer = TimesheetSerializer(timesheet, many=False)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsOwner])
def delete_timesheet(request, pk):
    timesheet = Timesheet.objects.get(id=pk)
    timesheet.delete()
    return Response("Deleted")
