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
const scroll_speed_default = 5; // 2s

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
}

function modifyTileSpeed() {
    const tileEl = document.querySelectorAll(".tile"); //gets all tile elements and puts them in an array
    for(let i = 0; i < tileEl.length; i++) {
        tileEl[i].style.animationDuration = scroll_speed + "s"
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
/*
window.setInterval(() => {
    start = true;
    addClick();
}, 1000);
*/

window.setInterval(() => {
    updateTestValues();
    if(start) {
        checkTimeout();
        checkAllTasks();
        passTime();
        calculateAverage();
    }
}, 10); // interval values that are less than 10 are inaccurate
// 100 ticks = 1 second

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
    tile.innerHTML = '<div class="tile"><span style="font-size: 15px; color:lightgreen; position: relative; left:7px;">'+ time_between_clicks +'ms</span></div>';
    hit_screen.appendChild(tile);

    const tileClass = document.querySelector(".tile");
    const myStyle = getComputedStyle(tileClass);
    const tempAniDuration = parseInt(myStyle.animationDuration.substring(0, myStyle.animationDuration.length - 1)); // you cant directly put this value into the equation when setting the setTimeout timeout time, you must make a new variable and use that
    const aniDuration = tempAniDuration * 1000 - 50;

    setTimeout(() => {
        tile.remove();
    }, aniDuration);

}


class Task {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.complete = false;
        this.timer = 0;
        this.count = 0;
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
}

function checkAllTasks() {
    if(bpm_update_time >= 100) {
        if(!task1.getComplete()) {
            if(bpm >= 200) {
                task1.setComplete(true);
                updateTasks(); // updates the shown tasks if they are completed
            }
        }
        if(!task2.getComplete()) {
            if(bpm >= 1000) {
                task2.setComplete(true);
                updateTasks();
            }
        }
        if(!task3.getComplete()) {
            if(bpm >= 2000) {
                task3.setComplete(true);
                updateTasks();
            }
        }
        if(!task4.getComplete()) {
            if(bpm >= 3000) {
                task4.setComplete(true);
                updateTasks();
            }
        }



        if(!betweenTask1.getComplete()) {
            if((bpm > 200 && bpm < 250) && (ticks % 100 == 0)){ // this would only be check every second
                betweenTask1.setTimer(betweenTask1.getTimer() + 1);
            } else if(bpm >= 250 || bpm <= 200) {
                betweenTask1.setTimer(0);
            }
            if(betweenTask1.getTimer() >= 5) {
                betweenTask1.setComplete(true);
                updateTasks();
            }
        }
        if(!betweenTask2.getComplete()) {
            if((bpm > 550 && bpm < 600) && (ticks % 100 == 0)){ // this would only be check every second
                betweenTask2.setTimer(betweenTask2.getTimer() + 1);
            } else if(bpm >= 600 || bpm <= 550) {
                betweenTask2.setTimer(0);
            }
            if(betweenTask2.getTimer() >= 10) {
                betweenTask2.setComplete(true);
                updateTasks();
            }
        }
        console.log(betweenTask2.getTimer());
        if(!betweenTask3.getComplete()) {
            if((bpm > 900 && bpm < 925) && (ticks % 100 == 0)){ // this would only be check every second
                betweenTask3.setTimer(betweenTask3.getTimer() + 1);
            } else if(bpm >= 925 || bpm <= 900) {
                betweenTask3.setTimer(0);
            }
            if(betweenTask3.getTimer() >= 15) {
                betweenTask3.setComplete(true);
                updateTasks();
            }
        }

    }
    
}


function addTask(task) {
    const taskEl = document.createElement("div");

    taskEl.innerHTML = 
        '<span>' + task.getName() + '</span>';
    
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

let task1 = new Task("Hit Over 200BPM", "Easy");
let task2 = new Task("Hit Over 1000BPM", "Medium");
let task3 = new Task("Hit Over 2000BPM", "Hard");
let task4 = new Task("Hit Over 3000BPM", "Extreme");

let betweenTask1 = new Task("Stay Between 200-250BPM for 5 Sec", "Easy");
let betweenTask2 = new Task("Stay Between 550-600BPM for 10 Sec", "Medium");
let betweenTask3 = new Task("Stay Between 900-925BPM for 15 Sec", "Hard");

function updateTasks() {
    removeTasks();
    let allTasks = [
        task1, 
        task2, 
        task3, 
        task4,
        betweenTask1,
        betweenTask2,
        betweenTask3
    ];
    for(i = 0; i < allTasks.length; i++) {
        addTask(allTasks[i]);
    }
}

updateTasks();