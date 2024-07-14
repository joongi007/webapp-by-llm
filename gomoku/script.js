(
    () => {
        class Gomoku {
            constructor() {
                this.board = Array(15).fill().map(() => Array(15).fill(null));
                this.currentPlayer = 'black';
                this.gameOver = false;
                this.rule = 'standard';
                this.forbiddenMoves = [];
            }

            placeStone(row, col) {
                if (this.gameOver || this.board[row][col]) return false;

                if (this.rule === 'renju' && this.currentPlayer === 'black') {
                    if (this.checkForbiddenMove(row, col)) return false;
                }

                this.board[row][col] = this.currentPlayer;

                if (this.checkWin(row, col)) {
                    this.gameOver = true;
                    return 'win';
                }

                if (this.checkDraw()) {
                    this.gameOver = true;
                    return 'draw';
                }

                this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';

                if (this.rule === 'renju' && this.currentPlayer === 'black') {
                    this.updateForbiddenMoves();
                }

                return true;
            }

            checkWin(row, col) {
                const directions = [
                    [0, 1], [1, 0], [1, 1], [1, -1]
                ];

                for (const [dx, dy] of directions) {
                    let count = 1;
                    count += this.countDirection(row, col, dx, dy);
                    count += this.countDirection(row, col, -dx, -dy);

                    if (count >= 5) {
                        if (this.rule === 'renju' && this.currentPlayer === 'black' && count > 5) {
                            return false; // 장목(6목 이상)은 흑이 승리할 수 없음
                        }
                        return true;
                    }
                }

                return false;
            }

            countDirection(row, col, dx, dy) {
                let count = 0;
                let x = row + dx;
                let y = col + dy;

                while (x >= 0 && x < 15 && y >= 0 && y < 15 && this.board[x][y] === this.currentPlayer) {
                    count++;
                    x += dx;
                    y += dy;
                }

                return count;
            }

            checkDraw() {
                return this.board.every(row => row.every(cell => cell !== null));
            }

            checkForbiddenMove(row, col) {
                return this.forbiddenMoves.some(move => move.row === row && move.col === col);
            }

            updateForbiddenMoves() {
                this.forbiddenMoves = [];
                for (let i = 0; i < 15; i++) {
                    for (let j = 0; j < 15; j++) {
                        if (!this.board[i][j]) {
                            if (this.isDoubleFour(i, j) || this.isDoubleThree(i, j) || this.isOverline(i, j)) {
                                this.forbiddenMoves.push({ row: i, col: j });
                            }
                        }
                    }
                }
            }

            isDoubleFour(row, col) {
                // 간단한 이중사 체크 로직 (실제로는 더 복잡할 수 있습니다)
                let openFours = 0;
                const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

                for (const [dx, dy] of directions) {
                    if (this.isOpenFour(row, col, dx, dy)) openFours++;
                }

                return openFours >= 2;
            }

            isOpenFour(row, col, dx, dy) {
                // 열린 사 체크 로직
                this.board[row][col] = 'black';
                let count = 1;
                count += this.countDirection(row, col, dx, dy);
                count += this.countDirection(row, col, -dx, -dy);
                this.board[row][col] = null;
                return count === 4;
            }

            isDoubleThree(row, col) {
                // 간단한 삼삼 체크 로직 (실제로는 더 복잡할 수 있습니다)
                let openThrees = 0;
                const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

                for (const [dx, dy] of directions) {
                    if (this.isOpenThree(row, col, dx, dy)) openThrees++;
                }

                return openThrees >= 2;
            }

            isOpenThree(row, col, dx, dy) {
                // 열린 삼 체크 로직
                this.board[row][col] = 'black';
                let count = 1;
                count += this.countDirection(row, col, dx, dy);
                count += this.countDirection(row, col, -dx, -dy);
                this.board[row][col] = null;
                return count === 3;
            }

            isOverline(row, col) {
                const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

                for (const [dx, dy] of directions) {
                    if (this.countLineLength(row, col, dx, dy) >= 6) return true;
                }

                return false;
            }

            isOpenEnd(row, col, dx, dy) {
                return row >= 0 && row < 15 && col >= 0 && col < 15 && this.board[row][col] === null;
            }

            checkOverline(row, col) {
                const directions = [
                    [0, 1], [1, 0], [1, 1], [1, -1]
                ];

                for (const [dx, dy] of directions) {
                    if (this.countLineLength(row, col, dx, dy) >= 6) {
                        return true;
                    }
                }

                return false;
            }

            countLineLength(row, col, dx, dy) {
                this.board[row][col] = 'black';
                let count = 1;
                count += this.countDirection(row, col, dx, dy);
                count += this.countDirection(row, col, -dx, -dy);
                this.board[row][col] = null;
                return count;
            }

            reset() {
                this.board = Array(15).fill().map(() => Array(15).fill(null));
                this.currentPlayer = 'black';
                this.gameOver = false;
                this.forbiddenMoves = [];
            }

            setRule(rule) {
                this.rule = rule;
                if (this.rule === 'renju' && this.currentPlayer === 'black') {
                    this.updateForbiddenMoves();
                } else {
                    this.forbiddenMoves = [];
                }
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const game = new Gomoku();
            const boardElement = document.getElementById('board');
            const startBtn = document.getElementById('startBtn');
            const resetBtn = document.getElementById('resetBtn');
            const ruleSelect = document.getElementById('ruleSelect');
            const currentPlayerElement = document.getElementById('currentPlayer');
            const gameStatusElement = document.getElementById('gameStatus');

            function updateBoard() {
                boardElement.innerHTML = '';
                const cellSize = 30; // px
                for (let i = 0; i < 15; i++) {
                    for (let j = 0; j < 15; j++) {
                        if (game.board[i][j]) {
                            const stone = document.createElement('div');
                            stone.classList.add('stone', game.board[i][j]);
                            stone.style.top = `${i * cellSize}px`;
                            stone.style.left = `${j * cellSize}px`;
                            boardElement.appendChild(stone);
                        }
                    }
                }

                // 금수 자리 표시
                if (game.rule === 'renju' && game.currentPlayer === 'black') {
                    game.forbiddenMoves.forEach(move => {
                        const forbidden = document.createElement('div');
                        forbidden.classList.add('forbidden');
                        forbidden.style.top = `${move.row * cellSize}px`;
                        forbidden.style.left = `${move.col * cellSize}px`;
                        boardElement.appendChild(forbidden);
                    });
                }
            }

            function updateGameInfo() {
                currentPlayerElement.textContent = game.currentPlayer === 'black' ? '흑' : '백';
                gameStatusElement.textContent = game.gameOver ? '게임 종료' : '진행 중';
            }

            boardElement.addEventListener('click', (e) => {
                const rect = boardElement.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cellSize = 30; // px
                const col = Math.round(x / cellSize);
                const row = Math.round(y / cellSize);

                if (row >= 0 && row < 15 && col >= 0 && col < 15) {
                    const result = game.placeStone(row, col);

                    if (result === false && game.rule === 'renju' && game.currentPlayer === 'black') {
                        gameStatusElement.textContent = '금수입니다. 다른 곳에 돌을 놓아주세요.';
                    } else if (result === 'win') {
                        gameStatusElement.textContent = `${game.currentPlayer === 'black' ? '흑' : '백'} 승리!`;
                    } else if (result === 'draw') {
                        gameStatusElement.textContent = '무승부!';
                    } else {
                        gameStatusElement.textContent = '진행 중';
                    }

                    updateBoard();
                    updateGameInfo();
                }
            });

            startBtn.addEventListener('click', () => {
                game.reset();
                updateBoard();
                updateGameInfo();
            });

            resetBtn.addEventListener('click', () => {
                game.reset();
                updateBoard();
                updateGameInfo();
            });

            ruleSelect.addEventListener('change', (e) => {
                game.setRule(e.target.value);
                game.reset();
                updateBoard();
                updateGameInfo();
            });

            updateBoard();
            updateGameInfo();
        });
    }
)();