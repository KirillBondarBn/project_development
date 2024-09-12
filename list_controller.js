const container = document.getElementById("content")
const import_button = document.getElementById("import_tasks");
const add_button = document.getElementById("add_task")
const save_button = document.getElementById("save_tasks")

var task_count = 0;

function remove_task(event) {
    event.target.parentElement.remove()
}

function create_task() {
    var task = document.createElement('div')
    var title = document.createElement('input')
    title.type = "text"
    title.placeholder = "Enter the title"

    var description = document.createElement('textarea')
    
    var remove_button = document.createElement('input')
    remove_button.type = "button"
    remove_button.value = "Remove"
    remove_button.onclick = remove_task

    var status = document.createElement('select')
    var done = document.createElement('option')
    done.textContent = "Done"
    done.value = "done"
    var notReady = document.createElement('option')
    notReady.textContent = "Not ready"
    notReady.value = "not_ready"

    status.appendChild(notReady)
    status.appendChild(done)

    task.className = "task"
    task.id = `${task_count + 1}`
    task_count += 1
    
    task.appendChild(title)
    task.appendChild(description)
    task.appendChild(status)
    task.appendChild(remove_button)
    container.appendChild(task)
}

function export_tasks() {
    var tasks = [];
    var taskElements = container.querySelectorAll(".task");

    taskElements.forEach(task => {
        var taskData = {
            title: task.querySelector('input[type="text"]').value,
            description: task.querySelector('textarea').value,
            status: task.querySelector('select').value
        };
        tasks.push(taskData);
    });

    var json = JSON.stringify(tasks, null, 2);

    var blob = new Blob([json], { 
        type: "application/json" 
    });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function import_tasks(event) {
    var file = event.target.files[0]; 

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            try {
                var tasks = JSON.parse(e.target.result);
                tasks.forEach(taskData => {
                    create_task_from_data(taskData);
                });
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };

        reader.readAsText(file); файла
    }
}

function create_task_from_data(taskData) {
    var task = document.createElement('div');
    task.className = "task";
    task.id = `${task_count + 1}`;
    task_count += 1;

    var title = document.createElement('input');
    title.type = "text";
    title.value = taskData.title;

    var description = document.createElement('textarea');
    description.value = taskData.description;

    var remove_button = document.createElement('input');
    remove_button.type = "button";
    remove_button.value = "Remove";
    remove_button.onclick = remove_task;

    var status = document.createElement('select');

    var done = document.createElement('option');
    done.textContent = "Done";
    done.value = "done";

    var notReady = document.createElement('option');
    notReady.textContent = "Not ready";
    notReady.value = "not_ready";

    status.appendChild(notReady);
    status.appendChild(done);

    
    status.value = taskData.status;

    task.appendChild(title);
    task.appendChild(description);
    task.appendChild(status);
    task.appendChild(remove_button);
    container.appendChild(task);
}


import_button.addEventListener("change", import_tasks);


add_button.addEventListener("click", create_task)
save_button.addEventListener("click", export_tasks)