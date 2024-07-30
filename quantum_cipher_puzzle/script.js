(
    () => {
        const qubitsContainer = document.getElementById('qubits-container');
        const measureButton = document.getElementById('measure');
        const resetButton = document.getElementById('reset');
        const hintButton = document.getElementById('hint');
        const messageElement = document.getElementById('message');
        const scoreElement = document.getElementById('score-value');
        const timeElement = document.getElementById('time-value');
        const difficultySelect = document.getElementById('difficulty');
        const hadamardButton = document.getElementById('hadamard');
        const cnotButton = document.getElementById('cnot');
        const helpButton = document.getElementById('help-button');
        const helpModal = document.getElementById('help-modal');
        const closeButton = document.getElementsByClassName('close')[0];

        let qubits = [];
        let score = 0;
        let timeLeft = 60;
        let timerInterval;
        let selectedQubit = null;

        const difficulties = {
            easy: { qubits: 3, time: 60, targetState: '000' },
            medium: { qubits: 4, time: 45, targetState: '0000' },
            hard: { qubits: 5, time: 30, targetState: '00000' }
        };

        function showHelp() {
            helpModal.style.display = "block";
        }

        function closeHelp() {
            helpModal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == helpModal) {
                closeHelp();
            }
        }

        helpButton.addEventListener('click', showHelp);
        closeButton.addEventListener('click', closeHelp);

        function initializeGame() {
            const difficulty = difficulties[difficultySelect.value];
            qubits = [];
            score = 0;
            timeLeft = difficulty.time;
            clearInterval(timerInterval);
            qubitsContainer.innerHTML = '';

            for (let i = 0; i < difficulty.qubits; i++) {
                const qubit = {
                    state: Math.random() < 0.5 ? '0' : '1',
                    element: document.createElement('div')
                };
                qubit.element.className = 'qubit';
                qubit.element.textContent = '?';
                qubit.element.addEventListener('click', () => selectQubit(i));
                qubitsContainer.appendChild(qubit.element);
                qubits.push(qubit);
            }
            updateMessage('큐비트를 선택하고 게이트를 적용하세요!');
            updateUI();
            startTimer();
            showHelp();
        }

        function selectQubit(index) {
            if (selectedQubit !== null) {
                qubits[selectedQubit].element.classList.remove('highlight');
            }
            selectedQubit = index;
            qubits[selectedQubit].element.classList.add('highlight');
        }

        function applyHadamard() {
            if (selectedQubit === null) {
                updateMessage('먼저 큐비트를 선택하세요!');
                return;
            }
            const qubit = qubits[selectedQubit];
            qubit.state = qubit.state === '0' ? '+' : '-';
            updateUI();
        }

        function applyCNOT() {
            if (selectedQubit === null) {
                updateMessage('먼저 제어 큐비트를 선택하세요!');
                return;
            }
            const controlQubit = qubits[selectedQubit];
            if (controlQubit.state === '1' || controlQubit.state === '-') {
                const targetIndex = (selectedQubit + 1) % qubits.length;
                const targetQubit = qubits[targetIndex];
                targetQubit.state = targetQubit.state === '0' ? '1' : '0';
            }
            updateUI();
        }

        function measureQubits() {
            let measured = '';
            qubits.forEach(qubit => {
                if (qubit.state === '+' || qubit.state === '-') {
                    qubit.state = Math.random() < 0.5 ? '0' : '1';
                }
                measured += qubit.state;
                qubit.element.textContent = qubit.state;
            });

            const difficulty = difficulties[difficultySelect.value];
            if (measured === difficulty.targetState) {
                score += difficulty.qubits * 10;
                updateMessage('축하합니다! 암호를 해독했습니다!');
            } else {
                updateMessage('암호 해독에 실패했습니다. 다시 시도하세요.');
            }
            updateUI();
        }

        function resetGame() {
            initializeGame();
        }

        function updateMessage(msg) {
            messageElement.textContent = msg;
        }

        function updateUI() {
            qubits.forEach((qubit, index) => {
                qubit.element.textContent = qubit.state;
                qubit.element.style.backgroundColor =
                    qubit.state === '1' ? '#ffcccc' :
                        qubit.state === '0' ? '#ccffcc' :
                            qubit.state === '+' ? '#ccccff' : '#ffccff';
            });
            scoreElement.textContent = score;
            timeElement.textContent = timeLeft;
        }

        function startTimer() {
            timerInterval = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    updateMessage('시간 초과! 게임 오버');
                    measureQubits();
                }
                updateUI();
            }, 1000);
        }

        function showHint() {
            const difficulty = difficulties[difficultySelect.value];
            let hint = '목표 상태: ' + difficulty.targetState + '\n';
            hint += '힌트: Hadamard 게이트를 사용하여 중첩 상태를 만들고, ';
            hint += 'CNOT 게이트를 사용하여 큐비트 간 얽힘을 만드세요.';
            updateMessage(hint);
        }

        difficultySelect.addEventListener('change', initializeGame);
        measureButton.addEventListener('click', measureQubits);
        resetButton.addEventListener('click', resetGame);
        hintButton.addEventListener('click', showHint);
        hadamardButton.addEventListener('click', applyHadamard);
        cnotButton.addEventListener('click', applyCNOT);

        initializeGame();
    }
)();