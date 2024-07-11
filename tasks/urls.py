from django.urls import include, path
from .views import TaskCreateView, TaskDeleteView, TaskListView, TaskUpdateView, DashboardView
from .api_views import TaskListAPIView
from rest_framework.routers import DefaultRouter
from .api_views import TaskViewSet, TaskListAPIView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('tasks', TaskListView.as_view(), name='task_list'),
    path('task/add/', TaskCreateView.as_view(), name='task_create'),
    path('task/<int:pk>/edit/', TaskUpdateView.as_view(), name='task_update'),
    path('task/<int:pk>/delete/', TaskDeleteView.as_view(), name='task_delete'),
    path('api/tasks/', TaskListAPIView.as_view(), name='task_list_api'),
    path('api/', include(router.urls)),
]
