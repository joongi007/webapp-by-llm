(
    () => {
        // 프로젝트 데이터
        const projects = [
            {
                title: '고객 세그먼테이션 분석',
                description: 'K-means 클러스터링을 사용하여 고객 그룹을 식별하고 맞춤형 마케팅 전략 수립',
                image: '../../images/data1.png',
                link: '#'
            },
            {
                title: '주식 가격 예측 모델',
                description: 'LSTM 네트워크를 사용하여 주식 가격 동향을 예측하는 딥러닝 모델 개발',
                image: '../../images/data2.png',
                link: '#'
            },
            {
                title: '자연어 처리 챗봇',
                description: 'BERT 모델을 fine-tuning하여 고객 서비스 자동화를 위한 챗봇 구현',
                image: '../../images/data3.png',
                link: '#'
            },
            {
                title: '이미지 분류 시스템',
                description: 'CNN을 활용한 제품 불량 검출 자동화 시스템 개발',
                image: '../../images/data4.png',
                link: '#'
            }
        ];

        // 스킬 데이터
        const skills = {
            'programming-languages': ['Python', 'R', 'SQL', 'Java', 'JavaScript'],
            'ml-dl-frameworks': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras'],
            'databases': ['MySQL', 'PostgreSQL', 'MongoDB', 'Cassandra'],
            'data-visualization': ['Matplotlib', 'Seaborn', 'D3.js', 'Tableau']
        };

        // 스킬 차트 데이터
        const skillChartData = {
            labels: ['데이터 분석', '머신러닝', '딥러닝', '데이터 시각화', '빅데이터 처리', '통계학'],
            datasets: [{
                label: '스킬 레벨',
                data: [95, 90, 85, 80, 75, 85],
                backgroundColor: 'rgba(74, 144, 226, 0.5)',
                borderColor: 'rgba(74, 144, 226, 1)',
                borderWidth: 1
            }]
        };

        // DOM이 로드된 후 실행
        document.addEventListener('DOMContentLoaded', () => {
            renderProjects();
            renderSkills();
            createSkillChart();
            setupContactForm();
        });

        // 프로젝트 렌더링
        function renderProjects() {
            const projectsContainer = document.getElementById('projects-container');
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.link}" class="project-link">자세히 보기</a>
            </div>
        `;
                projectsContainer.appendChild(projectCard);
            });
        }

        // 스킬 렌더링
        function renderSkills() {
            for (const [category, skillList] of Object.entries(skills)) {
                const skillContainer = document.getElementById(category);
                skillList.forEach(skill => {
                    const li = document.createElement('li');
                    li.textContent = skill;
                    skillContainer.appendChild(li);
                });
            }
        }

        // 스킬 차트 생성
        function createSkillChart() {
            const ctx = document.getElementById('skillChart').getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: skillChartData,
                options: {
                    scales: {
                        r: {
                            angleLines: {
                                display: false
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }
                }
            });
        }

        // 연락처 폼 설정
        function setupContactForm() {
            const contactForm = document.getElementById('contact-form');
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // 여기에 폼 제출 로직 구현 (예: API 호출)
                alert('메시지가 전송되었습니다. 감사합니다!');
                contactForm.reset();
            });
        }

        // 스크롤 애니메이션
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (sectionTop < windowHeight * 0.75) {
                    section.classList.add('active');
                }
            });
        });
    }
)();