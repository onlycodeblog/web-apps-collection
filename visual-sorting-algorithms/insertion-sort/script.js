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

async function insertionSort() {
    if (isSorting) return; // Prevent starting a new sort if one is in progress
    isSorting = true;

    const bars = document.getElementsByClassName("bar");
    const sortButton = document.getElementById("sort-button");

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        // Highlight the current bar being inserted
        bars[i].style.backgroundColor = "coral";

        // Highlight the left side to show it is being processed
        for (let k = 0; k < i; k++) {
            if (!isSorting) return; // Stop sorting if resetSimulation is called

            // Wait if paused
            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            await new Promise(resolve => setTimeout(resolve, 350));
            bars[k].style.backgroundColor = "steelblue";
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        bars[i].style.height = "0%";

        while (j >= 0 && array[j] > key) {

            if (!isSorting) return; // Stop sorting if resetSimulation is called

            // Wait if paused
            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Highlight the bar being compared
            bars[j].style.backgroundColor = "crimson";
            await new Promise(resolve => setTimeout(resolve, 500));

            // Move the bar
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j]}%`;
            bars[j].style.height = "0%";


            // Reset the color of the compared bar
            await new Promise(resolve => setTimeout(resolve, 750));
            bars[j].style.backgroundColor = "coral";

            j--;
        }

        // Insert the key into its correct position
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}%`;

        // Highlight the current bar being inserted in its correct position
        bars[j + 1].style.backgroundColor = "green";

        // Reset the color of the inserted bar
        await new Promise(resolve => setTimeout(resolve, 750));
                
        // Reset the color of all processed bars
        for (let k = 0; k <= i; k++) {
            if (!isSorting) return; // Stop sorting if resetSimulation is called

            // Wait if paused
            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            await new Promise(resolve => setTimeout(resolve, 350));
            bars[k].style.backgroundColor = "darkslateblue";
        }
    }

    // Mark all bars as sorted
    for (let k = 0; k < array.length; k++) {
        if (!isSorting) return; // Stop sorting if resetSimulation is called

        // Wait if paused
        while (isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        bars[k].style.backgroundColor = "green";
    }

    isSorting = false; // Sorting completed

    // Reset button to "Sort" after completion
    sortButton.innerText = "Sort";
    isPaused = false;
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
        insertionSort();
    }
}

// Generate an initial array on page load
window.onload = generateArray();
