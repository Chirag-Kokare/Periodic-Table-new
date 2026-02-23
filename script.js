let compareMode = false;
let selectedElements = [];

// 1. Fix the Toggle Button
document.getElementById('compare-toggle').onclick = (e) => {
    compareMode = !compareMode;
    selectedElements = []; // Clear previous clicks
    e.target.innerText = compareMode ? "Mode: Click 2 Elements" : "Mode: Normal";
    e.target.style.boxShadow = compareMode ? "0 0 15px var(--neon-pink)" : "none";
};

// 2. The Main Click Function
function openAtom(data) {
    const overlay = document.getElementById('atom-overlay');
    
    if (!compareMode) {
        // NORMAL VIEW
        overlay.innerHTML = `
            <div class="atom-container" id="visualizer-single">
                <div class="nucleus-glow"></div>
                <div class="nucleus-group"><div class="proton"></div><div class="neutron"></div></div>
            </div>
            <div class="atom-info">
                <h2 style="color:${catColors[data[5]]}">${data[1]}</h2>
                <p>${data[2]}</p>
            </div>
            <button class="close-btn" onclick="closeAtom()">Close</button>
        `;
        renderAtomVisuals(data, 'visualizer-single');
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 10);
    } else {
        // COMPARE VIEW
        selectedElements.push(data);
        
        // Give visual feedback that the first one was clicked
        const cells = document.querySelectorAll('.element');
        cells.forEach(c => { if(c.innerText.includes(data[1])) c.style.border = "2px solid white"; });

        if (selectedElements.length === 2) {
            overlay.innerHTML = `
                <div class="comparison-wrapper">
                    <div class="comparison-item">
                        <div class="atom-container" id="viz-left">
                            <div class="nucleus-glow"></div>
                            <div class="nucleus-group"><div class="proton"></div><div class="neutron"></div></div>
                        </div>
                        <div class="atom-info"><h2>${selectedElements[0][1]}</h2></div>
                    </div>
                    <div style="font-size: 2rem; color: var(--neon-pink); font-weight: bold;">VS</div>
                    <div class="comparison-item">
                        <div class="atom-container" id="viz-right">
                            <div class="nucleus-glow"></div>
                            <div class="nucleus-group"><div class="proton"></div><div class="neutron"></div></div>
                        </div>
                        <div class="atom-info"><h2>${selectedElements[1][1]}</h2></div>
                    </div>
                </div>
                <button class="close-btn" onclick="closeAtom()">Exit Comparison</button>
            `;
            renderAtomVisuals(selectedElements[0], 'viz-left');
            renderAtomVisuals(selectedElements[1], 'viz-right');
            overlay.style.display = 'flex';
            overlay.classList.add('active');
            selectedElements = []; // Reset for next time
            // Remove the white borders from the table
            setTimeout(() => { cells.forEach(c => c.style.border = ""); }, 1000);
        }
    }
}

// 3. The Visuals Generator (The core engine)
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

        const radius = (containerId === 'visualizer-single') ? 60 + (i * 35) : 40 + (i * 25);
        
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
    const overlay = document.getElementById('atom-overlay');
    overlay.classList.remove('active');
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
}
