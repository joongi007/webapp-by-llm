document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('nav a');
    const contactForm = document.getElementById('contact-form');

    // 메뉴 토글
    menuToggle.addEventListener('click', () => {
        nav.querySelector('ul').classList.toggle('show');
    });

    // 스크롤 시 내비게이션 스타일 변경
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.backgroundColor = '#fff';
            nav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        } else {
            nav.style.backgroundColor = 'transparent';
            nav.style.boxShadow = 'none';
        }
    });

    // 스무스 스크롤
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const navHeight = nav.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // 모바일 메뉴 닫기
            nav.querySelector('ul').classList.remove('show');
        });
    });

    // 연락처 폼 제출
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        console.log('Form submitted:', { name, email, message });
        // 여기에 실제 폼 제출 로직을 구현할 수 있습니다.
        alert('메시지가 성공적으로 전송되었습니다!');
        contactForm.reset();
    });

    // 프로젝트 카드 애니메이션
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
});