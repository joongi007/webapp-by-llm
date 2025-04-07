document.addEventListener('DOMContentLoaded', () => {
  // 기본 정보 렌더링
  const renderBasicInfo = () => {
      document.getElementById('name').textContent = coverLetterData.name;
      document.getElementById('title').textContent = coverLetterData.title;
      document.getElementById('aboutContent').textContent = coverLetterData.about;
      document.getElementById('contactInfo').textContent = coverLetterData.contact;
      document.getElementById('currentYear').textContent = new Date().getFullYear();
  };

  // 자기소개서 섹션 렌더링
  const renderCoverLetterSections = () => {
      const sectionsContainer = document.getElementById('coverLetterSections');
      
      coverLetterData.sections.forEach((section, index) => {
          // 새로운 섹션 요소 생성
          const sectionElement = document.createElement('section');
          sectionElement.className = 'cover-letter-item';
          sectionElement.style.animationDelay = `${index * 0.2}s`;
          
          // 섹션 제목 생성
          const title = document.createElement('h3');
          title.textContent = section.title;
          
          // 섹션 내용 생성
          const content = document.createElement('p');
          content.textContent = section.content;
          
          // 섹션에 제목과 내용 추가
          sectionElement.appendChild(title);
          sectionElement.appendChild(content);
          
          // 컨테이너에 섹션 추가
          sectionsContainer.appendChild(sectionElement);
      });
  };

  // 페이지 로드 시 애니메이션 효과
  const addLoadAnimations = () => {
      const sections = document.querySelectorAll('.section');
      sections.forEach((section, index) => {
          section.style.opacity = '0';
          section.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
              section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              section.style.opacity = '1';
              section.style.transform = 'translateY(0)';
          }, 100 * index);
      });
  };

  // 스크롤 시 섹션 애니메이션
  const handleScrollAnimations = () => {
      const sections = document.querySelectorAll('.section');
      
      const fadeInSection = () => {
          sections.forEach(section => {
              const sectionTop = section.getBoundingClientRect().top;
              const sectionBottom = section.getBoundingClientRect().bottom;
              const windowHeight = window.innerHeight;
              
              if (sectionTop < windowHeight - 100 && sectionBottom > 0) {
                  section.classList.add('visible');
              }
          });
      };
      
      // 초기 체크
      fadeInSection();
      
      // 스크롤 이벤트 리스너
      window.addEventListener('scroll', fadeInSection);
  };

  // 초기화 함수
  const init = () => {
      renderBasicInfo();
      renderCoverLetterSections();
      addLoadAnimations();
      handleScrollAnimations();
  };

  // 실행
  init();
});