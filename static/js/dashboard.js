// dashboard.js
$(document).ready(function () {
    // Load tasks dynamically

    function formatDueDate(dueDateStr) {
        const dueDate = new Date(dueDateStr);
        const today = new Date();

        // Clear the time part for comparison
        today.setHours(0, 0, 0, 0);
        const dueDateOnly = new Date(dueDate);
        dueDateOnly.setHours(0, 0, 0, 0);

        const differenceInTime = dueDateOnly.getTime() - today.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        let formattedDate;

        if (differenceInDays === 0) {
            // Due today
            formattedDate = `${dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (differenceInDays === 1) {
            // Due tomorrow
            formattedDate = `Tomorrow`;
        } else if (differenceInDays === -1) {
            // Due yesterday
            formattedDate = `Yesterday`;
        } else if (differenceInDays < 7 && differenceInDays > 0) {
            // Due within a week
            formattedDate = `${dueDate.toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            // Distant date
            formattedDate = `${dueDate.toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        }

        return formattedDate;
    }

    let allCategories = new Set();

    function loadTasks(status) {
        $.ajax({
            url: `/api/tasks-status/?status=${status}`,
            method: 'GET',
            success: function (data) {
                $(`#${status.toLowerCase().replace(' ', '-')}`).empty();
                data.forEach(task => {
                    let taskCard = $('#task-card-template').html();
                    taskCard = taskCard.replace(/{id}/gm, task.id);
                    taskCard = taskCard.replace(/{title}/gm, task.title);
                    taskCard = taskCard.replace(/{description}/gm, task.description);
                    taskCard = taskCard.replace(/{status}/gm, task.status);
                    taskCard = taskCard.replace(/{priority}/gm, task.priority);
                    taskCard = taskCard.replace(/{due_date}/gm, formatDueDate(task.due_date));
                    taskCard = taskCard.replace(/{category}/gm, task.category.slice(0, 12).concat(task.category.length > 12 ? '...' : ''));
                    taskCard = taskCard.replace(/{assigned_to}/gm, task.assigned_to);
                    taskCard = taskCard.replace('<span class="truncate text-sm">priority</span>', `<span class="truncate text-sm ${getPriorityTextColor(task.priority)}">${task.priority}</span>`);

                    taskCard = $(taskCard);
                    taskCard.attr('data-category', task.category);
                    taskCard.attr('data-priority', task.priority);
                    taskCard.attr('data-due_date', task.due_date);
                    $(`#${status.toLowerCase().replace(' ', '-')}`).append(taskCard);
                    allCategories.add(task.category);
                });
                updateCardCount(status, data.length);
                if (status === 'Overdue') {
                    populateCategoryFilter(allCategories);
                }

            }
        });

    }

    function getPriorityTextColor(priority) {
        if (priority === 'High') {
            return 'text-[#da5758]';
        } else if (priority === 'Medium') {
            return 'text-[#f3a64f]';
        } else {
            return 'text-[#69cc54]';
        }
    }

    function populateCategoryFilter(categories) {
        const categoryFilter = $('#category-filter');
        categoryFilter.empty();
        categoryFilter.append('<option selected value="all">All Categories</option>');
        categories.forEach(category => {
            categoryFilter.append(`<option value="${category}">${category}</option>`);
        });
    }

    function updateCardCount(status, count) {
        $(`#${status.toLowerCase().replace(' ', '-')}-count`).text(count);
    }

    // Initial load
    loadTasks('In Progress');
    loadTasks('Completed');
    loadTasks('Overdue');

    // Search functionality
    $('#search-input').on('keyup', function () {
        let query = $(this).val();
        $('.task-card').each(function () {
            let title = $(this).find('h2').text().toLowerCase();
            $(this).toggle(title.includes(query.toLowerCase()));
        });
    });

    // Sorting and filtering functionality
    $('#sort-by').on('change', function () {
        let sortBy = $('#sort-by').val();

        let sortedTasks = $('.task-card').toArray().sort(function (a, b) {
            let aValue = $(a).data(sortBy);
            let bValue = $(b).data(sortBy);

            if (sortBy === 'due_date') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            return aValue > bValue ? 1 : -1;
        });

        $('#in-progress, #completed, #overdue').empty().append(sortedTasks);
    });


    // $('#filter-btn').on('click', function () {
    //     let priorityFilter = $('#priority-filter').val();
    //     let categoryFilter = $('#category-filter').val();

    //     $('.task-card').each(function () {
    //         let taskPriority = $(this).data('priority');
    //         let taskCategory = $(this).data('category');

    //         let priorityMatch = priorityFilter === 'all' || taskPriority === priorityFilter;
    //         let categoryMatch = categoryFilter === 'all' || taskCategory === categoryFilter;

    //         if (priorityMatch && categoryMatch) {
    //             $(this).show();
    //         } else {
    //             $(this).hide();
    //         }
    //     });
    // });

    $('#priority-filter').on('change', function () {
        let priorityFilter = $(this).val();

        if (priorityFilter === 'all') {
            $('.task-card').show();
        } else {
            $('.task-card').each(function () {
                const taskPriority = $(this).data('priority');
                if (taskPriority === priorityFilter) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });

    $('#show-all-btn').on('click', function () {
        $('#priority-filter').val('all');
        $('#category-filter').val('all');
        $('.task-card').show();
    });

    $('#category-filter').on('change', function () {
        const selectedCategory = $(this).val();
        if (selectedCategory === 'all') {
            $('.task-card').show();
        } else {
            $('.task-card').each(function () {
                const taskCategory = $(this).data('category');
                if (taskCategory === selectedCategory) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });

    // Modal dialog for add/edit task
    $('#add-task-btn').on('click', function () {
        $('#task-id').val('');
        $('#task-form')[0].reset();
        $('#modal-title').text('Add Task');
        $('#task-modal').removeClass('hidden');
    });

    $(document).on('click', '.task-card .edit-btn', function () {
        let taskId = $(this).parent().parent().parent().parent().data('id');
        $.ajax({
            url: `/api/tasks/${taskId}/`,
            method: 'GET',
            success: function (task) {
                $('#task-id').val(task.id);
                $('#id_title').val(task.title);
                $('#id_description').val(task.description);
                $('#id_status').val(task.status);
                $('#id_priority').val(task.priority);
                $('#id_due-date').val(task.due_date.slice(0, 16)); // Format: YYYY-MM-DDTHH:MM
                $('#id_category').val(task.category);
                $('#id_assigned_to').val(task.assigned_to);
                $('#modal-title').text('Edit Task');
                $('#task-modal').removeClass('hidden');
            }
        });
    });

    $('#task-form').on('submit', function (e) {
        e.preventDefault();
        let csrftoken = getCSRFToken();
        let taskId = $('#task-id').val();
        let url = taskId ? `/api/tasks/${taskId}/` : '/api/tasks/';
        let method = taskId ? 'PUT' : 'POST';
        // let formData = {
        //     title: $('#id_title').val(),
        //     description: $('#id_description').val(),
        //     status: $('#id_status').val(),
        //     priority: $('#id_priority').val(),
        //     due_date: $('#id_due-date').val(),
        //     category: $('#id_category').val(),
        //     assigned_to: $('#id_assigned_to').val(),
        // };
        let formData = $(this).serialize();
        // console.log(formData);
        $.ajax({
            url: url,
            method: method,
            data: formData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function (data) {
                $('#task-modal').addClass('hidden');
                loadTasks(data.status); // Reload tasks for the updated status
            }
        });
    });

    $('#cancel-btn').on('click', function () {
        $('#task-modal').addClass('hidden');
    });

    // Drag-and-Drop functionality
    $(".task-card").draggable({
        revert: "invalid",
        stack: ".task-card",
        helper: "clone",
        start: function (event, ui) {
            $(this).addClass("dragging");
        },

        stop: function (event, ui) {
            $(this).removeClass("dragging");
        }
    });

    $("#in-progress, #completed, #overdue").droppable({
        accept: ".task-card",
        activate: function(event, ui) {
            $(this).addClass("border-dashed border-2 border-blue-500");
          },
          deactivate: function(event, ui) {
            $(this).removeClass("border-dashed border-2 border-blue-500");
          },
        drop: function (event, ui) {
            $(this).removeClass("border-dashed border-2 border-blue-500");
            let status = $(this).attr("id").replace("-", " ");
            let taskId = ui.draggable.data("id");

            let csrftoken = getCSRFToken();

            // Update task status via AJAX
            $.ajax({
                url: `/api/tasks/${taskId}/`,
                method: 'PATCH',
                data: {
                    status: status
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                },
                success: function (data) {
                    ui.draggable.appendTo(`#${status.toLowerCase().replace(' ', '-')}`).css({ top: 0, left: 0 });
                    loadTasks(data.status); 
                }
            });
        }
    });
});
