(
    () => {
        // 체스 게임 인스턴스 생성
        const chess = new Chess();

        // DOM 요소 선택
        const board = document.getElementById('chessboard');
        const currentPlayerDiv = document.getElementById('current-player');
        const gameStatusDiv = document.getElementById('game-status');
        const newGameBtn = document.getElementById('new-game');
        const undoMoveBtn = document.getElementById('undo-move');

        // 체스판 생성 함수
        function createBoard() {
            board.innerHTML = '';
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    const square = document.createElement('div');
                    square.className = `chess-square ${(i + j) % 2 === 0 ? 'chess-square-light' : 'chess-square-dark'}`;
                    square.dataset.position = `${String.fromCharCode(97 + j)}${8 - i}`;
                    square.addEventListener('click', handleSquareClick);
                    board.appendChild(square);
                }
            }
            updateBoard();
        }

        // 체스판 업데이트 함수
        function updateBoard() {
            const position = chess.board();
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    const square = board.children[i * 8 + j];
                    const piece = position[i][j];
                    square.innerHTML = piece ?
                        `<span class="chess-piece chess-piece-${piece.color === 'w' ? 'white' : 'black'}">${getUnicodePiece(piece)}</span>`
                        : '';
                    square.classList.remove('possible-move');
                }
            }
            updateGameInfo();
        }

        // 유니코드 체스 피스 반환 함수
        function getUnicodePiece(piece) {
            const pieces = {
                'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
                'P': '♟', 'N': '♞', 'B': '♝', 'R': '♜', 'Q': '♛', 'K': '♚'
            };
            return pieces[piece.type] || '';
        }

        // 게임 정보 업데이트 함수
        function updateGameInfo() {
            currentPlayerDiv.textContent = `현재 차례: ${chess.turn() === 'w' ? '백' : '흑'}`;
            if (chess.in_checkmate()) {
                gameStatusDiv.textContent = `체크메이트! ${chess.turn() === 'w' ? '흑' : '백'} 승리!`;
            } else if (chess.in_draw()) {
                gameStatusDiv.textContent = '무승부!';
            } else if (chess.in_check()) {
                gameStatusDiv.textContent = '체크!';
            } else {
                gameStatusDiv.textContent = '게임 진행 중';
            }
        }

        // 클릭 이벤트 처리 함수
        let selectedSquare = null;
        let pendingPromotion = null;
        let clickedSquare = null;

        function handleSquareClick(event) {
            clickedSquare = event.target.closest('.chess-square');
            if (!clickedSquare) return;

            const position = clickedSquare.dataset.position;

            if (selectedSquare) {
                const move = {
                    from: selectedSquare.dataset.position,
                    to: position,
                };

                // 프로모션 가능성 확인
                const piece = chess.get(selectedSquare.dataset.position);
                const toRow = position.charAt(1);
                if (piece && piece.type === 'p' && (toRow === '8' || toRow === '1')) {
                    // 현재 턴 확인
                    if (piece.color === chess.turn()) {
                        pendingPromotion = move;
                        showPromotionModal(piece.color);
                        return;
                    }
                }

                makeMove(move);
            } else {
                selectedSquare = clickedSquare;
                selectedSquare.classList.add('selected');
                showPossibleMoves(position);
            }
        }

        // 이동 실행 함수
        function makeMove(move) {
            const result = chess.move(move);
            if (result) {
                updateBoard();
                selectedSquare.classList.remove('selected');
                selectedSquare = null;
                clearPossibleMoves();
            } else {
                selectedSquare.classList.remove('selected');
                clearPossibleMoves();
                selectedSquare = clickedSquare;
                selectedSquare.classList.add('selected');
                showPossibleMoves(move.to);
            }
        }

        // 프로모션 모달 표시 함수
        function showPromotionModal(color) {
            const modal = document.getElementById('promotion-modal');
            const choices = document.getElementById('promotion-choices');
            choices.innerHTML = '';

            const pieces = ['q', 'r', 'n', 'b'];
            pieces.forEach(piece => {
                const pieceElement = document.createElement('div');
                pieceElement.className = `promotion-choice`;
                const pieceSpan = document.createElement('span');
                pieceSpan.className = `chess-piece chess-piece-${color === 'w' ? 'white' : 'black'}`;
                pieceSpan.textContent = getUnicodePiece({ type: piece, color: color });
                pieceElement.appendChild(pieceSpan);
                pieceElement.addEventListener('click', () => handlePromotion(piece));
                choices.appendChild(pieceElement);
            });

            modal.style.display = 'block';
        }

        // 프로모션 선택 처리 함수
        function handlePromotion(piece) {
            const modal = document.getElementById('promotion-modal');
            modal.style.display = 'none';

            if (pendingPromotion) {
                pendingPromotion.promotion = piece;
                makeMove(pendingPromotion);
                pendingPromotion = null;
            }
        }


        // 가능한 이동 위치 표시 함수
        function showPossibleMoves(position) {
            const moves = chess.moves({ square: position, verbose: true });
            moves.forEach(move => {
                const square = document.querySelector(`[data-position="${move.to}"]`);
                square.classList.add('possible-move');
            });
        }

        // 가능한 이동 위치 표시 제거 함수
        function clearPossibleMoves() {
            const squares = document.querySelectorAll('.chess-square');
            squares.forEach(square => square.classList.remove('possible-move'));
        }

        // 새 게임 시작 함수
        function startNewGame() {
            chess.reset();
            createBoard();
            selectedSquare = null;
            clearPossibleMoves();
        }

        // 무르기 함수
        function undoMove() {
            chess.undo();
            updateBoard();
            selectedSquare = null;
            clearPossibleMoves();
        }

        // 이벤트 리스너 추가
        newGameBtn.addEventListener('click', startNewGame);
        undoMoveBtn.addEventListener('click', undoMove);

        // 초기화 함수에 프로모션 모달 이벤트 리스너 추가
        function initGame() {
            // 초기 보드 생성
            createBoard();

            // 모달 외부 클릭 시 닫기
            const modal = document.getElementById('promotion-modal');
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    pendingPromotion = null;
                    selectedSquare.classList.remove('selected');
                    selectedSquare = null;
                    clearPossibleMoves();
                }
            });
        }

        // 게임 초기화 호출
        initGame();
    }
)();