document.addEventListener('DOMContentLoaded', () => {
    const designList = document.getElementById('design-list');
    const designFrame = document.getElementById('design-frame');
    const currentDesign = document.querySelector('#current-design span');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const viewPageBtn = document.getElementById('view-page-btn');
    const viewSourceBtn = document.getElementById('view-source-btn');

    const baseGitHubUrl = 'https://github.com/joongi007/webapp-by-llm/tree/master/portfolio_design_viewer/designs/';

    // 디자인 목록 (실제 프로젝트에서는 이 부분을 동적으로 생성하거나 서버에서 가져올 수 있습니다)
    const designs = [
        'Minimal Portfolio',
        'Personal Blog', 
        'Photography Showcase',
        'Web Developer',
        'Graph Designer',
        'Data Scientist',
        'UX UI Designer',
        'Game Developer',
        'Cosmic Space Scientist',
        'Ecosystem Env Scientist',
        'Audio Music Producer',
        'Developer Resume',
        'Cover Letter',
    ];

    // 디자인 목록을 표시하는 함수
    function displayDesigns() {
        designList.innerHTML = '';
        designs.forEach(design => {
            const designItem = document.createElement('div');
            designItem.className = 'design-item';
            designItem.textContent = design;
            designItem.addEventListener('click', () => loadDesign(design));
            designList.appendChild(designItem);
        });
    }

    // 선택한 디자인을 불러오는 함수
    function loadDesign(design) {
        const designPath = `designs/${design.toLowerCase().replace(/\s+/g, '-')}/index.html`;
        designFrame.src = designPath;
        currentDesign.textContent = design;
        viewPageBtn.onclick = () => window.open(designPath, '_blank');
        viewSourceBtn.onclick = () => window.open(`${baseGitHubUrl}${design.toLowerCase().replace(/\s+/g, '-')}`, '_blank');
    }

    // 전체화면 모드 토글 함수
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        }
    }

    // 다크 모드 토글 함수
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDarkMode = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDarkMode);
    }

    // 저장된 테마 적용
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // 이벤트 리스너
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    themeToggle.addEventListener('click', toggleTheme);

    // 초기화
    displayDesigns();
    if (designs.length > 0) {
        loadDesign(designs[0]);
    }

    // 반응형 디자인을 위한 리사이즈 이벤트 리스너
    window.addEventListener('resize', () => {
        // 필요한 경우 여기에 반응형 로직을 추가할 수 있습니다.
    });
});