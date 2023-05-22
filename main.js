const app = document.querySelector('.container');

app.innerHTML = `
<header>
    <div class="volume" title='Turn On|Off Volume'>
        <i class="fa-solid fa-volume-high"></i>
        <i class="fa-solid fa-volume-xmark"></i>
    </div>
    <h1 class="title">ToDo List</h1>
    <div class="info">

        <div class="info-block">
            You have <span id='quantity'>0</span> items
        </div>

        <div class="info-block">
            <button type="button" class="clear-completed" onclick='deleteCompletedTasks()'>
                Clear completed
            </button>
        </div>
        
    </div>
</header>


<form name="form">
    <input type="text" name="new_task" id="new_task">
    <label for="new_task">Add a task</label>
    <button type='button' onclick='Reset()'>Clear</button>
</form>

<main>
    <ul class="tasks">
    </ul>
    <button type='button' class='delete-all'>Delete all</button>
</main>        
`;




let toDos = [];


const form = document.forms.form;
const input = form.elements.new_task;
const label = form.querySelector('label');
const delete_all = document.querySelector('.delete-all');


function Reset(){
    input.value = '';
    input.focus()
}


function labelAnimationStylings(){
    label.classList.add('active-label');
    input.style.border = `2px solid #ac539c`;
    input.style.boxShadow = '0 0 0 2px rgba(172, 83, 156, 0.3)';
}

function labelAnimation(){
    if(input.value.length > 0){
        labelAnimationStylings();
    }
    else{
        label.classList.remove('active-label');
        input.style.border = `2px solid #eee`;
        input.style.boxShadow = 'none';
    }
}







const quantity = document.getElementById('quantity');


function updateQuantity(){
    quantity.textContent = toDos.filter( todo => !todo.completed).length;
}


const ul = document.querySelector('.tasks');


function showTasks(){
    toDos = JSON.parse(localStorage.getItem('toDoList'))
    ul.innerHTML = '';

    toDos.forEach((el, index) =>{
        ul.innerHTML = `
        <li class="task" data-id='${index}'>
            <div class="task-block">
                <input type="checkbox" name="check-${index}" ${el.completed ? 'checked' : ''}>
                <p class="task-name ${el.completed ? 'completed-task' : ''}">${el.value}</p>
            </div>


            <div class="task-block">
                <i class="fa-regular fa-copy" title="Copy"></i>
                <i class="fa-solid fa-trash" title="Delete"></i>
            </div>

        </li>
        ` + ul.innerHTML;
    });

    if(toDos.filter(todo => todo.completed).length === 0){
        document.querySelector('.clear-completed').classList.remove('shown-button');
    }
    else{
        document.querySelector('.clear-completed').classList.add('shown-button');
    }

    saveToLocalStorage();
    updateQuantity();
    deleteAllShow();
    newValue();
    expandContent();
}






function addTask(event){
    toDos = JSON.parse(localStorage.getItem('toDoList'))
    event.preventDefault();
    const value = input.value.trim();
    const completed = false;
    
    if(value.length !== 0){   
        toDos =[
            ...toDos,
            {
                value,
                completed
            }
        ]
        input.value = null;
        // console.log(toDos)
        // input.blur();


        labelAnimation();
        saveToLocalStorage();
        showTasks();
    }

    labelAnimationStylings();
    deleteAllShow();
}




function update(event){
    if(event.target.type === 'checkbox'){
        const id = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'), 10);
        const completed = event.target.checked;
        
        toDos.forEach( (el, index) =>{
            if(index === id){
                el.completed = completed;
            }
        })
        
        saveToLocalStorage();
        showTasks();
    }
}


const clipBoard = document.querySelector('.clipBoard');


function options(event){
    if(event.target.classList[1] === 'fa-trash'){
        const id = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'), 10);
        
        if(window.confirm(`Do you want to delete this task?`)){
            const list = event.target.parentNode.parentNode;
            list.classList.add('deleted-task');
            DeltetionAudio();
            
            setTimeout(function(){
                toDos = toDos.filter( (todo, index) => index !== id);
                saveToLocalStorage();
                showTasks();
            }, 600)
        }
        
    }

    else if(event.target.classList[1] === 'fa-copy'){
        const copy_text = event.target.parentNode.parentNode.querySelector('.task-name').textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(copy_text);
        }
        document.execCommand(copy_text);

        
        clipBoard.classList.add('active-clipBoard');
        
        ClipBoardSound();

        setTimeout(function(){
            clipBoard.classList.remove('active-clipBoard')
        }, 1200)

    }
}


function deleteCompletedTasks(){
    toDos = JSON.parse(localStorage.getItem('toDoList'));
    DeltetionAudio();

    const ul_elements = [...ul.querySelectorAll('input:checked')]
    ul_elements.forEach((todo, index) =>{
        todo.parentNode.parentNode.classList.add('deleted-task-right');
    });

    setTimeout(function(){
        toDos = toDos.filter(todo => !todo.completed);
        saveToLocalStorage();
        showTasks();
    }, 700)



}




function deleteAllShow(){
    if(toDos.length === 0){
        delete_all.classList.remove('delete-all-shown');
    }
    else{
        delete_all.classList.add('delete-all-shown');
    }
}


function deleteAll(){
    DeltetionAudio();   
    toDos = [];
    saveToLocalStorage();
    ul.classList.add('deleted-tasks');
    
    setTimeout(function(){
        ul.classList.remove('deleted-tasks');
        showTasks();
        deleteAllShow();
    }, 600);

    
}



let li_task_names = [];

function newValue(){
    li_task_names = [...ul.querySelectorAll('.task-name')]

    li_task_names.forEach( (todo, index) =>{
        todo.addEventListener('dblclick', function(){
            let new_input = document.createElement('input');
            
            let id = parseInt(todo.parentNode.parentNode.getAttribute('data-id'), 10);
            todo.parentNode.parentNode.classList.add('selected');

            
            new_input.type = 'text';
            new_input.value = todo.textContent;
            new_input.classList.add('update-task');
            
            
            todo.style.display = 'none';
            todo.parentNode.append(new_input);
            new_input.focus();

            
            function UpdateNewValue(){
                
                let temp = JSON.parse(localStorage.getItem('toDoList'));
                
                temp.forEach( (el, i) =>{
                    if(el.value === todo.textContent && id === i){
                        el.value = new_input.value;
                    }
                })
                
                
                // console.log(temp)
                todo.style.display = 'block';
                new_input.remove();
                
                // todo.parentNode.parentNode.classList.remove('completed');
                localStorage.setItem('toDoList', JSON.stringify(temp))
                showTasks();



                if(new_input.value.length === 0){
                    const idd = parseInt(todo.parentNode.parentNode.getAttribute('data-id'), 10);
                          
                    let tempp = JSON.parse(localStorage.getItem('toDoList'));

                    let temp_task = ul.querySelector(`[data-id="${idd}"]`);
                    console.log(temp_task)

                    temp_task.classList.add('deleted-task');
                    DeltetionAudio();

                    
                    toDos = toDos.filter( (todoo, iii) => iii !== idd);
                    saveToLocalStorage();
                    showTasks();
                }
            }

            new_input.addEventListener('blur', UpdateNewValue);
            new_input.addEventListener('change', UpdateNewValue);
        })


        
    })


}




///////


function expandContent(){
    const Tasks = [...ul.querySelectorAll('.task-name')];
    
    Tasks.forEach( (el, index) =>{
        console.log(Tasks);
        el.addEventListener('click', function(){
            el.classList.toggle('expanded');
        })
    } )
} 



//////////////////////////


function saveToLocalStorage(){
    localStorage.setItem('toDoList', JSON.stringify(toDos));
}

function startLocalStorage(){
    if(JSON.parse(localStorage.getItem('toDoList')) === null){
        localStorage.setItem('toDoList', JSON.stringify(toDos))
    }
    else{
        toDos = JSON.parse(localStorage.getItem('toDoList'));
    }
}
////////////////////////////////////


///////////////////////////// sounds
let soundOn= true;
const volumeIcons = document.querySelector('.volume');



function DeltetionAudio(){
    if(soundOn){
        const audio = new Audio('Delete Button   Sound Effect [Free No Copyright].mp3');
        audio.currentTime = 0.8;
        audio.volume = 0.2;
        audio.play();
    }
}

function ClipBoardSound(){
    if(soundOn){
        const audio = new Audio('Telegram Notification - Sound Effect  (Fast Version).mp3');
        audio.volume = 0.2;
        audio.play();
    }
}
/////////////////////////


function soundIcon(){
    soundOn = JSON.parse(localStorage.getItem('toDoList-Volume'))
    if(JSON.parse(localStorage.getItem('toDoList-Volume') === 'true')){
        soundOn = false;
        volumeIcons.querySelector('.fa-volume-xmark').style.display = 'block';
        volumeIcons.querySelector('.fa-volume-high').style.display = 'none';

        // Check if the Vibration API is supported
        if ('vibrate' in navigator) {
            // Vibrate for 200 milliseconds
            navigator.vibrate(200);
        } else {
            // Vibration API is not supported
            console.log('Vibration not supported');
        }
  
    }
    else{
        soundOn = true;
        volumeIcons.querySelector('.fa-volume-xmark').style.display = 'none';
        volumeIcons.querySelector('.fa-volume-high').style.display = 'block';
    }
    localStorage.setItem('toDoList-Volume', JSON.stringify(soundOn));
}

volumeIcons.addEventListener('click', soundIcon);




function soundLocalStorage(){
    if(JSON.parse(localStorage.getItem('toDoList-Volume')) === null){
        localStorage.setItem('toDoList-Volume', JSON.stringify(true));
    }
    else{
        soundOn = JSON.parse(localStorage.getItem('toDoList-Volume'))
        if(JSON.parse(localStorage.getItem('toDoList-Volume') === 'false')){
            volumeIcons.querySelector('.fa-volume-xmark').style.display = 'block';
            volumeIcons.querySelector('.fa-volume-high').style.display = 'none';
        }
        else{
            volumeIcons.querySelector('.fa-volume-xmark').style.display = 'none';
            volumeIcons.querySelector('.fa-volume-high').style.display = 'block';
        }
    }
}

//////////////////////////






function init(){
    startLocalStorage();
    soundLocalStorage();
    showTasks();
    form.addEventListener('submit', addTask);
    ul.addEventListener('change', update)
    ul.addEventListener('click', options)
    // newValue();
    // expandContent();

    // input.addEventListener('input', labelAnimation);
    input.addEventListener('change', labelAnimation);
    input.addEventListener('focus', labelAnimationStylings);
    input.addEventListener('blur', labelAnimation);

    delete_all.addEventListener('click', deleteAll);


}

init();