(
    () => {
        let ecosystem;

        function setup() {
            const canvas = createCanvas(windowWidth, windowHeight);
            canvas.parent('ecosystem');
            ecosystem = new Ecosystem();
        }

        function draw() {
            clear();
            ecosystem.update();
            ecosystem.display();
        }

        class Ecosystem {
            constructor() {
                this.plants = [];
                this.animals = [];
                this.temperature = 20;
                this.precipitation = 50;
                this.initializePlants(50);
                this.initializeAnimals(20);
            }

            initializePlants(num) {
                for (let i = 0; i < num; i++) {
                    this.plants.push(new Plant(random(width), random(height)));
                }
            }

            initializeAnimals(num) {
                for (let i = 0; i < num; i++) {
                    this.animals.push(new Animal(random(width), random(height)));
                }
            }

            update() {
                this.updateEnvironment();
                this.plants = this.plants.filter(plant => plant.isAlive);
                this.animals = this.animals.filter(animal => animal.isAlive);

                for (let plant of this.plants) {
                    plant.grow(this.temperature, this.precipitation);
                }

                for (let animal of this.animals) {
                    animal.move();
                    animal.eat(this.plants);
                    animal.reproduce(this.animals);
                }

                if (random(1) < 0.05) this.plants.push(new Plant(random(width), random(height)));
            }

            updateEnvironment() {
                this.temperature = document.getElementById('temperature').value;
                this.precipitation = document.getElementById('precipitation').value;
                this.updateEcoStats();
            }

            display() {
                for (let plant of this.plants) {
                    plant.display();
                }
                for (let animal of this.animals) {
                    animal.display();
                }
            }

            updateEcoStats() {
                document.getElementById('eco-stats').innerHTML = `
            <p>식물 수: ${this.plants.length}</p>
            <p>동물 수: ${this.animals.length}</p>
            <p>온도: ${this.temperature}°C</p>
            <p>강수량: ${this.precipitation}mm</p>
        `;
            }
        }

        class Plant {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = random(5, 20);
                this.growthRate = random(0.1, 0.3);
                this.isAlive = true;
            }

            grow(temperature, precipitation) {
                if (temperature > 30 || temperature < 5 || precipitation < 20) {
                    this.size -= 0.1;
                } else {
                    this.size += this.growthRate;
                }
                if (this.size <= 0) this.isAlive = false;
            }

            display() {
                fill(0, 255, 0, 150);
                ellipse(this.x, this.y, this.size);
            }
        }

        class Animal {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = random(10, 30);
                this.speed = random(1, 3);
                this.isAlive = true;
            }

            move() {
                this.x += random(-this.speed, this.speed);
                this.y += random(-this.speed, this.speed);
                this.x = constrain(this.x, 0, width);
                this.y = constrain(this.y, 0, height);
            }

            eat(plants) {
                for (let plant of plants) {
                    if (dist(this.x, this.y, plant.x, plant.y) < this.size / 2 + plant.size / 2) {
                        plant.size -= 1;
                        this.size += 0.5;
                        if (plant.size <= 0) plant.isAlive = false;
                        break;
                    }
                }
            }

            reproduce(animals) {
                if (this.size > 40 && random(1) < 0.001) {
                    animals.push(new Animal(this.x, this.y));
                    this.size *= 0.7;
                }
            }

            display() {
                fill(255, 0, 0, 150);
                ellipse(this.x, this.y, this.size);
            }
        }

        // 연구 주제 데이터
        const researchTopics = [
            { name: "생물 다양성 보존", data: [10, 15, 8, 12, 20] },
            { name: "기후 변화 영향", data: [5, 8, 12, 15, 18] },
            { name: "생태계 복원", data: [3, 6, 9, 12, 15] },
            { name: "환경 오염 저감", data: [7, 10, 13, 16, 19] }
        ];

        // 프로젝트 데이터
        const projects = [
            { title: "도시 생태계 복원 프로젝트", description: "도심 속 생태 공간 조성을 통한 생물다양성 증진" },
            { title: "해양 플라스틱 저감 연구", description: "미세 플라스틱이 해양 생태계에 미치는 영향 분석 및 저감 방안 도출" },
            { title: "기후변화 적응형 농업 시스템 개발", description: "기후변화에 대응하는 지속가능한 농업 방식 연구" },
            { title: "멸종위기종 보호 프로그램", description: "국내 멸종위기종의 서식지 보전 및 개체 수 회복을 위한 통합적 접근" }
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
            const visualization = document.getElementById('eco-data-viz');
            visualization.innerHTML = ''; // Clear previous visualization
            // Here you would typically use a chart library to visualize the data
            // For simplicity, we'll just display the data as text
            const dataDisplay = document.createElement('p');
            dataDisplay.textContent = `${topic.name} 데이터: ${topic.data.join(', ')}`;
            visualization.appendChild(dataDisplay);
        }

        function renderProjects() {
            const container = document.getElementById('project-list');
            projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project-item';
                projectElement.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        `;
                container.appendChild(projectElement);
            });
        }

        function setupNavigation() {
            const navItems = document.querySelectorAll('.nav-item');
            const sections = document.querySelectorAll('.eco-section');

            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    const targetSection = item.getAttribute('data-section');
                    sections.forEach(section => {
                        section.style.display = 'none';
                        if (section.id === targetSection) {
                            section.style.display = 'block';
                        }
                    });
                });
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderResearchTopics();
            renderProjects();
            setupNavigation();

            // 연락처 폼 설정
            const contactForm = document.getElementById('contact-form');
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('메시지가 전송되었습니다. 감사합니다!');
                contactForm.reset();
            });
        });

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
        }
    }
)();