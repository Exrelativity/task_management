# Task Management Dashboard

This project is a Task Management Dashboard built with Django for the backend and Tailwind CSS for the frontend styling. The application allows users to manage tasks, providing functionalities to create, update, delete, and categorize tasks. The tasks can be dragged and dropped between different status columns (In Progress, Completed, Overdue).

## Features

- User Authentication (optional)
- Task Creation, Update, and Deletion
- Task Categorization by Status, Priority, and Due Date
- Drag-and-Drop Interface for Changing Task Status
- Search, Sort, and Filter Tasks
- Responsive Design with Tailwind CSS
- Dynamic Data Loading with AJAX and jQuery

## Technologies Used

- Django
- Tailwind CSS
- jQuery
- AJAX

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Python 3.x
- Django 3.x or higher

## Installation

1. **Clone the Repository**

```bash
git clone https://github.com/Exrelativity/task_management.git
cd task_management
```

2. **Create a Virtual Environment**

```bash
python -m venv .env
source .env/bin/activate   # On Windows: env\Scripts\activate
```

3. **Install Django and Other Dependencies**

```bash
pip install -r requirements.txt
```

5. **Apply Migrations**

```bash
python manage.py migrate
```

6. **Create a Superuser**

```bash
python manage.py createsuperuser
```

7. **Run the Development Server**

```bash
python manage.py runserver
```

Open your web browser and navigate to `http://127.0.0.1:8000` to see the application in action.

## Project Structure

```plaintext
.
├── task_management/
│   ├── tasks/
│   │   ├── migrations/
│   │   ├── templates/
│   │   │   ├── components/
│   │   │   ├── registration/
│   │   │   ├── tasks/
│   │   │   ├── dashboard.html/
│   │   │   └── ...
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── forms.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── ...
│   ├── task_management/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── ...
│   ├── manage.py
├── static/
|   ├── js/
│   |   └── dashboard.js/
|   |   └── ...
├── requirements.txt
└── README.md
```

## Usage

### Task Management

- **Dashboard**: Displays all tasks categorized by their status.
- **Create Task**: Allows users to create a new task with details like title, description, status, priority, due date, and category.
- **Update Task**: Allows users to update an existing task.
- **Delete Task**: Allows users to delete a task.
- **Drag-and-Drop**: Change task status by dragging tasks between columns.

### Search, Sort, and Filter

- **Search**: Search for tasks by title.
- **Sort**: Sort tasks based on priority, due date, etc.
- **Filter**: Filter tasks based on status, priority, and category.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

If you want to contact me, you can reach me at [ukweheverest@gmail.com].

---

Feel free to customize this README file according to your project details and personal preferences.
