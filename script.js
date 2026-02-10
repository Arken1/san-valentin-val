// --- CONFIGURACIÓN DE DATOS ---
const gameData = [
    { name: "La Entrada", options: ["Papitas", "Nachos", "Berenjenas"] },
    { name: "Plato Fuerte", options: ["Pizza", "Pasta", "Hamburguesa"] },
    { name: "El Postre", options: ["Helado", "Galletas Redvelvet", "Sorpresa de Chocolate"] }, // Agregué una extra para rellenar
    { name: "Bebidas", options: ["Café", "Té", "Agua", "Vino"] },
    { name: "El Snack", options: ["Galletas", "Barras de Cereal", "Fruta"] }
];

let currentStage = 0;
let finalChoices = [];
let audioPlayer = document.getElementById('audio-player');

// --- PANTALLA 1: PROPUESTA ---
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');

// Lógica del botón "No" que huye
btnNo.addEventListener('mouseover', moveButton);
btnNo.addEventListener('touchstart', moveButton); // Para celular

function moveButton() {
    const x = Math.random() * (window.innerWidth - btnNo.offsetWidth);
    const y = Math.random() * (window.innerHeight - btnNo.offsetHeight);
    btnNo.style.position = 'absolute';
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
}

// Lógica del botón "Sí"
btnYes.addEventListener('click', () => {
    changeScreen('screen-proposal', 'screen-game');
    playMusic('assets/song1.mp3'); // Perfect - Ed Sheeran
    initGameStage();
});

// --- PANTALLA 2: JUEGO ---
function initGameStage() {
    // Resetear UI
    document.getElementById('game-controls').classList.remove('hidden');
    document.getElementById('round-result').classList.add('hidden');
    document.getElementById('winner-selection').classList.add('hidden');
    document.getElementById('loser-selection').classList.add('hidden');
    
    // Texto
    document.getElementById('stage-title').innerText = `Decidiendo: ${gameData[currentStage].name}`;
    document.getElementById('player-choice-display').innerText = '❓';
    document.getElementById('cpu-choice-display').innerText = '❓';
}

// Botones de Piedra Papel Tijera
document.querySelectorAll('.rps-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        playRound(e.target.dataset.choice);
    });
});

function playRound(playerChoice) {
    // Si estamos en la mitad del juego, cambiar a música movida
    if (currentStage === 1) playMusic('assets/song2.mp3'); // Steal the show

    const choices = ['piedra', 'papel', 'tijera'];
    const emojis = { piedra: '✊', papel: '✋', tijera: '✌️' };
    const cpuChoice = choices[Math.floor(Math.random() * 3)];

    // Mostrar elecciones
    document.getElementById('player-choice-display').innerText = emojis[playerChoice];
    document.getElementById('cpu-choice-display').innerText = emojis[cpuChoice];

    // Ocultar controles para que no spamee click
    document.getElementById('game-controls').classList.add('hidden');
    document.getElementById('round-result').classList.remove('hidden');

    // Determinar ganador
    if (playerChoice === cpuChoice) {
        document.getElementById('result-message').innerText = "¡Empate! Intenta de nuevo.";
        setTimeout(() => {
            document.getElementById('game-controls').classList.remove('hidden');
            document.getElementById('round-result').classList.add('hidden');
        }, 1500);
        return;
    }

    const winConditions = { piedra: 'tijera', papel: 'piedra', tijera: 'papel' };
    
    if (winConditions[playerChoice] === cpuChoice) {
        // ELLA GANA
        document.getElementById('result-message').innerText = "¡Ganaste! Tú eliges 😎";
        showWinnerOptions();
    } else {
        // ELLA PIERDE
        document.getElementById('result-message').innerText = "¡Gané yo! 😈";
        showLoserOptions();
    }
}

// -- Si ella gana --
let selectedOption = "";

function showWinnerOptions() {
    const container = document.getElementById('options-container');
    container.innerHTML = ''; // Limpiar
    document.getElementById('winner-selection').classList.remove('hidden');
    document.getElementById('custom-option').value = '';

    gameData[currentStage].options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedOption = opt;
            document.getElementById('custom-option').value = ''; // Limpiar custom si elige btn
        };
        container.appendChild(btn);
    });
}

document.getElementById('custom-option').addEventListener('input', (e) => {
    selectedOption = e.target.value;
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
});

document.getElementById('confirm-selection').addEventListener('click', () => {
    if (!selectedOption) return alert("¡Elige algo o escribe una opción!");
    nextStage(selectedOption);
});

// -- Si ella pierde --
function showLoserOptions() {
    document.getElementById('loser-selection').classList.remove('hidden');
    // CPU elige random
    const randomPick = gameData[currentStage].options[Math.floor(Math.random() * gameData[currentStage].options.length)];
    document.getElementById('cpu-pick-text').innerText = `Yo elijo: ${randomPick}`;
    selectedOption = randomPick;
}

document.getElementById('btn-rematch').addEventListener('click', () => {
    // Reiniciar solo este round
    initGameStage();
});

document.getElementById('btn-accept').addEventListener('click', () => {
    nextStage(selectedOption);
});

// --- TRANSICIÓN DE ETAPAS ---
function nextStage(choice) {
    finalChoices.push({ stage: gameData[currentStage].name, choice: choice });
    currentStage++;

    if (currentStage < gameData.length) {
        initGameStage();
    } else {
        showFinalResult();
    }
}

// --- PANTALLA 3: RESULTADO FINAL ---
function showFinalResult() {
    changeScreen('screen-game', 'screen-final');
    playMusic('assets/song3.mp3'); // Tití me preguntó

    const list = document.getElementById('final-summary');
    finalChoices.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.stage}:</strong> ${item.choice}`;
        list.appendChild(li);
    });
}

// --- UTILIDADES ---
function changeScreen(hideId, showId) {
    document.getElementById(hideId).classList.remove('active');
    document.getElementById(hideId).classList.add('hidden');
    
    setTimeout(() => {
        document.getElementById(hideId).style.display = 'none'; // Asegurar que se quite del flujo
        document.getElementById(showId).style.display = 'block';
        setTimeout(() => {
            document.getElementById(showId).classList.remove('hidden');
            document.getElementById(showId).classList.add('active');
        }, 50);
    }, 500);
}

function playMusic(src) {
    audioPlayer.src = src;
    audioPlayer.play().catch(e => console.log("Chrome requiere interacción para reproducir audio"));
}
