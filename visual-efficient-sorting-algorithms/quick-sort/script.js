let array = [];
let originalArray = []; // To store the original array before sorting starts
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
    originalArray = []; // Reset original array
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
    originalArray = [...array]; // Store the original array before sorting starts

    // Render bars for the array
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${array[i]}%`;
        arrayContainer.appendChild(bar);
    }

}

async function quickSort(start = 0, end = array.length - 1) {
    if (start > end || !isSorting) return;
    const bars = document.getElementsByClassName("bar");

    if (start === end && start >= 0 && start <= (array.length - 1)) {
        await new Promise(resolve => setTimeout(resolve, 400));
        bars[start].style.backgroundColor = "green";
        await new Promise(resolve => setTimeout(resolve, 400));
        return;
    }

    isSorting = true;

    // Wait if paused
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const pivotIndex = await partition(start, end);

    // Recursively sort left and right partitions
    await quickSort(start, pivotIndex - 1);
    await quickSort(pivotIndex + 1, end);

    // Mark as sorted if the whole array is done
    if (start === 0 && end === array.length - 1 && isSorting) {
        for (let k = start; k <= end; k++) {
            // Wait if paused
            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            bars[k].style.backgroundColor = "green";
        }

        isSorting = false; // Sorting completed

        // Reset button to "Sort" after completion
        const sortButton = document.getElementById("sort-button");
        sortButton.innerText = "Sort";
        isPaused = false;
    }    
}

async function partition(start, end) {
    if (!isSorting) return; // Stop sorting

    const bars = document.getElementsByClassName("bar");
    const pivot = array[end];
    let i = start - 1;

    // Highlight the pivot in crimson
    bars[end].style.backgroundColor = "crimson";
    await new Promise((resolve) => setTimeout(resolve, 550));

    for (let j = start; j < end; j++) {
        bars[j].style.backgroundColor = "coral";
        await new Promise(resolve => setTimeout(resolve, 400));
    }

    if (i >= 0 && bars[i].style.backgroundColor !== "green") {
        bars[i].style.backgroundColor = "steelblue";
    }

    for (let j = start; j < end; j++) {

        // Wait if paused
        while (isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!isSorting) return; // Stop sorting

        // Highlight the bar being compared
        if (bars[j].style.backgroundColor !== "green") {
            bars[j].style.backgroundColor = "steelblue";
            await new Promise(resolve => setTimeout(resolve, 400));
        }

        if (array[j] < pivot) {
            i++;

            // Highlight the bar being compared
            bars[i].style.backgroundColor = "crimson";
            bars[j].style.backgroundColor = "crimson";
            await new Promise(resolve => setTimeout(resolve, 500));

            bars[i].style.height = "0%";
            bars[j].style.height = "0%";

            await new Promise(resolve => setTimeout(resolve, 500));

            await swap(bars, i, j); // swap the smaller elements to the left

            if (bars[i].style.backgroundColor !== "green") {
                bars[i].style.backgroundColor = "darkslateblue";
                await new Promise(resolve => setTimeout(resolve, 400));
            }

            if (bars[j].style.backgroundColor !== "green") {
                bars[j].style.backgroundColor = "darkslateblue";
                await new Promise(resolve => setTimeout(resolve, 400));
            }
        }

        if (bars[j].style.backgroundColor !== "green") {
            bars[j].style.backgroundColor = "darkslateblue";
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (i + 1 < end && bars[i + 1].style.backgroundColor !== "green") {
            bars[i + 1].style.backgroundColor = "steelblue";
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    bars[i + 1].style.height = "0%";
    bars[end].style.height = "0%";

    // Place the pivot in its correct position
    await swap(bars, i + 1, end);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Mark the pivot as sorted
    bars[i + 1].style.height = `${array[i + 1]}%`;
    bars[i + 1].style.backgroundColor = "green";
    bars[end].style.height = `${array[end]}%`;
    await new Promise(resolve => setTimeout(resolve, 500));

    if (bars[end].style.backgroundColor !== "green") {
        bars[end].style.backgroundColor = "darkslateblue";
        await new Promise((resolve) => setTimeout(resolve, 550));
    }

    await new Promise((resolve) => setTimeout(resolve, 550));

    return i + 1;
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
        }, 550); // Animation delay
    });
}

function resetSimulation() {
    isSorting = false; // Stop the sorting process
    isPaused = false; // Reset the paused state
    arrayContainer.innerHTML = ""; // Clear the array container
    array = [...originalArray]; // Reset array to the original array before sorting started

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
        quickSort();
    }
}

// Generate an initial array on page load
window.onload = generateArray();
