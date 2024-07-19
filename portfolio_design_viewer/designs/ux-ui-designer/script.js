(
    () => {
        // 프로젝트 데이터
        const projects = [
            {
                title: '모바일 뱅킹 앱 리디자인',
                description: '사용자 경험을 개선하여 고객 만족도 20% 향상',
                image: '../../images/design1.png',
                link: '#'
            },
            {
                title: '이커머스 웹사이트 UX/UI 설계',
                description: '전환율 15% 증가 및 사용자 체류 시간 30% 증가',
                image: '../../images/design2.png',
                link: '#'
            },
            {
                title: '헬스케어 모바일 앱 디자인',
                description: '직관적인 인터페이스로 사용자 참여도 25% 향상',
                image: '../../images/design3.png',
                link: '#'
            },
            {
                title: '여행 예약 플랫폼 UX 개선',
                description: '예약 프로세스 간소화로 완료율 35% 증가',
                image: '../../images/design4.png',
                link: '#'
            }
        ];

        // DOM이 로드된 후 실행
        document.addEventListener('DOMContentLoaded', () => {
            renderProjects();
            setupSmoothScroll();
            setupContactForm();
            addScrollAnimation();
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

        // 부드러운 스크롤 설정
        function setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
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

        // 스크롤 애니메이션 추가
        function addScrollAnimation() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                    }
                });
            });

            const hiddenElements = document.querySelectorAll('.process-step, .project-card');
            hiddenElements.forEach((el) => observer.observe(el));
        }

        // 페이지 로드 시 애니메이션
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }
)();