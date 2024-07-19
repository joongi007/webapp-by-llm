(
    () => {
        // 기술 스택 데이터
        const skills = ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git'];

        // 프로젝트 데이터
        const projects = [
            {
                title: '반응형 웹사이트',
                description: '최신 웹 기술을 활용한 반응형 웹사이트 개발',
                image: '../../images/project1.png',
                link: '#'
            },
            {
                title: '온라인 쇼핑몰',
                description: 'React와 Node.js를 이용한 풀스택 이커머스 플랫폼',
                image: '../../images/project4.png',
                link: '#'
            },
            {
                title: '포트폴리오 웹사이트',
                description: '바닐라 자바스크립트로 구현한 개인 포트폴리오 사이트',
                image: '../../images/project5.png',
                link: '#'
            }
        ];

        // 경력 및 교육 데이터
        const experiences = [
            {
                title: '시니어 웹 개발자',
                company: 'ABC 테크',
                period: '2020 - 현재',
                description: '대규모 웹 애플리케이션 개발 및 유지보수'
            },
            {
                title: '주니어 프론트엔드 개발자',
                company: 'XYZ 솔루션즈',
                period: '2018 - 2020',
                description: '사용자 인터페이스 개발 및 최적화'
            },
            {
                title: '컴퓨터 공학 학사',
                company: '한국대학교',
                period: '2014 - 2018',
                description: '웹 개발 및 소프트웨어 엔지니어링 전공'
            }
        ];

        // DOM이 로드된 후 실행
        document.addEventListener('DOMContentLoaded', () => {
            renderSkills();
            renderProjects();
            renderExperiences();
            setupContactForm();
        });

        // 기술 스택 렌더링
        function renderSkills() {
            const skillsList = document.getElementById('skills-list');
            skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                skillsList.appendChild(li);
            });
        }

        // 프로젝트 렌더링
        function renderProjects() {
            const projectsContainer = document.getElementById('projects-container');
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.link}" target="_blank">자세히 보기</a>
            </div>
        `;
                projectsContainer.appendChild(projectCard);
            });
        }

        // 경력 및 교육 렌더링
        function renderExperiences() {
            const experienceContainer = document.getElementById('experience-container');
            experiences.forEach(exp => {
                const expItem = document.createElement('div');
                expItem.className = 'experience-item';
                expItem.innerHTML = `
            <h3>${exp.title}</h3>
            <p>${exp.company} | ${exp.period}</p>
            <p>${exp.description}</p>
        `;
                experienceContainer.appendChild(expItem);
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
    }
)();