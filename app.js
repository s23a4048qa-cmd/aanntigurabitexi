// Web Audio API Context
let audioCtx = null;

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    play: document.getElementById('play-screen'),
    result: document.getElementById('result-screen')
};

const ui = {
    score: document.getElementById('score'),
    time: document.getElementById('time'),
    carName: document.getElementById('car-name'),
    carImage: document.getElementById('car-image'),
    feedbackOverlay: document.getElementById('feedback-overlay'),
    finalScore: document.getElementById('final-score'),
    title: document.getElementById('title'),
    btnLeft: document.getElementById('btn-left'),
    btnRight: document.getElementById('btn-right'),
    startBtn: document.getElementById('start-btn'),
    retryBtn: document.getElementById('retry-btn')
};

// Game State
let gameState = {
    score: 0,
    timeLeft: 30,
    timerId: null,
    currentCar: null,
    isPlaying: false,
    nextCar: null,
    nextCarImage: null
};

// BGM Setup (ローカルファイルを使用)
const bgm = new Audio('./【無料フリーBGM】楽しいケルト曲「Harvest」.opus');
bgm.loop = true;
bgm.volume = 0.3; // BGMの音量は少し小さめに設定

// コイン効果音 (ローカルファイルを使用)
const coinSe = new Audio('./金額表示.mp3');

// Initialize Audio
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play Sounds
function playCorrectSound() {
    if (!audioCtx) return;
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    
    // E6 and C6 chord
    osc1.frequency.setValueAtTime(1318.51, audioCtx.currentTime); // E6
    osc2.frequency.setValueAtTime(1046.50, audioCtx.currentTime); // C6

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.5);
    osc2.stop(audioCtx.currentTime + 0.5);
}

function playIncorrectSound() {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime); // Low buzz

    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

function playCoinSound() {
    // ユーザーが用意したオーディオファイルを再生する
    coinSe.currentTime = 0;
    coinSe.play().catch(e => console.log("コイン音再生待機:", e));
}

// Show Screen
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

// Prepare next car (Prefetch)
async function prepareNextCar() {
    let probCommon = 0.8;
    let probJapan = 0.9;
    
    const isJapanTarget = Math.random() < probJapan;
    const isCommonTarget = Math.random() < probCommon;
    
    let candidates = carsData.filter(car => car.isJapan === isJapanTarget && car.isCommon === isCommonTarget);
    if (candidates.length === 0) candidates = carsData;
    
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    const imageUrl = await fetchCarImage(selected.name);
    
    // Preload image and wait for it to load
    await new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Error時も進行させる（プレースホルダー等が表示されるため）
        img.src = imageUrl;
    });
    
    gameState.nextCar = selected;
    gameState.nextCarImage = imageUrl;
}

// Show next car
function showNextCar() {
    if (!gameState.nextCar) {
        ui.carImage.src = 'https://placehold.co/400x250/e2e8f0/475569?text=Loading...';
        ui.carName.textContent = '読み込み中...';
        const waitInterval = setInterval(() => {
            if (gameState.nextCar) {
                clearInterval(waitInterval);
                displayReadyCar();
            }
        }, 100);
        return;
    }
    displayReadyCar();
}

function displayReadyCar() {
    gameState.currentCar = gameState.nextCar;
    ui.carName.textContent = gameState.currentCar.name;
    ui.carImage.src = gameState.nextCarImage;
    
    gameState.nextCar = null;
    gameState.nextCarImage = null;
    
    // Start preparing the next one
    prepareNextCar();
}

// Handle Answer
function handleAnswer(side) {
    if (!gameState.isPlaying || ui.carName.textContent === '準備中...' || ui.carName.textContent === '読み込み中...') return;
    
    const isCorrect = gameState.currentCar.side === side;
    
    if (isCorrect) {
        gameState.score += 100;
        ui.score.textContent = gameState.score;
        playCorrectSound();
        showFeedback(true);
    } else {
        playIncorrectSound();
        showFeedback(false, gameState.currentCar.side);
    }
    
    setTimeout(() => {
        showNextCar();
    }, 500);
}

function showFeedback(isCorrect, correctSide = '') {
    ui.feedbackOverlay.className = 'feedback-overlay';
    
    if (isCorrect) {
        ui.feedbackOverlay.classList.add('correct');
        ui.feedbackOverlay.textContent = '〇';
    } else {
        ui.feedbackOverlay.classList.add('incorrect');
        const sideText = correctSide === 'left' ? '左' : '右';
        ui.feedbackOverlay.innerHTML = `×<br><span style="font-size:1.5rem">正解は${sideText}です</span>`;
    }
    
    setTimeout(() => {
        ui.feedbackOverlay.className = 'feedback-overlay';
    }, 500);
}

// Game Loop
async function startGame() {
    initAudio();
    
    // BGMの再生を開始
    bgm.currentTime = 0;
    bgm.play().catch(e => console.log("BGM再生待機（ファイルが存在しない、または自動再生ブロック）"));

    gameState.score = 0;
    gameState.timeLeft = 30;
    gameState.isPlaying = true;
    gameState.nextCar = null;
    
    ui.score.textContent = gameState.score;
    ui.time.textContent = gameState.timeLeft;
    
    showScreen('play');
    
    ui.carImage.src = 'https://placehold.co/400x250/e2e8f0/475569?text=Loading...';
    ui.carName.textContent = '準備中...';
    
    await prepareNextCar();
    showNextCar();
    
    gameState.timerId = setInterval(() => {
        gameState.timeLeft--;
        ui.time.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(gameState.timerId);
    gameState.isPlaying = false;
    
    // BGMを停止し、お金の音を鳴らす
    bgm.pause();
    playCoinSound();

    
    ui.finalScore.textContent = gameState.score;
    
    // Determine Title
    let title = "新人アルバイト";
    if (gameState.score >= 4000) title = "神業スタッフ";
    else if (gameState.score >= 3000) title = "ベテランスタッフ";
    else if (gameState.score >= 2000) title = "優秀なスタッフ";
    else if (gameState.score >= 1000) title = "中堅スタッフ";
    
    ui.title.textContent = title;
    
    // Ranking Logic
    let ranking = JSON.parse(localStorage.getItem('gasStationRanking_v2')) || [];
    ranking.push(gameState.score);
    // Sort descending
    ranking.sort((a, b) => b - a);
    // Keep top 5
    ranking = ranking.slice(0, 5);
    localStorage.setItem('gasStationRanking_v2', JSON.stringify(ranking));

    // Display Ranking
    const rankingList = document.getElementById('ranking-list');
    if (rankingList) {
        rankingList.innerHTML = '';
        let isNewRecordHighlighted = false;
        
        ranking.forEach((score, index) => {
            const li = document.createElement('li');
            
            // If this is the current score and hasn't been highlighted yet
            if (score === gameState.score && !isNewRecordHighlighted && gameState.score > 0) {
                li.className = 'new-record';
                li.innerHTML = `<span>${index + 1}位 <small>(NEW!)</small></span> <span>${score} 円</span>`;
                isNewRecordHighlighted = true;
            } else {
                li.innerHTML = `<span>${index + 1}位</span> <span>${score} 円</span>`;
            }
            
            rankingList.appendChild(li);
        });
    }

    showScreen('result');
}

// Event Listeners
if (ui.startBtn) {
    ui.startBtn.addEventListener('click', () => {
        bgm.play().catch(e => console.log("BGM再生待機:", e));
        startGame();
    });
}
ui.retryBtn.addEventListener('click', () => {
    bgm.play().catch(e => console.log("BGM再生待機:", e));
    startGame();
});

ui.btnLeft.addEventListener('click', () => handleAnswer('left'));
ui.btnRight.addEventListener('click', () => handleAnswer('right'));

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (!gameState.isPlaying) return;
    if (e.key === 'ArrowLeft') handleAnswer('left');
    if (e.key === 'ArrowRight') handleAnswer('right');
});
