// 이력서 데이터
// 이 객체를 수정하여 이력서 내용을 변경할 수 있습니다.
const resumeData = {
  // 순서 설정 - 표시할 섹션의 순서를 지정합니다. 원하지 않는 섹션은 제거하면 됩니다.
  sectionOrder: [
    'personalInfo',     // 인적사항
    'introduction',     // 소개
    'skills',           // 기술 키워드
    'experience',       // 경력
    'projectDetails',   // 경력기술서
    'projects',         // 프로젝트
    'education',        // 학력
    'certificates',     // 자격증
    'portfolio',        // 포트폴리오
    'articles'          // 기사 목록
  ],

  // 인적사항
  personalInfo: {
    name: '홍길동',
    gender: '남',        // 옵션: 남, 여
    birthYear: 1990,    // 출생 연도 - 자동으로 나이 계산
    photo: '../../images/profile.png', // 증명사진 URL
    email: 'example@example.com',
    blog: 'https://blog.example.com',
    github: 'https://github.com/username',
    // 추가 링크들
    links: [
      { name: '링크드인', url: 'https://linkedin.com/in/username', icon: 'fab fa-linkedin' },
      { name: '포트폴리오', url: 'https://portfolio.example.com', icon: 'fas fa-briefcase' }
      // 필요한 만큼 추가 가능
    ],
    // 마지막 갱신일 (YYYY-MM-DD 형식)
    lastUpdated: '2025-04-02'
  },

  // 소개
  introduction: {
    text: `안녕하세요, 저는 웹 개발자 홍길동입니다. 프론트엔드와 백엔드 개발 경험이 있으며, 사용자 경험을 중요시하는 개발을 지향합니다. 새로운 기술을 배우는 것을 좋아하며, 팀원들과의 협업을 통해 더 나은 결과물을 만들어내는 것에 보람을 느낍니다.`
  },

  // 기술 키워드
  skills: {
    categories: [
      {
        name: '프로그래밍 언어',
        items: [
          { name: 'JavaScript', icon: 'fab fa-js' },
          { name: 'TypeScript', icon: 'fas fa-code' },
          { name: 'Python', icon: 'fab fa-python' },
          { name: 'Java', icon: 'fab fa-java' }
        ]
      },
      {
        name: '프레임워크',
        items: [
          { name: 'React', icon: 'fab fa-react' },
          { name: 'Vue.js', icon: 'fab fa-vuejs' },
          { name: 'Express', icon: 'fas fa-server' },
          { name: 'Spring Boot', icon: 'fas fa-leaf' }
        ]
      },
      {
        name: '도구 및 기타',
        items: [
          { name: 'Git', icon: 'fab fa-git-alt' },
          { name: 'Docker', icon: 'fab fa-docker' },
          { name: 'AWS', icon: 'fab fa-aws' },
          { name: 'Figma', icon: 'fab fa-figma' }
        ]
      }
    ]
  },

  // 경력
  experience: [
    {
      company: 'ABC 테크놀로지',
      period: { start: '2023.03', end: '현재' }, // end가 '현재'이면 현재 재직중으로 표시
      isCurrent: true, // 현재 재직 여부
      responsibilities: [
        {
          // 기간별 담당업무가 없는 경우 title과 details만 입력
          title: '웹 애플리케이션 개발',
          details: 'React와 Node.js를 활용한 웹 애플리케이션 개발 및 유지보수'
        },
        {
          // 기간별 담당업무가 있는 경우 period 추가
          period: { start: '2023.08', end: '현재' },
          title: '팀 리드 개발자',
          details: '5명으로 구성된 프론트엔드 개발팀의 리드 역할을 수행하며 코드 리뷰 및 기술 지원'
        }
      ]
    },
    {
      company: 'XYZ 소프트웨어',
      period: { start: '2020.06', end: '2023.02' },
      isCurrent: false,
      responsibilities: [
        {
          title: '백엔드 개발자',
          details: 'Java Spring Boot를 이용한 API 서버 개발 및 데이터베이스 설계'
        }
      ]
    }
  ],

  // 경력기술서
  projectDetails: [
    {
      name: '온라인 쇼핑몰 플랫폼 개발',
      company: 'ABC 테크놀로지',
      techStack: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB'],
      period: { start: '2023.05', end: '2023.12' },
      team: {
        total: 8,
        details: '프론트엔드 3명, 백엔드 3명, 디자이너 1명, PM 1명'
      },
      roles: [
        '프론트엔드 개발 리드',
        '사용자 인터페이스 및 사용자 경험 설계',
        '백엔드 API와의 연동 및 상태 관리'
      ],
      achievements: [
        '이전 버전 대비 페이지 로딩 속도 40% 향상',
        '모바일 사용자 전환율 25% 증가',
        '코드 품질 개선 및 테스트 자동화 도입으로 버그 발생률 30% 감소'
      ]
    },
    {
      name: '기업 내부 관리 시스템 고도화',
      company: 'XYZ 소프트웨어',
      techStack: ['Java', 'Spring Boot', 'MySQL', 'Vue.js', 'Docker'],
      period: { start: '2022.01', end: '2023.02' },
      team: {
        total: 5,
        details: '백엔드 3명, 프론트엔드 1명, DBA 1명'
      },
      roles: [
        '백엔드 API 개발',
        '데이터베이스 스키마 설계 및 최적화',
        '서버 인프라 구축 및 배포 자동화'
      ],
      achievements: [
        '시스템 처리 속도 60% 향상',
        '마이크로서비스 아키텍처 도입으로 유지보수성 개선',
        '연간 운영 비용 20% 절감'
      ]
    }
  ],

  // 개인 프로젝트
  projects: [
    {
      period: { start: '2023.01', end: '2023.03' },
      name: '개인 블로그 플랫폼',
      description: 'Next.js와 Tailwind CSS를 활용한 정적 블로그 플랫폼 개발. 마크다운 지원 및 SEO 최적화.'
    },
    {
      period: { start: '2022.08', end: '2022.11' },
      name: '일정 관리 앱',
      description: 'React Native로 개발한 크로스 플랫폼 모바일 앱. 로컬 알림 및 캘린더 동기화 기능 구현.'
    }
  ],

  // 학력
  education: [
    {
      school: '한국대학교',
      major: '컴퓨터공학',
      period: { start: '2015.03', end: '2019.02' },
      status: '졸업', // 졸업, 재학, 휴학, 졸업예정 등
      gpa: '3.8/4.5',
      isEvening: false, // 주/야간 여부
      thesis: '블록체인 기반 인증 시스템 설계 및 구현',
      activities: [
        '프로그래밍 동아리 회장 (2018)',
        '교내 해커톤 대회 우승 (2017)'
      ]
    }
  ],

  // 자격증
  certificates: [
    {
      name: '정보처리기사',
      organization: '한국산업인력공단',
      date: '2019.05',
      description: '국가공인 자격증'
    },
    {
      name: 'AWS Certified Solutions Architect',
      organization: 'Amazon Web Services',
      date: '2021.08',
      description: '클라우드 아키텍처 설계 자격증'
    }
  ],

  // 포트폴리오
  portfolio: [
    {
      image: '../../images/project1.png',
      title: '반응형 웹 디자인 프로젝트',
      description: 'HTML, CSS, JavaScript를 활용한 반응형 웹사이트 제작 프로젝트입니다.',
      codeLink: 'https://github.com/username/project1',
      demoLink: 'https://example.com/demo1'
    },
    {
      image: '../../images/project2.png',
      title: '데이터 시각화 대시보드',
      description: 'React와 D3.js를 활용한 데이터 시각화 대시보드입니다.',
      codeLink: 'https://github.com/username/project2',
      demoLink: 'https://example.com/demo2'
    }
  ],

  // 기사 목록
  articles: [
    {
      title: 'JavaScript의 비동기 프로그래밍 이해하기',
      date: '2023.12.10',
      summary: 'Promise, async/await를 활용한 효율적인 비동기 프로그래밍 방법에 대한 글입니다.',
      link: 'https://blog.example.com/async-javascript'
    },
    {
      title: 'React 성능 최적화 기법',
      date: '2023.08.22',
      summary: 'React 애플리케이션의 렌더링 성능을 최적화하는 다양한 방법을 소개합니다.',
      link: 'https://blog.example.com/react-optimization'
    }
  ]
};