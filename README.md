# Time Tracking

## Description
This is web application for managing you projects, tracking you activity and calendar planing

## Functionality
- Sign up
- Sing In
- Manage you project
- Track you current and previous activity(Can bound to project)
- Create and manage your calendar
Authentication system provided via JWT

## Setup
### Backend
```
pip install -r requirements.txt
python manage.py makemagrations
python manage.py migrate
python manage.py runserver
```
### Frontend
```
cd frontend
npm i
npm start
```
Go to ```localhost:3000``` to view the app

## Technologi Stack
- Django
- Django Rest Framework
- React
- Redux
- Router
- PostgreSQL

## Quick review
![Image alt](https://github.com/romabozhanovgithub/time_tracking/blob/main/images/login.png)

![Image alt](https://github.com/romabozhanovgithub/time_tracking/blob/main/images/register.png)

![Image alt](https://github.com/romabozhanovgithub/time_tracking/blob/main/images/time_tracker.png)

![Image alt](https://github.com/romabozhanovgithub/time_tracking/blob/main/images/tasks.png)

![Image alt](https://github.com/romabozhanovgithub/time_tracking/blob/main/images/create_task.png)

![Image alt](https://github.com/romabozhanovgithub/time_tracking/blob/main/images/edit_task.png)

![Image alt](https://github.com/romabozhanovgithub/time_tracking/blob/main/images/calendar.png)

![Image alt](https://github.com/romabozhanovgithub/time_tracking/blob/main/images/create_calendar.png)
