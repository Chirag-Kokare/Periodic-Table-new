let compareMode = false;
let selectedElements = [];

document.getElementById('compare-toggle').onclick = (e) => {
    compareMode = !compareMode;
    e.target.innerText = compareMode ? "Mode: Compare (Select 2)" : "Mode: Normal";
    selectedElements = []; // Reset selection
};

function openAtom(data) {
    if (!compareMode) {
        // Standard single view
        renderAtomVisualizer(data, 'atom-visualizer', 'atom-details');
        document.getElementById('atom-overlay').classList.add('active');
    } else {
        // Comparison logic
        selectedElements.push(data);
        if (selectedElements.length === 2) {
            // We could expand the overlay to show two atoms here!
            alert(`Comparing ${selectedElements[0][2]} and ${selectedElements[1][2]}`);
            selectedElements = []; // Reset for next pair
        }
    }
}

// Separate the rendering logic so you can use it for multiple containers
function renderAtomVisualizer(data, containerId, infoId) {
    const [num, sym, name, col, row, cat] = data;
    const visualizer = document.getElementById(containerId);
    
    // ... (Your existing shell generation code goes here) ...
}
