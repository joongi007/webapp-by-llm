document.addEventListener('DOMContentLoaded', () => {
    // Matter.js 모듈 설정
    const { Engine, Render, Runner, Bodies, Composite, Body, Vector, Vertices, Events, Constraint } = Matter;

    // 캔버스 크기 설정
    const canvas = document.getElementById('canvas');
    const container = document.querySelector('.canvas-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Matter.js 엔진 생성
    const engine = Engine.create();
    engine.gravity.y = 0.5; // 기본 중력 설정

    // 렌더러 설정
    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: containerWidth,
            height: containerHeight,
            wireframes: false,
            background: '#f8fafc',
            showAngleIndicator: false
        }
    });

    // 실행기 설정
    const runner = Runner.create();

    // UI 요소 참조
    const rotationDirectionSelect = document.getElementById('rotation-direction');
    const rotationSpeedInput = document.getElementById('rotation-speed');
    const rotationSpeedValue = document.getElementById('rotation-speed-value');
    const ballCountInput = document.getElementById('ball-count');
    const ballCountValue = document.getElementById('ball-count-value');
    const gravityScaleInput = document.getElementById('gravity-scale');
    const gravityScaleValue = document.getElementById('gravity-scale-value');
    const obstacleCountInput = document.getElementById('obstacle-count');
    const obstacleCountValue = document.getElementById('obstacle-count-value');
    const bouncinessInput = document.getElementById('bounciness');
    const bouncinessValue = document.getElementById('bounciness-value');
    const resetBtn = document.getElementById('reset-btn');

    // 설정값 업데이트 함수
    const updateRotationSpeed = () => {
        rotationSpeedValue.textContent = rotationSpeedInput.value;
    };

    const updateBallCount = () => {
        ballCountValue.textContent = ballCountInput.value;
    };

    const updateGravityScale = () => {
        gravityScaleValue.textContent = gravityScaleInput.value;
    };

    const updateObstacleCount = () => {
        obstacleCountValue.textContent = obstacleCountInput.value;
    };

    const updateBounciness = () => {
        bouncinessValue.textContent = bouncinessInput.value;
    };

    // 이벤트 리스너 설정
    rotationSpeedInput.addEventListener('input', updateRotationSpeed);
    ballCountInput.addEventListener('input', updateBallCount);
    gravityScaleInput.addEventListener('input', updateGravityScale);
    obstacleCountInput.addEventListener('input', updateObstacleCount);
    bouncinessInput.addEventListener('input', updateBounciness);

    // 기본값 표시
    updateRotationSpeed();
    updateBallCount();
    updateGravityScale();
    updateObstacleCount();
    updateBounciness();

    // 물리 객체를 저장하는 변수
    let walls = [], balls = [], obstacles = [], centerPoint;

    // 육각형 생성 함수 (내부 영역 생성 및 벽 생성)
    const createHexagon = () => {
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const radius = Math.min(containerWidth, containerHeight) * 0.35;

        // 육각형 꼭지점 계산
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            vertices.push(
                Vector.create(
                    centerX + radius * Math.cos(angle),
                    centerY + radius * Math.sin(angle)
                )
            );
        }

        // 육각형 벽 생성 (각 변을 별도의 벽으로)
        const walls = [];
        for (let i = 0; i < 6; i++) {
            const v1 = vertices[i];
            const v2 = vertices[(i + 1) % 6];

            const wall = Bodies.rectangle(
                (v1.x + v2.x) / 2,
                (v1.y + v2.y) / 2,
                Vector.magnitude(Vector.sub(v2, v1)),
                10,
                {
                    isStatic: true,
                    angle: Math.atan2(v2.y - v1.y, v2.x - v1.x),
                    render: {
                        fillStyle: '#3182ce',
                        lineWidth: 0
                    },
                    chamfer: { radius: 5 },
                    friction: 0.05,  // 마찰 감소
                    frictionStatic: 0.1  // 정적 마찰 감소
                }
            );

            walls.push(wall);
        }

        // 가운데 고정점 생성 (충돌 비활성화)
        centerPoint = Bodies.circle(centerX, centerY, 5, {
            isStatic: true,
            render: { visible: false },
            collisionFilter: {
                group: 0,
                category: 0x0002,
                mask: 0 // 모든 충돌 비활성화
            }
        });

        return { walls, centerPoint, vertices };
    };

    // 공 생성 함수
    const createBalls = (count) => {
        const balls = [];
        const radius = 15;
        const hexRadius = Math.min(containerWidth, containerHeight) * 0.3;

        for (let i = 0; i < count; i++) {
            // 육각형 내부에 랜덤 위치 생성
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * hexRadius * 0.7;

            const x = containerWidth / 2 + distance * Math.cos(angle);
            const y = containerHeight / 2 + distance * Math.sin(angle);

            // 랜덤 색상 생성
            const hue = Math.floor(Math.random() * 360);

            const ball = Bodies.circle(x, y, radius, {
                restitution: parseFloat(bouncinessInput.value),
                friction: 0.02,       // 낮은 마찰
                frictionAir: 0.002,   // 공기 저항 약간 증가
                density: 0.01,        // 공 밀도 조정
                collisionFilter: {
                    group: 0,
                    category: 0x0001,
                    mask: 0x0001      // 중앙 포인트와 충돌하지 않도록
                },
                render: {
                    fillStyle: `hsl(${hue}, 70%, 60%)`,
                    strokeStyle: '#fff',
                    lineWidth: 2
                }
            });

            balls.push(ball);
        }

        return balls;
    };

    // 장애물 생성 함수 (육각형 테두리에 붙임)
    const createObstacles = (count, hexagonVertices) => {
        const obstacles = [];
        const obstacleSize = 20;  // 삼각형의 크기

        // 균등하게 분배될 수 있는 각도
        const angleStep = Math.PI * 2 / 6;
        const availablePositions = [];

        for (let i = 0; i < 6; i++) {
            availablePositions.push(i);
        }

        // 랜덤하게 위치 선택
        const selectedPositions = [];
        for (let i = 0; i < Math.min(count, 6); i++) {
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            selectedPositions.push(availablePositions.splice(randomIndex, 1)[0]);
        }

        for (const posIndex of selectedPositions) {
            // 육각형 벽의 각도 계산
            const v1 = hexagonVertices[posIndex];
            const v2 = hexagonVertices[(posIndex + 1) % 6];
            const wallAngle = Math.atan2(v2.y - v1.y, v2.x - v1.x);

            // 벽 중앙점
            const midX = (v1.x + v2.x) / 2;
            const midY = (v1.y + v2.y) / 2;

            // 벽의 안쪽 방향 벡터
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;
            const toCenter = Vector.normalise(
                Vector.sub({ x: centerX, y: centerY }, { x: midX, y: midY })
            );

            // 장애물을 육각형 벽에서 약간 안쪽으로 이동
            const offset = 12;
            const obstacleX = midX + toCenter.x * offset;
            const obstacleY = midY + toCenter.y * offset;

            // ** 수정된 각도 계산 - 30도(π/6) 조정 **
            const obstacle = Bodies.polygon(obstacleX, obstacleY, 3, obstacleSize, {
                isStatic: true,
                angle: wallAngle + Math.PI - Math.PI/6,
                restitution: 0.8,     // 탄성 증가
                friction: 0.01,       // 마찰 대폭 감소
                frictionStatic: 0.01, // 정적 마찰 대폭 감소
                chamfer: { radius: 2 },
                render: {
                    fillStyle: '#ed8936',
                    strokeStyle: '#dd6b20',
                    lineWidth: 1
                }
            });

            obstacles.push(obstacle);
        }

        return obstacles;
    };

    // 시뮬레이션 초기화 함수
    const initSimulation = () => {
        // 기존 객체 제거
        Composite.clear(engine.world);

        // 새 객체 생성
        const hexagonParts = createHexagon();
        walls = hexagonParts.walls;
        balls = createBalls(parseInt(ballCountInput.value));
        obstacles = createObstacles(parseInt(obstacleCountInput.value), hexagonParts.vertices);

        // 월드에 추가
        Composite.add(engine.world, [
            ...walls,
            centerPoint,
            ...balls,
            ...obstacles
        ]);

        // 중력 초기화
        engine.gravity.x = 0;
        engine.gravity.y = parseFloat(gravityScaleInput.value) * 100;
    };

    // 초기 시뮬레이션 설정
    initSimulation();

    // 육각형 회전 및 중력 효과 적용
    Events.on(engine, 'beforeUpdate', () => {
        const rotationDirection = rotationDirectionSelect.value;
        const rotationSpeed = parseFloat(rotationSpeedInput.value);
        const gravityScale = parseFloat(gravityScaleInput.value);

        // 벽 회전 (중력 방향은 바꾸지 않음)
        if (rotationDirection !== 'none' && walls.length > 0) {
            const direction = rotationDirection === 'clockwise' ? 1 : -1;

            // 각 벽을 개별적으로 회전 (중심점 기준)
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;

            for (const wall of walls) {
                // 현재 위치를 중심점에 상대적인 벡터로 변환
                const relativePos = Vector.sub(wall.position, { x: centerX, y: centerY });

                // 회전 각도 계산
                const rotationAmount = direction * rotationSpeed;

                // 벡터 회전
                const rotatedPos = Vector.rotate(relativePos, rotationAmount);

                // 새 위치 계산
                const newPos = Vector.add({ x: centerX, y: centerY }, rotatedPos);

                // 물체 위치 및 각도 업데이트
                Body.setPosition(wall, newPos);
                Body.setAngle(wall, wall.angle + rotationAmount);
            }

            // 장애물도 함께 회전
            for (const obstacle of obstacles) {
                // 현재 위치를 중심점에 상대적인 벡터로 변환
                const relativePos = Vector.sub(obstacle.position, { x: centerX, y: centerY });

                // 회전 각도 계산
                const rotationAmount = direction * rotationSpeed;

                // 벡터 회전
                const rotatedPos = Vector.rotate(relativePos, rotationAmount);

                // 새 위치 계산
                const newPos = Vector.add({ x: centerX, y: centerY }, rotatedPos);

                // 물체 위치 및 각도 업데이트
                Body.setPosition(obstacle, newPos);
                Body.setAngle(obstacle, obstacle.angle + rotationAmount);
            }
        }

        // 공이 화면 바깥으로 너무 멀리 나가면 재배치
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            const distance = Vector.magnitude(
                Vector.sub(
                    { x: ball.position.x, y: ball.position.y },
                    { x: containerWidth / 2, y: containerHeight / 2 }
                )
            );

            // 중앙에서 너무 멀어지면 재배치
            if (distance > Math.min(containerWidth, containerHeight) * 0.7) {
                const angle = Math.random() * Math.PI * 2;
                const newDistance = Math.random() * Math.min(containerWidth, containerHeight) * 0.2;

                Body.setPosition(ball, {
                    x: containerWidth / 2 + newDistance * Math.cos(angle),
                    y: containerHeight / 2 + newDistance * Math.sin(angle)
                });

                Body.setVelocity(ball, { x: 0, y: 0 });
            }
        }
    });

    // 재설정 버튼 이벤트
    resetBtn.addEventListener('click', initSimulation);

    // 중력 변경 이벤트
    gravityScaleInput.addEventListener('input', () => {
        const gravityScale = parseFloat(gravityScaleInput.value);
        engine.gravity.y = gravityScale * 100;
    });

    // 창 크기 변경 시 캔버스 크기 조정
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        render.options.width = newWidth;
        render.options.height = newHeight;
        Render.setPixelRatio(render, window.devicePixelRatio);

        // 육각형 위치 재조정 필요
        initSimulation();
    });

    // 렌더러 및 실행기 시작
    Render.run(render);
    Runner.run(runner, engine);
});