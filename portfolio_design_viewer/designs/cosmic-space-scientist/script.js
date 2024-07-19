(
    () => {
        // Three.js를 사용한 3D 우주 맵 생성
        let scene, camera, renderer;
        let stars = [];

        function initStarMap() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('star-map').appendChild(renderer.domElement);

            for (let i = 0; i < 1000; i++) {
                const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const star = new THREE.Mesh(geometry, material);
                star.position.set(
                    Math.random() * 600 - 300,
                    Math.random() * 600 - 300,
                    Math.random() * 600 - 300
                );
                scene.add(star);
                stars.push(star);
            }

            camera.position.z = 5;
            animate();
        }

        function animate() {
            requestAnimationFrame(animate);
            stars.forEach(star => {
                star.rotation.x += 0.01;
                star.rotation.y += 0.01;
            });
            renderer.render(scene, camera);
        }

        // 연구 주제 데이터
        const researchTopics = [
            { name: "외계행성 탐사", data: [10, 15, 8, 12, 20] },
            { name: "블랙홀 연구", data: [5, 8, 12, 15, 18] },
            { name: "암흑물질 탐지", data: [3, 6, 9, 12, 15] },
            { name: "우주 팽창 이론", data: [7, 10, 13, 16, 19] }
        ];

        // 출판 데이터
        const publications = [
            { title: "새로운 외계행성 발견에 관한 연구", journal: "Nature Astronomy", year: 2023 },
            { title: "블랙홀 주변의 시공간 왜곡 분석", journal: "Astrophysical Journal", year: 2022 },
            { title: "암흑물질의 분포와 은하 형성의 관계", journal: "Monthly Notices of the Royal Astronomical Society", year: 2021 },
            { title: "우주 팽창 속도의 새로운 측정 방법", journal: "Physical Review Letters", year: 2020 }
        ];

        function renderResearchTopics() {
            const container = document.getElementById('research-topics');
            researchTopics.forEach(topic => {
                const topicElement = document.createElement('div');
                topicElement.className = 'research-item';
                topicElement.textContent = topic.name;
                topicElement.addEventListener('click', () => visualizeResearchData(topic));
                container.appendChild(topicElement);
            });
        }

        function visualizeResearchData(topic) {
            const visualization = document.getElementById('research-visualization');
            visualization.innerHTML = ''; // Clear previous visualization
            // Here you would typically use a chart library to visualize the data
            // For simplicity, we'll just display the data as text
            const dataDisplay = document.createElement('p');
            dataDisplay.textContent = `${topic.name} 데이터: ${topic.data.join(', ')}`;
            visualization.appendChild(dataDisplay);
        }

        function renderPublications() {
            const container = document.getElementById('publication-list');
            publications.forEach(pub => {
                const pubElement = document.createElement('div');
                pubElement.className = 'publication-item';
                pubElement.innerHTML = `
            <h3>${pub.title}</h3>
            <p>${pub.journal}, ${pub.year}</p>
        `;
                container.appendChild(pubElement);
            });
        }

        function setupNavigation() {
            const navItems = document.querySelectorAll('.nav-item');
            const sections = document.querySelectorAll('section');

            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    const targetSection = item.getAttribute('data-section');
                    sections.forEach(section => {
                        section.classList.remove('active');
                        if (section.id === targetSection) {
                            section.classList.add('active');
                        }
                    });
                });
            });
        }

        function updateDataOverlay() {
            const overlay = document.getElementById('data-overlay');
            const date = new Date();
            overlay.innerHTML = `
        <p>현재 시간: ${date.toLocaleTimeString()}</p>
        <p>관측 중인 천체: NGC 1234</p>
        <p>망원경 상태: 정상</p>
    `;
        }

        document.addEventListener('DOMContentLoaded', () => {
            initStarMap();
            renderResearchTopics();
            renderPublications();
            setupNavigation();
            setInterval(updateDataOverlay, 1000);

            // 연락처 폼 설정
            const contactForm = document.getElementById('contact-form');
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('메시지가 전송되었습니다. 감사합니다!');
                contactForm.reset();
            });
        });

        // 마우스 움직임에 따른 별 반응
        document.addEventListener('mousemove', (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            camera.position.x += mouseX * 0.1;
            camera.position.y += mouseY * 0.1;
        });

        // 창 크기 변경에 대응
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 배경에 2D 별 효과 추가
        function createStarryBackground() {
            const universe = document.getElementById('universe');
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.width = `${Math.random() * 3}px`;
                star.style.height = star.style.width;
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animationDuration = `${Math.random() * 3 + 1}s`;
                star.style.animationDelay = `${Math.random() * 3}s`;
                universe.appendChild(star);
            }
        }

        createStarryBackground();
    }
)();