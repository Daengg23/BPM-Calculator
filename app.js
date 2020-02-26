//## NOTE: FIX PROBLEM WITH SPAM HOLDING KEYS, ALSO ADD A DELAY BETWEEN CLICKS COUNTER
//## NOTE: FIX THE BUG WHERE THE TEST ENDS EARLY IF YOU MODIFY THE TEST TIME VALUE

console.log("Scripts Loaded");
let key_down = false; // allows only keypresses and no holds
let start = false; // tells the program if it should start recording bpm
let ticks = 0; // time passed since start
let clicks = 0;
let bpm = 0;

const bpm_update_time_default = 100; // 100ms
const test_max_time_default = 80; // 8s
const scroll_speed_default = 2; // 2s

let bpm_update_time = bpm_update_time_default;
let test_max_time = test_max_time_default;
let scroll_speed = scroll_speed_default;

let time_between_clicks = 0;
let current_click_time = 0;
let previous_click_time = 0;


const input_box = document.querySelector("#input-box");
const reset_button = document.querySelector("#reset-button");
const reset_default_button = document.querySelector("#reset-default-button");
const bpm_count = document.querySelector("#bpm-counter");
const timer_count = document.querySelector("#time-counter");
const input_fields = document.querySelector(".options-element input"); // we only need the input field inside of an option element
const hit_screen = document.querySelector(".hit-screen");
const task_container = document.querySelector(".task-container");
let task_elements = document.querySelector(".task-container div");
const scale_container = document.querySelector(".scale-container");

// Options input fields
const test_time_input = document.querySelector("#test-time");
const bpm_update_time_input = document.querySelector("#bpm-update-time");
const scroll_speed_input = document.querySelector("#scroll-time");

// Makes value of input fields visible on startup
bpm_update_time_input.value = bpm_update_time;
test_time_input.value = test_max_time;
scroll_speed_input.value = scroll_speed;

function updateTestValues() {
    bpm_update_time = bpm_update_time_input.value; // we get the bpm update time in ms. 1000ms = 1 second, or 100 ticks
    test_max_time = test_time_input.value;
    scroll_speed = scroll_speed_input.value;
    modifyTileSpeed();
    constructScale();
}

//NOTE: Test values should be updated only when they are modified, make each input field have an event listener

function modifyTileSpeed() {
    const tileEl = document.querySelectorAll(".tile"); //gets all tile elements and puts them in an array
    for(let i = 0; i < tileEl.length; i++) {
        tileEl[i].style.animationDuration = scroll_speed + "s"
    }
}



function constructScale() {
    scale_container.innerHTML = ""; //clears of previous scale
    for(let i = 0; i < scroll_speed * 10; i++) {
        const pointEl = document.createElement("div");
        pointEl.style = "display:inline-block; height:100%; width: " + 10 / scroll_speed + "%;"; // 10/1 = 10 segments, 10% each, 10/2 = 20 segmends, 5% each

        if(i % 10) { // Giving different scale sizes
            pointEl.innerHTML = "<span style='position:absolute; bottom:0; width:0.2%; height:50%; background-color:rgb(105, 105, 105); '></span>"; 
        } else if(i % 5){
            pointEl.innerHTML = "<span style='position:absolute; bottom:0; width:0.2%; height:25%; background-color:rgb(105, 105, 105); '></span>"; 
        } else 
            pointEl.innerHTML = "<span style='position:absolute; bottom:0; width:0.2%; height:100%; background-color:rgb(105, 105, 105); '></span>"; 
        
        
        
            scale_container.appendChild(pointEl);
    }

}

input_box.addEventListener("keypress", (e) => {
    start = true;
    if(key_down === false) {
        key_down = false;
        addClick();
    }
    input_box.value = input_box.defaultValue; //clears typed characters
    
});
input_box.addEventListener("keyup", (e) => {
    key_down = false;
    start = true;
});

reset_button.addEventListener("click", () => {
    reset();
});

reset_default_button.addEventListener("click", () => {
    resetDefault();
    reset();
    updateTestValues();
});

input_fields.addEventListener("click", (e) => {
    reset();
});


// This is auto

window.setInterval(() => {
    addClick();
}, 1000 );



window.setInterval(() => {
    updateTestValues();
    if(start) {
        // game loop
        checkTimeout();
        checkAllTasks();
        passTime();
        calculateAverage();
        time_between_clicks = 0; //resets time between clicks so that the only way it could be brought up again is by clicking
    }
}, 10); // interval values that are less than 10 are inaccurate
// 100 ticks = 1 second

function updateTaskElementEventListeners() {
    task_elements = document.querySelectorAll(".task-container div"); // updates all tasks that are shown
    for(let i = 0; i < task_elements.length; i++) {
        task_elements[i].addEventListener('mouseover', () => { 
        });

    }
}

function calculateAverage() {
    if(ticks * 10 % bpm_update_time === 0) { // 100 ticks is one second so 10 ticks is 100 ms
        const average = Math.round(clicks/(ticks/6000) * 100)/100; // 6000/100 is 60 seconds. Divide number of clicks by a faction of a minute
        bpm = average;
        bpm_count.innerHTML = average;
    }
}

function checkTimeout() {
    if(ticks >= test_max_time * 100) {
        //alert("Your Final BPM Was: " + bpm_count.innerHTML);
        reset();
    }
}

function passTime() {
    ticks++;
    if(start) {
        timer_count.innerHTML = ticks/100;
    }
}

function addClick() {
    clicks++;
    calculateTimeBetweenClick();
    addTile();
}

function calculateTimeBetweenClick() {
    previous_click_time = current_click_time; // refreshes the current click
    current_click_time = ticks * 10; // the time is the time passed since the test started
    time_between_clicks = Math.abs(current_click_time - previous_click_time); //result will sometimes be negative
}

function reset() {
    input_box.blur(); // deselects the input area so that the keyboard does not continue to give input
    keydown = false;
    ticks = 0;
    clicks = 0;
    bpm = 0;
    start = false; 
    timer_count.innerHTML = 0;
    bpm_count.innerHTML = 0;
    input_box.value = input_box.defaultValue; //clears leftover text
    time_between_clicks = 0;
    previous_click_time = 0;
    current_click_time = 0;
}

function resetDefault() {
    bpm_update_time_input.value = bpm_update_time_default;
    test_time_input.value = test_max_time_default;
    scroll_speed_input.value = scroll_speed_default;
}

function addTile() {
    const tile = document.createElement('span');
    tile.innerHTML = '<div class="tile"><span style="font-size: 150%; color:lightgreen; position: relative; left:7px;">'+ time_between_clicks +'ms</span></div>';
    hit_screen.appendChild(tile);

    const tileClass = document.querySelector(".tile");
    const myStyle = getComputedStyle(tileClass);
    const tempAniDuration = parseInt(myStyle.animationDuration.substring(0, myStyle.animationDuration.length - 1)); // you cant directly put this value into the equation when setting the setTimeout timeout time, you must make a new variable and use that
    const aniDuration = tempAniDuration * 1000 - 10;

    setTimeout(() => {
        tile.remove();
    }, aniDuration);

}


class Task {
    constructor(name, description, type, val1=0, val2=0, duration=0, delay=0, goal=0) {
        this.name = name;
        this.description = description;
        this.complete = false;
        this.timer = 0;
        this.count = 0;
        this.val1 = val1;
        this.val2 = val2;
        this.duration = duration;
        this.delay = delay;
        this.goal = goal;
        this.type = type;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getTimer() {
        return this.timer;
    }
    setTimer(newTime) {
        this.timer = newTime;
    }

    getCount() {
        return this.count;
    }
    setCount(newCount) {
        this.count = newCount;
    }

    getComplete() {
        return this.complete;
    }
    setComplete(newVal) {
        // new Val has to be a boolean
        this.complete = newVal;
    }

    getType() {
        return this.type;
    }

    inBetween(bpm, ticks) {
        // val1 = min bpm limit
        // val2 = max bpm limit
        // goal = time needed to complete
        // ticks prevent timers from being spammed
        if((bpm > this.val1 && bpm < this.val2) && (ticks % 100 == 0)){ // this would only be check every second
            this.setTimer(this.getTimer() + 1);
        } else if(bpm >= this.val2 || bpm <= this.val1) {
            this.setTimer(0);
        }
        if(this.getTimer() >= this.goal) {
            this.setComplete(true);
        }
    }

    goOver(bpm) {
        // goal = bpm goal
        if(bpm >= this.goal) {
            this.setComplete(true);
        }
    }

    hitConsecutive(timeBetweenClicks) {
        // val1 = desired tbc
        // val2 = margin of error
        // goal = number of consecutive tbc
        // when timer is 0, there is no valid tbc, valid times are shown when a click is registered
        if(timeBetweenClicks >= this.val1 - this.val2 && timeBetweenClicks <= this.val1 + this.val2) { // allows for margin of error with val2
            this.setCount(this.getCount() + 1);
        } else if((timeBetweenClicks >= this.val + this.val2 || timeBetweenClicks <= this.val1 - this.val2) && timeBetweenClicks != 0) { // when tbc goes out of range
            this.setCount(0);
        }
        if(this.getCount() >= this.goal) {
            this.setComplete(true);
        }
    }


}

let task1 = new Task("Hit Over 500BPM", "Easy", "goOver", 0, 0, 0, 0, 500);
let task2 = new Task("Hit Over 1000BPM", "Medium", "goOver", 0, 0, 0, 0, 1000);
let task3 = new Task("Hit Over 2000BPM", "Hard", "goOver", 0, 0, 0, 0, 2000);
let task4 = new Task("Hit Over 3000BPM", "Extreme", "goOver", 0, 0, 0, 0, 3000);

let hitConsecutive1 = new Task("Hit 4 (250ms) notes in a row, 50ms accuracy", "Easy", "hitConsecutive", 250, 50, 0, 0, 4);
let hitConsecutive2 = new Task("Hit 16 (500ms) notes in a row, 50ms accuracy", "Easy", "hitConsecutive", 500, 50, 0, 0, 16);
let hitConsecutive3 = new Task("Hit 32 (100ms) notes in a row, 10ms accuracy", "Medium", "hitConsecutive", 100, 10, 0, 0, 32);
let hitConsecutive4 = new Task("Hit 64 (50ms) notes in a row, 10ms accuracy", "Hard", "hitConsecutive", 50, 10, 0, 0, 64);
let hitConsecutive5 = new Task("Hit 12 (1500ms) notes in a row, 10ms accuracy", "Extreme", "hitConsecutive", 1500, 10, 0, 0, 12);


let betweenTask1 = new Task("Stay Between 200-250BPM for 5 Sec", "Easy", "inBetween", 200, 250, 0, 0, 5);
let betweenTask2 = new Task("Stay Between 550-600BPM for 10 Sec", "Medium", "inBetween", 550, 600, 0, 0, 10);
let betweenTask3 = new Task("Stay Between 900-925BPM for 15 Sec", "Hard", "inBetween", 900, 925, 0, 0, 15);

let allTasks = [
    task1, 
    task2, 
    task3, 
    task4,
    betweenTask1,
    betweenTask2,
    betweenTask3,
    hitConsecutive1,
    hitConsecutive2,
    hitConsecutive3,
    hitConsecutive4,
    hitConsecutive5
];

function checkAllTasks() {
    for(let i = 0; i < allTasks.length; i++) {
        let completed = undefined;
        if(bpm_update_time >= bpm_update_time_default) {
            if(!(allTasks[i].getComplete())) {
                completed = false;
                if(allTasks[i].getType() === "goOver")
                    allTasks[i].goOver(bpm);
                if(allTasks[i].getType() === "inBetween")
                    allTasks[i].inBetween(bpm, ticks);
                if(allTasks[i].getType() === "hitConsecutive")
                    allTasks[i].hitConsecutive(time_between_clicks);
            }
            
        }
        if(allTasks[i].getComplete() == true && completed == false) { // completed would only be false when it is check that the task is incomplete
            completed = true;
        }
        if(completed == true){
            updateTasks(); // the tasks are only updated when a task is detected to be incomplete and is completed within this iteration
        }
    }
    
}


function addTask(task) {
    const taskEl = document.createElement("div");

    taskEl.innerHTML = '<span>' + task.getName() + '</span>';
    
    if(task.getComplete() == true) {
        taskEl.innerHTML += '<div class="complete"></div>';
    } else {
        taskEl.innerHTML += '<div class="incomplete"></div>';
    }
    task_container.appendChild(taskEl); 
}

function removeTasks() {
    task_container.innerHTML = "";
}

function updateTasks() {
    removeTasks();
    for(i = 0; i < allTasks.length; i++) {
        addTask(allTasks[i]);
    }
    updateTaskElementEventListeners();
}

updateTasks();