(
    () => {
        // Three.js 초기화
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // 큐브 조각 생성 함수
        function createCubelet() {
            const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
            const edgesGeometry = new THREE.EdgesGeometry(geometry);
            const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });

            const materials = [
                new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 빨강
                new THREE.MeshBasicMaterial({ color: 0xff8000 }), // 주황
                new THREE.MeshBasicMaterial({ color: 0xffff00 }), // 노랑
                new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 초록
                new THREE.MeshBasicMaterial({ color: 0x0000ff }), // 파랑
                new THREE.MeshBasicMaterial({ color: 0xffffff })  // 흰색
            ];

            const cubelet = new THREE.Mesh(geometry, materials);
            const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

            cubelet.add(edges);
            return cubelet;
        }

        // 3x3x3 루빅스 큐브 생성
        const rubiksCube = new THREE.Group();
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const cubelet = createCubelet();
                    cubelet.position.set(x, y, z);
                    rubiksCube.add(cubelet);
                }
            }
        }
        scene.add(rubiksCube);

        camera.position.z = 5;

        // 조명 추가
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 30);
        scene.add(directionalLight);

        // 렌더링 루프
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        // 키보드 이벤트 처리
        document.addEventListener('keydown', (event) => {
            const key = event.key.toUpperCase();
            const isShiftPressed = event.shiftKey;
            const rotationAngle = isShiftPressed ? -Math.PI / 2 : Math.PI / 2;

            switch (key) {
                case 'F': rotateFace('z', 1, rotationAngle); break;
                case 'B': rotateFace('z', -1, rotationAngle); break;
                case 'U': rotateFace('y', 1, rotationAngle); break;
                case 'D': rotateFace('y', -1, rotationAngle); break;
                case 'L': rotateFace('x', -1, rotationAngle); break;
                case 'R': rotateFace('x', 1, rotationAngle); break;
            }
        });

        // 면 회전 함수
        function rotateFace(axis, direction, angle) {
            rubiksCube.children.forEach(cubelet => {
                if (cubelet.position[axis] * direction > 0.5) {
                    rotateAroundWorldAxis(cubelet, new THREE.Vector3(
                        axis === 'x' ? 1 : 0,
                        axis === 'y' ? 1 : 0,
                        axis === 'z' ? 1 : 0
                    ), angle);
                }
            });
        }

        // 축을 중심으로 회전하는 함수
        function rotateAroundWorldAxis(object, axis, radians) {
            const rotWorldMatrix = new THREE.Matrix4();
            rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
            rotWorldMatrix.multiply(object.matrix);
            object.matrix = rotWorldMatrix;
            object.rotation.setFromRotationMatrix(object.matrix);
        }

        // 마우스 드래그로 큐브 회전
        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0
        };

        document.addEventListener('mousedown', (event) => {
            isDragging = true;
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                rubiksCube.rotation.y += deltaMove.x * 0.01;
                rubiksCube.rotation.x += deltaMove.y * 0.01;
            }

            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        });

        document.addEventListener('mouseup', (event) => {
            isDragging = false;
        });

        // 윈도우 리사이즈 대응
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
)();