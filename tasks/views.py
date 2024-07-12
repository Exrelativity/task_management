from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, TemplateView
from .models import Task
from .forms import TaskForm
from django.contrib.auth.mixins import LoginRequiredMixin

class DashboardView(
    LoginRequiredMixin,
    TemplateView
    ):
    template_name = 'dashboard.html'
    form_class = TaskForm
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.form_class()
        return context




class TaskListView(
    LoginRequiredMixin, 
    ListView):
    model = Task
    template_name = 'tasks/task_list.html'




class TaskCreateView(
    LoginRequiredMixin, 
    CreateView):
    model = Task
    form_class = TaskForm
    template_name = 'tasks/task_create.html'
    success_url = reverse_lazy('task_list')




class TaskUpdateView(
    LoginRequiredMixin, 
    UpdateView):
    model = Task
    form_class = TaskForm
    template_name = 'tasks/task_update.html'
    success_url = reverse_lazy('task_list')



class TaskDeleteView(
    LoginRequiredMixin, 
    DeleteView):
    model = Task
    template_name = 'tasks/task_delete.html'
    success_url = reverse_lazy('task_list')

