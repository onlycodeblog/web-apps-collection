let array = [];
let originalArray = []; // New variable to store the original array
let isSorting = false; // Flag to track if sorting is in progress
let isPaused = false; // Flag to track if sorting is paused
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
    if (isSorting) return; // Prevent generating a new array during sorting

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

async function mergeSort(start = 0, end = array.length - 1) {
    if (start >= end || !isSorting) return;
    isSorting = true;

    const mid = Math.floor((start + end) / 2);

    // Wait if paused
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);

    // Mark as sorted if the whole array is done
    if (start === 0 && end === array.length - 1 && isSorting) {
        const bars = document.getElementsByClassName("bar");
        for (let i = 0; i < bars.length; i++) {
            // Wait if paused
            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            bars[i].style.backgroundColor = "green";
        }
        
        isSorting = false; // Sorting completed

        // Reset button to "Sort" after completion
        const sortButton = document.getElementById("sort-button");
        sortButton.innerText = "Sort";
        isPaused = false;
    }
}

async function merge(start, mid, end) {
    if (!isSorting) return; // Stop sorting

    const bars = document.getElementsByClassName("bar");
    const temp = [];
    let i = start, j = mid + 1;

    // Wait if paused
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }     

    // Highlight the range being merged
    for (let k = start; k <= end; k++) {

        while (isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        bars[k].style.backgroundColor = "steelblue";
    }

    // Merge the two subarrays
    while (i <= mid && j <= end) {
        if (array[i] <= array[j]) {
            temp.push(array[i++]);
        } else {
            temp.push(array[j++]);
        }
    }

    // Add remaining elements from the left and right subarrays
    while (i <= mid) temp.push(array[i++]);
    while (j <= end) temp.push(array[j++]);

    // Copy sorted elements back to the original array
    for (let k = start; k <= end; k++) {

        while (isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
        array[k] = temp[k - start];
        bars[k].style.height = `${array[k]}%`;
    }

    // Reset color after merging
    for (let k = start; k <= end; k++) {

        while (isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        bars[k].style.backgroundColor = "darkslateblue";
    }
}

function resetSimulation() {
    isSorting = false; // Stop the sorting process
    isPaused = false; // Reset the paused state
    arrayContainer.innerHTML = ""; // Clear the array container

    array = [...originalArray]; // Restore the original array

    // Render bars for the original array
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
        isSorting = true;
        mergeSort();
    }
}

// Generate an initial array on page load
window.onload = generateArray();
