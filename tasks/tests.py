from django.test import TestCase
from .models import Task
from django.contrib.auth.models import User

class TaskModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            status='In Progress',
            priority='Medium',
            due_date='2024-12-31T23:59:59Z',
            category='General',
            assigned_to=self.user
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, 'Test Task')
