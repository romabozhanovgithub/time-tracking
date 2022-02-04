from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from .models import Task, Track, Calendar
from .serializers import UserSerializerWithToken, TaskSerializer, TrackSerializer, CalendarSerializer
from .permissions import IsOwnerOrReadOnly, IsOwner
from collections import OrderedDict
import datetime
from .db_debugger import query_debugger


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for key, value in serializer.items():
            data[key] = value

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
def register_user(request):
    data = request.data

    try:
        user = User.objects.create(
            email=data["email"],
            password=make_password(data["password"])
        )
        return Response(status=status.HTTP_201_CREATED)
    except:
        message = {"detail": "User with this email already exists"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    user = request.user
    data = request.data
    data["user"] = user.id

    serializer = TaskSerializer(data=data)
    serializer.is_valid()
    serializer.save(user=user)
    return Response({**serializer.data, "hours": 0})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    user = request.user
    tasks = Task.objects.prefetch_related("tracks").filter(user=user)
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
    user = request.user
    data = request.data
    
    task = Task.objects.get(id=pk)

    serializer = TaskSerializer(task, data=data, many=False)
    serializer.is_valid()
    serializer.save(user=user)
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

    task = None

    if data["related"]:
        if "task" in data["related"]:
            task = Task.objects.get(id=data["related"]["task"]["id"])

    serializer = TrackSerializer(data=data)
    serializer.is_valid()
    serializer.save(user=user, task=task)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tracks(request):
    user = request.user
    tracks = Track.objects.select_related("task").filter(user=user).order_by("-time_start")

    data = []
    days = []
    page = int(request.query_params["page"])
    m = 0
    
    for track in tracks:
        date = [str(track.time_start.day), str(track.time_start.month), str(track.time_start.year)]

        if "-".join(date) not in days:
            days.append("-".join(date))
            m += 1

            if m >= 7 * (page - 1) and m <= 7 * page:
                data.append("-".join([str(track.time_start.year), str(track.time_start.month), str(track.time_start.day)]))

    if len(data):
        tracks = tracks.filter(time_start__date__range=[data[-1], data[0]]).order_by("-time_start")

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
    track.time_start = data["time_start"]
    track.time_end = data["time_end"]

    if data["related"]:
        if "task" in data["related"]:
            task = track.task

            if not task:
                task = Task.objects.filter(id=data["related"]["task"]["id"]).first()
                track.task = task
            elif task.id != data["related"]["task"]["id"]:
                task = Task.objects.filter(id=data["related"]["task"]["id"]).first()
                track.task = task
    elif not data["related"]:
        track.task = None

    track.save()

    serializer = TrackSerializer(track, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsOwner])
def delete_track(request, pk):
    track = Track.objects.get(id=pk)
    track.delete()

    return Response(pk)


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_calendar(request):
    user = request.user
    data = request.data
    calendar = Calendar.objects.create(
        user=user,
        title=data["title"],
        time_start=data["timeStart"],
        time_end=data["timeEnd"]
    )

    if data["related"]:
        if "task" in data["related"]:
            task = Task.objects.filter(id=data["related"]["task"]["id"]).first()
            calendar.task = task
            calendar.save()

    serializer = CalendarSerializer(calendar)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_calendars(request):
    user = request.user
    page = request.query_params["page"].split(".")
    date = datetime.datetime(int(page[-1]), int(page[1]), int(page[0]))
    calendars = user.calendars.all().filter(time_start__date__range=[date, date + datetime.timedelta(days=7)]).order_by("-time_start")
    serializer = CalendarSerializer(calendars, many=True)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsOwner])
def update_calendar(request, pk):
    data = request.data
    calendar = Calendar.objects.get(id=pk)

    calendar.title = data["title"]
    calendar.time_start = data["timeStart"]
    calendar.time_end = data["timeEnd"]

    calendar.save()

    if data["related"]:
        if "task" in data["related"] and calendar_task.id != data["related"]["task"]["id"]:
            task = Task.objects.get(id=data["related"]["task"]["id"])
            calendar.task = task
    elif not data["related"]:
        calendar.task = None

    calendar.save()

    serializer = CalendarSerializer(calendar, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsOwner])
def delete_calendar(request, pk):
    calendar = Calendar.objects.get(id=pk)
    calendar.delete()

    return Response(pk)
