(
    () => {
        // 전역 변수
        let canvas, ctx;
        let mapSize, foodCount, speciesCount;
        let organisms = [];
        let foods = [];
        let showSenseRange = false;
        let organismIdCounter = 0;
        let canvasScale = 1;
        let offsetX = 0, offsetY = 0;
        let highlightedDescendants = new Set();
        let animationId = null;
        let originalAncestors = new Map();
        let worldWidth, worldHeight;
        let modal;
        let foodGenerationRate = 50; // 기본값
        let lastFoodGenerationTime = 0;

        // 초기화 함수
        function init() {
            canvas = document.getElementById('simulation-canvas');
            ctx = canvas.getContext('2d');

            // 이벤트 리스너 설정
            document.getElementById('start-simulation').addEventListener('click', startSimulation);
            document.getElementById('zoom-in').addEventListener('click', zoomIn);
            document.getElementById('zoom-out').addEventListener('click', zoomOut);
            document.getElementById('toggle-stats').addEventListener('click', toggleStatistics);
            document.getElementById('toggle-sense-range').addEventListener('click', toggleSenseRange);
            document.getElementById('show-ancestors').addEventListener('click', toggleAncestorsList);
            document.getElementById('food-generation-rate').addEventListener('input', updateFoodGenerationRate);
            canvas.addEventListener('click', handleCanvasClick);

            // 유기체 정보 컨테이너에 이벤트 위임 설정
            document.getElementById('organism-info-container').addEventListener('closeInfo', handleCloseInfo);
            document.getElementById('organism-info-container').addEventListener('highlightDescendants', handleHighlightDescendants);

            // 입력값 변경 시 표시 업데이트
            document.getElementById('map-size').addEventListener('input', updateMapSizeDisplay);

            // 초기 캔버스 크기 설정
            resizeCanvas();

            // 모달 요소 가져오기
            modal = document.getElementById('ancestor-modal');

            // 모달 닫기 버튼에 이벤트 리스너 추가
            const closeBtn = modal.querySelector('.close');
            closeBtn.onclick = closeModal;

            // 모달 외부 클릭 시 닫기
            window.onclick = function (event) {
                if (event.target == modal) {
                    closeModal();
                }
            }
        }

        // 먹이 생성 속도 업데이트 함수
        function updateFoodGenerationRate() {
            const slider = document.getElementById('food-generation-rate');
            const value = document.getElementById('food-generation-rate-value');
            foodGenerationRate = slider.value;
            value.textContent = foodGenerationRate;
        }

        // 최초 조상 목록 토글 함수
        function toggleAncestorsList() {
            showAncestorsList();
            modal.style.display = "block";
        }

        // 모달 닫기 함수
        function closeModal() {
            modal.style.display = "none";
        }

        // 유기체 정보창 닫기 이벤트 핸들러
        function handleCloseInfo(event) {
            console.log(`Closing info for organism ${event.detail.organismId}`); // 디버깅용 로그
            const infoDiv = document.getElementById(`organism-info-${event.detail.organismId}`);
            if (infoDiv) {
                infoDiv.remove();
            }
        }

        // 후손 강조 표시 이벤트 핸들러
        function handleHighlightDescendants(event) {
            console.log(`Highlighting descendants for organism ${event.detail.organismId}`); // 디버깅용 로그
            highlightDescendants(event.detail.organismId);
        }

        // 후손 강조 표시 이벤트 핸들러
        function handleHighlightDescendants(event) {
            console.log(`Highlighting descendants for organism ${event.detail.organismId}`); // 디버깅용 로그
            highlightDescendants(event.detail.organismId);
        }

        // 유기체 정보 표시 함수
        function displayOrganismInfo(org) {
            const container = document.getElementById('organism-info-container');
            let infoDiv = document.getElementById(`organism-info-${org.id}`);

            if (!infoDiv) {
                infoDiv = document.createElement('div');
                infoDiv.id = `organism-info-${org.id}`;
                infoDiv.className = 'organism-info';

                // 정보 내용을 담을 div
                const contentDiv = document.createElement('div');
                contentDiv.className = 'organism-info-content';
                infoDiv.appendChild(contentDiv);

                // 버튼 컨테이너
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'organism-info-buttons';
                infoDiv.appendChild(buttonContainer);

                // 후손 강조 표시 버튼
                // const highlightButton = document.createElement('button');
                // highlightButton.textContent = '후손 강조 표시';
                // highlightButton.addEventListener('click', () => {
                //     container.dispatchEvent(new CustomEvent('highlightDescendants', { detail: { organismId: org.id } }));
                // });
                // buttonContainer.appendChild(highlightButton);

                // 닫기 버튼
                const closeButton = document.createElement('button');
                closeButton.textContent = '닫기';
                closeButton.addEventListener('click', () => {
                    container.dispatchEvent(new CustomEvent('closeInfo', { detail: { organismId: org.id } }));
                });
                buttonContainer.appendChild(closeButton);

                container.appendChild(infoDiv);
            }

            updateOrganismInfoContent(infoDiv.querySelector('.organism-info-content'), org);
        }

        // 유기체 정보 컨테이너 클릭 핸들러
        function handleOrganismInfoClick(event) {
            const target = event.target;
            if (target.classList.contains('close-info')) {
                const organismId = target.getAttribute('data-id');
                closeOrganismInfo(organismId);
            } else if (target.classList.contains('highlight-descendants')) {
                const organismId = target.getAttribute('data-id');
                highlightDescendants(organismId);
            } else if (target.classList.contains('ancestor-link')) {
                event.preventDefault();
                const currentId = target.getAttribute('data-current');
                const ancestorId = target.getAttribute('data-ancestor');
                showAncestorInfo(currentId, ancestorId);
            }
        }

        // 캔버스 크기 조정 함수
        function resizeCanvas() {
            const container = document.getElementById('simulation-container');
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            canvas.style.width = containerWidth + 'px';
            canvas.style.height = containerHeight + 'px';

            canvas.width = containerWidth * window.devicePixelRatio;
            canvas.height = containerHeight * window.devicePixelRatio;

            // 세계 크기 설정
            worldWidth = mapSize;
            worldHeight = mapSize;

            // 캔버스 스케일 및 오프셋 계산
            canvasScale = Math.min(canvas.width / worldWidth, canvas.height / worldHeight);
            offsetX = (canvas.width - worldWidth * canvasScale) / 2;
            offsetY = (canvas.height - worldHeight * canvasScale) / 2;

            ctx.setTransform(canvasScale, 0, 0, canvasScale, offsetX, offsetY);
        }

        // 캔버스 클릭 핸들러
        function handleCanvasClick(event) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const clickX = (event.clientX - rect.left) * scaleX;
            const clickY = (event.clientY - rect.top) * scaleY;

            const worldX = (clickX - offsetX) / canvasScale;
            const worldY = (clickY - offsetY) / canvasScale;

            const clickedOrganism = organisms.find(org =>
                Math.sqrt((org.x - worldX) ** 2 + (org.y - worldY) ** 2) < org.size
            );

            if (clickedOrganism) {
                displayOrganismInfo(clickedOrganism);
            }
        }

        // 유기체 정보 내용 업데이트 함수
        function updateOrganismInfoContent(contentDiv, org) {
            const parentInfo = org.parent ? `자손 (부모 ID: ${org.parent.id})` : '초기 생성';
            const ancestorsInfo = org.ancestors.length > 0
                ? `<p>조상: ${org.ancestors.map(id => `<span class="ancestor-link" data-current="${org.id}" data-ancestor="${id}">${id}</span>`).join(', ')}</p>`
                : '';

            const descendantsCount = findAllDescendants(org.id).length;

            contentDiv.innerHTML = `
        <h3>유기체 정보 (ID: ${org.id})</h3>
        <p>유형: ${org.diet === 'herbivore' ? '초식' : '육식'}</p>
        <p>세대: ${org.generation}</p>
        <p>후손 수: ${descendantsCount}</p>
        <p>부모 관계: ${parentInfo}</p>
        ${ancestorsInfo}
        <p>크기: ${org.size.toFixed(2)}</p>
        <p>속도: ${org.speed.toFixed(2)}</p>
        <p>회전 속도: ${org.turnSpeed.toFixed(2)}</p>
        <p>감지 범위: ${org.senseRange.toFixed(2)}</p>
        <p>에너지: ${org.energy.toFixed(2)}</p>
        <p>나이: ${org.age.toFixed(2)}</p>
    `;
        }

        // 조상 정보 표시 함수
        function showAncestorInfo(currentOrgId, ancestorId) {
            const currentOrg = organisms.find(org => org.id === currentOrgId);
            if (!currentOrg) return;

            const ancestorOrg = findAncestor(currentOrg, ancestorId);
            if (ancestorOrg) {
                displayOrganismInfo(ancestorOrg);
            } else {
                alert(`조상 ID ${ancestorId}의 정보를 찾을 수 없습니다.`);
            }
        }

        // 조상 찾기 함수
        function findAncestor(org, ancestorId) {
            if (org.id === ancestorId) return org;
            if (!org.parent) return null;
            return findAncestor(org.parent, ancestorId);
        }

        // 유기체 정보창 닫기 함수
        function closeOrganismInfo(organismId) {
            console.log(`Closing info for organism ${organismId}`); // 디버깅용 로그
            const infoDiv = document.getElementById(`organism-info-${organismId}`);
            if (infoDiv) {
                infoDiv.remove();
            }
        }

        // 감지 범위 토글 함수
        function toggleSenseRange() {
            showSenseRange = !showSenseRange;
            const button = document.getElementById('toggle-sense-range');
            button.classList.toggle('active');
            button.textContent = showSenseRange ? '감지 범위 숨기기' : '감지 범위 표시';
        }

        // 정보창 위치 조정 함수
        function positionInfoDiv(infoDiv) {
            const container = document.getElementById('organism-info-container');
            const containerRect = container.getBoundingClientRect();
            const infoDivRect = infoDiv.getBoundingClientRect();

            if (infoDivRect.bottom > containerRect.bottom) {
                infoDiv.style.top = `${containerRect.bottom - infoDivRect.height}px`;
            }
        }

        // 통계 정보 토글 함수
        function toggleStatistics() {
            const statsElement = document.getElementById('statistics');
            statsElement.classList.toggle('hidden');
        }

        // 맵 크기 표시 업데이트
        function updateMapSizeDisplay() {
            const mapSizeInput = document.getElementById('map-size');
            document.getElementById('map-size-value').textContent = mapSizeInput.value;
        }

        // 시뮬레이션 시작
        function startSimulation() {
            // 이전 애니메이션 중지
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
            }

            // 상태 초기화
            organisms = [];
            foods = [];
            highlightedDescendants = new Set();
            originalAncestors.clear();

            // 모달 초기화
            closeModal();

            // 먹이 생성 속도 초기화
            updateFoodGenerationRate();
            lastFoodGenerationTime = 0;

            // 유기체 정보 창과 조상 목록 모두 제거
            const infoContainer = document.getElementById('organism-info-container');
            infoContainer.innerHTML = '';
            const ancestorContainer = document.getElementById('ancestor-list-container');
            ancestorContainer.innerHTML = '';

            // 최초 조상 보기 버튼 텍스트 초기화
            document.getElementById('show-ancestors').textContent = '후손 강조 표시';

            // 사용자 입력 가져오기
            mapSize = parseInt(document.getElementById('map-size').value);
            foodCount = parseInt(document.getElementById('food-count').value);
            speciesCount = parseInt(document.getElementById('species-count').value);

            // 캔버스 크기 설정
            resizeCanvas();

            // 객체 초기화
            initializeObjects();

            // 초기 통계 정보 업데이트
            updateStatistics();

            // 애니메이션 시작
            animate();
        }


        // 객체 초기화
        function initializeObjects() {
            organisms = [];
            foods = [];

            // 유기체 생성
            for (let i = 0; i < speciesCount; i++) {
                organisms.push(createOrganism());
            }

            // 음식 생성
            for (let i = 0; i < foodCount; i++) {
                foods.push({
                    x: Math.random() * mapSize,
                    y: Math.random() * mapSize,
                    size: 5
                });
            }
        }

        // 유기체 생성 함수
        function createOrganism(parent = null) {
            organismIdCounter++;
            let newOrganism;
            if (parent) {
                // 부모로부터 유전자 상속
                newOrganism = {
                    id: organismIdCounter,
                    x: parent.x + (Math.random() - 0.5) * 20,
                    y: parent.y + (Math.random() - 0.5) * 20,
                    size: parent.size / 2,
                    speed: mutate(parent.speed),
                    angle: Math.random() * Math.PI * 2,
                    turnSpeed: 0.1,
                    velocity: { x: 0, y: 0 },
                    color: mutateColor(parent.color),
                    energy: 50,
                    diet: parent.diet,
                    senseRange: mutate(parent.senseRange),
                    age: 0,
                    splitSize: mutate(parent.splitSize),
                    splitCount: mutate(parent.splitCount),
                    parent: parent,
                    ancestors: [...(parent.ancestors || []), parent.id],
                    generation: (parent.generation || 0) + 1
                };
            } else {
                // 새로운 유기체 생성
                newOrganism = {
                    id: organismIdCounter,
                    x: Math.random() * mapSize,
                    y: Math.random() * mapSize,
                    size: 10 + Math.random() * 10,
                    speed: 1 + Math.random() * 2,
                    angle: Math.random() * Math.PI * 2,
                    turnSpeed: 0.1,
                    velocity: { x: 0, y: 0 },
                    color: getRandomColor(),
                    energy: 100,
                    diet: Math.random() < 0.5 ? 'herbivore' : 'carnivore',
                    senseRange: 50 + Math.random() * 50,
                    age: 0,
                    splitSize: 20 + Math.random() * 10,
                    splitCount: Math.floor(2 + Math.random() * 3),
                    parent: null,
                    ancestors: [],
                    generation: 0
                };
            }

            // 최초 조상인 경우 정보 저장
            if (!parent) {
                originalAncestors.set(newOrganism.id, { ...newOrganism });
            }

            return newOrganism;
        }

        // 유기체 제거 함수 추가
        function removeOrganism(org) {
            const index = organisms.findIndex(o => o.id === org.id);
            if (index > -1) {
                organisms.splice(index, 1);
            }
        }

        // 색상 돌연변이 함수
        function mutateColor(color) {
            const rgb = color.match(/\d+/g).map(Number);
            return `rgb(${rgb.map(v => Math.max(0, Math.min(255, v + Math.floor(Math.random() * 41 - 20)))).join(',')}`;
        }

        // 돌연변이 함수 수정
        function mutate(value) {
            return value * (0.9 + Math.random() * 0.2);
        }

        // 유기체 분화 함수
        function splitOrganism(org) {
            const childCount = Math.floor(org.splitCount);
            const childSize = org.size / childCount;
            const childEnergy = org.energy / childCount;

            for (let i = 0; i < childCount; i++) {
                const child = createOrganism(org);
                child.size = childSize;
                child.energy = childEnergy;
                organisms.push(child);
            }

            // 부모 유기체 제거
            const index = organisms.indexOf(org);
            if (index > -1) {
                organisms.splice(index, 1);
            }
        }

        // 색상 혼합 함수
        function blendColors(color1, color2) {
            const r1 = parseInt(color1.slice(4, color1.indexOf(',')));
            const g1 = parseInt(color1.slice(color1.indexOf(',') + 1, color1.lastIndexOf(',')));
            const b1 = parseInt(color1.slice(color1.lastIndexOf(',') + 1, -1));

            const r2 = parseInt(color2.slice(4, color2.indexOf(',')));
            const g2 = parseInt(color2.slice(color2.indexOf(',') + 1, color2.lastIndexOf(',')));
            const b2 = parseInt(color2.slice(color2.lastIndexOf(',') + 1, -1));

            const r = Math.floor((r1 + r2) / 2);
            const g = Math.floor((g1 + g2) / 2);
            const b = Math.floor((b1 + b2) / 2);

            return `rgb(${r},${g},${b})`;
        }

        // 랜덤 색상 생성
        function getRandomColor() {
            return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
        }

        // 유기체 이동
        function moveOrganism(org) {
            let targetX = org.x;
            let targetY = org.y;

            // 가장 가까운 먹이 찾기
            let closestFood = null;
            let closestDistance = Infinity;

            if (org.diet === 'herbivore') {
                foods.forEach(food => {
                    const dist = distance(org, food);
                    if (dist < closestDistance && dist < org.senseRange) {
                        closestFood = food;
                        closestDistance = dist;
                    }
                });
            } else {
                organisms.forEach(prey => {
                    if (prey !== org && prey.size < org.size * 0.8) {
                        const dist = distance(org, prey);
                        if (dist < closestDistance && dist < org.senseRange) {
                            closestFood = prey;
                            closestDistance = dist;
                        }
                    }
                });
            }

            // 먹이를 향해 이동 또는 랜덤 이동
            if (closestFood) {
                targetX = closestFood.x;
                targetY = closestFood.y;
            } else {
                // 먹이가 감지되지 않으면 현재 방향으로 계속 이동
                targetX = org.x + Math.cos(org.angle) * 100;
                targetY = org.y + Math.sin(org.angle) * 100;
            }

            // 목표 방향 계산
            const targetAngle = Math.atan2(targetY - org.y, targetX - org.x);

            // 현재 각도와 목표 각도의 차이 계산
            let angleDiff = targetAngle - org.angle;

            // 각도 차이를 -PI에서 PI 사이로 정규화
            angleDiff = (angleDiff + Math.PI * 3) % (Math.PI * 2) - Math.PI;

            // 부드러운 회전
            org.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), org.turnSpeed);

            // 속도 계산 및 적용
            const acceleration = 0.1;
            org.velocity.x += Math.cos(org.angle) * acceleration;
            org.velocity.y += Math.sin(org.angle) * acceleration;

            // 최대 속도 제한
            const maxSpeed = org.speed;
            const currentSpeed = Math.sqrt(org.velocity.x ** 2 + org.velocity.y ** 2);
            if (currentSpeed > maxSpeed) {
                org.velocity.x = (org.velocity.x / currentSpeed) * maxSpeed;
                org.velocity.y = (org.velocity.y / currentSpeed) * maxSpeed;
            }

            // 위치 업데이트
            org.x += org.velocity.x;
            org.y += org.velocity.y;

            // 경계 체크
            org.x = Math.max(0, Math.min(org.x, worldWidth));
            org.y = Math.max(0, Math.min(org.y, worldHeight));
        }

        // 먹이 먹기 (초식동물)
        function eatFood(org) {
            for (let i = foods.length - 1; i >= 0; i--) {
                const food = foods[i];
                if (distance(org, food) < org.size + food.size) {
                    org.energy += 10;
                    org.size += 0.1;
                    foods.splice(i, 1);
                    break; // 한 번에 하나의 먹이만 먹도록 함
                }
            }
        }

        // 사냥 (육식동물)
        function huntPrey(org, index) {
            for (let i = organisms.length - 1; i >= 0; i--) {
                if (i !== index) {
                    const prey = organisms[i];
                    if (prey.size < org.size * 0.8 && distance(org, prey) < org.size + prey.size) {
                        org.energy += prey.energy * 0.5;
                        org.size += prey.size * 0.1;
                        organisms.splice(i, 1);
                        break; // 한 번에 하나의 먹이만 먹도록 함
                    }
                }
            }
        }

        // 통계 정보 업데이트 함수
        function updateStatistics() {
            const totalOrganisms = organisms.length;
            const herbivores = organisms.filter(org => org.diet === 'herbivore');
            const carnivores = organisms.filter(org => org.diet === 'carnivore');

            const averageSize = organisms.reduce((sum, org) => sum + org.size, 0) / totalOrganisms || 0;
            const averageLifespan = organisms.reduce((sum, org) => sum + org.age, 0) / totalOrganisms || 0;
            const averageEnergy = organisms.reduce((sum, org) => sum + org.energy, 0) / totalOrganisms || 0;

            document.getElementById('total-organisms').textContent = totalOrganisms;
            document.getElementById('herbivore-count').textContent = herbivores.length;
            document.getElementById('carnivore-count').textContent = carnivores.length;
            document.getElementById('average-size').textContent = averageSize.toFixed(2);
            document.getElementById('average-lifespan').textContent = averageLifespan.toFixed(2);
            document.getElementById('average-energy').textContent = averageEnergy.toFixed(2);
            document.getElementById('total-food').textContent = foods.length;
        }

        // 캔버스 배경 그리기 함수
        function drawBackground() {
            const gridSize = 20;
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
            ctx.lineWidth = 0.5;

            for (let x = 0; x <= worldWidth; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, worldHeight);
                ctx.stroke();
            }

            for (let y = 0; y <= worldHeight; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(worldWidth, y);
                ctx.stroke();
            }
        }


        // 애니메이션 함수
        function animate(currentTime) {
            // 캔버스 전체 클리어
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            // 시뮬레이션 영역 배경 그리기
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, worldWidth, worldHeight);

            // 배경 그리기
            drawBackground();

            // 유기체 및 음식 그리기
            for (let i = organisms.length - 1; i >= 0; i--) {
                const org = organisms[i];

                moveOrganism(org);

                org.energy -= 0.1;
                org.age += 0.01;

                if (org.diet === 'herbivore') {
                    eatFood(org);
                } else {
                    huntPrey(org, i);
                }

                if (org.size >= org.splitSize) {
                    splitOrganism(org);
                    continue;
                }

                if (org.energy > 150) {
                    org.size += 0.1;
                    org.energy -= 10;
                }

                if (org.energy <= 0 || org.age > 100) {
                    removeOrganism(org);
                    continue;
                }

                drawOrganism(org);
            }

            if (currentTime - lastFoodGenerationTime > (100 - foodGenerationRate) * 10) {
                generateFood();
                lastFoodGenerationTime = currentTime;
            }

            drawFood();

            // 통계 정보 업데이트
            updateStatistics();

            // 표시된 유기체 정보 업데이트
            updateDisplayedOrganismInfo();

            // 다음 프레임 요청
            animationId = requestAnimationFrame(animate);
        }

        // 먹이 생성 함수
        function generateFood() {
            if (foods.length < foodCount) {
                foods.push(createFood());
            }
        }

        // 표시된 유기체 정보 업데이트 함수
        function updateDisplayedOrganismInfo() {
            const container = document.getElementById('organism-info-container');
            const infoDivs = container.getElementsByClassName('organism-info');

            for (let infoDiv of infoDivs) {
                const organismId = infoDiv.id.split('-')[2];
                const organism = organisms.find(org => org.id == organismId);

                if (organism) {
                    updateOrganismInfoContent(infoDiv.querySelector('.organism-info-content'), organism);
                } else {
                    infoDiv.remove();
                }
            }
        }

        // 최초의 조상 유기체들을 찾는 함수
        function findOriginalAncestors() {
            return organisms.filter(org => org.generation === 0);
        }

        // 선택된 조상의 모든 후손을 찾는 함수
        function findAllDescendants(ancestorId) {
            return organisms.filter(org => org.ancestors.includes(ancestorId));
        }

        // 후손들을 강조 표시하는 함수
        function highlightDescendants(ancestorId) {
            highlightedDescendants = new Set(findLivingDescendants(ancestorId).map(org => org.id));
        }


        // 유기체 그리기
        function drawOrganism(org) {
            ctx.save();
            ctx.translate(org.x, org.y);
            ctx.rotate(org.angle);

            // 강조 표시
            if (highlightedDescendants.has(org.id)) {
                ctx.shadowColor = 'yellow';
                ctx.shadowBlur = 10;
            }

            // 감지 범위 그리기
            if (showSenseRange) {
                ctx.beginPath();
                ctx.arc(0, 0, org.senseRange, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(200, 200, 200, 0.1)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
                ctx.stroke();
            }

            // 몸체
            ctx.beginPath();
            ctx.ellipse(0, 0, org.size, org.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = org.color;
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 눈
            ctx.beginPath();
            ctx.arc(org.size * 0.7, -org.size * 0.2, org.size * 0.1, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();

            // 식성 표시
            ctx.fillStyle = org.diet === 'herbivore' ? 'lightgreen' : 'pink';
            ctx.fillRect(-org.size * 0.5, -org.size - 5, org.size, 5);
            ctx.strokeRect(-org.size * 0.5, -org.size - 5, org.size, 5);

            ctx.restore();
        }

        // 조상 목록 표시 함수
        function showAncestorsList() {
            const container = document.getElementById('ancestor-list-container');
            container.innerHTML = ''; // 기존 내용 초기화
            originalAncestors.forEach((ancestor, id) => {
                const button = document.createElement('button');
                button.className = 'ancestor-button';
                button.textContent = `조상 ID: ${id}`;
                button.onclick = () => {
                    highlightDescendants(id);
                    displayOriginalAncestorInfo(id);
                    closeModal(); // 버튼 클릭 후 모달 닫기
                };
                container.appendChild(button);
            });
        }

        // 사라진 최초 조상 정보 표시 함수
        function displayOriginalAncestorInfo(ancestorId) {
            const ancestor = originalAncestors.get(ancestorId);
            if (!ancestor) return;

            displayOrganismInfo(ancestor);
        }

        // 생존 후손 찾기 함수
        function findLivingDescendants(ancestorId) {
            return organisms.filter(org => org.ancestors.includes(ancestorId));
        }

        // 번식
        function reproduce(parent) {
            const partner = organisms.find(org =>
                org !== parent &&
                org.diet === parent.diet &&
                distance(org, parent) < parent.senseRange &&
                org.energy > 100
            );

            if (partner) {
                const child = createOrganism(parent, partner);
                organisms.push(child);
                parent.energy -= 50;
                partner.energy -= 50;
            }
        }

        function drawFood() {
            foods.forEach(food => {
                ctx.beginPath();
                ctx.arc(food.x, food.y, food.size, 0, Math.PI * 2);
                ctx.fillStyle = 'green';
                ctx.fill();
            });
        }

        function createFood() {
            // 새로운 음식 생성
            return {
                x: Math.random() * worldWidth,
                y: Math.random() * worldHeight,
                size: 5
            }
        }

        // 두 점 사이의 거리 계산
        function distance(a, b) {
            return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
        }

        // 줌 인 함수
        function zoomIn() {
            canvasScale *= 1.2;
            offsetX = (canvas.width - worldWidth * canvasScale) / 2;
            offsetY = (canvas.height - worldHeight * canvasScale) / 2;
            ctx.setTransform(canvasScale, 0, 0, canvasScale, offsetX, offsetY);
        }

        // 줌 아웃 함수
        function zoomOut() {
            canvasScale /= 1.2;
            offsetX = (canvas.width - worldWidth * canvasScale) / 2;
            offsetY = (canvas.height - worldHeight * canvasScale) / 2;
            ctx.setTransform(canvasScale, 0, 0, canvasScale, offsetX, offsetY);
        }

        // 페이지 로드 시 초기화
        window.onload = init;
    }
)();