(
    () => {
        const player = document.getElementById('player');
        const gameContainer = document.getElementById('game-container');
        const sections = document.querySelectorAll('.section');
        const inventory = document.getElementById('collected-items');
        const dialogBox = document.getElementById('dialog-box');
        const dialogText = document.getElementById('dialog-text');
        const dialogClose = document.getElementById('dialog-close');

        let playerX = 0;
        let playerY = 0;
        const speed = 5;

        const projects = [
            { name: "RPG Adventure", description: "오픈 월드 RPG 게임" },
            { name: "Puzzle Master", description: "두뇌를 자극하는 퍼즐 게임" },
            { name: "Space Shooter", description: "클래식 아케이드 슈팅 게임" }
        ];

        const skills = [
            "Unity", "Unreal Engine", "C#", "C++", "3D Modeling", "Game Design", "AI Programming", "Multiplayer Networking"
        ];

        function updatePlayerPosition() {
            player.style.left = `${playerX}px`;
            player.style.top = `${playerY}px`;
        }

        function movePlayer(direction) {
            switch (direction) {
                case 'left':
                    playerX = Math.max(0, playerX - speed);
                    break;
                case 'right':
                    playerX = Math.min(gameContainer.clientWidth - player.clientWidth, playerX + speed);
                    break;
                case 'up':
                    playerY = Math.max(0, playerY - speed);
                    break;
                case 'down':
                    playerY = Math.min(gameContainer.clientHeight - player.clientHeight, playerY + speed);
                    break;
            }
            updatePlayerPosition();
            checkCollisions();
        }

        function checkCollisions() {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (
                    playerX < rect.right &&
                    playerX + player.clientWidth > rect.left &&
                    playerY < rect.bottom &&
                    playerY + player.clientHeight > rect.top
                ) {
                    showSection(section.id);
                }
            });
        }

        function showSection(sectionId) {
            sections.forEach(section => section.style.display = 'none');
            document.getElementById(sectionId).style.display = 'block';

            if (sectionId === 'projects') {
                renderProjects();
            } else if (sectionId === 'skills') {
                renderSkills();
            }
        }

        function renderProjects() {
            const showcase = document.getElementById('project-showcase');
            showcase.innerHTML = '';
            projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project-item';
                projectElement.textContent = project.name;
                projectElement.addEventListener('click', () => showDialog(project.description));
                showcase.appendChild(projectElement);
            });
        }

        function renderSkills() {
            const skillTree = document.getElementById('skill-tree');
            skillTree.innerHTML = '';
            skills.forEach(skill => {
                const skillElement = document.createElement('div');
                skillElement.className = 'skill-item';
                skillElement.textContent = skill;
                skillElement.addEventListener('click', () => collectItem(skill));
                skillTree.appendChild(skillElement);
            });
        }

        function collectItem(item) {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            inventory.appendChild(listItem);
            showDialog(`You've learned ${item}!`);
        }

        function showDialog(text) {
            dialogText.textContent = text;
            dialogBox.classList.remove('hidden');
        }

        dialogClose.addEventListener('click', () => {
            dialogBox.classList.add('hidden');
        });

        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    movePlayer('left');
                    break;
                case 'ArrowRight':
                    movePlayer('right');
                    break;
                case 'ArrowUp':
                    movePlayer('up');
                    break;
                case 'ArrowDown':
                    movePlayer('down');
                    break;
                case 'a':
                    showSection('about');
                    break;
                case 'p':
                    showSection('projects');
                    break;
                case 's':
                    showSection('skills');
                    break;
                case 'c':
                    showSection('contact');
                    break;
            }
        });

        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            showDialog('메시지가 전송되었습니다. 감사합니다!');
            e.target.reset();
        });

        // 초기 플레이어 위치 설정
        playerX = gameContainer.clientWidth / 2 - player.clientWidth / 2;
        playerY = gameContainer.clientHeight / 2 - player.clientHeight / 2;
        updatePlayerPosition();
    }
)();