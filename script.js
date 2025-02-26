(
    () => {
        // 웹 앱 정보를 담은 배열
        const webApps = [
            {
                title: "육각형 물리 시뮬레이션",
                folder: "hexagon_physics_simulator",
                summary: "육각형 물리 시뮬레이션 웹 게임",
                image: "hexagon_physics_simulator/example.png",
                tags: ["claude 3.7 sonnet"]
            },
            {
                title: "메모리 매치 카드 게임",
                folder: "memory_match_card_game",
                summary: "메모리 메치 카드 웹 게임",
                image: "memory_match_card_game/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "전략 정복 게임",
                folder: "strategic_conquest",
                summary: "Epic Strategic Conquest Deluxe 웹 게임",
                image: "strategic_conquest/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "양자 암호 퍼즐",
                folder: "quantum_cipher_puzzle",
                summary: "양자 암호 퍼즐 게임 웹 앱",
                image: "quantum_cipher_puzzle/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "stable diffusion prompt 생성",
                folder: "stable_diffusion_prompt_generator",
                summary: "stable diffusion prompt 생성 웹 앱",
                image: "stable_diffusion_prompt_generator/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "포트폴리오 디자인 템플릿",
                folder: "portfolio_design_viewer",
                summary: "포트폴리오 디자인 템플릿 게시 웹 앱",
                image: "portfolio_design_viewer/example.png",
                tags: ["claude 3.5 sonnet", "only desktop"]
            },
            {
                title: "생태계 시뮬레이션",
                folder: "ecosystem_simulator",
                summary: "가상 생태계 시뮬레이션 웹 앱",
                image: "ecosystem_simulator/example.png",
                tags: ["claude 3.5 sonnet", "only desktop"]
            },
            {
                title: "프랙탈 아트",
                folder: "fractal_art_generator",
                summary: "프랙탈 아트 생성기 웹 앱",
                image: "fractal_art_generator/example.png",
                tags: ["claude 3.5 sonnet", "only desktop"]
            },
            {
                title: "색체 심리 테스트",
                folder: "color_psychology_test",
                summary: "고급 색체 심리 테스트 웹 앱",
                image: "color_psychology_test/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "미로 게임",
                folder: "maze",
                summary: "미로 게임 웹 앱",
                image: "maze/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "단위 변환기",
                folder: "unit_converter",
                summary: "단위 변환기 웹 앱",
                image: "unit_converter/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "드럼 패드",
                folder: "drum_pad",
                summary: "드럼 패드 웹 앱",
                image: "drum_pad/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "소설",
                folder: "novel",
                summary: "claude 3.5가 작성한 소설 및 소설 웹 앱",
                image: "novel/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "Transformer 모델 심층 이해",
                folder: "understanding_transformer",
                summary: "claude 3.5가 설명해주는 Transformer 모델 심층 이해 웹 앱",
                image: "understanding_transformer/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "테트리스",
                folder: "tetris",
                summary: "테트리스 웹 앱",
                image: "tetris/example.png",
                tags: ["claude 3.5 sonnet", "only desktop"]
            },
            {
                title: "간단한 뱀파이어 서바이버스 라이크",
                folder: "simple_vampire_survivors_like",
                summary: "간단한 뱀파이어 서바이버스 라이크 웹 앱",
                image: "simple_vampire_survivors_like/example.png",
                tags: ["claude 3.5 sonnet", "only desktop"]
            },
            {
                title: "오목",
                folder: "gomoku",
                summary: "오목 게임 웹 앱",
                image: "gomoku/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "스도쿠 솔버",
                folder: "sudoku_solver",
                summary: "스도쿠를 풀어주는 솔버 웹 앱",
                image: "sudoku_solver/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "스도쿠",
                folder: "sudoku",
                summary: "스도쿠 웹 앱",
                image: "sudoku/example.png",
                tags: ["claude 3.5 sonnet", "only desktop"]
            },
            {
                title: "모던 아이콘 갤러리",
                folder: "modern_icon_gallery",
                summary: "LLM을 통해 생성된 아이콘 갤러리",
                image: "modern_icon_gallery/example.png",
                tags: ["claude 3.5 sonnet"]
            },
            {
                title: "루빅스 큐브",
                folder: "rubiks_cube",
                summary: "루빅스 큐브 시뮬레이션",
                image: "rubiks_cube/example.png",
                tags: ["claude 3.5 sonnet", "only desktop"]
            },
            {
                title: "간단 유전 시뮬레이션",
                folder: "simple_dielectric_simulation",
                summary: "간단히 즐길 수 있는 유전 시뮬레이션",
                image: "simple_dielectric_simulation/example.png",
                tags: ["claude 3.5 sonnet", "only desktop"]
            },
            {
                title: "체스 게임",
                folder: "chess",
                summary: "온라인에서 즐기는 클래식한 체스 게임",
                image: "chess/example.png",
                tags: ["claude 3.5 sonnet"]
            }
            // 추후 다른 웹 앱들을 여기에 추가할 수 있습니다.
        ];

        // DOM이 로드된 후 실행
        document.addEventListener('DOMContentLoaded', () => {
            const appGallery = document.getElementById('app-gallery');
            const cardTemplate = document.getElementById('app-card-template');

            // 각 웹 앱에 대해 카드 생성
            webApps.forEach(app => {
                const card = createAppCard(app, cardTemplate);
                appGallery.appendChild(card);
            });

            // Lazy loading 설정
            setupLazyLoading();
        });

        // 앱 카드 생성 함수
        function createAppCard(app, cardTemplate) {
            const cardClone = cardTemplate.content.cloneNode(true);
            const card = cardClone.querySelector('.app-card');

            const image = card.querySelector('.app-image');
            image.dataset.src = app.image;
            image.alt = `${app.title} 썸네일`;

            card.querySelector('.app-title').textContent = app.title;
            card.querySelector('.app-summary').textContent = app.summary;

            // 태그 추가
            const tagsContainer = card.querySelector('.app-tags');
            app.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'app-tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });

            // 카드 클릭 이벤트 리스너 추가
            card.addEventListener('click', () => {
                window.location.href = `${app.folder}/index.html`;
            });

            return card;
        }

        // Lazy loading 설정 함수
        function setupLazyLoading() {
            const lazyImages = document.querySelectorAll('img.lazy');

            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.onload = () => {
                            img.classList.add('loaded');
                            img.classList.remove('lazy');
                            observer.unobserve(img);

                            // 로딩 스피너 제거
                            const spinner = img.parentElement.querySelector('.loading-spinner');
                            if (spinner) {
                                spinner.remove();
                            }
                        };
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // 동적으로 앱 추가 함수 (향후 확장성을 위해)
        function addNewApp(appInfo) {
            webApps.push(appInfo);
            const newCard = createAppCard(appInfo);
            document.getElementById('app-gallery').appendChild(newCard);
            setupLazyLoading();  // 새 이미지에 대해 lazy loading 다시 설정
        }
    }
)();