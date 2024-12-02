// HTML Elements
const neonTextInput = document.getElementById("neon-text");
const textColorInput = document.getElementById("text-color");
const fileUploadInput = document.getElementById("file-upload");
const sizeWidthInput = document.getElementById("size-width");
const sizeHeightInput = document.getElementById("size-height");
const unitSelect = document.getElementById("unit");
const previewText = document.getElementById("preview-text");
const previewContainer = document.getElementById("preview-container");
const intensityRange = document.getElementById("neon-intensity");
const animateButton = document.getElementById("animate-neon");

// Function to update the neon effect (color + intensity) for text
function updateNeonEffect(element, color, intensity) {
    element.style.color = color;
    element.style.textShadow = `
    0 0 ${intensity * 2}px ${color},
    0 0 ${intensity * 4}px ${color},
    0 0 ${intensity * 6}px ${color}
  `;
}

// Function to update SVG color (fill and stroke)
function updateSVGColor(svgElement, color) {
    const svgElements = svgElement.querySelectorAll("*");
    svgElements.forEach((el) => {
        // Change the fill and stroke attributes
        el.setAttribute("fill", color);
        el.setAttribute("stroke", color);
    });

    const currentOpacity = intensityRange.value / 10;
    svgElement.style.opacity = currentOpacity;
}

// Update text preview
neonTextInput.addEventListener("input", () => {
    // Update the text preview only if there is no SVG already
    if (!previewContainer.querySelector("svg")) {
        previewText.textContent = neonTextInput.value;
        updatePreview()
        updateNeonEffect(previewText, textColorInput.value, intensityRange.value);
    }
});

// Ajouter un événement pour la couleur du texte
textColorInput.addEventListener("input", (e) => {
    const newColor = e.target.value;
    updateColorForTextAndSVG(newColor); // Appliquer la nouvelle couleur au texte et au SVG
});

// Fonction qui met à jour la couleur du texte et du SVG
function updateColorForTextAndSVG(color) {
    // Mettre à jour la couleur du texte
    previewText.style.color = color;
    previewText.style.textShadow = `
      0 0 5px ${color},
      0 0 10px ${color},
      0 0 20px ${color},
      0 0 30px ${color}
    `;

    // Mettre à jour la couleur du SVG si présent
    const svgElement = previewContainer.querySelector("svg");
    if (svgElement) {
        updateSVGColor(svgElement, color);
    }
}



// Handle file upload and SVG color customization
fileUploadInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/svg+xml") {
        const svgText = await file.text();
        previewContainer.innerHTML = svgText; // Insert SVG into the DOM
        const svgElement = previewContainer.querySelector("svg");
        if (svgElement) {
            updateSVGColor(svgElement, textColorInput.value); // Apply initial color to SVG
            // Ensure SVG is contained within the preview area
            svgElement.style.maxWidth = '100%';
            svgElement.style.maxHeight = '100%';
            svgElement.style.objectFit = 'contain'; // Ensures the SVG stays inside the preview box
        }
    } else {
        alert("Please upload a valid SVG file.");
    }
});

// Replace the SVG with text if there is text input
function updatePreview() {
    if (neonTextInput.value.trim()) {
        // If there's text input, replace the SVG with text
        previewContainer.innerHTML = ""; // Clear current content (SVG or text)
        previewText.textContent = neonTextInput.value;
        previewContainer.appendChild(previewText); // Add the text to preview
        updateNeonEffect(previewText, textColorInput.value, intensityRange.value);
    }
}

// Update dimensions based on input
function updateDimensions() {
    const width = sizeWidthInput.value;
    const height = sizeHeightInput.value;
    const unit = unitSelect.value;
    previewContainer.style.width = `${width}${unit}`;
    previewContainer.style.height = `${height}${unit}`;
}

sizeWidthInput.addEventListener("input", updateDimensions);
sizeHeightInput.addEventListener("input", updateDimensions);
unitSelect.addEventListener("change", updateDimensions);

// Neon effect intensity slider
intensityRange.addEventListener("input", (e) => {
    // Apply neon effect on text
    if (previewText) {
        updateNeonEffect(previewText, textColorInput.value, e.target.value);
    }
    // Apply color and intensity on SVG if present
    const svgElement = previewContainer.querySelector("svg");
    if (svgElement) {
        updateSVGColor(svgElement, textColorInput.value);
    }
});

// Animate Neon (for text and SVG)
let isAnimating = false;
let animationInterval;

animateButton.addEventListener("click", () => {
    isAnimating = !isAnimating;
    if (isAnimating) {
        animateButton.textContent = "Stop Animation";
        animationInterval = setInterval(() => {
            const neonText = document.getElementById("preview-text");
            const svgElement = previewContainer.querySelector("svg");
            if (neonText) {
                neonText.style.opacity = neonText.style.opacity === "1" ? "0.5" : "1";
            }
            if (svgElement) {
                const currentOpacity = svgElement.style.opacity === "1" ? "0.5" : "1";
                svgElement.style.opacity = currentOpacity;
            }
        }, 500);
    } else {
        clearInterval(animationInterval);
        animateButton.textContent = "Animate Neon";
        document.getElementById("preview-text").style.opacity = "1";
        const svgElement = previewContainer.querySelector("svg");
        if (svgElement) svgElement.style.opacity = "1";
    }
});

// Handle Support Selection (optional)
const supports = {
    clear: document.getElementById("support-clear"),
    acrylic: document.getElementById("support-acrylic"),
    wood: document.getElementById("support-wood"),
};

Object.values(supports).forEach((supportCheckbox) => {
    supportCheckbox.addEventListener("change", () => {
        if (supports.acrylic.checked) {
            previewContainer.style.background = "#dde1e7"; // Acrylic
        } else if (supports.wood.checked) {
            previewContainer.style.background = "#a38360"; // Wood
        } else {
            previewContainer.style.background = "transparent"; // Clear
        }
    });
});


// Ajoutez un événement pour le bouton de réinitialisation
const resetButton = document.getElementById("reset-preview");

// Fonction pour réinitialiser l'aperçu
resetButton.addEventListener("click", () => {
    // Réinitialiser le texte du champ d'entrée
    neonTextInput.value = "";
    previewText.textContent = "";

    // Réinitialiser la couleur du texte
    textColorInput.value = "#000000";
    previewText.style.color = "#000000";
    previewText.style.textShadow = '';

    // Réinitialiser l'intensité du néon
    intensityRange.value = 5;
    updateNeonEffect(previewText, "#000000", intensityRange.value);
    
    // Réinitialiser le SVG, s'il y en a un
    previewContainer.innerHTML = "";
    previewText.textContent = "";

    // Réinitialiser l'animation
    isAnimating = false;
    clearInterval(animationInterval);
    animateButton.textContent = "Animate Neon";
    document.getElementById("preview-text").style.opacity = "1";
    const svgElement = previewContainer.querySelector("svg");
    if (svgElement) svgElement.style.opacity = "1";

    // Réinitialiser l'arrière-plan du conteneur
    previewContainer.style.background = "transparent";

    fileUploadInput.value = "";
});
