(
    () => {
        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let score = 0;
        let timer = 0;
        let gameInterval;
        let difficulty = 'easy';
        let theme = 'animals';
        let isMuted = false;
        let isPaused = false;
        let audioContext;

        const gameBoard = document.getElementById('game-board');
        const scoreElement = document.getElementById('score');
        const timerElement = document.getElementById('timer');
        const highScoreElement = document.getElementById('high-score');
        const startButton = document.getElementById('start-game');
        const pauseButton = document.getElementById('pause-game');
        const difficultySelect = document.getElementById('difficulty');
        const themeSelect = document.getElementById('theme');
        const muteToggle = document.getElementById('mute-toggle');
        const tutorial = document.getElementById('tutorial');
        const closeTutorialButton = document.getElementById('close-tutorial');

        const themes = {
            animals: '🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🐔🐧🐦🐤🐣',
            fruits: '🍎🍐🍊🍋🍌🍉🍇🍓🍒🍑🥭🍍🥥🥝🥑🍅🍆🥔🥕🌽',
            emojis: '😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚'
        };

        startButton.addEventListener('click', startGame);
        pauseButton.addEventListener('click', togglePause);
        difficultySelect.addEventListener('change', (e) => { difficulty = e.target.value; });
        themeSelect.addEventListener('change', (e) => {
            theme = e.target.value;
            document.body.className = `theme-${theme}`;
        });
        muteToggle.addEventListener('click', toggleMute);
        closeTutorialButton.addEventListener('click', () => {
            tutorial.classList.add('hidden');
        });

        function initAudio() {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        function playSound(frequency, duration) {
            if (isMuted || !audioContext) return;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        }

        function playBackgroundMusic() {
            if (isMuted || !audioContext) return;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();

            return { oscillator, gainNode };
        }

        function startGame() {
            resetGame();
            createCards();
            startTimer();
            if (!audioContext) initAudio();
            playBackgroundMusic();
            updateHighScore();
            pauseButton.disabled = false;
        }

        function resetGame() {
            cards = [];
            flippedCards = [];
            matchedPairs = 0;
            score = 0;
            timer = 0;
            gameBoard.innerHTML = '';
            scoreElement.textContent = score;
            timerElement.textContent = timer;
            isPaused = false;
        }

        function createCards() {
            const cardCount = difficulty === 'easy' ? 16 : difficulty === 'medium' ? 24 : 36;
            const symbolsString = themes[theme].slice(0, cardCount);
            const symbols = [...(symbolsString + symbolsString)];
            shuffleArray(symbols);

            gameBoard.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(cardCount))}, 1fr)`;

            symbols.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.cardIndex = index;
                card.addEventListener('click', flipCard);
                gameBoard.appendChild(card);
                cards.push({ element: card, symbol: symbol });
            });
        }

        function flipCard() {
            if (isPaused || flippedCards.length >= 2 || this.classList.contains('flipped')) return;

            const cardIndex = this.dataset.cardIndex;
            this.textContent = cards[cardIndex].symbol;
            this.classList.add('flipped');
            flippedCards.push(this);

            playSound(440, 0.1); // Play a short beep

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            const symbol1 = cards[card1.dataset.cardIndex].symbol;
            const symbol2 = cards[card2.dataset.cardIndex].symbol;

            if (symbol1 === symbol2) {
                playSound(660, 0.2); // Play a higher pitched beep for a match
                score += 10;
                scoreElement.textContent = score;
                matchedPairs++;

                if (matchedPairs === cards.length / 2) {
                    endGame();
                }
            } else {
                setTimeout(() => {
                    card1.textContent = '';
                    card2.textContent = '';
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                }, 500);
            }

            flippedCards = [];
        }

        function startTimer() {
            gameInterval = setInterval(() => {
                if (!isPaused) {
                    timer++;
                    timerElement.textContent = timer;
                }
            }, 1000);
        }

        function endGame() {
            clearInterval(gameInterval);
            alert(`게임 종료! 점수: ${score}, 시간: ${timer}초`);
            saveScore();
            updateHighScore();
            pauseButton.disabled = true;
        }

        function saveScore() {
            const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
            highScores.push({ score, time: timer });
            highScores.sort((a, b) => b.score - a.score || a.time - b.time);
            localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 10)));
        }

        function updateHighScore() {
            const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
            if (highScores.length > 0) {
                const highestScore = highScores[0];
                highScoreElement.textContent = `최고 점수: ${highestScore.score} (${highestScore.time}초)`;
            } else {
                highScoreElement.textContent = '최고 점수: 없음';
            }
        }

        function togglePause() {
            isPaused = !isPaused;
            pauseButton.textContent = isPaused ? '재개' : '일시정지';
            if (isPaused) {
                clearInterval(gameInterval);
            } else {
                startTimer();
            }
        }

        function toggleMute() {
            isMuted = !isMuted;
            muteToggle.textContent = isMuted ? '🔇' : '🔊';
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // 페이지 로드 시 최고 점수 표시 및 튜토리얼 표시
        document.addEventListener('DOMContentLoaded', () => {
            updateHighScore();
            if (!localStorage.getItem('tutorialShown')) {
                tutorial.classList.remove('hidden');
                localStorage.setItem('tutorialShown', 'true');
            }
        });
    }
)();