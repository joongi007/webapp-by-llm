// 이력서 데이터
// 이 객체를 수정하여 이력서 내용을 변경할 수 있습니다.
const resumeData = {
  // 전역 설정
  settings: {
    showLinkNames: false, // true: 링크 이름 표시, false: URL 표시
  },

  // 순서 설정 - 표시할 섹션의 순서를 지정합니다. 원하지 않는 섹션은 제거하면 됩니다.
  sectionOrder: [
    'personalInfo',     // 인적사항
    'introduction',     // 소개
    'coreCompetencies', // 핵심역량
    'skills',           // 기술 키워드
    'experience',       // 경력
    'projectDetails',   // 경력기술서
    'projects',         // 프로젝트
    'education',        // 학력
    'certificates',     // 자격증
    'portfolio',        // 포트폴리오
    'coverLetter',      // 자기소개서
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
      { name: '링크드인', url: 'https://linkedin.com/in/username', icon: 'fab fa-linkedin' },
      { name: '링크드인', url: 'https://linkedin.com/in/username', icon: 'fab fa-linkedin' },
      { name: '링크드인', url: 'https://linkedin.com/in/username', icon: 'fab fa-linkedin' },
      { name: '포트폴리오', url: 'https://portfolio.example.com', icon: 'fas fa-briefcase' }
      // 필요한 만큼 추가 가능
    ],
    // 마지막 갱신일 (YYYY-MM-DD 형식)
    lastUpdated: '2025-04-02'
  },

  // 소개
  introduction: {
    text: `안녕하세요, 저는 웹 개발자 홍길동입니다. 프론트엔드와 백엔드 개발 경험이 있으며, 사용자 경험을 중요시하는 개발을 지향합니다.

새로운 기술을 배우는 것을 좋아하며, 팀원들과의 협업을 통해 더 나은 결과물을 만들어내는 것에 보람을 느낍니다.`
  },

  // 핵심역량
  coreCompetencies: [
    {
      title: '문제 해결 능력',
      description: '복잡한 문제를 체계적으로 분석하고 효율적인 해결책을 도출합니다.\n\n실제 프로젝트에서 성능 병목 현상을 분석하여 응답 시간을 50% 개선한 경험이 있습니다.'
    },
    {
      title: '커뮤니케이션 능력',
      description: '기술적 내용을 비개발자에게도 이해하기 쉽게 설명하는 능력이 뛰어납니다.\n\n다양한 이해관계자들과 효과적으로 소통하여 프로젝트 요구사항을 명확히 정의합니다.'
    },
    {
      title: '빠른 학습력',
      description: '새로운 기술과 프레임워크를 신속하게 습득하고 실무에 적용합니다.\n\n평균 2주 이내에 새로운 프레임워크를 마스터하여 프로젝트에 적용한 경험이 여러 번 있습니다.'
    }
  ],

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

  // 자기소개서
  coverLetter: [
    {
      title: '지원동기',
      content: `귀사는 혁신적인 기술과 사용자 중심의 서비스로 업계를 선도하고 있으며, 이러한 귀사의 비전과 가치관이 저의 커리어 목표와 일치하여 지원하게 되었습니다.
  
특히 귀사의 [특정 프로젝트/서비스]에 깊은 인상을 받았으며, 저의 기술과 경험을 바탕으로 이 프로젝트에 기여하고 함께 성장하고 싶습니다.`
    },
    {
      title: '성격의 장단점',
      content: `저의 가장 큰 장점은 끈기와 책임감입니다. 한번 맡은 일은 끝까지 완수하려는 의지가 강하며, 문제가 발생해도 포기하지 않고 해결책을 찾기 위해 노력합니다.
  
반면 단점으로는 완벽주의적 성향이 있어 때로는 지나치게 세부사항에 집착하는 경향이 있습니다. 이러한 점을 인식하고, 중요도와 우선순위를 설정하여 효율적으로 업무를 처리하는 방법을 지속적으로 개선하고 있습니다.`
    },
    {
      title: '직무 적합성',
      content: `저는 프론트엔드와 백엔드 모두에 능숙한 풀스택 개발자로, JavaScript, React, Node.js, Java Spring 등 다양한 기술 스택을 활용한 프로젝트 경험이 있습니다.
  
특히 사용자 경험을 최우선으로 생각하는 개발 철학을 가지고 있으며, 이는 귀사가 추구하는 가치와 일치한다고 생각합니다. 또한 새로운 기술을 빠르게 습득하고 적용하는 능력이 있어, 빠르게 변화하는 IT 환경에서도 적응력을 발휘할 수 있습니다.`
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