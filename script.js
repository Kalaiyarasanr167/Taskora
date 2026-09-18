
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        const user = {
            name: name,
            email: email,
            password: password
        };

        fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            alert(data.message);

            if (data.message === "Registration successful") {
                window.location.href = "login.html";
            }

        })
        .catch(function(error) {

            console.log(error);

        });

    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            if (data.message === "Login successful") {

                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("user", JSON.stringify(data.user));

                window.location.href = "dashboard.html";

            } else {

                alert(data.message);

            }

        })
        .catch(function(error) {

            console.log(error);

        });

    });
}


function openTaskForm() {

    document.getElementById("taskFormContainer").style.display = "block";

}


function closeTaskForm() {

    document.getElementById("taskFormContainer").style.display = "none";

}


const taskForm = document.getElementById("taskForm");

if (taskForm) {

    taskForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const title = document.getElementById("taskTitle").value;
        const description = document.getElementById("taskDescription").value;
        const date = document.getElementById("taskDate").value;
        const priority = document.getElementById("taskPriority").value;

        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user.id;

        fetch("http://localhost:5000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                due_date: date,
                priority: priority,
                user_id: user_id
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            alert(data.message);

            taskForm.reset();

            closeTaskForm();

            displayTasks();

        })
        .catch(function(error) {

            console.log(error);

        });

    });

}


function displayTasks() {

    const taskList = document.getElementById("taskList");

    if (!taskList) {
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    fetch("http://localhost:5000/tasks/" + user.id)
    .then(function(response) {
        return response.json();
    })
    .then(function(tasks) {

        taskList.innerHTML = "";

        tasks.forEach(function(task) {

            const today = new Date();

            today.setHours(0, 0, 0, 0);

            const dueDate = new Date(task.due_date);

            dueDate.setHours(0, 0, 0, 0);

            let dueMessage = "Due: " + task.due_date;

            if (task.status === "Pending" && dueDate < today) {

                dueMessage = "⚠️ Overdue: " + task.due_date;

            } else if (
                task.status === "Pending" &&
                dueDate.getTime() === today.getTime()
            ) {

                dueMessage = "📅 Due Today";

            }

            const taskCard = document.createElement("div");

            taskCard.className = "task-card";

            taskCard.innerHTML = `
                <h3>${task.title}</h3>

                <p>${task.description}</p>

                <div class="task-info">

                    <span>${dueMessage}</span>

                    <span class="priority">
                        Priority: ${task.priority}
                    </span>

                    <span class="status ${
                        task.status === "Completed"
                        ? "completed"
                        : "pending"
                    }">
                        ${task.status}
                    </span>

                    <div class="task-buttons">

                        ${
                            task.status === "Pending"
                            ? `<button class="complete-btn"
                                onclick="completeTask(${task.id})">
                                Complete
                               </button>`
                            : ""
                        }

                        <button class="delete-btn"
                            onclick="deleteTask(${task.id})">
                            Delete
                        </button>

                    </div>

                </div>
            `;

            taskList.appendChild(taskCard);

        });

        updateStats(tasks);

    })
    .catch(function(error) {

        console.log(error);

    });

}


function completeTask(id) {

    fetch("http://localhost:5000/tasks/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "Completed"
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        alert(data.message);

        displayTasks();

    })
    .catch(function(error) {

        console.log(error);

    });

}


function deleteTask(id) {

    fetch("http://localhost:5000/tasks/" + id, {
        method: "DELETE"
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        alert(data.message);

        displayTasks();

    })
    .catch(function(error) {

        console.log(error);

    });

}


function updateStats(tasks) {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.status === "Completed";
    }).length;

    const pending = total - completed;

    const totalElement = document.getElementById("totalTasks");
    const pendingElement = document.getElementById("pendingTasks");
    const completedElement = document.getElementById("completedTasks");

    if (totalElement) {
        totalElement.innerText = total;
    }

    if (pendingElement) {
        pendingElement.innerText = pending;
    }

    if (completedElement) {
        completedElement.innerText = completed;
    }

}


function logout() {

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");

    window.location.href = "login.html";

}


const userName = document.getElementById("userName");

if (userName) {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        userName.innerText = user.name;
    }

    displayTasks();

}


fetch("http://localhost:5000/")
.then(function(response) {
    return response.text();
})
.then(function(data) {
    console.log(data);
});
 