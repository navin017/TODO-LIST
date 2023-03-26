//To select  the class todo-form   
const todoForm = document.querySelector('.todo-form');
//To select  the class todo-input   
const todoInput = document.querySelector('.todo-input');
//To select  the class todo-items    
const todoItemsList = document.querySelector('.todo-items');
//Empty array to Store the todos     
let todos = [];
let isEdited = false;

todoForm.addEventListener('submit', function (event) {
  event.preventDefault();
  //Calling the addTodo function   
  addTodo(todoInput.value);
});

// Function to add todos   
function addTodo(item) {
  if (item == '')
    alert("Your Todo list is still empty");

  //Using Array method to find duplicate item    
  const exists = todos.some(todo => todo.name === item);

  if (exists) {
    alert("This task is already exist!");
    return;
  }
  else if (item !== '') {
    //Creating new todo object with id,name,and status of completion   
    const todo =
    {
      id: Date.now(),
      name: item,
      completed: false
    };
    //To identify is that todo is updating or newly-adding    
    if (isEdited) {
      const index = todos.findIndex(item => item.id === editedTodoId);
      todos[index] = todo;
      isEdited = true;
    }
    // if any above condition is executed the edited or updated todos will added to the Todos array   
    todos.push(todo);
    showToast('added');
    //Set the input field to empty   
    todoInput.value = '';
  }
  //To make the addTodo function to execute once only during call   
  todoForm.removeEventListener('submit', addTodo);
  //Adding todos to the localstorage   
  addToLocalStorage(todos);
}

function renderTodos() {
  //To make a cleared list for adding items   
  todoItemsList.innerHTML = '';
  //For each loop to iterate through todos Array    
  todos.forEach(function (item) {
    const checked = item.completed ? 'checked' : null;
    const li = document.createElement('li');
    //Setting all class attributes to item   
    li.setAttribute('class', 'item');
    li.setAttribute('data-key', item.id);
    //including the elements for list   
    li.innerHTML = `     
    
     <input type="checkbox" class="checkbox" ${checked}>${item.name}     
     <button class="delete-button">🗑️</button>        
     <button class="edit-button">✏️</button> `;
    //To add the next new Todo to the list   
    todoItemsList.append(li);
  });
}

//function to add the todos to the local storage   
function addToLocalStorage(todos) {
  //Converting the arrays to the string to store it in Local Storage   
  localStorage.setItem('todos', JSON.stringify(todos));
  //To show the Updated List   
  renderTodos(todos);
}

//Get the todos form Local Storage to show   
function getFromLocalStorage() {
  //change values from string to array   
  const reference = localStorage.getItem('todos');
  if (reference) {
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}

//Function for checkbox to represent completion status   
function toggle(id) {
  todos.forEach(function (item) {
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });
  addToLocalStorage(todos);
}

function deleteTodo(id) {
  //To get conformation from the user to delete the todo    
  const confirmed = confirm("Are you sure you want to delete this todo?");
  if (confirmed == true) {
    //filter the item by deleting the selected todo   
    todos = todos.filter(function (item) {
      return item.id != id;
    });
    addToLocalStorage(todos);
  }
  showDelToast("this task is deleted Sucessfully!")
}

//Function to edit the Existing Function   
function editTodo(id) {
  const todoIndex = todos.findIndex(item => item.id == id);
  if (todoIndex !== -1) {
    const todo = todos[todoIndex];
    todoInput.value = todo.name;
    todos.splice(todoIndex, 1);

    todoForm.addEventListener('submit', function (event) {
      event.preventDefault();
      todo.name = todoInput.value;
      todos.splice(todoIndex, 0, todo);
      addToLocalStorage(todos);
      todoForm.removeEventListener('submit', arguments.callee);
      todoForm.addEventListener('submit', addTodo);
      todoInput.value = '';
      isEdited = false;
    });
  }
}

//function to calback for specific function is clicked   
getFromLocalStorage();
todoItemsList.addEventListener('click', function (event) {
  if (event.target.type === 'checkbox') {
    toggle(event.target.parentElement.getAttribute('data-key'));
  }
  else if (event.target.classList.contains('delete-button')) {
    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  }
  else if (event.target.classList.contains('edit-button')) {
    editTodo(event.target.parentElement.getAttribute('data-key'));
    disableButtons(true);
    isEdited = true;
  }
});

//toast message     

function showToast(type) {
  let message = type === 'added' ? 'Your task has been added' : 'New task has been updated';
  const toast = document.createElement('div');  //is to organize the toast in a form     
  toast.classList.add('toast');
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

//To prevent another click on eddit       
const disableButtons = (bool) => {

  let editButtons = document.getElementsByClassName("edit-button");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  })
}

////toast for delete remaining      
function showDelToast(noti) {
  const toastDel = document.createElement('div');  //is to organize the toast in a form     
  toastDel.classList.add('toastDel');
  toastDel.textContent = noti;
  document.body.appendChild(toastDel);
  setTimeout(() => {
    toastDel.remove();
  }, 2000)
}   