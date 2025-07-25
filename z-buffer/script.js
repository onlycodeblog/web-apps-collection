const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set internal resolution 2x for sharp rendering
canvas.width = 800;
canvas.height = 500;

// Scale down to 800x500 for display
canvas.style.width = "800px";
canvas.style.height = "500px";

const width = canvas.width;
const height = canvas.height;

let depth = 100;
let currentShape = 'rectangle'; // Name of the shape

// Set up a Z-buffer (2D array for depth values)
let zBuffer = Array(width * height).fill(Number.POSITIVE_INFINITY);

// Initialize Z-buffer with infinity (no depth data yet)
function initializeZBuffer() {
    zBuffer = Array(width * height).fill(Number.POSITIVE_INFINITY);
}

// Clear Z-buffer and canvas
function clearCanvasAndZBuffer() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    depth = 100;
    drawInfo(depth, currentShape);

    // Reset the Z-buffer
    initializeZBuffer();
}


function drawInfo(depth, shape) {
    ctx.clearRect(0, 0, 150, 50); // Clear a small rectangle in the top-left corner for text

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';

    const depthValue = (depth/100).toFixed(2);

    ctx.fillText(`Depth: ${depthValue}`, 10, 20);
    ctx.fillText(`Shape: ${shape.charAt(0).toUpperCase() + shape.slice(1)}`, 10, 40);
}


// Function to increase the depth value
function increaseDepth() {
    if (depth < 100) {
        depth += 1;
    }
    drawInfo(depth, currentShape);
}

// Function to decrease the depth value
function decreaseDepth() {
    if (depth > 1) {
        depth -= 1;
    }
    drawInfo(depth, currentShape);
}


// Function to draw the current shape at a given position
function drawShapeAtPosition(shape, x, y) {
    
    x = Math.floor(x);
    y = Math.floor(y);

    // Set the fill style for the shape
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

    // Draw the shape at the specified position
    switch (shape) {
        case 'circle':
            drawCircle(x, y, depth);
            break;
        case 'triangle':
            drawTriangle(x, y, depth);
            break;
        case 'square':
            drawSquare(x, y, depth);
            break;
        case 'rectangle':
            drawRectangle(x, y, depth);
            break;
    }

    drawInfo(depth, currentShape);
}


// Function to draw shapes based on the type selected from the menu
function drawShape(shape) {
    currentShape = shape;

    // Set a random color for the shape
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    ctx.fillStyle = color;

    drawInfo(depth, currentShape);
}


function drawCircle(centerX, centerY, depth) {
    const radius = Math.min(width, height) / 5;

    for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
            const pixelX = centerX + i;
            const pixelY = centerY + j;
            if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
                if (i * i + j * j <= radius * radius) {
                    const index = pixelY * width + pixelX;
                    if (depth <= zBuffer[index]) {
                        zBuffer[index] = depth;
                        ctx.fillRect(pixelX, pixelY, 1, 1);
                    }
                }
            }
        }
    }
}


function drawTriangle(centerX, centerY, depth) {
    const size = Math.min(width, height) / 5;
    const vertices = [
        { x: centerX, y: centerY - size }, // Top vertex
        { x: centerX - size, y: centerY + size }, // Bottom-left vertex
        { x: centerX + size, y: centerY + size }  // Bottom-right vertex
    ];

    const minX = Math.min(vertices[0].x, vertices[1].x, vertices[2].x);
    const maxX = Math.max(vertices[0].x, vertices[1].x, vertices[2].x);
    const minY = Math.min(vertices[0].y, vertices[1].y, vertices[2].y);
    const maxY = Math.max(vertices[0].y, vertices[1].y, vertices[2].y);

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const lambda1 = ((vertices[1].y - vertices[2].y) * (x - vertices[2].x) +
                            (vertices[2].x - vertices[1].x) * (y - vertices[2].y)) /
                            ((vertices[1].y - vertices[2].y) * (vertices[0].x - vertices[2].x) +
                            (vertices[2].x - vertices[1].x) * (vertices[0].y - vertices[2].y));

            const lambda2 = ((vertices[2].y - vertices[0].y) * (x - vertices[2].x) +
                            (vertices[0].x - vertices[2].x) * (y - vertices[2].y)) /
                            ((vertices[1].y - vertices[2].y) * (vertices[0].x - vertices[2].x) +
                            (vertices[2].x - vertices[1].x) * (vertices[0].y - vertices[2].y));

            const lambda3 = 1 - lambda1 - lambda2;

            if (lambda1 >= 0 && lambda2 >= 0 && lambda3 >= 0) {
                const index = y * width + x;
                if (depth <= zBuffer[index]) {
                    zBuffer[index] = depth;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }
}


function drawSquare(centerX, centerY, depth) {
    const side = Math.min(width, height) / 5;
    const startX = Math.floor(centerX - side / 2);
    const startY = Math.floor(centerY - side / 2);

    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            const pixelX = startX + i;
            const pixelY = startY + j;
            const index = pixelY * width + pixelX;
            if (depth <= zBuffer[index]) {
                zBuffer[index] = depth;
                ctx.fillRect(pixelX, pixelY, 1, 1);
            }
        }
    }
}

function drawRectangle(centerX, centerY, depth) {
    const widthRect = Math.min(width, height) / 3;
    const heightRect = Math.min(width, height) / 5;
    const startX = Math.floor(centerX - widthRect / 2);
    const startY = Math.floor(centerY - heightRect / 2);

    for (let i = 0; i < widthRect; i++) {
        for (let j = 0; j < heightRect; j++) {
            const pixelX = startX + i;
            const pixelY = startY + j;
            const index = pixelY * width + pixelX;
            if (depth <= zBuffer[index]) { // '>=' means new shape will be in front
                zBuffer[index] = depth;
                ctx.fillRect(pixelX, pixelY, 1, 1);
            }
        }
    }
}

// Draw the initial depth value on page load
window.onload = function () {
    drawInfo(depth, currentShape);
};

// Event listener for canvas click to draw the current shape at the clicked position
canvas.addEventListener('click', (event) => {
    // Get the mouse click coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Draw the current shape at the clicked position
    drawShapeAtPosition(currentShape, x, y, depth);
});
