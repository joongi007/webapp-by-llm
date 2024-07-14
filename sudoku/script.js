(
    () => {
        const board = document.getElementById('sudoku-board');
        const newGameBtn = document.getElementById('new-game');
        const checkSolutionBtn = document.getElementById('check-solution');
        const difficultySelect = document.getElementById('difficulty');
        const hintBtn = document.getElementById('hint');
        const hintCountDisplay = document.getElementById('hint-count');
        const memoBtn = document.getElementById('memo-mode');

        let solution = [];
        let puzzle = [];
        let cellTypes = [];
        let memos = [];
        let hintCount = 3;
        let selectedCell = null;
        let memoMode = false;

        function generateSudoku(difficulty) {
            solution = generateSolution();
            puzzle = generatePuzzle(solution, difficulty);
            cellTypes = puzzle.map(row => row.map(cell => cell === 0 ? 'editable' : 'initial'));
            memos = Array(9).fill().map(() => Array(9).fill().map(() => []));
            hintCount = 3;
            updateHintCount();
            saveGameState();
        }

        function generateSolution() {
            const grid = Array(9).fill().map(() => Array(9).fill(0));
            fillGrid(grid);
            return grid;
        }

        function fillGrid(grid) {
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (grid[i][j] === 0) {
                        shuffleArray(numbers);
                        for (let num of numbers) {
                            if (isValid(grid, i, j, num)) {
                                grid[i][j] = num;
                                if (fillGrid(grid)) {
                                    return true;
                                }
                                grid[i][j] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        function isValid(grid, row, col, num) {
            // Check row
            for (let x = 0; x < 9; x++) {
                if (grid[row][x] === num) return false;
            }

            // Check column
            for (let x = 0; x < 9; x++) {
                if (grid[x][col] === num) return false;
            }

            // Check 3x3 box
            let boxRow = Math.floor(row / 3) * 3;
            let boxCol = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[boxRow + i][boxCol + j] === num) return false;
                }
            }

            return true;
        }

        function generatePuzzle(solution, difficulty) {
            let puzzle = solution.map(row => [...row]);
            let cellsToRemove;

            switch (difficulty) {
                case 'easy':
                    cellsToRemove = 36; // 45 cells filled
                    break;
                case 'medium':
                    cellsToRemove = 46; // 35 cells filled
                    break;
                case 'hard':
                    cellsToRemove = 52; // 29 cells filled
                    break;
                default:
                    cellsToRemove = 46;
            }

            const positions = Array(81).fill().map((_, index) => index);
            shuffleArray(positions);

            for (let i = 0; i < cellsToRemove; i++) {
                const position = positions[i];
                const row = Math.floor(position / 9);
                const col = position % 9;
                puzzle[row][col] = 0;
            }

            return puzzle;
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function renderBoard() {
            board.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    if (puzzle[i][j] !== 0) {
                        cell.textContent = puzzle[i][j];
                    } else {
                        const memoContainer = document.createElement('div');
                        memoContainer.classList.add('memo-container');
                        for (let k = 1; k <= 9; k++) {
                            const memoItem = document.createElement('div');
                            memoItem.classList.add('memo-item');
                            memoItem.textContent = memos[i][j].includes(k) ? k : '';
                            memoContainer.appendChild(memoItem);
                        }
                        cell.appendChild(memoContainer);
                    }
                    cell.classList.add(cellTypes[i][j]);
                    if (cellTypes[i][j] === 'editable' || cellTypes[i][j] === 'user-input') {
                        cell.addEventListener('click', () => selectCell(cell));
                        if (puzzle[i][j] !== 0 && !isValidInput(i, j, puzzle[i][j])) {
                            cell.classList.add('invalid');
                        }
                    }
                    board.appendChild(cell);
                }
            }
        }

        function selectCell(cell) {
            if (cellTypes[cell.dataset.row][cell.dataset.col] === 'editable' ||
                cellTypes[cell.dataset.row][cell.dataset.col] === 'user-input') {
                if (selectedCell) {
                    selectedCell.classList.remove('selected');
                }
                selectedCell = cell;
                cell.classList.add('selected');
            }
        }

        function handleKeyPress(e) {
            if (selectedCell && (cellTypes[selectedCell.dataset.row][selectedCell.dataset.col] === 'editable' ||
                cellTypes[selectedCell.dataset.row][selectedCell.dataset.col] === 'user-input')) {
                const row = parseInt(selectedCell.dataset.row);
                const col = parseInt(selectedCell.dataset.col);
                if (e.key >= '1' && e.key <= '9') {
                    const inputValue = parseInt(e.key);
                    if (memoMode) {
                        toggleMemo(row, col, inputValue);
                    } else {
                        setMainValue(row, col, inputValue);
                    }
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    clearCell(row, col);
                }
                saveGameState();
            }
        }

        function toggleMemo(row, col, value) {
            const index = memos[row][col].indexOf(value);
            if (index > -1) {
                memos[row][col].splice(index, 1);
            } else {
                memos[row][col].push(value);
            }
            renderBoard();
        }

        function setMainValue(row, col, value) {
            puzzle[row][col] = value;
            cellTypes[row][col] = 'user-input';
            memos[row][col] = [];

            if (isValidInput(row, col, value)) {
                selectedCell.classList.remove('invalid');
            } else {
                selectedCell.classList.add('invalid');
            }
            renderBoard();
            // 셀 선택 상태 유지
            selectCell(board.children[row * 9 + col]);
        }

        function clearCell(row, col) {
            puzzle[row][col] = 0;
            cellTypes[row][col] = 'editable';
            memos[row][col] = [];
            renderBoard();
            // 셀 선택 상태 유지
            selectCell(board.children[row * 9 + col]);
        }

        function isValidInput(row, col, value) {
            // 행 검사
            for (let i = 0; i < 9; i++) {
                if (i !== col && puzzle[row][i] === value) {
                    return false;
                }
            }

            // 열 검사
            for (let i = 0; i < 9; i++) {
                if (i !== row && puzzle[i][col] === value) {
                    return false;
                }
            }

            // 3x3 박스 검사
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            for (let i = boxRow; i < boxRow + 3; i++) {
                for (let j = boxCol; j < boxCol + 3; j++) {
                    if (i !== row && j !== col && puzzle[i][j] === value) {
                        return false;
                    }
                }
            }

            return true;
        }

        function checkSolution() {
            let correct = true;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const cell = board.children[i * 9 + j];
                    const value = parseInt(cell.textContent) || 0;
                    if (value !== solution[i][j]) {
                        correct = false;
                        cell.classList.add('incorrect');
                    } else {
                        cell.classList.remove('incorrect');
                    }
                }
            }
            alert(correct ? '정답입니다!' : '틀렸습니다. 다시 시도해보세요.');
        }

        function provideHint() {
            const emptyCells = Array.from(board.children).filter(cell => !cell.textContent && cell.classList.contains('editable'));

            if (emptyCells.length === 0) {
                alert('더 이상 힌트를 제공할 수 없습니다.');
                return;
            }

            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const row = parseInt(randomCell.dataset.row);
            const col = parseInt(randomCell.dataset.col);

            randomCell.textContent = solution[row][col];
            randomCell.classList.remove('editable');
            randomCell.classList.add('hint');
            puzzle[row][col] = solution[row][col];
            cellTypes[row][col] = 'hint';

            hintCount--;
            updateHintCount();
            saveGameState();
        }

        function updateHintCount() {
            hintCountDisplay.textContent = hintCount;
            hintBtn.disabled = hintCount === 0;
        }

        function saveGameState() {
            const gameState = {
                puzzle: puzzle,
                solution: solution,
                hintCount: hintCount,
                difficulty: difficultySelect.value,
                cellTypes: cellTypes,
                memos: memos
            };
            localStorage.setItem('sudokuGameState', JSON.stringify(gameState));
        }

        function loadGameState() {
            const savedState = localStorage.getItem('sudokuGameState');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                puzzle = gameState.puzzle;
                solution = gameState.solution;
                hintCount = gameState.hintCount;
                difficultySelect.value = gameState.difficulty;
                cellTypes = gameState.cellTypes;
                memos = gameState.memos || Array(9).fill().map(() => Array(9).fill().map(() => []));
                renderBoard();
                updateHintCount();
            } else {
                newGame();
            }
        }

        function newGame() {
            const difficulty = difficultySelect.value;
            generateSudoku(difficulty);
            renderBoard();
            updateHintCount();
            selectedCell = null;
        }

        newGameBtn.addEventListener('click', newGame);
        checkSolutionBtn.addEventListener('click', checkSolution);
        hintBtn.addEventListener('click', provideHint);
        memoBtn.addEventListener('click', () => {
            memoMode = !memoMode;
            memoBtn.classList.toggle('active', memoMode);
        });
        document.addEventListener('keydown', handleKeyPress);

        // 게임 시작 시 저장된 상태 불러오기
        loadGameState();
    }
)();