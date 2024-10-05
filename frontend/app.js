document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/api/todos';
    const todoList = document.getElementById('todo-list');
    const newTodoInput = document.getElementById('new-todo');
    const addTodoButton = document.getElementById('add-todo');

    // Fetch and display todos on page load
    function fetchTodos() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(todos => {
                todoList.innerHTML = ''; // Clear existing list
                todos.forEach(todo => addTodoToUI(todo));
            })
            .catch(error => console.error('Error fetching todos:', error));
    }

    // Add todo to UI
    function addTodoToUI(todo) {
        const li = document.createElement('li');
        li.dataset.id = todo.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleComplete(todo));

        const todoTitle = document.createElement('span');
        todoTitle.textContent = todo.title;
        if (todo.completed) {
            todoTitle.classList.add('completed'); // Strike-through if completed
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(todoTitle);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    }

    // Toggle todo completion
    function toggleComplete(todo) {
        fetch(`${apiUrl}/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: todo.title,
                completed: !todo.completed,
            }),
        })
            .then(response => response.json())
            .then(updatedTodo => {
                const todoElement = document.querySelector(`li[data-id="${todo.id}"] span`);
                const checkbox = document.querySelector(`li[data-id="${todo.id}"] input[type="checkbox"]`);
                checkbox.checked = updatedTodo.completed;

                if (updatedTodo.completed) {
                    todoElement.classList.add('completed'); // Add strike-through if completed
                } else {
                    todoElement.classList.remove('completed'); // Remove strike-through if not completed
                }
            })
            .catch(error => console.error('Error updating todo:', error));
    }

    // Delete a todo
    function deleteTodo(id) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                const todoElement = document.querySelector(`li[data-id="${id}"]`);
                todoElement.remove();
            })
            .catch(error => console.error('Error deleting todo:', error));
    }

    // Add a new todo
    addTodoButton.addEventListener('click', () => {
        const title = newTodoInput.value.trim();
        if (title === '') return;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        })
            .then(response => response.json())
            .then(todo => {
                addTodoToUI(todo);
                newTodoInput.value = ''; // Clear input
            })
            .catch(error => console.error('Error adding todo:', error));
    });

    // Initial fetch
    fetchTodos();
});
