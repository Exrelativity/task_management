from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    # @action(detail=False, methods=['get'])
    # def status(self, request):
    #     status = request.query_params.get('status')
    #     tasks = Task.objects.filter(status=status)
    #     serializer = self.get_serializer(tasks, many=True)
    #     return Response(serializer.data)

class TaskListAPIView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        status = self.request.query_params.get('status')
        return Task.objects.filter(status=status)
