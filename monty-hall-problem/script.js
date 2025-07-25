let stayWins = 0;
let switchWins = 0;
let running = false; // Flag to control if the simulation is running
let paused = false;  // Flag to check if the simulation is paused


// Function to toggle between Run and Pause
function toggleSimulation() {
    const runButton = document.getElementById("runButton");

    if (runButton.innerText === "Restart" || !running) {
        runSimulations(); // Restart if the button is in "Restart" mode, Start simulation if not running
    } else {
        // Toggle pause and update button text accordingly
        paused = !paused;
        runButton.innerText = paused ? "Resume" : "Pause";
    }
}

// Function to run multiple simulations with progress bars for both wins
async function runSimulations() {
    const numSimulations = parseInt(document.getElementById("numSimulations").value) || 0;
    stayWins = 0;
    switchWins = 0;
    running = true; // Set running to true to start the simulation
    paused = false;

    // Change button to "Pause" when running
    const runButton = document.getElementById("runButton");

    if (numSimulations > 0) {
        runButton.innerText = "Pause";
    }
    
    // Reset progress bars and results
    document.getElementById("progressStay").style.width = '0%';
    document.getElementById("progressSwitch").style.width = '0%';
    document.getElementById("stayWinsText").innerText = "Wins by Staying: 0";
    document.getElementById("switchWinsText").innerText = "Wins by Switching: 0";

    let i = 0;
    for (; i < numSimulations; i++) {

        while (paused) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait while paused
        }

        // Check if the simulation has been reset, if so, stop the loop
        if (!running) break;

        simulateGame(false);  // Run simulation without switching
        simulateGame(true);   // Run simulation with switching

        // Update progress bars and display results
        updateProgressBars(numSimulations);
        displayResults(numSimulations);

        // Delay for smoother progress animation
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Simulation complete; change button to "Restart"
    if (i == numSimulations && numSimulations > 0) {
        runButton.innerText = "Restart";
    }

    running = false;
}

// Function to simulate a single game
function simulateGame(switchChoice) {
    const prizeDoor = Math.floor(Math.random() * 3) + 1;
    const userChoice = Math.floor(Math.random() * 3) + 1;

    // Monty reveals a goat door that's neither the user's choice nor the prize door
    const doors = [1, 2, 3];
    const possibleDoors = doors.filter(d => d !== userChoice && d !== prizeDoor);
    const shownDoor = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];

    // Determine the final choice based on switchChoice flag
    const finalChoice = switchChoice ? doors.find(d => d !== userChoice && d !== shownDoor) : userChoice;

    // Track wins based on the final choice and the prize door
    if (finalChoice === prizeDoor) {
        if (switchChoice) {
            switchWins++;
        } else {
            stayWins++;
        }
    }
}

// Function to reset the simulation
function resetSimulation() {
    // Set running to false to stop any ongoing simulation
    running = false;
    paused = false;

    // Reset input field
    document.getElementById("numSimulations").value = "";

    // Reset progress bar widths
    document.getElementById("progressStay").style.width = '0%';
    document.getElementById("progressSwitch").style.width = '0%';

    // Reset progress bar text
    document.getElementById("stayWinsText").innerText = "Wins by Staying: 0";
    document.getElementById("switchWinsText").innerText = "Wins by Switching: 0";

    // Reset win counts
    stayWins = 0;
    switchWins = 0;

    // Reset button text to "Run"
    document.getElementById("runButton").innerText = "Run";
}

// Function to update progress bars based on the current wins
function updateProgressBars(totalSimulations) {
    const stayProgress = (stayWins / totalSimulations) * 100;
    const switchProgress = (switchWins / totalSimulations) * 100;

    document.getElementById("progressStay").style.width = `${stayProgress}%`;
    document.getElementById("progressSwitch").style.width = `${switchProgress}%`;
}

// Function to display results
function displayResults(totalSimulations) {
    const stayWinsPercent = ((stayWins / totalSimulations) * 100.0).toFixed(1);
    const switchWinsPercent = ((switchWins / totalSimulations) * 100.0).toFixed(1);

    document.getElementById("stayWinsText").innerText = `Wins by Staying: ${stayWins} (${stayWinsPercent}%)`;
    document.getElementById("switchWinsText").innerText = `Wins by Switching: ${switchWins} (${switchWinsPercent}%)`;
}