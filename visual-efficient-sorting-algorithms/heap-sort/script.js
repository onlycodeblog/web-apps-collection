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

async function heapSort() {
    if (!isSorting) return; // Stop sorting if resetSimulation is called
    isSorting = true;

    const bars = document.getElementsByClassName("bar");

    // Build a max heap
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        await heapify(array.length, i, bars);
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    // Extract elements from the heap
    for (let i = array.length - 1; i > 0; i--) {
        if (!isSorting) return; // Stop sorting if resetSimulation is called

        // Wait if paused
        while (isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await new Promise(resolve => setTimeout(resolve, 200)); 

        bars[0].style.backgroundColor = "crimson";

        bars[i].style.backgroundColor = "crimson";

        await new Promise(resolve => setTimeout(resolve, 300));

        // Swap the root (maximum) with the last element
        await swap(bars, 0, i);

        bars[0].style.backgroundColor = "darkslateblue";

        await new Promise(resolve => setTimeout(resolve, 400));

        // Mark the sorted bar
        bars[i].style.backgroundColor = "green";

        await new Promise(resolve => setTimeout(resolve, 300));

        // Reduce the heap size and heapify the root
        await heapify(i, 0, bars);
    }

    bars[0].style.backgroundColor = "green"; // Mark the root as sorted
    isSorting = false; // Sorting completed

    // Reset button to "Sort" after completion
    const sortButton = document.getElementById("sort-button");
    sortButton.innerText = "Sort";
    isPaused = false;
}

async function heapify(size, root, bars) {
    if (!isSorting) return; // Stop sorting

    // Wait if paused
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }    
    
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    // Highlight the current root
    bars[root].style.backgroundColor = "coral";
    await new Promise(resolve => setTimeout(resolve, 300));


    if (left < size) {
        bars[left].style.backgroundColor = "steelblue";
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (right < size) {
        bars[right].style.backgroundColor = "steelblue";
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if the left child is larger
    if (left < size && array[left] > array[largest]) {
        // await new Promise(resolve => setTimeout(resolve, 400));
        largest = left;
    } else if (left < size) {
        bars[left].style.backgroundColor = "darkslateblue";
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Check if the right child is larger
    if (right < size && array[right] > array[largest]) {

        if (largest === left) {
            bars[left].style.backgroundColor = "darkslateblue";
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // await new Promise(resolve => setTimeout(resolve, 400));
        largest = right;
    } else if (right < size) {
        bars[right].style.backgroundColor = "darkslateblue";
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // If the largest is not the root, swap and heapify the affected subtree
    if (largest !== root) {
        await new Promise(resolve => setTimeout(resolve, 200));
        await swap(bars, root, largest);
        bars[largest].style.backgroundColor = "darkslateblue";
        await new Promise(resolve => setTimeout(resolve, 200));
        bars[root].style.backgroundColor = "darkslateblue";
        await new Promise(resolve => setTimeout(resolve, 200));
        await heapify(size, largest, bars);
    } else {
        // bars[root].style.backgroundColor = "darkslateblue";
    }

    // Reset color after heapify
    if (left < size) {
        bars[left].style.backgroundColor = "darkslateblue";
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    if (right < size) {
        bars[right].style.backgroundColor = "darkslateblue";
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    bars[root].style.backgroundColor = "darkslateblue";
    await new Promise(resolve => setTimeout(resolve, 150));
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
        }, 750); // Animation delay
    });
}

function resetSimulation() {
    isSorting = false; // Stop the sorting process
    isPaused = false; // Reset the paused state
    arrayContainer.innerHTML = ""; // Clear the array container

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
        isSorting = true;
        heapSort();
    }
}

// Generate an initial array on page load
window.onload = generateArray();
