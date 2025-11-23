const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const pixelSlider = document.getElementById("pixelSlider");
const thresholdSlider = document.getElementById("thresholdSlider");
const pixelValue = document.getElementById("pixelValue");
const thresholdValue = document.getElementById("thresholdValue");
const thresholdGroup = document.getElementById("thresholdGroup");
const downloadBtn = document.getElementById("downloadBtn");
const imageTab = document.getElementById("imageTab");
const textTab = document.getElementById("textTab");
const imageSection = document.getElementById("imageSection");
const textSection = document.getElementById("textSection");
const textSizeGroup = document.getElementById("textSizeGroup");
const textInput = document.getElementById("textInput");
const generateTextBtn = document.getElementById("generateTextBtn");
const fontSizeSlider = document.getElementById("fontSizeSlider");
const fontSizeValue = document.getElementById("fontSizeValue");
const darkColorInput = document.getElementById("darkColor");
const lightColorInput = document.getElementById("lightColor");

let currentImage = null;
let pixelSize = 32;
let threshold = 128;
let fontSize = 80;
let currentMode = "image";
let darkColor = "#000000";
let lightColor = "#ffffff";

// Initialize with a placeholder
function drawPlaceholder() {
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#999";
  ctx.font = "20px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Upload an image or enter text to start",
    canvas.width / 2,
    canvas.height / 2
  );
}

// Generate text image
function generateTextImage(text) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  // Set canvas size
  tempCanvas.width = 600;
  tempCanvas.height = 600;

  // Fill white background
  tempCtx.fillStyle = "#ffffff";
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw text
  tempCtx.fillStyle = "#000000";
  tempCtx.font = `bold ${fontSize}px Arial, sans-serif`;
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";

  // Handle multi-line text
  const lines = text.split("\n");
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = (tempCanvas.height - totalHeight) / 2 + lineHeight / 2;

  lines.forEach((line, index) => {
    tempCtx.fillText(line, tempCanvas.width / 2, startY + index * lineHeight);
  });

  // Convert to image
  const img = new Image();
  img.onload = () => {
    currentImage = img;
    processImage(img);
  };
  img.src = tempCanvas.toDataURL();
}

// Tab switching
imageTab.addEventListener("click", () => {
  currentMode = "image";
  imageTab.classList.add("active");
  textTab.classList.remove("active");
  imageSection.style.display = "block";
  textSection.style.display = "none";
  textSizeGroup.style.display = "none";
  thresholdGroup.style.display = "block";
  drawPlaceholder();
});

textTab.addEventListener("click", () => {
  currentMode = "text";
  textTab.classList.add("active");
  imageTab.classList.remove("active");
  imageSection.style.display = "none";
  textSection.style.display = "block";
  textSizeGroup.style.display = "block";
  thresholdGroup.style.display = "none";
  drawPlaceholder();
});

// Generate text button
generateTextBtn.addEventListener("click", () => {
  const text = textInput.value.trim();
  if (text) {
    generateTextImage(text);
  }
});

// Font size slider
fontSizeSlider.addEventListener("input", (e) => {
  fontSize = parseInt(e.target.value);
  fontSizeValue.textContent = fontSize;
  const text = textInput.value.trim();
  if (text && currentMode === "text") {
    generateTextImage(text);
  }
});

// Process and display image
function processImage(image) {
  currentImage = image;

  // Calculate dimensions to fit canvas while maintaining aspect ratio
  const maxSize = 600;
  let width = image.width;
  let height = image.height;

  if (width > height) {
    if (width > maxSize) {
      height = (height * maxSize) / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width = (width * maxSize) / height;
      height = maxSize;
    }
  }

  canvas.width = width;
  canvas.height = height;

  applyPixelation();
}

// Apply pixelation effect
function applyPixelation() {
  if (!currentImage) return;

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Draw original image
  tempCtx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

  // Get image data
  const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Calculate grid dimensions
  const gridWidth = Math.ceil(canvas.width / pixelSize);
  const gridHeight = Math.ceil(canvas.height / pixelSize);

  // Clear canvas
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Process each pixel block
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const startX = x * pixelSize;
      const startY = y * pixelSize;
      const endX = Math.min(startX + pixelSize, canvas.width);
      const endY = Math.min(startY + pixelSize, canvas.height);

      // Calculate average brightness for this block
      let totalBrightness = 0;
      let pixelCount = 0;

      for (let py = startY; py < endY; py++) {
        for (let px = startX; px < endX; px++) {
          const i = (py * canvas.width + px) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          totalBrightness += brightness;
          pixelCount++;
        }
      }

      const avgBrightness = totalBrightness / pixelCount;

      // Apply threshold to determine dark or light color
      const color = avgBrightness > threshold ? lightColor : darkColor;

      // Draw the pixel block
      ctx.fillStyle = color;
      ctx.fillRect(startX, startY, endX - startX, endY - startY);
    }
  }
}

// File upload handlers
uploadArea.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => processImage(img);
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Drag and drop
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragover");

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => processImage(img);
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Slider controls
pixelSlider.addEventListener("input", (e) => {
  pixelSize = parseInt(e.target.value);
  pixelValue.textContent = pixelSize;
  applyPixelation();
});

thresholdSlider.addEventListener("input", (e) => {
  threshold = parseInt(e.target.value);
  thresholdValue.textContent = threshold;
  applyPixelation();
});

// Color picker controls
darkColorInput.addEventListener("input", (e) => {
  darkColor = e.target.value;
  applyPixelation();
});

lightColorInput.addEventListener("input", (e) => {
  lightColor = e.target.value;
  applyPixelation();
});

// Download button
downloadBtn.addEventListener("click", () => {
  try {
    // Get the canvas data as blob for better compatibility
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `pixelated-art-${Date.now()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Fallback to dataURL method
        const link = document.createElement("a");
        link.download = `pixelated-art-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, "image/png");
  } catch (error) {
    console.error("Download failed:", error);
    alert("Download failed. Please try again.");
  }
});

// Initialize
drawPlaceholder();
