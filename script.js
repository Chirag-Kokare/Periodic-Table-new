// --- 1. Your Elements Data (Keep your full list here) ---
const elementsRaw = [
    [1,"H","Hydrogen",1,1,6],[2,"He","Helium",18,1,4],
    [3,"Li","Lithium",1,2,1],[4,"Be","Beryllium",2,2,2],
    // ... paste the rest of your 118 elements here ...
];

const lanthanides = [[58,"Ce","Cerium",4,8,6] /* etc */ ];
const actinides = [[90,"Th","Thorium",4,9,6] /* etc */ ];
const allElements = [...elementsRaw, ...lanthanides, ...actinides];

const catColors = { 1: '#ff00ff', 2: '#ff9d00', 3: '#ffee00', 4: '#00f3ff', 5: '#00ff41', 6: '#ffffff' };
const catClass = { 1: 'cat-alkali', 2: 'cat-alkaline', 3: 'cat-transition', 4: 'cat-noble', 5: 'cat-halogen', 6: 'cat-other' };

// --- 2. Comparison State ---
let compareMode = false;
let selection = [];

// Handle the Mode Toggle Button
document.getElementById('compare-toggle').onclick = (e) => {
    compareMode = !compareMode;
    selection = []; 
    e.target.innerText = compareMode ? "Mode: Select 2" : "Mode: Normal";
    e.target.style.boxShadow = compareMode ? "0 0 15px #ff00ff" : "none";
};

// --- 3. The Main Function ---
function openAtom(data) {
    if (!compareMode) {
        // Just show the one element like you had before
        showVisuals(data);
        document.getElementById('atom-overlay').classList.add('active');
    } else {
        // Store the first one, then wait for the second
        selection.push(data);
        if (selection.length === 2) {
            // For now, we show the second one and tell the user
            alert(`Comparing ${selection[0][2]} and ${selection[1][2]}`);
            showVisuals(selection[1]); // Shows the second one
            document.getElementById('atom-overlay').classList.add('active');
            selection = []; // Clear for next time
        }
    }
}

// This is your original drawing logic, kept clean
function showVisuals(data) {
    const [num, sym, name, col, row, cat] = data;
    const visualizer = document.getElementById('atom-visualizer');
    
    document.getElementById('detail-symbol').innerText = sym;
    document.getElementById('detail-symbol').style.color = catColors[cat];
    document.getElementById('detail-name').innerText = name;
    document.getElementById('detail-number').innerText = `Atomic Number: ${num}`;

    // Clear old electrons but keep the nucleus
    const old = visualizer.querySelectorAll('.shell, div[style*="animation"]');
    old.forEach(s => s.remove());

    let electronsRemaining = num;
    const shellCaps = [2, 8, 18, 32, 32, 18, 8];
    const maxShells = row > 7 ? 7 : row;

    for(let i=0; i<maxShells; i++) {
        if (electronsRemaining <= 0) break;
        const count = Math.min(electronsRemaining, shellCaps[i]);
        electronsRemaining -= count;

        const radius = 60 + (i * 35);
        const shell = document.createElement('div');
        shell.className = 'shell';
        shell.style.width = `${radius * 2}px`;
        shell.style.height = `${radius * 2}px`;
        shell.style.top = `calc(50% - ${radius}px)`;
        shell.style.left = `calc(50% - ${radius}px)`;
        visualizer.appendChild(shell);

        const spinContainer = document.createElement('div');
        spinContainer.style.cssText = `position:absolute; width:0; height:0; top:50%; left:50%; animation: orbit ${3 + i}s linear infinite;`;
        
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
}

// --- 4. Render the Table (Your original grid logic) ---
function renderTable() {
    const container = document.getElementById('table-container');
    allElements.forEach(el => {
        const elDiv = document.createElement('div');
        elDiv.className = `element ${catClass[el[5]]}`;
        elDiv.style.gridColumn = el[3];
        elDiv.style.gridRow = el[4];
        elDiv.style.color = catColors[el[5]];
        elDiv.onclick = () => openAtom(el);
        elDiv.innerHTML = `<span class="at-num">${el[0]}</span><span class="symbol">${el[1]}</span><span class="name">${el[2]}</span>`;
        container.appendChild(elDiv);
    });
}
renderTable();
