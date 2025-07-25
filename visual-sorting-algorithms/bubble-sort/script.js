let array = [];
let originalArray = []; // New variable to store the original array
let isSorting = false; // Flag to track if sorting is in progress
let isPaused = false;  // Flag to track if sorting is paused
const arrayContainer = document.getElementById("array-container");


let selectedArrayType = 'random';

function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('show');
}

function setArrayType(type) {
    selectedArrayType = type;
    const dropdownBtn = document.querySelector('.dropdown-btn');
    dropdownBtn.childNodes[0].textContent = capitalize(type) + " ";
    generateArray(); // Regenerate the array based on the selected type
    toggleDropdown(); // Close the dropdown
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).replace('_', ' ');
}

// Close the dropdown if clicked outside
window.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.dropdown');
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Event listener for dropdown button
document.querySelector('.dropdown-btn').addEventListener('click', toggleDropdown);


function generateArray(size = 10) {
    if (isSorting) {
        return; // Prevent generating a new array during sorting
    }

    const arrayType = selectedArrayType;
    array = [];
    arrayContainer.innerHTML = "";

    // Generate array based on selected type
    if (arrayType === "random") {
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 100) + 1);
        }
    } else if (arrayType === "increasing") {
        for (let i = 1; i <= size; i++) {
            array.push(i * Math.floor(100 / size));
        }
    } else if (arrayType === "decreasing") {
        for (let i = size; i >= 1; i--) {
            array.push(i * Math.floor(100 / size));
        }
    }

    // Store a copy of the generated array
    originalArray = [...array]; // Store the array before any sorting happens

    // Render bars for the array
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${array[i]}%`;
        arrayContainer.appendChild(bar);
    }
}

async function bubbleSort() {
    if (isSorting) return; // Prevent starting a new sort if one is in progress
    isSorting = true;

    const bars = document.getElementsByClassName("bar");
    const sortButton = document.getElementById("sort-button");

    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {

            if (!isSorting) return; // Stop sorting if resetSimulation is called
            
            // Wait if paused
            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            bars[j].style.backgroundColor = "steelblue"; // Mark as being compared
            bars[j + 1].style.backgroundColor = "steelblue";

            if (array[j] > array[j + 1]) {
                // Swap elements
                await swap(bars, j, j + 1);
            }

            bars[j].style.backgroundColor = "darkslateblue"; // Reset color
            bars[j + 1].style.backgroundColor = "darkslateblue";
        }
        bars[array.length - i - 1].style.backgroundColor = "green"; // Mark as sorted
    }
    
    bars[0].style.backgroundColor = "green"; // Mark the first bar as sorted
    isSorting = false; // Sorting completed

    // Reset button to "Sort" after completion
    sortButton.innerText = "Sort";
    isPaused = false;
}

async function swap(bars, i, j) {
    return new Promise((resolve) => {
        // Swap array elements
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;

        // Swap bar heights
        bars[i].style.height = `${array[i]}%`;
        bars[j].style.height = `${array[j]}%`;

        setTimeout(() => {
            resolve();
        }, 850); // Animation delay
    });
}

function resetSimulation() {
    isSorting = false; // Stop the sorting process
    isPaused = false; // Reset the paused state
    arrayContainer.innerHTML = ""; // Clear the array container
    // generateArray(); // Regenerate the array based on the selected type

    // Reset the array to the original one before sorting started
    array = [...originalArray]; // Restore the original array

    // Render bars for the restored array
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${array[i]}%`;
        arrayContainer.appendChild(bar);
    }

    // Reset the sort button
    const sortButton = document.getElementById("sort-button");
    sortButton.innerText = "Sort";
}

function toggleSort() {
    const sortButton = document.getElementById("sort-button");

    if (isSorting) {
        // Toggle pause/resume
        isPaused = !isPaused;
        sortButton.innerText = isPaused ? "Resume" : "Pause";
    } else {
        // Start sorting
        sortButton.innerText = "Pause";
        bubbleSort();
    }
}

// Generate an initial array on page load
window.onload = generateArray();
