// 게임 상태
let gameState = {
    gold: 200,
    food: 200,
    population: 40,
    military: {
        total: 15,
        soldier: 10,
        archer: 3,
        cavalry: 2
    },
    territories: [],
    buildings: {farm: 2, mine: 2, barracks: 1, tower: 0},
    units: {worker: 25},
    technologies: {agriculture: 0, mining: 0, military: 0},
    heroes: [],
    diplomacy: {ally: null, trade: null},
    turn: 1,
    maxTurns: 100
};

const enemyState = {
    territories: [],
    military: 15,
    gold: 200,
    food: 200
};

let actionLog = [];
let statsData = {
    turns: [],
    playerTerritories: [],
    enemyTerritories: [],
    playerMilitary: [],
    enemyMilitary: []
};

let backgroundMusic;
let effectSounds = {};

// 게임 초기화
function initGame() {
    updateResources();
    generateMap();
    addEventListeners();
    initializeChart();
    initializeAudio();
}

// 이벤트 리스너 추가
function addEventListeners() {
    document.getElementById('end-turn').addEventListener('click', endTurn);
    document.getElementById('build').addEventListener('click', () => openModal('build'));
    document.getElementById('train').addEventListener('click', () => openModal('train'));
    document.getElementById('research').addEventListener('click', () => openModal('research'));
    document.getElementById('recruit-hero').addEventListener('click', recruitHero);
    document.getElementById('offer-alliance').addEventListener('click', offerAlliance);
    document.getElementById('propose-trade').addEventListener('click', proposeTrade);
    document.getElementById('toggle-music').addEventListener('click', toggleMusic);
    
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == document.getElementById('modal')) {
            closeModal();
        }
    });
}

// 토스트 메시지 표시 함수
function showToast(message) {
    const toast = document.getElementById("toast");
    if(toast.className.includes('show')) {
        toast.textContent = message;
    }
    else {
        toast.className = "toast show";
        toast.textContent = message;
        setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
    }   
}

// 모달 열기
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';
    
    switch(type) {
        case 'build':
            modalBody.innerHTML = `
                <h3>건설</h3>
                <button onclick="handleBuildClick('farm')">농장 건설 (50 금)</button>
                <button onclick="handleBuildClick('mine')">광산 건설 (50 금)</button>
                <button onclick="handleBuildClick('barracks')">훈련소 건설 (100 금)</button>
                <button onclick="handleBuildClick('tower')">방어탑 건설 (75 금)</button>
            `;
            break;
        case 'train':
            modalBody.innerHTML = `
                <h3>훈련</h3>
                <button onclick="handleTrainClick('worker')">일꾼 훈련 (20 식량)</button>
                <button onclick="handleTrainClick('soldier')">보병 훈련 (30 식량)</button>
                <button onclick="handleTrainClick('archer')">궁수 훈련 (40 식량)</button>
                <button onclick="handleTrainClick('cavalry')">기병 훈련 (50 식량)</button>
            `;
            break;
        case 'research':
            modalBody.innerHTML = `
                <h3>연구</h3>
                <button onclick="handleResearchClick('agriculture')">농업 연구 (100 금)</button>
                <button onclick="handleResearchClick('mining')">채광 연구 (100 금)</button>
                <button onclick="handleResearchClick('military')">군사 연구 (100 금)</button>
            `;
            break;
    }
    
    modal.style.display = "block";
}

// 건설 클릭 핸들러
function handleBuildClick(type) {
    showToast(`${type} 건설을 시도했습니다.`);
    buildBuilding(type);
}

// 훈련 클릭 핸들러
function handleTrainClick(type) {
    showToast(`${type} 훈련을 시도했습니다.`);
    trainUnit(type);
}

// 연구 클릭 핸들러
function handleResearchClick(tech) {
    showToast(`${tech} 연구를 시도했습니다.`);
    research(tech);
}

// 모달 닫기
function closeModal() {
    document.getElementById('modal').style.display = "none";
}

// 맵 생성
function generateMap() {
    const map = document.getElementById('map');
    for (let i = 0; i < 81; i++) {
        const territory = document.createElement('div');
        territory.className = 'territory';
        territory.addEventListener('click', () => handleTerritoryClick(i));
        
        // 지형 효과 추가
        if (Math.random() < 0.1) {
            territory.classList.add('mountain');
            territory.textContent = '⛰️';
        } else if (Math.random() < 0.1) {
            territory.classList.add('water');
            territory.textContent = '🌊';
        }
        
        map.appendChild(territory);
    }
    // 초기 영토 설정
    for (let i = 0; i < 4; i++) {
        let playerTerritory = Math.floor(Math.random() * 81);
        gameState.territories.push(playerTerritory);
        document.getElementsByClassName('territory')[playerTerritory].classList.add('player');
    }
    // 적 영토 생성
    for (let i = 0; i < 6; i++) {
        let enemyTerritory;
        do {
            enemyTerritory = Math.floor(Math.random() * 81);
        } while (gameState.territories.includes(enemyTerritory));
        enemyState.territories.push(enemyTerritory);
        document.getElementsByClassName('territory')[enemyTerritory].classList.add('enemy');
    }
}

// 영토 클릭 처리
function handleTerritoryClick(index) {
    const territory = document.getElementsByClassName('territory')[index];
    if (territory.classList.contains('player')) {
        showMessage('이미 당신의 영토입니다.');
        return;
    }
    
    if (territory.classList.contains('mountain')) {
        showMessage('산 지형은 정복할 수 없습니다.');
        return;
    }
    
    if (territory.classList.contains('enemy') || territory.classList.contains('ally')) {
        if (gameState.military.total >= 10) {
            const defenderStrength = territory.classList.contains('enemy') ? enemyState.military : gameState.military.total * 0.5;
            const battleResult = battle(gameState.military.total, defenderStrength, false);
            if (battleResult) {
                if (territory.classList.contains('enemy')) {
                    territory.classList.remove('enemy');
                    enemyState.territories = enemyState.territories.filter(t => t !== index);
                } else {
                    territory.classList.remove('ally');
                    gameState.diplomacy.ally = null;
                }
                territory.classList.add('player');
                gameState.territories.push(index);
                gameState.military.total = Math.ceil(gameState.military.total * 0.7);
                updateMilitaryUnits(0.7);
                showMessage('영토를 정복했습니다!');
                playSound('conquer');
                addToLog('아군이 새로운 영토를 정복했습니다.');
            } else {
                gameState.military.total = Math.ceil(gameState.military.total * 0.5);
                updateMilitaryUnits(0.5);
                showMessage('공격에 실패했습니다.');
                playSound('defeat');
                addToLog('아군의 공격이 실패했습니다.');
            }
        } else {
            showMessage('공격하기 위해서는 10 이상의 군사력이 필요합니다.');
        }
    } else if (!territory.classList.contains('water')) {
        if (gameState.military.total >= 5) {
            gameState.military.total -= 5;
            updateMilitaryUnits(0.9);
            gameState.territories.push(index);
            territory.classList.add('player');
            showMessage('새로운 영토를 정복했습니다!');
            playSound('conquer');
            addToLog('아군이 새로운 영토를 점령했습니다.');
        } else {
            showMessage('빈 영토를 정복하기 위해서는 5의 군사력이 필요합니다.');
        }
    } else {
        showMessage('물 지형은 정복할 수 없습니다.');
    }
    updateResources();
    updateChart();
}

// 전투 시스템
function battle(attackerStrength, defenderStrength, isMountain) {
    const terrainFactor = isMountain ? 1.5 : 1;
    const attackerRoll = Math.random() * attackerStrength;
    const defenderRoll = Math.random() * defenderStrength * terrainFactor;
    return attackerRoll > defenderRoll;
}

// 군사 유닛 업데이트
function updateMilitaryUnits(factor) {
    for (let unit in gameState.military) {
        if (unit !== 'total') {
            gameState.military[unit] = Math.ceil(gameState.military[unit] * factor);
        }
    }
}

// 건물 건설 (기존 함수 수정)
function buildBuilding(type) {
    const costs = {farm: 50, mine: 50, barracks: 100, tower: 75};
    if (gameState.gold >= costs[type]) {
        gameState.gold -= costs[type];
        gameState.buildings[type] = (gameState.buildings[type] || 0) + 1;
        updateResources();
        showMessage(`${type} 건설 완료!`);
        showToast(`${type} 건설 완료!`);
        playSound('build');
        addToLog(`새로운 ${type}을(를) 건설했습니다.`);
    } else {
        showToast('금이 부족합니다!');
        showMessage('금이 부족합니다!');
    }
}

// 유닛 훈련 (기존 함수 수정)
function trainUnit(type) {
    const costs = {worker: 20, soldier: 30, archer: 40, cavalry: 50};
    if (gameState.food >= costs[type] && gameState.population >= 1) {
        gameState.food -= costs[type];
        gameState.population -= 1;
        gameState.units[type] = (gameState.units[type] || 0) + 1;
        if (type !== 'worker') {
            gameState.military.total += 1;
            gameState.military[type] += 1;
        }
        updateResources();
        showToast(`${type} 훈련 완료!`);
        showMessage(`${type} 훈련 완료!`);
        playSound('train');
        addToLog(`새로운 ${type}을(를) 훈련했습니다.`);
    } else {
        showToast('자원이 부족합니다!');
        showMessage('자원이 부족합니다!');
    }
}

// 기술 연구 (기존 함수 수정)
function research(tech) {
    if (gameState.gold >= 100 && gameState.technologies[tech] < 3) {
        gameState.gold -= 100;
        gameState.technologies[tech] += 1;
        updateResources();
        showToast(`${tech} 기술 연구 완료!`);
        showMessage(`${tech} 기술 연구 완료!`);
        playSound('research');
        addToLog(`${tech} 기술 연구를 완료했습니다.`);
    } else if (gameState.technologies[tech] >= 3) {
        showToast('이 기술은 이미 최고 수준입니다.');
        showMessage('이 기술은 이미 최고 수준입니다.');
    } else {
        showToast('금이 부족합니다!');
        showMessage('금이 부족합니다!');
    }
}

// 영웅 모집
function recruitHero() {
    if (gameState.gold >= 200 && gameState.heroes.length < 3) {
        gameState.gold -= 200;
        const newHero = {
            name: `영웅 ${gameState.heroes.length + 1}`,
            strength: Math.floor(Math.random() * 5) + 5
        };
        gameState.heroes.push(newHero);
        gameState.military.total += newHero.strength;
        updateResources();
        showMessage(`새로운 영웅 ${newHero.name}을(를) 모집했습니다! 군사력 +${newHero.strength}`);
        playSound('hero');
        addToLog(`새로운 영웅 ${newHero.name}을(를) 모집했습니다.`);
    } else if (gameState.heroes.length >= 3) {
        showMessage('이미 최대 수의 영웅을 보유하고 있습니다.');
    } else {
        showMessage('금이 부족합니다!');
    }
}

// 동맹 제안
function offerAlliance() {
    if (gameState.gold >= 100 && !gameState.diplomacy.ally) {
        gameState.gold -= 100;
        if (Math.random() < 0.5) {
            gameState.diplomacy.ally = 'AI';
            const allyTerritory = enemyState.territories[Math.floor(Math.random() * enemyState.territories.length)];
            document.getElementsByClassName('territory')[allyTerritory].classList.remove('enemy');
            document.getElementsByClassName('territory')[allyTerritory].classList.add('ally');
            enemyState.territories = enemyState.territories.filter(t => t !== allyTerritory);
            showMessage('동맹 제안이 수락되었습니다!');
            playSound('alliance');
            addToLog('적과의 동맹이 체결되었습니다.');
        } else {
            showMessage('동맹 제안이 거절되었습니다.');
            addToLog('적이 동맹 제안을 거절했습니다.');
        }
        updateResources();
    } else if (gameState.diplomacy.ally) {
        showMessage('이미 동맹이 있습니다.');
    } else {
        showMessage('금이 부족합니다!');
    }
}

// 무역 제안
function proposeTrade() {
    if (gameState.gold >= 50 && !gameState.diplomacy.trade) {
        gameState.gold -= 50;
        if (Math.random() < 0.7) {
            gameState.diplomacy.trade = 'AI';
            showMessage('무역 제안이 수락되었습니다! 매 턴 추가 자원을 얻습니다.');
            playSound('trade');
            addToLog('적과의 무역 협정이 체결되었습니다.');
        } else {
            showMessage('무역 제안이 거절되었습니다.');
            addToLog('적이 무역 제안을 거절했습니다.');
        }
        updateResources();
    } else if (gameState.diplomacy.trade) {
        showMessage('이미 무역 협정이 있습니다.');
    } else {
        showMessage('금이 부족합니다!');
    }
}

// 턴 종료
function endTurn() {
    gameState.turn++;
    // 자원 생산
    gameState.gold += (gameState.buildings.mine || 0) * 10 * (1 + gameState.technologies.mining * 0.1);
    gameState.food += (gameState.buildings.farm || 0) * 10 * (1 + gameState.technologies.agriculture * 0.1);
    gameState.gold += (gameState.units.worker || 0) * 2;
    gameState.food += (gameState.units.worker || 0) * 2;
    // 인구 증가
    const foodSurplus = Math.floor(gameState.food / 100);
    gameState.population += foodSurplus;
    gameState.food = gameState.food % 100;
    // 군사력 증가
    if (gameState.buildings.barracks) {
        const newSoldiers = Math.min(gameState.buildings.barracks, Math.floor(gameState.population / 10));
        gameState.military.total += newSoldiers;
        gameState.military.soldier += newSoldiers;
        gameState.population -= newSoldiers;
    }
    // 무역 효과
    if (gameState.diplomacy.trade) {
        gameState.gold += 20;
        gameState.food += 20;
    }
    // 방어탑 효과
    gameState.military.total += gameState.buildings.tower * 2;
    // 이벤트 발생
    triggerRandomEvent();
    // AI 턴 실행
    executeAITurn();
    updateResources();
    updateChart();
    showMessage(`턴 ${gameState.turn} 시작`);
    checkGameOverCondition();
}

// AI 턴 실행
function executeAITurn() {
    let aiActions = [];

    // 자원 생산
    enemyState.gold += 30;
    enemyState.food += 30;
    
    // 군사력 증가
    if (enemyState.gold >= 30 && Math.random() < 0.7) {
        enemyState.gold -= 30;
        enemyState.military += 1;
        aiActions.push('적이 군사력을 증강했습니다.');
    }
    
    // 영토 확장
    if (enemyState.military >= 5 && Math.random() < 0.5) {
        let newTerritory;
        do {
            newTerritory = Math.floor(Math.random() * 81);
        } while (gameState.territories.includes(newTerritory) || enemyState.territories.includes(newTerritory) || document.getElementsByClassName('territory')[newTerritory].classList.contains('water'));
        
        enemyState.territories.push(newTerritory);
        document.getElementsByClassName('territory')[newTerritory].classList.add('enemy');
        enemyState.military -= 5;
        aiActions.push('적이 새로운 영토를 점령했습니다.');
    }
    
    // 플레이어 공격
    if (enemyState.military >= 10 && Math.random() < 0.3) {
        const targetTerritory = gameState.territories[Math.floor(Math.random() * gameState.territories.length)];
        const battleResult = battle(enemyState.military, gameState.military.total, document.getElementsByClassName('territory')[targetTerritory].classList.contains('mountain'));
        if (battleResult) {
            document.getElementsByClassName('territory')[targetTerritory].classList.remove('player');
            document.getElementsByClassName('territory')[targetTerritory].classList.add('enemy');
            gameState.territories = gameState.territories.filter(t => t !== targetTerritory);
            enemyState.territories.push(targetTerritory);
            enemyState.military = Math.ceil(enemyState.military * 0.7);
            aiActions.push('적이 아군의 영토를 점령했습니다!');
        } else {
            enemyState.military = Math.ceil(enemyState.military * 0.5);
            aiActions.push('적의 공격을 막아냈습니다!');
        }
    }

    // AI 행동 로그 추가
    aiActions.forEach(action => addToLog(action));
}

// 랜덤 이벤트 발생
function triggerRandomEvent() {
    const events = [
        {name: "풍작", effect: () => {gameState.food += 50; return "풍작으로 식량이 50 증가했습니다!";}},
        {name: "광맥 발견", effect: () => {gameState.gold += 50; return "새로운 광맥 발견으로 금이 50 증가했습니다!";}},
        {name: "질병", effect: () => {gameState.population = Math.max(0, gameState.population - 5); return "질병으로 인구가 5 감소했습니다.";}},
        {name: "용병 모집", effect: () => {
            if (gameState.gold >= 30) {
                gameState.gold -= 30;
                gameState.military.total += 5;
                gameState.military.soldier += 5;
                return "30 금을 지불하고 5명의 용병을 고용했습니다!";
            }
            return "용병을 고용할 금이 부족합니다.";
        }},
        {name: "기술 혁신", effect: () => {
            const techs = ['agriculture', 'mining', 'military'];
            const randomTech = techs[Math.floor(Math.random() * techs.length)];
            if (gameState.technologies[randomTech] < 3) {
                gameState.technologies[randomTech]++;
                return `${randomTech} 기술이 무료로 1단계 상승했습니다!`;
            }
            return "모든 기술이 이미 최고 수준입니다.";
        }}
    ];
    
    if (Math.random() < 0.3) {  // 30% 확률로 이벤트 발생
        const event = events[Math.floor(Math.random() * events.length)];
        const message = event.effect();
        showMessage(`이벤트 발생 - ${event.name}: ${message}`);
        addToLog(`이벤트: ${event.name} - ${message}`);
        playSound('event');
    }
}

// 리소스 업데이트
function updateResources() {
    document.getElementById('gold').textContent = gameState.gold;
    document.getElementById('food').textContent = gameState.food;
    document.getElementById('population').textContent = gameState.population;
    document.getElementById('military').textContent = gameState.military.total;
    document.getElementById('turn').textContent = gameState.turn;
}

// 메시지 표시
function showMessage(message) {
    const messageElement = document.getElementById('messages');
    messageElement.textContent = message;
}

// 로그에 추가
function addToLog(message) {
    const logList = document.getElementById('log-list');
    const logItem = document.createElement('li');
    logItem.textContent = `턴 ${gameState.turn}: ${message}`;
    logList.prepend(logItem);
    
    // 로그 항목 제한 (최대 20개)
    if (logList.children.length > 20) {
        logList.removeChild(logList.lastChild);
    }
}

// 게임 오버 조건 확인
function checkGameOverCondition() {
    const playerTerritories = gameState.territories.length;
    const enemyTerritories = enemyState.territories.length;
    
    if (gameState.turn > gameState.maxTurns) {
        endGame("턴 제한에 도달했습니다. ");
    } else if (playerTerritories === 0) {
        endGame("모든 영토를 잃었습니다. ");
    } else if (enemyTerritories === 0) {
        endGame("모든 적 영토를 정복했습니다! ");
    } else if (playerTerritories >= 57) {  // 전체 영토의 70% 이상 차지
        endGame("영토의 70% 이상을 차지했습니다! ");
    } else if (gameState.technologies.agriculture === 3 && gameState.technologies.mining === 3 && gameState.technologies.military === 3) {
        endGame("모든 기술을 최고 수준으로 연구했습니다! ");
    }
}

// 게임 종료
function endGame(message) {
    const playerTerritories = gameState.territories.length;
    const enemyTerritories = enemyState.territories.length;
    
    if (playerTerritories > enemyTerritories) {
        showMessage(message + "승리했습니다!");
        playSound('victory');
    } else if (playerTerritories < enemyTerritories) {
        showMessage(message + "패배했습니다.");
        playSound('defeat');
    } else {
        showMessage(message + "무승부입니다.");
    }
    
    document.getElementById('end-turn').disabled = true;
}

// 차트 초기화
function initializeChart() {
    const ctx = document.getElementById('stats-chart').getContext('2d');
    window.statsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '플레이어 영토',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                label: '적 영토',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 차트 업데이트
function updateChart() {
    statsData.turns.push(gameState.turn);
    statsData.playerTerritories.push(gameState.territories.length);
    statsData.enemyTerritories.push(enemyState.territories.length);
    statsData.playerMilitary.push(gameState.military.total);
    statsData.enemyMilitary.push(enemyState.military);

    window.statsChart.data.labels = statsData.turns;
    window.statsChart.data.datasets[0].data = statsData.playerTerritories;
    window.statsChart.data.datasets[1].data = statsData.enemyTerritories;
    window.statsChart.update();
}

// 오디오 초기화
function initializeAudio() {
    backgroundMusic = new (window.AudioContext || window.webkitAudioContext)();
    
    // 배경 음악 생성
    const bufferSize = backgroundMusic.sampleRate * 2;  // 2초 길이의 버퍼
    const buffer = backgroundMusic.createBuffer(1, bufferSize, backgroundMusic.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.sin(440 * Math.PI * 2 * i / backgroundMusic.sampleRate) * 0.1;
    }

    const source = backgroundMusic.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gainNode = backgroundMusic.createGain();
    gainNode.gain.setValueAtTime(0.1, backgroundMusic.currentTime);

    source.connect(gainNode);
    gainNode.connect(backgroundMusic.destination);

    source.start();
    
    // 효과음 생성
    const sounds = ['build', 'train', 'research', 'hero', 'alliance', 'trade', 'conquer', 'defeat', 'victory', 'event'];
    sounds.forEach(sound => {
        effectSounds[sound] = createSound(sound);
    });
}

// 효과음 생성
function createSound(type) {
    const bufferSize = backgroundMusic.sampleRate * 0.5;  // 0.5초 길이의 버퍼
    const buffer = backgroundMusic.createBuffer(1, bufferSize, backgroundMusic.sampleRate);
    const data = buffer.getChannelData(0);

    let frequency;
    switch(type) {
        case 'build': frequency = 330; break;
        case 'train': frequency = 440; break;
        case 'research': frequency = 660; break;
        case 'hero': frequency = 550; break;
        default: frequency = 440;
    }

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.sin(frequency * Math.PI * 2 * i / backgroundMusic.sampleRate) * 0.1;
    }

    return buffer;
}

// 효과음 재생
function playSound(type) {
    const sound = effectSounds[type];
    if (sound) {
        const source = backgroundMusic.createBufferSource();
        source.buffer = sound;
        source.connect(backgroundMusic.destination);
        source.start();
    }
}

// 배경음악 토글
function toggleMusic() {
    if (backgroundMusic.state === 'suspended') {
        backgroundMusic.resume();
        document.getElementById('toggle-music').textContent = '음악 끄기';
    } else if (backgroundMusic.state === 'running') {
        backgroundMusic.suspend();
        document.getElementById('toggle-music').textContent = '음악 켜기';
    }
}

// 게임 초기화
window.onload = initGame;