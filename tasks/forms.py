# from django import forms
# from .models import Task

# class TaskForm(forms.ModelForm):
#     class Meta:
#         model = Task
#         fields = ['title', 'description', 'status', 'priority', 'due_date', 'category', 'assigned_to']
#         widgets = {
#             'due_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
#             'status': forms.Select(choices=Task.STATUS_CHOICES),
#             'priority': forms.Select(choices=Task.PRIORITY_CHOICES),
#         }


from django import forms
from django.contrib.auth.models import User
from .models import Task

class TaskForm(forms.ModelForm):
    assigned_to = forms.ModelChoiceField(
        queryset=User.objects.all(),
        widget=forms.Select(attrs={'class': 'form-control'}),
        required=True,
        label='Assign To'
    )

    class Meta:
        model = Task
        fields = ['title', 'description', 'status', 'priority', 'due_date', 'category', 'assigned_to']
        widgets = {
            'due_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'status': forms.Select(choices=Task.STATUS_CHOICES, attrs={'class': 'form-control'}),
            'priority': forms.Select(choices=Task.PRIORITY_CHOICES, attrs={'class': 'form-control'}),
        }
