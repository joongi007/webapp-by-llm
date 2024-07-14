(
    () => {
        // 전역 변수 선언
        let mazeSize = 10;
        let player = { x: 0, y: 0 };
        let goal = { x: 0, y: 0 };
        let mazeGrid = [];
        let difficulty = 'medium';
        let timer = 0;
        let score = 0;
        let items = [];
        let timerInterval;
        let highScores = [];
        let volume = 1;
        let isMuted = false;
        let showMinimap = true;
        const VISION_RADIUS = 2; // 플레이어 주변 2칸까지 보이도록 설정

        // DOM 요소 선택
        const maze = document.getElementById('maze');
        const generateButton = document.getElementById('generate-maze');
        const sizeSelect = document.getElementById('maze-size');
        const difficultySelect = document.getElementById('difficulty');
        const timerElement = document.getElementById('timer');
        const scoreElement = document.getElementById('score');
        const itemsElement = document.getElementById('items');
        const minimapElement = document.getElementById('minimap');
        const highScoresList = document.getElementById('high-scores-list');
        const volumeSlider = document.getElementById('volume-slider');
        const muteButton = document.getElementById('mute-button');
        const virtualKeys = document.getElementById('virtual-keys');
        const upKey = document.getElementById('up-key');
        const leftKey = document.getElementById('left-key');
        const rightKey = document.getElementById('right-key');
        const downKey = document.getElementById('down-key');

        // Web Audio API 컨텍스트 생성
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);

        // 이벤트 리스너 설정
        generateButton.addEventListener('click', generateMaze);
        sizeSelect.addEventListener('change', (e) => {
            mazeSize = parseInt(e.target.value);
        });
        difficultySelect.addEventListener('change', (e) => {
            difficulty = e.target.value;
        });
        document.addEventListener('keydown', movePlayer);
        volumeSlider.addEventListener('input', updateVolume);
        muteButton.addEventListener('click', toggleMute);
        upKey.addEventListener('click', () => handleVirtualKeyPress('ArrowUp'));
        leftKey.addEventListener('click', () => handleVirtualKeyPress('ArrowLeft'));
        rightKey.addEventListener('click', () => handleVirtualKeyPress('ArrowRight'));
        downKey.addEventListener('click', () => handleVirtualKeyPress('ArrowDown'));
        // 터치 이벤트 방지
        virtualKeys.addEventListener('touchstart', (e) => e.preventDefault());
        window.addEventListener('resize', handleResize);

        // 미로 생성 함수
        function generateMaze() {
            // 미로 그리드 초기화
            mazeGrid = [];
            for (let y = 0; y < mazeSize; y++) {
                const row = [];
                for (let x = 0; x < mazeSize; x++) {
                    row.push(Math.random() < getDifficultyWallChance() ? 1 : 0);
                }
                mazeGrid.push(row);
            }

            // 시작점과 목표점 설정
            player = { x: 0, y: 0 };
            goal = { x: mazeSize - 1, y: mazeSize - 1 };

            // 시작점과 목표점은 항상 비어있어야 함
            mazeGrid[player.y][player.x] = 0;
            mazeGrid[goal.y][goal.x] = 0;

            // 경로 확보를 위한 간단한 미로 생성 알고리즘
            ensurePath();

            // 아이템 배치
            placeItems();

            // 타이머 시작
            startTimer();

            // 점수 초기화
            score = 0;

            // 난이도에 따른 미니맵 표시 여부 설정
            showMinimap = difficulty !== 'hard';
            updateMinimapVisibility();

            // 미로 렌더링
            renderMaze();
            renderMinimap();
            updateGameInfo();
        }

        // 난이도에 따른 벽 생성 확률 반환
        function getDifficultyWallChance() {
            switch (difficulty) {
                case 'easy': return 0.3;
                case 'medium': return 0.4;
                case 'hard': return 0.5;
                default: return 0.4;
            }
        }

        // 시작점에서 목표점까지의 경로 확보
        function ensurePath() {
            let x = 0, y = 0;
            while (x < mazeSize - 1 || y < mazeSize - 1) {
                if (x < mazeSize - 1 && (y === mazeSize - 1 || Math.random() < 0.5)) {
                    x++;
                } else {
                    y++;
                }
                mazeGrid[y][x] = 0;
            }
        }

        // 아이템 배치 함수
        function placeItems() {
            items = [];
            const itemCount = Math.floor(mazeSize * mazeSize * 0.1);
            for (let i = 0; i < itemCount; i++) {
                let x, y;
                do {
                    x = Math.floor(Math.random() * mazeSize);
                    y = Math.floor(Math.random() * mazeSize);
                } while (mazeGrid[y][x] === 1 || (x === player.x && y === player.y) || (x === goal.x && y === goal.y));
                items.push({ x, y, type: Math.random() < 0.5 ? 'key' : 'potion' });
            }
        }

        // 아이템 배치 함수
        function placeItems() {
            items = [];
            const itemCount = Math.floor(mazeSize * mazeSize * 0.1);
            for (let i = 0; i < itemCount; i++) {
                let x, y;
                do {
                    x = Math.floor(Math.random() * mazeSize);
                    y = Math.floor(Math.random() * mazeSize);
                } while (mazeGrid[y][x] === 1 || (x === player.x && y === player.y) || (x === goal.x && y === goal.y));
                items.push({ x, y, type: Math.random() < 0.5 ? 'key' : 'potion' });
            }
        }

        // 시야 내에 있는지 확인하는 함수
        function isInVision(x, y) {
            const dx = Math.abs(x - player.x);
            const dy = Math.abs(y - player.y);
            return Math.max(dx, dy) <= VISION_RADIUS;
        }

        // 미로 렌더링 함수 수정
        function renderMaze() {
            maze.innerHTML = '';
            maze.style.gridTemplateColumns = `repeat(${mazeSize}, 20px)`;

            for (let y = 0; y < mazeSize; y++) {
                for (let x = 0; x < mazeSize; x++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');

                    if (isInVision(x, y)) {
                        if (mazeGrid[y][x] === 1) {
                            cell.classList.add('wall');
                        }
                        if (x === player.x && y === player.y) {
                            cell.classList.add('player');
                        }
                        if (x === goal.x && y === goal.y) {
                            cell.classList.add('goal');
                        }
                        const item = items.find(item => item.x === x && item.y === y);
                        if (item) {
                            cell.classList.add('item');
                            cell.dataset.itemType = item.type;
                        }
                    } else {
                        cell.classList.add('fog');
                    }

                    maze.appendChild(cell);
                }
            }
        }

        function changeDifficulty() {
            difficulty = difficultySelect.value;
            showMinimap = difficulty !== 'hard';
            updateMinimapVisibility();
        }

        // 미니맵 가시성 업데이트 함수
        function updateMinimapVisibility() {
            const minimapElement = document.getElementById('minimap');
            minimapElement.style.display = showMinimap ? 'grid' : 'none';
        }

        // 미니맵 렌더링 함수 수정
        function renderMinimap() {
            if (!showMinimap) return;

            minimapElement.innerHTML = '';
            minimapElement.style.display = 'grid';
            minimapElement.style.gridTemplateColumns = `repeat(${mazeSize}, 1fr)`;

            for (let y = 0; y < mazeSize; y++) {
                for (let x = 0; x < mazeSize; x++) {
                    const cell = document.createElement('div');
                    cell.style.width = '100%';
                    cell.style.height = '100%';
                    cell.style.backgroundColor = mazeGrid[y][x] === 1 ? '#34495e' : '#ecf0f1';
                    if (x === player.x && y === player.y) {
                        cell.style.backgroundColor = '#e74c3c';
                    }
                    if (x === goal.x && y === goal.y) {
                        cell.style.backgroundColor = '#2ecc71';
                    }
                    minimapElement.appendChild(cell);
                }
            }
        }

        // 사운드 생성 함수들
        function createMoveSound() {
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
            oscillator.connect(gainNode);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }

        function createWallSound() {
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
            oscillator.connect(gainNode);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }

        function createItemSound() {
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
            oscillator.connect(gainNode);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        }

        // 플레이어 이동 함수
        function movePlayer(e) {
            const key = e.key.toLowerCase();
            const movementMap = {
                'arrowleft': { dx: -1, dy: 0 },
                'arrowright': { dx: 1, dy: 0 },
                'arrowup': { dx: 0, dy: -1 },
                'arrowdown': { dx: 0, dy: 1 },
                'a': { dx: -1, dy: 0 },
                'd': { dx: 1, dy: 0 },
                'w': { dx: 0, dy: -1 },
                's': { dx: 0, dy: 1 }
            };

            const movement = movementMap[key];
            if (movement) {
                const newX = player.x + movement.dx;
                const newY = player.y + movement.dy;

                if (
                    newX >= 0 && newX < mazeSize &&
                    newY >= 0 && newY < mazeSize &&
                    mazeGrid[newY][newX] === 0
                ) {
                    player.x = newX;
                    player.y = newY;
                    createMoveSound();
                    score += 1;
                    checkItem();
                    renderMaze();
                    renderMinimap();
                    updateGameInfo();

                    if (player.x === goal.x && player.y === goal.y) {
                        endGame();
                    }
                } else {
                    createWallSound();
                }
            }
        }

        // 아이템 체크 함수
        function checkItem() {
            const itemIndex = items.findIndex(item => item.x === player.x && item.y === player.y);
            if (itemIndex !== -1) {
                const item = items[itemIndex];
                items.splice(itemIndex, 1);
                createItemSound();
                score += item.type === 'key' ? 50 : 25;
                updateGameInfo();
            }
        }

        // 게임 정보 업데이트 함수
        function updateGameInfo() {
            scoreElement.textContent = `점수: ${score}`;
            itemsElement.textContent = `아이템: ${items.length}개 남음`;
        }

        // 타이머 시작 함수
        function startTimer() {
            clearInterval(timerInterval);
            timer = 0;
            timerInterval = setInterval(() => {
                timer++;
                timerElement.textContent = `시간: ${timer}초`;
            }, 1000);
        }

        // 게임 종료 함수
        function endGame() {
            clearInterval(timerInterval);
            alert(`축하합니다! 미로를 완료했습니다!\n소요 시간: ${timer}초\n점수: ${score}`);
            updateHighScores();
        }

        // 최고 기록 업데이트 함수
        function updateHighScores() {
            highScores.push({ time: timer, score: score });
            highScores.sort((a, b) => b.score - a.score);
            highScores = highScores.slice(0, 5);
            localStorage.setItem('highScores', JSON.stringify(highScores));
            renderHighScores();
        }

        // 최고 기록 렌더링 함수
        function renderHighScores() {
            highScoresList.innerHTML = '';
            highScores.forEach((score, index) => {
                const li = document.createElement('li');
                li.textContent = `${index + 1}. 점수: ${score.score}, 시간: ${score.time}초`;
                highScoresList.appendChild(li);
            });
        }

        // 시야 제한 체크 함수
        function isVisible(x, y) {
            const distance = Math.sqrt(Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2));
            return distance <= 3;
        }

        // 볼륨 업데이트 함수
        function updateVolume() {
            volume = parseFloat(volumeSlider.value);
            if (!isMuted) {
                gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            }
        }

        // 음소거 토글 함수
        function toggleMute() {
            isMuted = !isMuted;
            if (isMuted) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                muteButton.textContent = '음소거 해제';
            } else {
                gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
                muteButton.textContent = '음소거';
            }
        }

        // 도움말 표시 함수
        function showHelp() {
            const helpContent = `
        <h2>게임 도움말</h2>
        <ul>
            <li>방향키 또는 WASD로 이동할 수 있습니다.</li>
            <li>벽을 통과할 수 없습니다.</li>
            <li>노란색 아이템을 수집하여 점수를 얻으세요.</li>
            <li>초록색 목표 지점에 도달하면 게임이 종료됩니다.</li>
            <li>난이도가 높을수록 벽이 많아지고 미니맵이 사라집니다.</li>
        </ul>
        <button id="close-help" class="styled-button">닫기</button>
    `;

            const helpModal = document.createElement('div');
            helpModal.id = 'help-modal';
            helpModal.innerHTML = helpContent;
            document.body.appendChild(helpModal);

            document.getElementById('close-help').addEventListener('click', () => {
                document.body.removeChild(helpModal);
            });
        }

        function isMobileDevice() {
            return (window.innerWidth <= 768);
        }

        function showVirtualKeys() {
            virtualKeys.classList.remove('hidden');
        }

        function hideVirtualKeys() {
            virtualKeys.classList.add('hidden');
        }

        function handleResize() {
            if (isMobileDevice()) {
                showVirtualKeys();
            } else {
                hideVirtualKeys();
            }
        }

        function handleVirtualKeyPress(direction) {
            const key = direction;
            movePlayer({ key });
        }

        function addVirtualKeyListeners() {
            const keys = ['up', 'left', 'right', 'down'];
            keys.forEach(direction => {
                const key = document.getElementById(`${direction}-key`);
                key.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    handleVirtualKeyPress(`Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`);
                });
                key.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    handleVirtualKeyPress(`Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`);
                });
            });
        }

        function handleVirtualKeyPress(direction) {
            movePlayer({ key: direction.toLowerCase() });
        }


        // 초기화 함수
        function init() {
            highScores = JSON.parse(localStorage.getItem('highScores')) || [];
            renderHighScores();

            // 난이도 변경 이벤트 리스너 추가
            difficultySelect.addEventListener('change', changeDifficulty);

            // 도움말 버튼 이벤트 리스너 추가
            document.getElementById('help-button').addEventListener('click', showHelp);

            generateMaze();

            // 사운드 컨트롤 초기화
            updateVolume();

            handleResize();  // 초기 로드 시 가상 키패드 표시 여부 결정
            addVirtualKeyListeners();
        }

        // 게임 초기화
        init();
    }
)();