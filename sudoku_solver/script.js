document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const solveBtn = document.getElementById('solve-btn');
    const clearBtn = document.getElementById('clear-btn');
    const messageDiv = document.createElement('div');
    messageDiv.id = 'message';
    document.body.appendChild(messageDiv);

    // 9x9 그리드 생성
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 9;
        input.addEventListener('input', function() {
            if (this.value.length > 1) {
                this.value = this.value.slice(0, 1);
            }
            if (this.value < 1 || this.value > 9) {
                this.value = '';
            }
            validateInput(this);
        });
        cell.appendChild(input);
        grid.appendChild(cell);
    }

    // 입력 유효성 검사 함수
    function validateInput(input) {
        const value = input.value;
        const index = Array.from(grid.children).findIndex(cell => cell.children[0] === input);
        const row = Math.floor(index / 9);
        const col = index % 9;

        if (value === '') {
            input.classList.remove('invalid');
            return true;
        }

        const isValid = checkRow(row, col, value) && checkColumn(row, col, value) && checkBox(row, col, value);

        if (isValid) {
            input.classList.remove('invalid');
        } else {
            input.classList.add('invalid');
        }

        return isValid;
    }

    // 행 검사
    function checkRow(row, currentCol, value) {
        for (let col = 0; col < 9; col++) {
            if (col !== currentCol && grid.children[row * 9 + col].children[0].value === value) {
                return false;
            }
        }
        return true;
    }

    // 열 검사
    function checkColumn(currentRow, col, value) {
        for (let row = 0; row < 9; row++) {
            if (row !== currentRow && grid.children[row * 9 + col].children[0].value === value) {
                return false;
            }
        }
        return true;
    }

    // 3x3 박스 검사
    function checkBox(currentRow, currentCol, value) {
        const boxRow = Math.floor(currentRow / 3) * 3;
        const boxCol = Math.floor(currentCol / 3) * 3;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cellRow = boxRow + row;
                const cellCol = boxCol + col;
                if ((cellRow !== currentRow || cellCol !== currentCol) && 
                    grid.children[cellRow * 9 + cellCol].children[0].value === value) {
                    return false;
                }
            }
        }
        return true;
    }

    // 스도쿠 풀이 함수
    function solveSudoku(board) {
        const emptyCell = findEmptyCell(board);
        if (!emptyCell) return true;
        
        const [row, col] = emptyCell;
        
        for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                
                if (solveSudoku(board)) {
                    return true;
                }
                
                board[row][col] = 0;
            }
        }
        
        return false;
    }

    // 빈 셀 찾기
    function findEmptyCell(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    // 유효성 검사
    function isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
            if (board[x][col] === num) return false;
        }
        
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) return false;
            }
        }
        
        return true;
    }

    // 메시지 표시 함수
    function showMessage(message, isError = false) {
        messageDiv.textContent = message;
        messageDiv.className = isError ? 'error' : 'success';
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    // 풀기 버튼 이벤트
    solveBtn.addEventListener('click', () => {
        const board = [];
        const inputs = document.querySelectorAll('#sudoku-grid input');
        let isValidInput = true;
        
        inputs.forEach((input) => {
            if (!validateInput(input)) {
                isValidInput = false;
            }
        });

        if (!isValidInput) {
            showMessage('잘못된 입력값이 있습니다. 수정 후 다시 시도해주세요.', true);
            return;
        }

        for (let i = 0; i < 9; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                const value = inputs[i * 9 + j].value;
                row.push(value === '' ? 0 : parseInt(value));
            }
            board.push(row);
        }

        if (solveSudoku(board)) {
            inputs.forEach((input, index) => {
                const row = Math.floor(index / 9);
                const col = index % 9;
                input.value = board[row][col];
                input.classList.remove('invalid');
                input.classList.add('solved');
            });
            showMessage('스도쿠가 성공적으로 해결되었습니다!');
        } else {
            showMessage('유효한 해결책을 찾을 수 없습니다.', true);
        }
    });

    // 지우기 버튼 이벤트
    clearBtn.addEventListener('click', () => {
        document.querySelectorAll('#sudoku-grid input').forEach(input => {
            input.value = '';
            input.classList.remove('invalid', 'solved');
        });
        showMessage('스도쿠 보드가 초기화되었습니다.');
    });
});