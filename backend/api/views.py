from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from .models import Task, Track, Notation, TrackTask, TrackNotation, Calendar, CalendarTask
from .serializers import UserSerializerWithToken, TaskSerializer, TrackSerializer, CalendarSerializer
from .permissions import IsOwnerOrReadOnly, IsOwner
from collections import OrderedDict
import datetime


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

    task = Task.objects.create(
        user=user,
        title=data["title"],
        color=data["color"]
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
    task.status = data["status"]

    task.save()

    serializer = TaskSerializer(task, many=False)
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
        time_start=data["timeStart"]
    )

    try:
        track.time_end = data["timeEnd"]
        track.save()
    except:
        pass

    if data["related"]:
        if "task" in data["related"]:
            TrackTask.objects.create(
                track=track,
                task=Task.objects.get(id=data["related"]["task"]["id"])
            )
            print(1)
        elif "notation" in data["related"]:
            TrackNotation.objects.create(
                track=track,
                notation=Notation.objects.get(id=data["related"]["notation"]["id"])
            )

    serializer = TrackSerializer(track)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tracks(request):
    user = request.user
    tracks = user.track_set.all().order_by("-time_start")

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
        tracks = user.track_set.all().filter(time_start__date__range=[data[-1], data[0]]).order_by("-time_start")

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

    track.save()

    if data["related"]:
        if "task" in data["related"]:
            track_task = TrackTask.objects.filter(track=track).first()

            if not track_task:
                TrackTask.objects.create(
                    track=track,
                    task=Task.objects.get(id=data["related"]["task"]["id"])
                )
            elif track_task.id != data["related"]["task"]["id"]:
                track_task.delete()

                TrackTask.objects.create(
                    track=track,
                    task=Task.objects.get(id=data["related"]["task"]["id"])
                )
            
            track_notation = TrackNotation.objects.filter(track=track).first()

            if track_notation:
                track_notation.delete()
    elif not data["related"]:
        track_task = TrackTask.objects.filter(track=track).first()

        if track_task:
            track_task.delete()

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
            CalendarTask.objects.create(
                calendar=calendar,
                task=Task.objects.get(id=data["related"]["task"]["id"])
            )

    serializer = CalendarSerializer(calendar)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_calendars(request):
    user = request.user
    page = request.query_params["page"].split(".")
    date = datetime.datetime(int(page[-1]), int(page[1]), int(page[0]))
    calendars = user.calendar_set.all().filter(time_start__date__range=[date, date + datetime.timedelta(days=7)]).order_by("-time_start")
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
        if "task" in data["related"]:
            calendar_task = CalendarTask.objects.filter(calendar=calendar).first()

            if not calendar_task:
                CalendarTask.objects.create(
                    calendar=calendar,
                    task=Task.objects.get(id=data["related"]["task"]["id"])
                )
            elif calendar_task.id != data["related"]["task"]["id"]:
                calendar_task.delete()

                CalendarTask.objects.create(
                    calendar=calendar,
                    task=Task.objects.get(id=data["related"]["task"]["id"])
                )
    elif not data["related"]:
        calendar_task = CalendarTask.objects.filter(calendar=calendar).first()

        if calendar_task:
            calendar_task.delete()

    serializer = CalendarSerializer(calendar, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsOwner])
def delete_calendar(request, pk):
    calendar = Calendar.objects.get(id=pk)
    calendar.delete()

    return Response(pk)
