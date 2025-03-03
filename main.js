const username = document.getElementById("username");
const password = document.getElementById("password");
const registerBtn = document.querySelector(".btn1");
const loggingBtn = document.querySelector(".btn2");
const urlApi = "http://localhost:3000";
const result = document.getElementById('result');




registerBtn.addEventListener('click', async(event) => {
    event.preventDefault();
    if (!username.value || !password.value) {
        alert('Please fill all rows');
        return;
    }
    await registerUser(username, password);
});

//register user
async function registerUser(usernameField, passwordField) {
    try {
        const response = await fetch(`${urlApi}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameField.value,
                password: passwordField.value
            })
        });
        const data = await response.json();
        if (response.status === 201) {
            window.alert("Registration succesful!");
            username.value = ""; // clearing the rows username 
            password.value = ""; // clearing from old pass 
        } else {
            window.alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Network error:", error);
        window.alert("Failed to connect to the server.");

    }

};

loggingBtn.addEventListener('click', async(event) => {
    event.preventDefault();
    if (!username.value || !password.value) {
        alert('Please fill all rows');
        return;
    }
    await loggingUser(username, password);
});


//logging user
async function loggingUser(usernameField, passwordField) {
    try {
        const response = await fetch(`${urlApi}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameField.value,
                password: passwordField.value
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            console.log(`your token is: ${data.token}`)
            window.alert("Login was succesfully complited!");
            document.cookie = `authToken=${data.token}; path=/; Secure`
            document.getElementById('result').innerHTML = `<center><strong>Token:</strong> ${data.token}</center>`
            fetchData();

        } else {
            window.alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Logging error:", error);
        window.alert("Logging error");

    }

};

async function fetchData() {
    const authToken = getCookie("authToken");
    if (!authToken) {
        alert("You must be logged in!");
        return;
    }
    try {
        const response = await fetch(`${urlApi}/todos`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${authToken}` }

        });
        if (!authToken) {
            alert("You must be logged in!");
            return;
        }
        const data = await response.json();
        if (response.status === 200) {
            window.alert("Data was successfully load");
            displayData(data);
            console.log(data);
        } else {
            window.alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Fetching error:", error);
        window.alert("Fetching error");
    }

}

function getCookie(name) {
    const value = `; ${document.cookie}`; // add ; sign easily separating in the future
    const parts = value.split(`; ${name}=`); // splitting on the parts
    console.log()
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

function displayData(data) {
    const todolist = document.getElementById('result');
    todolist.innerHTML = "";
    const myBtnAdd = document.createElement('add-todo');
    myBtnAdd.textContent = "add To List";
    myBtnAdd.addEventListener('click', () => {})
    todolist.appendChild(myBtnAdd);

    data.forEach(todo => {
        const myItem = document.createElement('li');


        myItem.innerHTML = `${todo.title} :  ${todo.description}`;
        todolist.appendChild(myItem);



        // "Complete" Button
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Complete";
        completeBtn.classList.add("complete-btn");
        completeBtn.addEventListener("click", () => markTodoComplete(todo.id));

        // "Edit" Button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", () => editTodo(todo));

        // "Delete" Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));


        const buttonContainer = document.createElement("div");
        // Append buttons inside the container
        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);

        myItem.appendChild(buttonContainer);

    });




}