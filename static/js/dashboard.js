// dashboard.js
$(document).ready(function () {
    // Load tasks dynamically

    let allCategories = new Set();

    function loadTasks(status) {
        $.ajax({
            url: `/api/tasks/?status=${status}`,
            method: 'GET',
            success: function (data) {
                $(`#${status.toLowerCase().replace(' ', '-')}`).empty();
                data.forEach(task => {
                    let taskCard = $('#task-card-template').html();
                    taskCard = taskCard.replace(/{{id}}/gm, task.id);
                    taskCard = taskCard.replace(/{{title}}/gm, task.title);
                    taskCard = taskCard.replace(/{{description}}/gm, task.description);
                    taskCard = taskCard.replace(/{{status}}/gm, task.status);
                    taskCard = taskCard.replace(/{{priority}}/gm, task.priority);
                    taskCard = taskCard.replace(/{{due_date}}/gm, new Date(task.due_date).toLocaleString());
                    taskCard = taskCard.replace(/{{category}}/gm, task.category);
                    taskCard = taskCard.replace(/{{assigned_to}}/gm, task.assigned_to);
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
        let priorityFilter = $('#priority-filter').val();
    
        $('.task-card').each(function () {
            let taskPriority = $(this).data('priority');
            let priorityMatch = priorityFilter === 'all' || taskPriority === priorityFilter;
            if (priorityMatch) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
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
        let taskId = $(this).data('id');
        $.ajax({
            url: `/api/tasks/${taskId}/`,
            method: 'GET',
            success: function (task) {
                $('#task-id').val(task.id);
                $('#div_id_title').val(task.title);
                $('#div_id_description').val(task.description);
                $('#div_id_status').val(task.status);
                $('#div_id_priority').val(task.priority);
                $('#div_id_due-date').val(task.due_date.slice(0, 16)); // Format: YYYY-MM-DDTHH:MM
                $('#div_id_category').val(task.category);
                $('#div_id_assigned_to').val(task.assigned_to);
                $('#modal-title').text('Edit Task');
                $('#task-modal').removeClass('hidden');
            }
        });
    });

    $('#task-form').on('submit', function (e) {
        e.preventDefault();
        let taskId = $('#task-id').val();
        let url = taskId ? `/api/tasks/${taskId}/` : '/api/tasks/';
        let method = taskId ? 'PUT' : 'POST';
        let formData = {
            title: $('#div_id_title').val(),
            description: $('#div_id_description').val(),
            status: $('#div_id_status').val(),
            priority: $('#div_id_priority').val(),
            due_date: $('#div_id_due-date').val(),
            category: $('#div_id_category').val(),
            assigned_to: $('#div_id_assigned_to').val(),
        };

        $.ajax({
            url: url,
            method: method,
            data: formData,
            success: function (data) {
                $('#task-modal').addClass('hidden');
                loadTasks(formData.status); // Reload tasks for the updated status
            }
        });
    });

    $('#cancel-btn').on('click', function () {
        $('#task-modal').addClass('hidden');
    });

    // Drag-and-Drop functionality
    $(".task-card").draggable({
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
        drop: function (event, ui) {
            let status = $(this).attr("id").replace("-", " "); // Convert 'in-progress' to 'In Progress'
            let taskId = ui.draggable.data("id");
            // Update task status via AJAX
            $.ajax({
                url: `/api/tasks/${taskId}/`,
                method: 'PATCH',
                data: {
                    status: status
                },
                success: function (data) {
                    ui.draggable.appendTo(`#${status.toLowerCase().replace(' ', '-')}`).css({ top: 0, left: 0 });
                }
            });
        }
    });
});
