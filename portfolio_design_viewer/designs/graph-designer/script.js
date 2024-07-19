(
    () => {
        // 포트폴리오 데이터
        const portfolioItems = [
            { title: '브랜드 아이덴티티', description: '로컬 카페 브랜딩', image: '../../images/project6.png' },
            { title: '웹사이트 디자인', description: '테크 스타트업 웹사이트', image: '../../images/project7.png' },
            { title: '패키지 디자인', description: '유기농 제품 패키지', image: '../../images/project8.png' },
            { title: '일러스트레이션', description: '어린이 도서 삽화', image: '../../images/project9.png' },
            { title: '포스터 디자인', description: '음악 페스티벌 포스터', image: '../../images/project10.png' },
            { title: 'UI/UX 디자인', description: '모바일 앱 인터페이스', image: '../../images/project2.png' },
        ];

        // 스킬 데이터
        const skills = ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Sketch', 'UI/UX Design', 'Typography', 'Color Theory'];

        // DOM이 로드된 후 실행
        document.addEventListener('DOMContentLoaded', () => {
            renderPortfolio();
            renderSkills();
            setupSmoothScroll();
            setupContactForm();
        });

        // 포트폴리오 아이템 렌더링
        function renderPortfolio() {
            const portfolioContainer = document.getElementById('portfolio-items');
            portfolioItems.forEach(item => {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-item-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
                portfolioContainer.appendChild(portfolioItem);
            });
        }

        // 스킬 렌더링
        function renderSkills() {
            const skillsContainer = document.getElementById('skills-list');
            skills.forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                skillItem.textContent = skill;
                skillsContainer.appendChild(skillItem);
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