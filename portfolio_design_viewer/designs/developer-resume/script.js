// 유틸리티 함수
const utils = {
  // 두 날짜 사이의 기간을 계산 (년, 월)
  calculateDuration: (startDate, endDate) => {
    const start = startDate.split('.').map(num => parseInt(num));
    let end;

    if (endDate === '현재') {
      const now = new Date();
      end = [now.getFullYear(), now.getMonth() + 1];
    } else {
      end = endDate.split('.').map(num => parseInt(num));
    }

    let yearDiff = end[0] - start[0];
    let monthDiff = end[1] - start[1];

    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }

    let result = '';
    if (yearDiff > 0) {
      result += `${yearDiff}년 `;
    }
    if (monthDiff > 0 || yearDiff === 0) {
      result += `${monthDiff}개월`;
    }

    return result;
  },

  // 나이 계산
  calculateAge: (birthYear) => {
    // TODO : 만나이?
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear + 1;
  },

  // 마지막 갱신일로부터 경과 시간 계산
  calculateTimeSinceUpdate: (lastUpdatedDate) => {
    const lastUpdate = new Date(lastUpdatedDate);
    const now = new Date();

    const diffTime = Math.abs(now - lastUpdate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '오늘';
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}주 전`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)}개월 전`;
    } else {
      return `${Math.floor(diffDays / 365)}년 전`;
    }
  },
  
  // 텍스트에서 개행 처리 (일반 함수로 만들어서 여러 곳에서 재사용)
  renderParagraphs: (container, text, className) => {
    const paragraphs = text.split(/\n\n/);
    paragraphs.forEach(paragraph => {
      if (paragraph.trim()) {
        const p = document.createElement('p');
        p.className = className;
        p.textContent = paragraph.trim();
        container.appendChild(p);
      }
    });
  }
};

// 인적사항 렌더링
const renderPersonalInfo = (data) => {
  const section = document.createElement('header');
  section.className = 'resume-header';

  // 프로필 사진
  if (data.photo) {
    const photo = document.createElement('img');
    photo.src = data.photo;
    photo.alt = `${data.name} 프로필 사진`;
    photo.className = 'profile-photo';
    section.appendChild(photo);
  }

  // 인적사항 정보
  const infoDiv = document.createElement('div');
  infoDiv.className = 'personal-info';

  // 이름 및 기본 정보
  const nameTitle = document.createElement('div');
  nameTitle.className = 'name-title';

  const name = document.createElement('h1');
  name.className = 'name';
  name.textContent = data.name;
  nameTitle.appendChild(name);

  // 성별 및 나이 정보
  if (data.gender || data.birthYear) {
    const details = document.createElement('span');
    let detailsText = '';

    if (data.gender) {
      detailsText += data.gender;
    }

    if (data.birthYear) {
      if (detailsText) detailsText += ' / ';
      detailsText += `${data.birthYear}년생 (${utils.calculateAge(data.birthYear)}세)`;
    }

    details.textContent = detailsText;
    nameTitle.appendChild(details);
  }

  infoDiv.appendChild(nameTitle);

  // 연락처 정보
  const personalDetails = document.createElement('div');
  personalDetails.className = 'personal-details';

  if (data.email) {
    const email = document.createElement('div');
    email.innerHTML = `<i class="fas fa-envelope"></i> ${data.email}`;
    personalDetails.appendChild(email);
  }

  infoDiv.appendChild(personalDetails);

  // 전역 설정 확인 (없으면 기본값 사용)
  const showLinkNames = resumeData.settings?.showLinkNames !== undefined ? resumeData.settings.showLinkNames : true;

  // 추가 링크들 (블로그, 깃허브, 기타)
  const contactLinks = document.createElement('div');
  contactLinks.className = 'contact-links';

  if (data.blog) {
    const blog = document.createElement('a');
    blog.href = data.blog;
    blog.className = 'contact-link';
    blog.target = '_blank';
    blog.rel = 'noopener noreferrer';
    blog.innerHTML = `<i class="fas fa-blog"></i> ${showLinkNames ? '블로그' : data.blog}`;
    contactLinks.appendChild(blog);
  }

  if (data.github) {
    const github = document.createElement('a');
    github.href = data.github;
    github.className = 'contact-link';
    github.target = '_blank';
    github.rel = 'noopener noreferrer';
    github.innerHTML = `<i class="fab fa-github"></i> ${showLinkNames ? 'GitHub' : data.github}`;
    contactLinks.appendChild(github);
  }

  // 추가 링크
  if (data.links && data.links.length > 0) {
    data.links.forEach(link => {
      const linkElement = document.createElement('a');
      linkElement.href = link.url;
      linkElement.className = 'contact-link';
      linkElement.target = '_blank';
      linkElement.rel = 'noopener noreferrer';
      linkElement.innerHTML = `<i class="${link.icon}"></i> ${showLinkNames ? link.name : link.url}`;
      contactLinks.appendChild(linkElement);
    });
  }

  infoDiv.appendChild(contactLinks);

  // 마지막 갱신일
  if (data.lastUpdated) {
    const lastUpdated = document.createElement('div');
    lastUpdated.className = 'last-updated';
    lastUpdated.textContent = `마지막 갱신: ${data.lastUpdated} (${utils.calculateTimeSinceUpdate(data.lastUpdated)})`;
    infoDiv.appendChild(lastUpdated);
  }

  section.appendChild(infoDiv);
  return section;
};

// 소개 렌더링
const renderIntroduction = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '소개';
  section.appendChild(title);

  // 개행 처리
  utils.renderParagraphs(section, data.text, 'intro-text');

  return section;
};

// 핵심역량 렌더링
const renderCoreCompetencies = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '핵심역량';
  section.appendChild(title);

  const competenciesList = document.createElement('ul');
  competenciesList.className = 'core-competencies-list';

  data.forEach(competency => {
    const item = document.createElement('li');
    item.className = 'core-competency-item';

    const itemTitle = document.createElement('h3');
    itemTitle.className = 'core-competency-title';
    itemTitle.textContent = competency.title;
    item.appendChild(itemTitle);

    // 설명 텍스트에서 개행 처리
    if (competency.description) {
      utils.renderParagraphs(item, competency.description, 'core-competency-paragraph');
    }

    competenciesList.appendChild(item);
  });

  section.appendChild(competenciesList);
  return section;
};

// 기술 스택 렌더링
const renderSkills = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '기술 스택';
  section.appendChild(title);

  const skillsContainer = document.createElement('div');
  skillsContainer.className = 'skills-container';

  data.categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skill-category';

    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'skill-category-title';
    categoryTitle.textContent = category.name;
    categoryDiv.appendChild(categoryTitle);

    const skillsList = document.createElement('ul');
    skillsList.className = 'skills-list';

    category.items.forEach(skill => {
      const skillItem = document.createElement('li');
      skillItem.className = 'skill-item';

      if (skill.icon) {
        skillItem.innerHTML = `<i class="${skill.icon}"></i> ${skill.name}`;
      } else {
        skillItem.textContent = skill.name;
      }

      skillsList.appendChild(skillItem);
    });

    categoryDiv.appendChild(skillsList);
    skillsContainer.appendChild(categoryDiv);
  });

  section.appendChild(skillsContainer);
  return section;
};

// 경력 렌더링
const renderExperience = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '경력';
  section.appendChild(title);

  const experienceList = document.createElement('ul');
  experienceList.className = 'experience-list';

  data.forEach(exp => {
    const expItem = document.createElement('li');
    expItem.className = 'experience-item';

    // 회사명, 재직기간, 재직여부
    const expHeader = document.createElement('div');
    expHeader.className = 'experience-header';

    const companyName = document.createElement('div');
    companyName.className = 'company-name';
    companyName.textContent = exp.company;
    expHeader.appendChild(companyName);

    // 재직 상태 및 기간
    const statusDuration = document.createElement('div');
    statusDuration.className = 'experience-duration';

    const period = document.createElement('span');
    period.textContent = `${exp.period.start} ~ ${exp.period.end}`;
    statusDuration.appendChild(period);

    const duration = document.createElement('span');
    duration.textContent = `(${utils.calculateDuration(exp.period.start, exp.period.end)})`;
    statusDuration.appendChild(duration);

    const status = document.createElement('span');
    status.className = `employment-status ${exp.isCurrent ? 'status-current' : 'status-previous'}`;
    status.textContent = exp.isCurrent ? '재직중' : '퇴사';
    statusDuration.appendChild(status);

    expHeader.appendChild(statusDuration);
    expItem.appendChild(expHeader);

    // 담당 업무
    if (exp.responsibilities && exp.responsibilities.length > 0) {
      const respList = document.createElement('ul');
      respList.className = 'responsibilities-list';

      exp.responsibilities.forEach(resp => {
        const respItem = document.createElement('li');
        respItem.className = 'responsibility-item';

        // 기간별 담당업무인 경우
        if (resp.period) {
          const periodSpan = document.createElement('div');
          periodSpan.className = 'responsibility-period';
          periodSpan.textContent = `${resp.period.start} ~ ${resp.period.end}`;
          respItem.appendChild(periodSpan);
        }

        const titleDiv = document.createElement('div');
        titleDiv.className = 'responsibility-title';
        titleDiv.textContent = resp.title;
        respItem.appendChild(titleDiv);

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'responsibility-details';
        
        // 개행 처리
        if (resp.details) {
          utils.renderParagraphs(detailsDiv, resp.details, 'responsibility-paragraph');
        }
        
        respItem.appendChild(detailsDiv);

        respList.appendChild(respItem);
      });

      expItem.appendChild(respList);
    }

    experienceList.appendChild(expItem);
  });

  section.appendChild(experienceList);
  return section;
};

// 경력기술서 렌더링
const renderProjectDetails = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '경력기술서';
  section.appendChild(title);

  data.forEach(project => {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project-item';

    // 프로젝트 헤더 (프로젝트명, 회사명)
    const projectHeader = document.createElement('div');
    projectHeader.className = 'project-header';

    const projectTitle = document.createElement('div');
    projectTitle.className = 'project-title';
    projectTitle.textContent = project.name;
    projectHeader.appendChild(projectTitle);

    const projectCompany = document.createElement('div');
    projectCompany.className = 'project-company';
    projectCompany.textContent = project.company;
    projectHeader.appendChild(projectCompany);

    projectDiv.appendChild(projectHeader);

    // 기술 스택
    if (project.techStack && project.techStack.length > 0) {
      const techStack = document.createElement('div');
      techStack.className = 'project-tech-stack';

      project.techStack.forEach(tech => {
        const techItem = document.createElement('span');
        techItem.className = 'skill-item';
        techItem.textContent = tech;
        techStack.appendChild(techItem);
      });

      projectDiv.appendChild(techStack);
    }

    // 프로젝트 상세 정보
    const details = document.createElement('dl');
    details.className = 'project-details';

    // 기간
    const periodDt = document.createElement('dt');
    periodDt.textContent = '기간';
    details.appendChild(periodDt);

    const periodDd = document.createElement('dd');
    periodDd.textContent = `${project.period.start} ~ ${project.period.end} (${utils.calculateDuration(project.period.start, project.period.end)})`;
    details.appendChild(periodDd);

    // 인력
    if(project.team) {
      const teamDt = document.createElement('dt');
      teamDt.textContent = '인력';
      details.appendChild(teamDt);
  
      const teamDd = document.createElement('dd');
      teamDd.textContent = `총 ${project.team.total}명 (${project.team.details})`;
      details.appendChild(teamDd);
    }

    // 역할
    if(project.roles) {
      const rolesDt = document.createElement('dt');
      rolesDt.textContent = '주요 역할';
      details.appendChild(rolesDt);
  
      const rolesDd = document.createElement('dd');
      const rolesUl = document.createElement('ul');
      project.roles.forEach(role => {
        const roleLi = document.createElement('li');
        roleLi.textContent = role;
        rolesUl.appendChild(roleLi);
      });
      rolesDd.appendChild(rolesUl);
      details.appendChild(rolesDd);
    }

    // 성과
    if(project.achievements) {
      const achievementsDt = document.createElement('dt');
      achievementsDt.textContent = '업무 성과';
      details.appendChild(achievementsDt);
  
      const achievementsDd = document.createElement('dd');
      const achievementsUl = document.createElement('ul');
      project.achievements.forEach(achievement => {
        const achievementLi = document.createElement('li');
        achievementLi.textContent = achievement;
        achievementsUl.appendChild(achievementLi);
      });
      achievementsDd.appendChild(achievementsUl);
      details.appendChild(achievementsDd);
    }
    
    // 다른 추가 사항
    if(project.others) {
      project.others.forEach((other) => {
        const achievementsDt = document.createElement('dt');
        achievementsDt.textContent = other.name;
        details.appendChild(achievementsDt);
    
        const achievementsDd = document.createElement('dd');
        const achievementsUl = document.createElement('ul');
        other.items.forEach(achievement => {
          const achievementLi = document.createElement('li');
          achievementLi.textContent = achievement;
          achievementsUl.appendChild(achievementLi);
        });
        achievementsDd.appendChild(achievementsUl);
        details.appendChild(achievementsDd);
      })
    }

    projectDiv.appendChild(details);
    section.appendChild(projectDiv);
  });

  return section;
};

// 프로젝트 렌더링
const renderProjects = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '프로젝트';
  section.appendChild(title);

  const projectList = document.createElement('ul');
  projectList.className = 'experience-list';

  data.forEach(project => {
    const projectItem = document.createElement('li');
    projectItem.className = 'experience-item';

    const projectHeader = document.createElement('div');
    projectHeader.className = 'experience-header';

    const projectName = document.createElement('div');
    projectName.className = 'company-name';
    projectName.textContent = project.name;
    projectHeader.appendChild(projectName);

    const period = document.createElement('div');
    period.className = 'experience-duration';
    period.textContent = `${project.period.start} ~ ${project.period.end} (${utils.calculateDuration(project.period.start, project.period.end)})`;
    projectHeader.appendChild(period);

    projectItem.appendChild(projectHeader);

    const description = document.createElement('div');
    // 개행 처리
    utils.renderParagraphs(description, project.description, 'project-description');
    projectItem.appendChild(description);

    projectList.appendChild(projectItem);
  });

  section.appendChild(projectList);
  return section;
};

// 학력 렌더링
const renderEducation = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '학력';
  section.appendChild(title);

  const educationList = document.createElement('ul');
  educationList.className = 'education-list';

  data.forEach(edu => {
    const eduItem = document.createElement('li');
    eduItem.className = 'education-item';

    const eduHeader = document.createElement('div');
    eduHeader.className = 'education-header';

    const schoolName = document.createElement('div');
    schoolName.className = 'school-name';
    schoolName.textContent = `${edu.school} ${edu.major}`;
    eduHeader.appendChild(schoolName);

    const period = document.createElement('div');
    period.className = 'education-duration';
    period.textContent = `${edu.period.start} ~ ${edu.period.end} (${utils.calculateDuration(edu.period.start, edu.period.end)})`;
    eduHeader.appendChild(period);

    eduItem.appendChild(eduHeader);

    const details = document.createElement('div');
    details.className = 'education-details';

    // 졸업 상태
    const status = document.createElement('div');
    status.innerHTML = `<strong>상태:</strong> ${edu.status}`;
    details.appendChild(status);

    // 학점
    if (edu.gpa) {
      const gpa = document.createElement('div');
      gpa.innerHTML = `<strong>학점:</strong> ${edu.gpa}`;
      details.appendChild(gpa);
    }

    // 주/야간
    if (edu.isEvening !== undefined) {
      const schedule = document.createElement('div');
      schedule.innerHTML = `<strong>구분:</strong> ${edu.isEvening ? '야간' : '주간'}`;
      details.appendChild(schedule);
    }

    // 졸업 논문
    if (edu.thesis) {
      const thesis = document.createElement('div');
      thesis.innerHTML = `<strong>졸업 논문:</strong> ${edu.thesis}`;
      details.appendChild(thesis);
    }

    // 활동
    if (edu.activities && edu.activities.length > 0) {
      const activities = document.createElement('div');
      activities.innerHTML = `<strong>주요 활동:</strong>`;

      const actList = document.createElement('ul');
      edu.activities.forEach(activity => {
        const actItem = document.createElement('li');
        actItem.textContent = activity;
        actList.appendChild(actItem);
      });

      activities.appendChild(actList);
      details.appendChild(activities);
    }

    eduItem.appendChild(details);
    educationList.appendChild(eduItem);
  });

  section.appendChild(educationList);
  return section;
};

// 자격증 렌더링
const renderCertificates = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '자격증';
  section.appendChild(title);

  const certList = document.createElement('ul');
  certList.className = 'certificates-list';

  data.forEach(cert => {
    const certItem = document.createElement('li');
    certItem.className = 'certificate-item';

    const certName = document.createElement('div');
    certName.className = 'certificate-name';
    certName.textContent = cert.name;
    certItem.appendChild(certName);

    const certDetails = document.createElement('div');
    certDetails.className = 'certificate-details';
    certDetails.textContent = `${cert.organization} | ${cert.date}`;

    if (cert.description) {
      certDetails.textContent += ` | ${cert.description}`;
    }

    certItem.appendChild(certDetails);
    certList.appendChild(certItem);
  });

  section.appendChild(certList);
  return section;
};

// 포트폴리오 렌더링
const renderPortfolio = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '포트폴리오';
  section.appendChild(title);

  const portfolioGrid = document.createElement('div');
  portfolioGrid.className = 'portfolio-grid';

  data.forEach(item => {
    const portfolioItem = document.createElement('div');
    portfolioItem.className = 'portfolio-item';

    // 이미지
    if (item.image) {
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.title;
      image.className = 'portfolio-image';
      portfolioItem.appendChild(image);
    }

    // 내용
    const content = document.createElement('div');
    content.className = 'portfolio-content';

    const itemTitle = document.createElement('h3');
    itemTitle.className = 'portfolio-title';
    itemTitle.textContent = item.title;
    content.appendChild(itemTitle);

    if (item.description) {
      const description = document.createElement('div');
      description.className = 'portfolio-description-container';
      utils.renderParagraphs(description, item.description, 'portfolio-description');
      content.appendChild(description);
    }

    // 링크
    const links = document.createElement('div');
    links.className = 'portfolio-links';

    // 전역 설정 확인 (없으면 기본값 사용)
    const showLinkNames = resumeData.settings?.showLinkNames !== undefined ? resumeData.settings.showLinkNames : true;

    if (item.codeLink) {
      const codeLink = document.createElement('a');
      codeLink.href = item.codeLink;
      codeLink.className = 'portfolio-link';
      codeLink.target = '_blank';
      codeLink.rel = 'noopener noreferrer';
      codeLink.innerHTML = `<i class="fab fa-github"></i> ${showLinkNames ? '코드 보기' : item.codeLink}`;
      links.appendChild(codeLink);
    }

    if (item.demoLink) {
      const demoLink = document.createElement('a');
      demoLink.href = item.demoLink;
      demoLink.className = 'portfolio-link';
      demoLink.target = '_blank';
      demoLink.rel = 'noopener noreferrer';
      demoLink.innerHTML = `<i class="fas fa-external-link-alt"></i> ${showLinkNames ? '데모 보기' : item.demoLink}`;
      links.appendChild(demoLink);
    }

    content.appendChild(links);
    portfolioItem.appendChild(content);
    portfolioGrid.appendChild(portfolioItem);
  });

  section.appendChild(portfolioGrid);
  return section;
};

// 기사 목록 렌더링
const renderArticles = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '기사 목록';
  section.appendChild(title);

  const articlesList = document.createElement('ul');
  articlesList.className = 'articles-list';

  data.forEach(article => {
    const articleItem = document.createElement('li');
    articleItem.className = 'article-item';

    const articleTitle = document.createElement('h3');
    articleTitle.className = 'article-title';
    articleTitle.textContent = article.title;
    articleItem.appendChild(articleTitle);

    const articleDate = document.createElement('div');
    articleDate.className = 'article-date';
    articleDate.textContent = article.date;
    articleItem.appendChild(articleDate);

    if (article.summary) {
      const summary = document.createElement('div');
      summary.className = 'article-summary-container';
      utils.renderParagraphs(summary, article.summary, 'article-summary');
      articleItem.appendChild(summary);
    }

    // 전역 설정 확인 (없으면 기본값 사용)
    const showLinkNames = resumeData.settings?.showLinkNames !== undefined ? resumeData.settings.showLinkNames : true;

    if (article.link) {
      const link = document.createElement('a');
      link.href = article.link;
      link.className = 'article-link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML = `<i class="fas fa-external-link-alt"></i> ${showLinkNames ? '자세히 보기' : article.link}`;
      articleItem.appendChild(link);
    }

    articlesList.appendChild(articleItem);
  });

  section.appendChild(articlesList);
  return section;
};

// 자기소개서 렌더링
const renderCoverLetter = (data) => {
  const section = document.createElement('section');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '자기소개서';
  section.appendChild(title);

  // 각 자기소개서 항목을 렌더링
  data.forEach(item => {
    const coverLetterItem = document.createElement('div');
    coverLetterItem.className = 'cover-letter-item';

    // 항목 제목
    const itemTitle = document.createElement('h3');
    itemTitle.className = 'cover-letter-title';
    itemTitle.textContent = item.title;
    coverLetterItem.appendChild(itemTitle);

    // 내용을 줄바꿈 유지하면서 렌더링
    utils.renderParagraphs(coverLetterItem, item.content, 'cover-letter-paragraph');

    section.appendChild(coverLetterItem);
  });

  return section;
};

// 이력서 렌더링 함수
const renderResume = () => {
  const resumeContainer = document.getElementById('resume-content');
  const { sectionOrder } = resumeData;

  // 각 섹션을 순서대로 렌더링
  sectionOrder.forEach(section => {
    const sectionData = resumeData[section];

    // 섹션 데이터가 없거나 빈 배열이면 렌더링하지 않음
    if (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0)) {
      return;
    }

    // 섹션별 렌더링 함수 호출
    switch (section) {
      case 'personalInfo':
        resumeContainer.appendChild(renderPersonalInfo(sectionData));
        break;
      case 'introduction':
        resumeContainer.appendChild(renderIntroduction(sectionData));
        break;
      case 'coreCompetencies':
        resumeContainer.appendChild(renderCoreCompetencies(sectionData));
        break;
      case 'skills':
        resumeContainer.appendChild(renderSkills(sectionData));
        break;
      case 'experience':
        resumeContainer.appendChild(renderExperience(sectionData));
        break;
      case 'projectDetails':
        resumeContainer.appendChild(renderProjectDetails(sectionData));
        break;
      case 'projects':
        resumeContainer.appendChild(renderProjects(sectionData));
        break;
      case 'education':
        resumeContainer.appendChild(renderEducation(sectionData));
        break;
      case 'certificates':
        resumeContainer.appendChild(renderCertificates(sectionData));
        break;
      case 'portfolio':
        resumeContainer.appendChild(renderPortfolio(sectionData));
        break;
      case 'coverLetter':
        resumeContainer.appendChild(renderCoverLetter(sectionData));
        break;
      case 'articles':
        resumeContainer.appendChild(renderArticles(sectionData));
        break;
    }
  });
};

// 자바스크립트 변수/함수 보호 - 즉시 실행 함수로 감싸기
(() => {
  // DOMContentLoaded 이벤트가 발생하면 이력서 렌더링
  document.addEventListener('DOMContentLoaded', () => {
    renderResume();
  });
})();