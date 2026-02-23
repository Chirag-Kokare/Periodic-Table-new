let compareMode = false;
let selectedElements = [];

// Toggle Button Logic
document.getElementById('compare-toggle').onclick = (e) => {
    compareMode = !compareMode;
    selectedElements = []; // Reset any partial selection
    
    if (compareMode) {
        e.target.innerText = "Mode: Click 2 Elements";
        e.target.style.borderColor = "var(--neon-pink)";
        e.target.style.color = "var(--neon-pink)";
    } else {
        e.target.innerText = "Mode: Normal";
        e.target.style.borderColor = "var(--neon-blue)";
        e.target.style.color = "var(--neon-blue)";
    }
};

function openAtom(data) {
    if (!compareMode) {
        // NORMAL MODE: Single View
        const overlay = document.getElementById('atom-overlay');
        overlay.innerHTML = `
            <div class="atom-container" id="atom-visualizer">
                <div class="nucleus-glow"></div>
                <div class="nucleus-group"><div class="proton"></div><div class="neutron"></div></div>
            </div>
            <div class="atom-info">
                <h2 style="color:${catColors[data[5]]}">${data[1]}</h2>
                <p>${data[2]}</p>
                <p>Atomic Number: ${data[0]}</p>
            </div>
            <button class="close-btn" onclick="closeAtom()">Close View</button>
        `;
        renderAtomVisuals(data, 'atom-visualizer');
        overlay.classList.add('active');
    } else {
        // COMPARE MODE: Collect 2 elements
        if (selectedElements.length < 2) {
            selectedElements.push(data);
            // Optional: Visual feedback on the table cell
            alert(`Selected ${data[2]}. Now select one more.`);
        }
        
        if (selectedElements.length === 2) {
            startComparison(selectedElements[0], selectedElements[1]);
            selectedElements = []; // Reset
        }
    }
}

function startComparison(el1, el2) {
    const overlay = document.getElementById('atom-overlay');
    overlay.classList.add('active');
    
    overlay.innerHTML = `
        <div class="comparison-wrapper">
            <div class="comparison-item">
                <div class="atom-container" id="atom-left">
                     <div class="nucleus-glow"></div>
                     <div class="nucleus-group"><div class="proton"></div><div class="neutron"></div></div>
                </div>
                <div class="atom-info"><h2>${el1[1]}</h2><p>${el1[2]}</p></div>
            </div>
            <div style="font-size: 3rem; color: var(--neon-pink);">VS</div>
            <div class="comparison-item">
                <div class="atom-container" id="atom-right">
                     <div class="nucleus-glow"></div>
                     <div class="nucleus-group"><div class="proton"></div><div class="neutron"></div></div>
                </div>
                <div class="atom-info"><h2>${el2[1]}</h2><p>${el2[2]}</p></div>
            </div>
        </div>
        <button class="close-btn" onclick="closeAtom()">Exit Comparison</button>
    `;

    renderAtomVisuals(el1, 'atom-left');
    renderAtomVisuals(el2, 'atom-right');
}

// Move your existing shell/electron drawing code into this reusable function
function renderAtomVisuals(data, containerId) {
    const num = data[0];
    const row = data[4];
    const visualizer = document.getElementById(containerId);
    
    let electronsRemaining = num;
    const shellCaps = [2, 8, 18, 32, 32, 18, 8];
    const maxShells = row > 7 ? 7 : row;

    for(let i=0; i < maxShells; i++) {
        if (electronsRemaining <= 0) break;
        const count = Math.min(electronsRemaining, shellCaps[i] || 8);
        electronsRemaining -= count;

        const radius = 50 + (i * 30); // Slightly smaller for comparison
        const shell = document.createElement('div');
        shell.className = 'shell';
        shell.style.width = `${radius * 2}px`;
        shell.style.height = `${radius * 2}px`;
        shell.style.top = `calc(50% - ${radius}px)`;
        shell.style.left = `calc(50% - ${radius}px)`;
        visualizer.appendChild(shell);

        const spinContainer = document.createElement('div');
        spinContainer.style.position = 'absolute';
        spinContainer.style.width = '0px'; spinContainer.style.height = '0px';
        spinContainer.style.top = '50%'; spinContainer.style.left = '50%';
        spinContainer.style.animation = `orbit ${3 + i*1.5}s linear infinite`;
        
        for(let e=0; e<count; e++) {
            const electron = document.createElement('div');
            electron.className = 'electron';
            const angle = (360 / count) * e;
            electron.style.transform = `rotate(${angle}deg) translate(${radius}px)`;
            spinContainer.appendChild(electron);
        }
        visualizer.appendChild(spinContainer);
    }
}

function closeAtom() {
    document.getElementById('atom-overlay').classList.remove('active');
    // Clear overlay content so it doesn't "flash" next time
    document.getElementById('atom-overlay').innerHTML = ''; 
}
