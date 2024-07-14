(
    () => {
        // Game variables
        let player;
        let enemies = [];
        let projectiles = [];
        let level = 1;
        let experience = 0;
        let gameTime = 0;
        let gameLoop;
        let enemySpawnInterval;
        let gameTimeInterval;
        let isGameRunning = false;

        // Player stats
        let playerStats = {
            speed: 5,
            health: 100,
            maxHealth: 100,
            invincibilityTime: 1000 // 1 second of invincibility after taking damage
        };
        let lastDamageTime = 0;

        // Weapon system
        let weapons = [
            { name: 'Pistol', damage: 20, projectileSpeed: 5, fireRate: 500, projectileType: 'normal' },
            { name: 'Shotgun', damage: 15, projectileSpeed: 4, fireRate: 1000, projectileType: 'spread' },
            { name: 'Laser', damage: 10, projectileSpeed: 10, fireRate: 100, projectileType: 'laser' }
        ];
        let currentWeaponIndex = 0;

        // Player movement variables
        let playerX = window.innerWidth / 2;
        let playerY = window.innerHeight / 2;
        let keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };

        let shootInterval;

        // Initialize the game
        function init() {
            player = document.getElementById('player');
            updatePlayerPosition();

            document.getElementById('start-button').addEventListener('click', startGame);
            document.getElementById('pause-button').addEventListener('click', togglePause);

            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
            document.getElementById('restart-button').addEventListener('click', restartGame);
        }

        function startGame() {
            if (!isGameRunning) {
                isGameRunning = true;
                document.getElementById('game-menu').style.display = 'none';
                gameLoop = requestAnimationFrame(update);
                enemySpawnInterval = setInterval(spawnEnemy, 1000);
                gameTimeInterval = setInterval(updateGameTime, 1000);
                startShooting();
            }
        }

        function togglePause() {
            if (isGameRunning) {
                isGameRunning = false;
                cancelAnimationFrame(gameLoop);
                clearInterval(enemySpawnInterval);
                clearInterval(gameTimeInterval);
                clearInterval(shootInterval);
                document.getElementById('game-menu').style.display = 'flex';
                document.getElementById('start-button').textContent = 'Resume Game';
            } else {
                startGame();
            }
        }

        // Main game loop
        function update() {
            if (isGameRunning) {
                movePlayer();
                moveEnemies();
                moveProjectiles();
                checkCollisions();
                updateUI();
                gameLoop = requestAnimationFrame(update);
            }
        }

        // Handle keyboard input
        function handleKeyDown(e) {
            if (e.key in keys) {
                keys[e.key] = true;
            }
        }

        function handleKeyUp(e) {
            if (e.key in keys) {
                keys[e.key] = false;
            }
        }

        // Move player based on keyboard input
        function movePlayer() {
            if (keys.ArrowUp) playerY -= playerStats.speed;
            if (keys.ArrowDown) playerY += playerStats.speed;
            if (keys.ArrowLeft) playerX -= playerStats.speed;
            if (keys.ArrowRight) playerX += playerStats.speed;

            // Keep player within bounds
            playerX = Math.max(0, Math.min(window.innerWidth - 40, playerX));
            playerY = Math.max(0, Math.min(window.innerHeight - 40, playerY));

            updatePlayerPosition();
        }

        function updatePlayerPosition() {
            player.style.left = playerX + 'px';
            player.style.top = playerY + 'px';
        }

        // Spawn a new enemy
        function spawnEnemy() {
            const enemy = document.createElement('div');
            enemy.classList.add('enemy');
            enemy.style.left = Math.random() * window.innerWidth + 'px';
            enemy.style.top = Math.random() * window.innerHeight + 'px';
            enemy.health = 100;
            document.getElementById('enemies').appendChild(enemy);
            enemies.push(enemy);
        }

        // Move enemies towards the player
        function moveEnemies() {
            enemies.forEach(enemy => {
                const enemyRect = enemy.getBoundingClientRect();
                const dx = playerX - enemyRect.left;
                const dy = playerY - enemyRect.top;
                const angle = Math.atan2(dy, dx);
                const speed = 2;

                const newLeft = enemyRect.left + Math.cos(angle) * speed;
                const newTop = enemyRect.top + Math.sin(angle) * speed;

                enemy.style.left = `${newLeft}px`;
                enemy.style.top = `${newTop}px`;
            });
        }

        // Shooting system
        function startShooting() {
            if (shootInterval) {
                clearInterval(shootInterval);
            }
            shootInterval = setInterval(shootProjectile, weapons[currentWeaponIndex].fireRate);
        }

        function shootProjectile() {
            if (isGameRunning) {
                const weapon = weapons[currentWeaponIndex];
                switch (weapon.projectileType) {
                    case 'normal':
                        createProjectile(playerX, playerY, 0);
                        break;
                    case 'spread':
                        for (let angle = -30; angle <= 30; angle += 30) {
                            createProjectile(playerX, playerY, angle);
                        }
                        break;
                    case 'laser':
                        createLaser();
                        break;
                }
            }
        }

        function createProjectile(x, y, angle) {
            const projectile = document.createElement('div');
            projectile.classList.add('projectile');
            projectile.style.left = x + 'px';
            projectile.style.top = y + 'px';
            document.getElementById('projectiles').appendChild(projectile);

            const weapon = weapons[currentWeaponIndex];
            const speed = weapon.projectileSpeed;
            const radians = angle * Math.PI / 180;
            projectile.dx = Math.cos(radians) * speed;
            projectile.dy = Math.sin(radians) * speed;

            projectiles.push(projectile);
        }

        function createLaser() {
            const laser = document.createElement('div');
            laser.classList.add('laser');
            laser.style.left = playerX + 'px';
            laser.style.top = playerY + 'px';
            laser.style.width = '4px';
            laser.style.height = '0px';
            document.getElementById('projectiles').appendChild(laser);
            projectiles.push(laser);
        }

        function moveProjectiles() {
            projectiles.forEach((projectile, index) => {
                if (projectile.classList.contains('laser')) {
                    const height = parseInt(projectile.style.height) || 0;
                    projectile.style.height = (height + 10) + 'px';
                    if (height > window.innerHeight) {
                        projectile.remove();
                        projectiles.splice(index, 1);
                    }
                } else {
                    const rect = projectile.getBoundingClientRect();
                    projectile.style.left = (rect.left + projectile.dx) + 'px';
                    projectile.style.top = (rect.top + projectile.dy) + 'px';

                    if (rect.right < 0 || rect.left > window.innerWidth || rect.bottom < 0 || rect.top > window.innerHeight) {
                        projectile.remove();
                        projectiles.splice(index, 1);
                    }
                }
            });
        }

        // Check for collisions
        function checkCollisions() {
            const playerRect = player.getBoundingClientRect();
            const currentTime = Date.now();

            enemies.forEach((enemy, enemyIndex) => {
                const enemyRect = enemy.getBoundingClientRect();

                // Check for collision between player and enemy
                if (isColliding(playerRect, enemyRect) && currentTime - lastDamageTime > playerStats.invincibilityTime) {
                    // Player takes damage
                    playerStats.health -= 10;
                    lastDamageTime = currentTime;

                    // Visual feedback for player taking damage
                    player.style.backgroundColor = 'red';
                    setTimeout(() => {
                        player.style.backgroundColor = '';
                    }, 200);

                    if (playerStats.health <= 0) {
                        gameOver();
                    }
                }
                projectiles.forEach((projectile, projectileIndex) => {
                    const projectileRect = projectile.getBoundingClientRect();

                    if (isColliding(projectileRect, enemyRect)) {
                        const weapon = weapons[currentWeaponIndex];

                        // Remove the projectile if it's not a laser
                        if (!projectile.classList.contains('laser')) {
                            projectile.remove();
                            projectiles.splice(projectileIndex, 1);
                        }

                        // Damage the enemy
                        enemy.health -= weapon.damage;

                        if (enemy.health <= 0) {
                            // Remove the enemy if its health is depleted
                            enemy.remove();
                            enemies.splice(enemyIndex, 1);

                            // Increase experience
                            experience += 10;
                            if (experience >= 100) {
                                levelUp();
                            }
                        } else {
                            // Change enemy color based on health
                            const healthPercentage = enemy.health / 100;
                            enemy.style.backgroundColor = `rgb(${255}, ${Math.floor(255 * healthPercentage)}, ${Math.floor(255 * healthPercentage)})`;
                        }
                    }
                });
            });
        }

        // Helper function to check collision between two rectangles
        function isColliding(rect1, rect2) {
            return !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);
        }

        // Level up system
        function levelUp() {
            level++;
            experience = 0;
            showLevelUpMenu();
        }

        function showLevelUpMenu() {
            isGameRunning = false;
            cancelAnimationFrame(gameLoop);
            clearInterval(enemySpawnInterval);
            clearInterval(gameTimeInterval);
            clearInterval(shootInterval);

            const levelUpMenu = document.getElementById('level-up-menu');
            const upgradeOptions = document.getElementById('upgrade-options');
            upgradeOptions.innerHTML = '';

            const upgrades = [
                { name: 'Increase Speed', effect: () => { playerStats.speed += 1; } },
                { name: 'Increase Damage', effect: () => { weapons.forEach(w => w.damage += 5); } },
                { name: 'Increase Projectile Speed', effect: () => { weapons.forEach(w => w.projectileSpeed += 1); } },
                {
                    name: 'Increase Fire Rate', effect: () => {
                        weapons.forEach(w => w.fireRate = Math.max(100, w.fireRate - 50));
                        startShooting();
                    }
                },
                {
                    name: 'Switch Weapon', effect: () => {
                        currentWeaponIndex = (currentWeaponIndex + 1) % weapons.length;
                        startShooting();
                    }
                }
            ];

            upgrades.forEach(upgrade => {
                const button = document.createElement('button');
                button.textContent = upgrade.name;
                button.classList.add('upgrade-option');
                button.addEventListener('click', () => {
                    upgrade.effect();
                    levelUpMenu.style.display = 'none';
                    resumeGame();
                });
                upgradeOptions.appendChild(button);
            });

            levelUpMenu.style.display = 'flex';
        }

        function resumeGame() {
            isGameRunning = true;
            gameLoop = requestAnimationFrame(update);
            enemySpawnInterval = setInterval(spawnEnemy, 1000);
            gameTimeInterval = setInterval(updateGameTime, 1000);
            startShooting();
        }

        function gameOver() {
            isGameRunning = false;
            cancelAnimationFrame(gameLoop);
            clearInterval(enemySpawnInterval);
            clearInterval(gameTimeInterval);
            clearInterval(shootInterval);

            document.getElementById('final-level').textContent = level;
            document.getElementById('game-over-menu').style.display = 'flex';
        }

        function restartGame() {
            // Reset all game variables
            playerStats = {
                speed: 5,
                health: 100,
                maxHealth: 100,
                invincibilityTime: 1000
            };
            lastDamageTime = 0;
            level = 1;
            experience = 0;
            enemies = [];
            projectiles = [];
            gameTime = 0;
            currentWeaponIndex = 0;

            // Reset weapons to their initial state
            weapons = [
                { name: 'Pistol', damage: 20, projectileSpeed: 5, fireRate: 500, projectileType: 'normal' },
                { name: 'Shotgun', damage: 15, projectileSpeed: 4, fireRate: 1000, projectileType: 'spread' },
                { name: 'Laser', damage: 10, projectileSpeed: 10, fireRate: 100, projectileType: 'laser' }
            ];

            // Hide game over menu
            document.getElementById('game-over-menu').style.display = 'none';

            // Clear the game container
            document.getElementById('enemies').innerHTML = '';
            document.getElementById('projectiles').innerHTML = '';

            // Reset player position
            playerX = window.innerWidth / 2;
            playerY = window.innerHeight / 2;
            updatePlayerPosition();

            // Reset UI
            updateUI();

            // Start the game
            startGame();
        }


        function updateUI() {
            document.getElementById('health-fill').style.width = `${(playerStats.health / playerStats.maxHealth) * 100}%`;
            document.getElementById('exp-fill').style.width = `${(experience % 100)}%`;
            document.getElementById('level-value').textContent = level;
        }

        function updateGameTime() {
            if (isGameRunning) {
                gameTime++;
                document.getElementById('time-value').textContent = gameTime;
            }
        }

        // Start the game
        window.onload = init;
    }
)();