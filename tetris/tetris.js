(
    () => {
        // 게임 설정
        const BOARD_WIDTH = 10;
        const BOARD_HEIGHT = 20;
        const BLOCK_SIZE = 30;

        // 테트리스 조각 정의 및 색상
        const SHAPES = [
            { shape: [[1, 1, 1, 1]], color: '#00FFFF' },  // I
            { shape: [[1, 1], [1, 1]], color: '#FFFF00' },  // O
            { shape: [[1, 1, 1], [0, 1, 0]], color: '#800080' },  // T
            { shape: [[1, 1, 1], [1, 0, 0]], color: '#FFA500' },  // L
            { shape: [[1, 1, 1], [0, 0, 1]], color: '#0000FF' },  // J
            { shape: [[1, 1, 0], [0, 1, 1]], color: '#00FF00' },  // S
            { shape: [[0, 1, 1], [1, 1, 0]], color: '#FF0000' }   // Z
        ];

        // 게임 상태
        let board = [];
        let currentPiece;
        let nextPiece;
        let score = 0;
        let level = 1;
        let highScore = localStorage.getItem('tetrisHighScore') || 0;
        let isPaused = false;
        let gameSpeed = 1000; // 초기 게임 속도 (밀리초)
        let gameTime = 0; // 게임 시간 (초)

        // 오디오 컨텍스트 생성
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 게임 초기화
        function initGame() {
            // 보드 초기화
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                board[y] = [];
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    board[y][x] = 0;
                }
            }

            score = 0;
            level = 1;
            gameSpeed = 1000;
            gameTime = 0;
            isPaused = false;

            // 다음 조각 생성
            nextPiece = getRandomPiece();

            // 새 조각 생성
            spawnNewPiece();

            // 하이스코어 표시
            updateHighScore();

            // 게임 루프 시작
            gameLoop();
        }

        // 게임 보드 그리기
        function drawGame() {
            const boardElement = document.getElementById('tetris-board');
            boardElement.innerHTML = '';

            // 보드 그리기
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    if (board[y][x]) {
                        const block = document.createElement('div');
                        block.className = 'tetris-block';
                        block.style.width = `${BLOCK_SIZE}px`;
                        block.style.height = `${BLOCK_SIZE}px`;
                        block.style.left = `${x * BLOCK_SIZE}px`;
                        block.style.top = `${y * BLOCK_SIZE}px`;
                        block.style.backgroundColor = board[y][x];
                        boardElement.appendChild(block);
                    }
                }
            }

            // 고스트 피스 그리기
            const ghostPiece = calculateGhostPiecePosition();
            drawPiece(ghostPiece, boardElement, true);

            // 현재 조각 그리기
            drawPiece(currentPiece, boardElement);
        }

        // 조각 그리기
        function drawPiece(piece, element, isGhost = false) {
            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    if (piece.shape[y][x]) {
                        const block = document.createElement('div');
                        block.className = 'tetris-block';
                        block.style.width = `${BLOCK_SIZE}px`;
                        block.style.height = `${BLOCK_SIZE}px`;
                        block.style.left = `${(piece.x + x) * BLOCK_SIZE}px`;
                        block.style.top = `${(piece.y + y) * BLOCK_SIZE}px`;
                        block.style.backgroundColor = piece.color;
                        if (isGhost) {
                            block.style.opacity = '0.3';
                        }
                        element.appendChild(block);
                    }
                }
            }
        }

        // 새 조각 생성
        function spawnNewPiece() {
            currentPiece = nextPiece;
            nextPiece = getRandomPiece();
            currentPiece.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece.shape[0].length / 2);
            currentPiece.y = 0;

            if (isCollision(currentPiece)) {
                // 게임 오버
                gameOver();
                return false;
            }

            drawNextPiece();
            return true;
        }

        // 랜덤 조각 가져오기
        function getRandomPiece() {
            const randomPiece = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            return {
                shape: randomPiece.shape,
                color: randomPiece.color,
                x: 0,
                y: 0
            };
        }

        // 다음 조각 그리기
        function drawNextPiece() {
            const nextPieceElement = document.getElementById('next-piece');
            nextPieceElement.innerHTML = '';
            drawPiece({ ...nextPiece, x: 1, y: 1 }, nextPieceElement);
        }

        // 충돌 검사
        function isCollision(piece) {
            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    if (piece.shape[y][x] &&
                        (piece.x + x < 0 ||
                            piece.x + x >= BOARD_WIDTH ||
                            piece.y + y >= BOARD_HEIGHT ||
                            (piece.y + y >= 0 && board[piece.y + y][piece.x + x]))) {
                        return true;
                    }
                }
            }
            return false;
        }

        // 고스트 피스 위치 계산
        function calculateGhostPiecePosition() {
            const ghostPiece = { ...currentPiece };
            while (!isCollision(ghostPiece)) {
                ghostPiece.y++;
            }
            ghostPiece.y--;
            return ghostPiece;
        }

        // 조각 회전
        function rotatePiece() {
            const rotated = currentPiece.shape[0].map((_, index) =>
                currentPiece.shape.map(row => row[index]).reverse()
            );
            const previousShape = currentPiece.shape;
            currentPiece.shape = rotated;
            if (isCollision(currentPiece)) {
                currentPiece.shape = previousShape;  // 회전 취소
            } else {
                playSound('rotate');
            }
        }

        // 조각 이동
        function movePiece(dx, dy) {
            currentPiece.x += dx;
            currentPiece.y += dy;
            if (isCollision(currentPiece)) {
                currentPiece.x -= dx;
                currentPiece.y -= dy;
                return false;
            }
            playSound('move');
            return true;
        }

        // 조각 드롭
        function dropPiece() {
            while (movePiece(0, 1)) { }
            placePiece();
            playSound('drop');
        }

        // 조각 배치
        function placePiece() {
            for (let y = 0; y < currentPiece.shape.length; y++) {
                for (let x = 0; x < currentPiece.shape[y].length; x++) {
                    if (currentPiece.shape[y][x]) {
                        board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
                    }
                }
            }
            clearLines();
            if (!spawnNewPiece()) {
                // 게임 오버
                gameOver();
                return false;
            }
            return true;
        }

        // 라인 제거
        function clearLines() {
            let linesCleared = 0;
            for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
                if (board[y].every(cell => cell !== 0)) {
                    board.splice(y, 1);
                    board.unshift(new Array(BOARD_WIDTH).fill(0));
                    linesCleared++;
                    y++;  // 같은 줄을 다시 검사
                }
            }
            if (linesCleared > 0) {
                updateScore(linesCleared);
                playSound('clear');
            }
        }

        // 게임 속도 업데이트
        function updateGameSpeed() {
            gameTime++;
            if (gameTime % 30 === 0) { // 30초마다 속도 증가
                gameSpeed = Math.max(100, gameSpeed - 50); // 최소 속도는 100ms
            }
        }

        // 점수 업데이트
        function updateScore(linesCleared) {
            const linePoints = [40, 100, 300, 1200];  // 1, 2, 3, 4줄 제거 시 점수
            score += (linePoints[linesCleared - 1] || 0) * level;
            score += Math.floor(gameTime / 10); // 10초마다 1점 추가
            level = Math.floor(score / 1000) + 1;  // 1000점마다 레벨 업
            document.getElementById('score-value').textContent = score;
            document.getElementById('level-value').textContent = level;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem('tetrisHighScore', highScore);
                updateHighScore();
            }
        }

        // 하이스코어 업데이트
        function updateHighScore() {
            document.getElementById('high-score-value').textContent = highScore;
        }

        // 게임 오버
        function gameOver() {
            alert('게임 오버!');
            isPaused = true;
        }

        // 게임 일시정지/재개
        function togglePause() {
            isPaused = !isPaused;
            document.getElementById('pause-btn').textContent = isPaused ? '재개' : '일시정지';
        }

        // 게임 재시작
        function restartGame() {
            initGame();
        }

        // 효과음 생성 함수
        function createSound(frequency, duration, type = 'sine') {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        }

        // 효과음 재생 함수
        function playSound(soundType) {
            switch (soundType) {
                case 'move':
                    createSound(330, 0.1);
                    break;
                case 'rotate':
                    createSound(440, 0.15);
                    break;
                case 'drop':
                    createSound(220, 0.3);
                    break;
                case 'clear':
                    createSound(660, 0.2, 'square');
                    break;
            }
        }

        // 게임 루프
        function gameLoop() {
            if (!isPaused) {
                updateGameSpeed();
                if (!movePiece(0, 1)) {
                    placePiece();
                }
                drawGame();
                updateScore(0); // 시간에 따른 점수 업데이트
            }
            setTimeout(gameLoop, gameSpeed);
        }

        // 도움말 모달 관련 요소
        const helpModal = document.getElementById('help-modal');
        const helpBtn = document.getElementById('help-btn');
        const closeHelpBtn = document.getElementById('close-help-btn');

        // 도움말 버튼 클릭 시 모달 열기
        helpBtn.onclick = function () {
            helpModal.style.display = "block";
        }

        // 닫기 버튼 클릭 시 모달 닫기
        closeHelpBtn.onclick = function () {
            helpModal.style.display = "none";
        }

        // 모달 외부 클릭 시 모달 닫기
        window.onclick = function (event) {
            if (event.target == helpModal) {
                helpModal.style.display = "none";
            }
        }

        // 키보드 입력 처리
        document.addEventListener('keydown', (e) => {
            if (!isPaused) {
                switch (e.key) {
                    case 'ArrowLeft':
                        movePiece(-1, 0);
                        break;
                    case 'ArrowRight':
                        movePiece(1, 0);
                        break;
                    case 'ArrowDown':
                        movePiece(0, 1);
                        break;
                    case 'ArrowUp':
                        rotatePiece();
                        break;
                    case ' ':
                        dropPiece();
                        break;
                }
                drawGame();
            }
            if (e.key === 'p' || e.key === 'P') {
                togglePause();
            }
            if (e.key === 'h' || e.key === 'H') {
                helpModal.style.display = helpModal.style.display === "none" ? "block" : "none";
            }
        });

        // 버튼 이벤트 리스너 추가
        document.getElementById('pause-btn').addEventListener('click', togglePause);
        document.getElementById('restart-btn').addEventListener('click', restartGame);

        // 게임 시작 시 오디오 컨텍스트 생성을 위한 사용자 상호작용 필요
        document.addEventListener('click', function initAudio() {
            audioContext.resume().then(() => {
                console.log('Audio Context started');
                document.removeEventListener('click', initAudio);
            });
        }, { once: true });

        // 게임 시작
        initGame();
    }
)();