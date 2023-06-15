// fifo queue implementation using array
class FifoQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(item) {
        this.queue.push(item);
    }

    dequeue() {
        return this.queue.shift();
    }

    size() {
        return this.queue.length;
    }
}

// sleep function to make the code wait for some time before executing next line of code
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// responsive navbar
function toggleMenu() {
    var menu = document.getElementById("menu");
    var github = document.getElementById("github");
    if (
        menu.classList.contains("hidden") &&
        github.classList.contains("hidden")
    ) {
        menu.classList.remove("hidden");
        github.classList.remove("hidden");
    } else {
        menu.classList.add("hidden");
        github.classList.add("hidden");
    }
}

// getting the input from the user
function getValues() {
    let customers = document.getElementById("customerCount").value;
    let chair = document.getElementById("chairCount").value;
    customers = customers.trim().split(" ");
    let chairs = [];

    if (customers[0] == "") {
        document.getElementById(
            "waitingRoom"
        ).innerHTML = `<div class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Waiting Room Empty at ${new Date().toLocaleTimeString()}</div>`;
        console.log("Saurav Hathi");
        document.getElementById(
            "cuttingRoom"
        ).innerHTML = `<div class="bg-green-500 text-white font-bold py-2 px-4 rounded">Hair Cut Room Empty at ${new Date().toLocaleTimeString()}</div>`;
        document.getElementById("baberSl").style.display = "block";
        document.getElementById(
            "barberSleeping"
        ).innerHTML = `<div class="bg-yellow-500 text-white font-bold py-2 px-4 rounded">Barber Sleeping at ${new Date().toLocaleTimeString()}</div>`;
        return;
    } else if (chair == "") {
        document.getElementById("chEr").style.display = "block";
        return;
    }

    for (let i = 0; i < chair; i++) {
        chairs.push("chair" + i);
    }

    return [customers, chairs];
}

// clear function
function clr() {
    document.getElementById("leaveWaitingRoom").innerHTML = "";
    document.getElementById("waitingRoom").innerHTML = "";
    document.getElementById("cuttingRoom").innerHTML = "";
    document.getElementById("cuttingLeavingRoom").innerHTML = "";
    document.getElementById("barberSleeping").innerHTML = "";
}

const checkAuthor = document.getElementById("checkAuthor");
if (checkAuthor.children[0].innerHTML.trim() === "Saurav Hathi") {
} else {
    window.location.href = "https://github.com/sauravhathi";
}

// start function to start the simulation and show the output
function start() {
    clr();
    // getValues function to get the input from the user
    const [customers, chairs] = getValues();

    let waitting = 0;

    // object of FifoQueue class
    const queue = new FifoQueue();

    // dom elements to show the output 
    let leaveWaitingRoom = document.getElementById("leaveWaitingRoom");
    let waitingRoom = document.getElementById("waitingRoom");
    let cuttingRoom = document.getElementById("cuttingRoom");
    let cuttingLeavingRoom = document.getElementById("cuttingLeavingRoom");
    let barberSleeping = document.getElementById("barberSleeping");
    let baberSl = document.getElementById("baberSl");

    let miliseconds = 3000;

    // using async function to make the code wait for some time before executing next line of code
    setTimeout(async () => {
        // loop to add the customers to the queue
        for (let i = 0; i < customers.length; i++) {
            if (waitting < chairs.length) {
                queue.enqueue(customers[i]);
                waitting++;
                console.log(
                    `Customer Entered the Waiting Room ${customers[i]
                    } at ${new Date().toLocaleTimeString()}`
                );
                waitingRoom.innerHTML += `<div class="bg-blue-500 text-white py-2 px-4 rounded">Customer ${customers[i]
                    } Entered the Waiting Room at ${new Date().toLocaleTimeString()}</div>`;
            } else {
                if (queue.size() === 0) {
                    return;
                } else {
                    console.log(
                        `Customer Left because of Full Waiting Room ${customers[i]
                        } at ${new Date().toLocaleTimeString()}`
                    );
                    leaveWaitingRoom.innerHTML += `<div class="bg-red-500 text-white py-2 px-4 rounded">Customer Left because of Full Waiting Room ${customers[i]
                        } at ${new Date().toLocaleTimeString()}</div>`;
                }
            }
        }
    }, 2000);

    // using async function to make the code wait for some time before executing next line of code
    setTimeout(async () => {
        if (waitting > 0) {
            for (let i = 0; i < waitting; i++) {
                const customer = queue.dequeue();
                waitingRoom.removeChild(waitingRoom.childNodes[0]);
                if (i == waitting - 1) {
                    waitingRoom.innerHTML += `<div class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Waiting Room Empty at ${new Date().toLocaleTimeString()}</div>`;
                }
                cuttingLeaving.style.display = "block";
                console.log(
                    `Customer Hair Cut Started ${customer} at ${new Date().toLocaleTimeString()}`
                );
                cuttingRoom.innerHTML += `<div class="bg-green-500 text-white py-2 px-4 rounded">Barber Cutting Hair of ${customer} at ${new Date().toLocaleTimeString()}</div>`;
                await sleep(2000);
                console.log(
                    `Customer Hair Cut Done ${customer} at ${new Date().toLocaleTimeString()}`
                );
                cuttingLeavingRoom.innerHTML += `<div class="bg-slate-800 text-white py-2 px-4 rounded">Customer ${customer} Left the Cutting Leaving Room at ${new Date().toLocaleTimeString()}</div>`;
                await sleep(2000);
                cuttingRoom.removeChild(cuttingRoom.childNodes[0]);
                console.log(
                    `Customer Left the Cutting Leaving Room ${customer} at ${new Date().toLocaleTimeString()}`
                );
                if (i == waitting - 1) {
                    cuttingRoom.innerHTML += `<div class="bg-green-500 text-white font-bold py-2 px-4 rounded">Hair Cut Room Empty at ${new Date().toLocaleTimeString()}</div>`;
                }
                await sleep(2000);
            }
        }
        if (waitting == 0 || waitting == chairs.length) {
            if (waitting == 0) {
                waitingRoom.innerHTML += `<div class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Waiting Room Empty at ${new Date().toLocaleTimeString()}</div>`;
                cuttingRoom.innerHTML += `<div class="bg-green-500 text-white font-bold py-2 px-4 rounded">Hair Cut Room Empty at ${new Date().toLocaleTimeString()}</div>`;
            }
            baberSl.style.display = "block";
            console.log(
                `Barber Sleeping at ${new Date().toLocaleTimeString()} `
            );
            barberSleeping.innerHTML += `<div class="bg-yellow-500 text-white font-bold py-2 px-4 rounded">Barber Sleeping at ${new Date().toLocaleTimeString()}</div>`;
        }
    }, 2000);
}