// script.js
document.addEventListener('DOMContentLoaded', () => {
    const contentPlaceholders = document.querySelectorAll('.content-placeholder');

    // 각 섹션의 컨텐츠를 동적으로 로드하는 함수
    async function loadContent(sectionId) {
        // 실제 구현에서는 서버에서 컨텐츠를 가져오거나 로컬 데이터를 사용할 수 있습니다.
        // 여기서는 예시로 하드코딩된 내용을 반환합니다.
        const content = {
            'background': `
                <p>Transformer 모델은 2017년 "Attention Is All You Need" 논문에서 소개되었습니다. 
                이 모델은 기존의 순환 신경망(RNN)이나 합성곱 신경망(CNN)을 사용하지 않고, 
                오직 어텐션 메커니즘만을 사용하여 뛰어난 성능을 보여주었습니다.</p>
            `,
            'importance': `
                <p>Transformer의 등장은 자연어 처리 분야에 혁명을 일으켰습니다. 
                병렬 처리가 가능하여 학습 속도가 빠르고, 장거리 의존성을 효과적으로 포착할 수 있어 
                다양한 태스크에서 뛰어난 성능을 보입니다.</p>
            `,
            'encoder': `
                <p>인코더는 입력 시퀀스를 고차원의 표현으로 변환합니다. 여러 개의 인코더 층이 쌓여 있으며, 
                각 층은 멀티헤드 셀프 어텐션과 피드포워드 신경망으로 구성됩니다.</p>
                <div id="encoder-visualization"></div>
            `,
            'decoder': `
                <p>디코더는 인코더의 출력과 이전에 생성된 출력을 사용하여 순차적으로 출력을 생성합니다. 
                디코더도 여러 층으로 구성되며, 마스크드 멀티헤드 어텐션을 사용하여 미래 정보를 참조하지 않도록 합니다.</p>
                <div id="decoder-visualization"></div>
            `,
            'components': `
                <p>Transformer의 주요 구성 요소:</p>
                <ul>
                    <li>임베딩 층</li>
                    <li>위치 인코딩</li>
                    <li>멀티헤드 어텐션</li>
                    <li>피드포워드 신경망</li>
                    <li>층 정규화</li>
                    <li>잔차 연결</li>
                </ul>
                <div id="components-visualization"></div>
            `,
            'self-attention': `
                <p>셀프 어텐션은 시퀀스 내의 각 요소가 다른 모든 요소와 어떻게 관련되는지를 계산합니다. 
                이를 통해 모델은 입력의 전체 컨텍스트를 고려할 수 있습니다.</p>
                <div id="self-attention-demo"></div>
            `,
            'multi-head': `
                <p>멀티헤드 어텐션은 여러 개의 어텐션 메커니즘을 병렬로 사용합니다. 
                각 헤드는 입력의 다른 측면에 집중할 수 있어, 더 풍부한 표현을 학습할 수 있습니다.</p>
                <div id="multi-head-demo"></div>
            `,
            'attention-math': `
                <p>어텐션의 수학적 표현:</p>
                <div class="equation">
                    \\[
                    Attention(Q, K, V) = softmax(\\frac{QK^T}{\\sqrt{d_k}})V
                    \\]
                </div>
                <p>여기서 $Q$는 쿼리, $K$는 키, $V$는 값을 나타냅니다.</p>
                <div id="attention-math-visualization"></div>
            `,
            'pretraining': `
                <p>사전 학습은 대규모 데이터셋에서 일반적인 패턴을 학습하는 과정입니다. 
                주로 사용되는 방법으로는 마스크드 언어 모델링(MLM)과 다음 문장 예측(NSP)이 있습니다.</p>
                <div id="pretraining-visualization"></div>
            `,
            'finetuning': `
                <p>파인튜닝은 사전 학습된 모델을 특정 태스크에 맞게 조정하는 과정입니다. 
                일반적으로 적은 양의 데이터로도 높은 성능을 얻을 수 있습니다.</p>
                <div id="finetuning-demo"></div>
            `,
            'optimization': `
                <p>Transformer 학습에 사용되는 주요 최적화 기법:</p>
                <ul>
                    <li>Adam 최적화</li>
                    <li>학습률 스케줄링</li>
                    <li>Warmup</li>
                    <li>Gradient Clipping</li>
                </ul>
                <div id="optimization-visualization"></div>
            `,
            'nlp': `
                <p>자연어 처리 분야에서 Transformer의 주요 응용:</p>
                <ul>
                    <li>기계 번역</li>
                    <li>텍스트 요약</li>
                    <li>감성 분석</li>
                    <li>질문 응답</li>
                    <li>텍스트 생성</li>
                </ul>
                <div id="nlp-demo"></div>
            `,
            'cv': `
                <p>컴퓨터 비전 분야에서의 Transformer 응용:</p>
                <ul>
                    <li>이미지 분류</li>
                    <li>객체 검출</li>
                    <li>이미지 캡셔닝</li>
                    <li>이미지 생성</li>
                </ul>
                <div id="cv-demo"></div>
            `,
            'other-domains': `
                <p>기타 도메인에서의 Transformer 응용:</p>
                <ul>
                    <li>음성 인식</li>
                    <li>신약 개발</li>
                    <li>단백질 구조 예측</li>
                    <li>시계열 예측</li>
                </ul>
            `,
            'variants': `
                <p>주요 Transformer 변형 모델:</p>
                <ul>
                    <li>BERT</li>
                    <li>GPT</li>
                    <li>T5</li>
                    <li>ELECTRA</li>
                    <li>XLNet</li>
                </ul>
                <div id="variants-comparison"></div>
            `,
            'scaling': `
                <p>모델 스케일링 기법:</p>
                <ul>
                    <li>더 큰 모델 (파라미터 수 증가)</li>
                    <li>더 많은 데이터</li>
                    <li>더 긴 학습 시간</li>
                    <li>효율적인 스케일링 법칙</li>
                </ul>
                <div id="scaling-visualization"></div>
            `,
            'efficiency': `
                <p>Transformer 효율성 개선 방법:</p>
                <ul>
                    <li>Sparse Attention</li>
                    <li>Reversible Layers</li>
                    <li>Parameter Sharing</li>
                    <li>Quantization</li>
                    <li>Knowledge Distillation</li>
                </ul>
                <div id="efficiency-comparison"></div>
            `
        };
        return content[sectionId] || '<p>컨텐츠를 불러오는 중 오류가 발생했습니다.</p>';
    }

    // 애니메이션을 적용하는 함수
    function applyAnimation(element, animationClass) {
        element.classList.add(animationClass);
        element.addEventListener('animationend', () => {
            element.classList.remove(animationClass);
        }, { once: true });
    }

    // MathJax 렌더링 함수
    function renderMathJax(element) {
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([element]).then(() => {
                console.log('MathJax rendering completed');
            }).catch((err) => console.error('MathJax rendering failed:', err));
        } else {
            console.warn('MathJax not loaded or initialized');
        }
    }

    // Intersection Observer를 사용하여 뷰포트에 들어온 요소에 애니메이션 적용
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.closest('section').id;
                loadContent(sectionId).then(content => {
                    entry.target.innerHTML = content;
                    applyAnimation(entry.target, 'fade-in');
                    initializeInteractiveElements(sectionId, entry.target);
                    renderMathJax(entry.target);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    contentPlaceholders.forEach(placeholder => {
        observer.observe(placeholder);
    });

    // 목차 클릭 이벤트 처리
    document.querySelectorAll('#table-of-contents a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
            applyAnimation(targetElement, 'slide-in');
        });
    });

    // 인터랙티브 요소 초기화 함수
    function initializeInteractiveElements(sectionId, container) {
        switch (sectionId) {
            case 'encoder':
            case 'decoder':
                createTransformerVisualization(sectionId, container.querySelector(`#${sectionId}-visualization`));
                break;
            case 'self-attention':
                createSelfAttentionDemo(container.querySelector('#self-attention-demo'));
                break;
            case 'multi-head':
                createMultiHeadAttentionDemo(container.querySelector('#multi-head-demo'));
                break;
            case 'attention-math':
                createAttentionMathVisualization(container.querySelector('#attention-math-visualization'));
                break;
            case 'finetuning':
                createFineTuningDemo(container.querySelector('#finetuning-demo'));
                break;
            case 'nlp':
                createNLPDemo(container.querySelector('#nlp-demo'));
                break;
            case 'cv':
                createCVDemo(container.querySelector('#cv-demo'));
                break;
            // 필요한 경우 다른 섹션에 대한 처리를 추가할 수 있습니다.
        }
    }

    // Transformer 구조 시각화 함수
    function createTransformerVisualization(type, container) {
        console.log("Creating Transformer visualization:", type); // 디버깅 로그

        const width = 800;
        const height = 600;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.style.border = "1px solid #000"; // SVG 경계 확인을 위한 테두리 추가
        container.appendChild(svg);

        // 배경 추가
        const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        background.setAttribute("width", width);
        background.setAttribute("height", height);
        background.setAttribute("fill", "#ffffff");
        svg.appendChild(background);

        const layers = type === 'encoder' ? 6 : 6;
        const layerWidth = 120;
        const layerHeight = 80;
        const layerGap = (width - layerWidth) / (layers + 1);

        // 화살표 마커 정의
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "10");
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
        polygon.setAttribute("fill", "#000000");
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);

        function createLayer(x, y, label) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", layerWidth);
            rect.setAttribute("height", layerHeight);
            rect.setAttribute("fill", "#e0e0e0");
            rect.setAttribute("stroke", "#000000");
            rect.setAttribute("stroke-width", "2");
            g.appendChild(rect);

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x + layerWidth / 2);
            text.setAttribute("y", y + layerHeight / 2);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("fill", "#000000");
            text.textContent = label;
            g.appendChild(text);

            return g;
        }

        function createArrow(x1, y1, x2, y2) {
            const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
            arrow.setAttribute("x1", x1);
            arrow.setAttribute("y1", y1);
            arrow.setAttribute("x2", x2);
            arrow.setAttribute("y2", y2);
            arrow.setAttribute("stroke", "#000000");
            arrow.setAttribute("stroke-width", "2");
            arrow.setAttribute("marker-end", "url(#arrowhead)");
            return arrow;
        }

        // 레이어 생성 및 추가
        for (let i = 0; i < layers; i++) {
            const x = layerGap * (i + 1);
            const y = height / 2 - layerHeight / 2;
            const layer = createLayer(x, y, `${type.charAt(0).toUpperCase() + type.slice(1)} Layer ${i + 1}`);
            svg.appendChild(layer);

            if (i < layers - 1) {
                const arrow = createArrow(
                    x + layerWidth, y + layerHeight / 2,
                    x + layerGap, y + layerHeight / 2
                );
                svg.appendChild(arrow);
            }
        }

        // 입력 및 출력 표시
        const inputOutput = [
            { label: "Input", x: 10, y: height / 2 - 60 },
            { label: "Output", x: width - 70, y: height / 2 - 60 }
        ];

        inputOutput.forEach(io => {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", io.x);
            text.setAttribute("y", io.y);
            text.setAttribute("fill", "#000000");
            text.textContent = io.label;
            svg.appendChild(text);

            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", io.x);
            rect.setAttribute("y", io.y + 10);
            rect.setAttribute("width", 60);
            rect.setAttribute("height", 100);
            rect.setAttribute("fill", "none");
            rect.setAttribute("stroke", "#000000");
            rect.setAttribute("stroke-width", "2");
            svg.appendChild(rect);
        });

        // 입력에서 첫 번째 레이어로, 마지막 레이어에서 출력으로 화살표 추가 (수정된 부분)
        svg.appendChild(createArrow(70, height / 2, layerGap, height / 2));

        // 마지막 레이어에서 출력으로 가는 화살표 수정
        const lastLayerX = layerGap * layers + layerWidth;
        const lastLayerY = height / 2;
        const outputX = width - 70;
        const outputY = height / 2;
        svg.appendChild(createArrow(lastLayerX, lastLayerY, outputX, outputY));

        // 인코더와 디코더의 특수한 부분 추가
        if (type === 'encoder') {
            addSelfAttention(svg, width, height);
        } else if (type === 'decoder') {
            addMaskedSelfAttention(svg, width, height);
            addEncoderDecoderAttention(svg, width, height, layerHeight);
        }

        // 호버 이벤트 추가
        addHoverEffects(svg);

        console.log("Transformer visualization created"); // 디버깅 로그
    }

    function addSelfAttention(svg, width, height) {
        console.log("Adding Self-Attention"); // 디버깅 로그

        const selfAttention = document.createElementNS("http://www.w3.org/2000/svg", "text");
        selfAttention.setAttribute("x", width / 2);
        selfAttention.setAttribute("y", 30);
        selfAttention.setAttribute("text-anchor", "middle");
        selfAttention.setAttribute("font-weight", "bold");
        selfAttention.setAttribute("fill", "#000000");
        selfAttention.textContent = "Self-Attention Mechanism";
        svg.appendChild(selfAttention);

        const tokenCount = 4;
        const tokenWidth = 40;
        const tokenHeight = 20;
        const tokenGap = 20;
        const startX = (width - (tokenCount * tokenWidth + (tokenCount - 1) * tokenGap)) / 2;
        const startY = 60;

        // 토큰 생성
        for (let i = 0; i < tokenCount; i++) {
            const token = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            token.setAttribute("x", startX + i * (tokenWidth + tokenGap));
            token.setAttribute("y", startY);
            token.setAttribute("width", tokenWidth);
            token.setAttribute("height", tokenHeight);
            token.setAttribute("fill", "#e0e0e0");
            token.setAttribute("stroke", "#000000");
            token.setAttribute("stroke-width", "2");
            svg.appendChild(token);

            const tokenText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tokenText.setAttribute("x", startX + i * (tokenWidth + tokenGap) + tokenWidth / 2);
            tokenText.setAttribute("y", startY + tokenHeight / 2);
            tokenText.setAttribute("text-anchor", "middle");
            tokenText.setAttribute("dominant-baseline", "middle");
            tokenText.setAttribute("fill", "#000000");
            tokenText.textContent = `T${i + 1}`;
            svg.appendChild(tokenText);
        }

        // Self-Attention 연결선 생성
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
        for (let i = 0; i < tokenCount; i++) {
            for (let j = 0; j < tokenCount; j++) {
                if (i !== j) {
                    const curve = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    const startX1 = startX + i * (tokenWidth + tokenGap) + tokenWidth / 2;
                    const startY1 = startY + tokenHeight;
                    const endX1 = startX + j * (tokenWidth + tokenGap) + tokenWidth / 2;
                    const endY1 = startY;
                    const controlX = (startX1 + endX1) / 2;
                    const controlY = startY1 + 40;

                    curve.setAttribute("d", `M ${startX1} ${startY1} Q ${controlX} ${controlY} ${endX1} ${endY1}`);
                    curve.setAttribute("fill", "none");
                    curve.setAttribute("stroke", colors[i]);
                    curve.setAttribute("stroke-width", "2");
                    curve.setAttribute("opacity", "0.5");
                    curve.setAttribute("marker-end", "url(#arrowhead)");
                    svg.appendChild(curve);
                }
            }
        }

        // 설명 텍스트 추가
        const description = document.createElementNS("http://www.w3.org/2000/svg", "text");
        description.setAttribute("x", width / 2);
        description.setAttribute("y", startY + tokenHeight + 80);
        description.setAttribute("text-anchor", "middle");
        description.setAttribute("font-size", "12");
        description.setAttribute("fill", "#000000");
        description.textContent = "각 토큰은 다른 모든 토큰과 관계를 맺습니다";
        svg.appendChild(description);
    }

    function addMaskedSelfAttention(svg, width, height) {
        const maskedSelfAttention = document.createElementNS("http://www.w3.org/2000/svg", "text");
        maskedSelfAttention.setAttribute("x", width / 2);
        maskedSelfAttention.setAttribute("y", 30);
        maskedSelfAttention.setAttribute("text-anchor", "middle");
        maskedSelfAttention.textContent = "Masked Self-Attention";
        svg.appendChild(maskedSelfAttention);

        // Masked self-attention을 나타내는 사선 화살표 추가
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", width / 4);
        line.setAttribute("y1", 50);
        line.setAttribute("x2", 3 * width / 4);
        line.setAttribute("y2", 50);
        line.setAttribute("stroke", "#a00");
        line.setAttribute("stroke-dasharray", "5,5");
        line.setAttribute("marker-end", "url(#arrowhead)");
        svg.appendChild(line);
    }

    function addEncoderDecoderAttention(svg, width, height, layerHeight) {
        const encoderDecoderAttention = document.createElementNS("http://www.w3.org/2000/svg", "text");
        encoderDecoderAttention.setAttribute("x", width / 2);
        encoderDecoderAttention.setAttribute("y", height - 40);
        encoderDecoderAttention.setAttribute("text-anchor", "middle");
        encoderDecoderAttention.textContent = "Encoder-Decoder Attention";
        svg.appendChild(encoderDecoderAttention);

        // Encoder-Decoder attention을 나타내는 수직 화살표 추가
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
        arrow.setAttribute("x1", width / 2);
        arrow.setAttribute("y1", height - 60);
        arrow.setAttribute("x2", width / 2);
        arrow.setAttribute("y2", height / 2 + layerHeight / 2);
        arrow.setAttribute("stroke", "#0a0");
        arrow.setAttribute("stroke-dasharray", "5,5");
        arrow.setAttribute("marker-end", "url(#arrowhead)");
        svg.appendChild(arrow);
    }


    function addHoverEffects(svg) {
        const layers = svg.querySelectorAll("g");
        layers.forEach(layer => {
            layer.addEventListener("mouseover", () => {
                layer.querySelector("rect").setAttribute("fill", "#ffd700");
            });
            layer.addEventListener("mouseout", () => {
                layer.querySelector("rect").setAttribute("fill", "#f0f0f0");
            });
        });
    }

    // 셀프 어텐션 데모 생성 함수
    function createSelfAttentionDemo(container) {
        const demo = document.createElement('div');
        demo.innerHTML = `
            <textarea id="self-attention-input" rows="3" cols="50">Enter a sentence here to visualize self-attention.</textarea>
            <button id="visualize-attention">Visualize Attention</button>
            <div id="attention-visualization"></div>
        `;
        container.appendChild(demo);

        document.getElementById('visualize-attention').addEventListener('click', () => {
            const input = document.getElementById('self-attention-input').value;
            visualizeAttention(input);
        });
    }

    // 어텐션 시각화 함수
    function visualizeAttention(input) {
        const words = input.split(' ');
        const attentionVisualization = document.getElementById('attention-visualization');
        attentionVisualization.innerHTML = '';

        // 어텐션 점수 시뮬레이션 (실제로는 모델이 계산해야 함)
        const attentionScores = simulateAttentionScores(words);

        // 컨테이너 생성
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        attentionVisualization.appendChild(container);

        // 단어 표시
        const wordsContainer = document.createElement('div');
        wordsContainer.style.display = 'flex';
        wordsContainer.style.marginBottom = '10px';
        container.appendChild(wordsContainer);

        words.forEach((word, i) => {
            const wordElement = document.createElement('div');
            wordElement.textContent = word;
            wordElement.style.padding = '5px 10px';
            wordElement.style.margin = '0 5px';
            wordElement.style.cursor = 'pointer';
            wordElement.style.backgroundColor = '#e0e0e0';
            wordElement.style.borderRadius = '5px';
            wordElement.addEventListener('mouseover', () => highlightConnections(i));
            wordElement.addEventListener('mouseout', resetConnections);
            wordsContainer.appendChild(wordElement);
        });

        // 어텐션 매트릭스 생성
        const matrixContainer = document.createElement('div');
        matrixContainer.style.display = 'grid';
        matrixContainer.style.gridTemplateColumns = `repeat(${words.length}, 1fr)`;
        matrixContainer.style.gap = '2px';
        container.appendChild(matrixContainer);

        attentionScores.forEach((row, i) => {
            row.forEach((score, j) => {
                const cell = document.createElement('div');
                cell.style.width = '30px';
                cell.style.height = '30px';
                cell.style.backgroundColor = `rgba(33, 150, 243, ${score})`;
                cell.dataset.row = i;
                cell.dataset.col = j;
                matrixContainer.appendChild(cell);
            });
        });

        function highlightConnections(index) {
            const cells = matrixContainer.childNodes;
            cells.forEach((cell) => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                if (row === index || col === index) {
                    cell.style.border = '2px solid #FF5722';
                } else {
                    cell.style.opacity = '0.3';
                }
            });
        }

        function resetConnections() {
            const cells = matrixContainer.childNodes;
            cells.forEach((cell) => {
                cell.style.border = 'none';
                cell.style.opacity = '1';
            });
        }
    }

    function simulateAttentionScores(words) {
        const length = words.length;
        return Array.from({ length }, () =>
            Array.from({ length }, () => Math.random()).map(score => score / words.length)
        );
    }

    // 멀티헤드 어텐션 데모 생성 함수
    function createMultiHeadAttentionDemo(container) {
        const demo = document.createElement('div');
        demo.innerHTML = `
            <h4>멀티헤드 어텐션 데모</h4>
            <div>
                <label for="input-sentence">입력 문장:</label>
                <input type="text" id="input-sentence" value="The cat sat on the mat." />
                <button id="visualize-multi-head">시각화</button>
            </div>
            <div id="multi-head-visualization" style="margin-top: 20px;"></div>
        `;
        container.appendChild(demo);

        const visualizeButton = demo.querySelector('#visualize-multi-head');
        visualizeButton.addEventListener('click', () => {
            const inputSentence = demo.querySelector('#input-sentence').value;
            visualizeMultiHeadAttention(inputSentence);
        });

        function visualizeMultiHeadAttention(sentence) {
            const words = sentence.split(' ');
            const numHeads = 4; // 예시로 4개의 헤드를 사용
            const visualizationContainer = demo.querySelector('#multi-head-visualization');
            visualizationContainer.innerHTML = '';

            // 각 헤드에 대한 컨테이너 생성
            for (let head = 0; head < numHeads; head++) {
                const headContainer = document.createElement('div');
                headContainer.className = 'attention-head';
                headContainer.style.marginBottom = '20px';
                headContainer.innerHTML = `<h5>헤드 ${head + 1}</h5>`;
                visualizationContainer.appendChild(headContainer);

                // 각 단어에 대한 어텐션 점수를 시뮬레이션 (실제로는 모델이 계산)
                const attentionScores = words.map(() => words.map(() => Math.random()));

                // 단어 그리드 생성
                const gridContainer = document.createElement('div');
                gridContainer.style.display = 'grid';
                gridContainer.style.gridTemplateColumns = `repeat(${words.length}, 1fr)`;
                gridContainer.style.gap = '5px';
                headContainer.appendChild(gridContainer);

                words.forEach((word, i) => {
                    const wordElement = document.createElement('div');
                    wordElement.textContent = word;
                    wordElement.style.padding = '5px';
                    wordElement.style.border = '1px solid #ddd';
                    wordElement.style.textAlign = 'center';
                    wordElement.style.position = 'relative';
                    wordElement.style.cursor = 'pointer';

                    wordElement.addEventListener('mouseover', () => {
                        words.forEach((_, j) => {
                            const line = document.createElement('div');
                            const score = attentionScores[i][j];
                            line.style.position = 'absolute';
                            line.style.height = '2px';
                            line.style.background = `rgba(255, 0, 0, ${score})`;
                            line.style.width = '100%';
                            line.style.bottom = `-${(j + 1) * 3}px`;
                            line.style.left = '0';
                            wordElement.appendChild(line);

                            // 점수를 표시하는 툴팁
                            const tooltip = document.createElement('div');
                            tooltip.textContent = score.toFixed(2);
                            tooltip.style.position = 'absolute';
                            tooltip.style.backgroundColor = 'black';
                            tooltip.style.color = 'white';
                            tooltip.style.padding = '2px 5px';
                            tooltip.style.borderRadius = '3px';
                            tooltip.style.fontSize = '12px';
                            tooltip.style.bottom = `-${(j + 1) * 3 + 15}px`;
                            tooltip.style.left = '50%';
                            tooltip.style.transform = 'translateX(-50%)';
                            wordElement.appendChild(tooltip);
                        });
                    });

                    wordElement.addEventListener('mouseout', () => {
                        while (wordElement.childNodes.length > 1) {
                            wordElement.removeChild(wordElement.lastChild);
                        }
                    });

                    gridContainer.appendChild(wordElement);
                });
            }

            // 헤드 결합에 대한 설명 추가
            const combinationExplanation = document.createElement('div');
            combinationExplanation.innerHTML = `
                <h5>헤드 결합</h5>
                <p>멀티헤드 어텐션에서는 각 헤드의 결과를 결합하여 최종 출력을 생성합니다. 
                이를 통해 모델은 입력의 다양한 측면을 동시에 고려할 수 있습니다.</p>
            `;
            visualizationContainer.appendChild(combinationExplanation);
        }

        // 초기 시각화 실행
        visualizeMultiHeadAttention("The cat sat on the mat.");
    }

    // 어텐션 수학 시각화 함수
    function createAttentionMathVisualization(container) {
        const demo = document.createElement('div');
        demo.innerHTML = `
            <h4>어텐션 수학 시각화</h4>
            <div>
                <label for="query-input">쿼리(Q):</label>
                <input type="text" id="query-input" value="0.5,0.8" />
            </div>
            <div>
                <label for="key-input">키(K):</label>
                <input type="text" id="key-input" value="0.2,0.3;0.4,0.6" />
            </div>
            <div>
                <label for="value-input">값(V):</label>
                <input type="text" id="value-input" value="0.1,0.9;0.5,0.5" />
            </div>
            <button id="calculate-attention">계산</button>
            <div id="attention-calculation" style="margin-top: 20px;"></div>
        `;
        container.appendChild(demo);

        const calculateButton = demo.querySelector('#calculate-attention');
        calculateButton.addEventListener('click', visualizeAttentionMath);

        function visualizeAttentionMath() {
            const query = parseInput(demo.querySelector('#query-input').value);
            const key = parseInput(demo.querySelector('#key-input').value);
            const value = parseInput(demo.querySelector('#value-input').value);

            const calculationContainer = demo.querySelector('#attention-calculation');
            calculationContainer.innerHTML = '';

            // Step 1: Q * K^T 계산
            const step1 = document.createElement('div');
            step1.innerHTML = '<h5>Step 1: $Q \\cdot K^T$ 계산</h5>';
            const qkt = matrixMultiply(query, transposeMatrix(key));
            step1.appendChild(createMatrix(qkt, 'Q * K^T'));
            calculationContainer.appendChild(step1);

            // Step 2: 스케일링 (√d_k로 나누기)
            const step2 = document.createElement('div');
            step2.innerHTML = '<h5>Step 2: 스케일링 ($\\frac{1}{\\sqrt{d_k}}$로 나누기)</h5>';
            const scaledQKT = scaleMatrix(qkt, 1 / Math.sqrt(key[0].length));
            step2.appendChild(createMatrix(scaledQKT, `\\[\\text{Scaled } Q \\cdot K^T = \\frac{Q \\cdot K^T}{\\sqrt{d_k}}\\]`));
            calculationContainer.appendChild(step2);

            // Step 3: Softmax 적용
            const step3 = document.createElement('div');
            step3.innerHTML = '<h5>Step 3: Softmax 적용</h5>';
            const softmaxQKT = applySoftmax(scaledQKT);
            step3.appendChild(createMatrix(softmaxQKT, `\\[\\text{Softmax}(\\text{Scaled } Q \\cdot K^T) = \\text{Softmax}\\left(\\frac{Q \\cdot K^T}{\\sqrt{d_k}}\\right)\\]`));
            calculationContainer.appendChild(step3);

            // Step 4: Softmax(QK^T) * V 계산
            const step4 = document.createElement('div');
            step4.innerHTML = '<h5>Step 4: $\\text{Softmax}(QK^T) \\cdot V$ 계산</h5>';
            const attention = matrixMultiply(softmaxQKT, value);
            step4.appendChild(createMatrix(attention, 'Attention'));
            calculationContainer.appendChild(step4);

            // 최종 결과 설명
            const explanation = document.createElement('p');
            explanation.textContent = '이것이 최종 어텐션 출력입니다. 각 행은 쿼리에 대한 어텐션 가중치가 적용된 값의 가중합을 나타냅니다.';
            calculationContainer.appendChild(explanation);
        }

        function parseInput(input) {
            return input.split(';').map(row => row.split(',').map(Number));
        }

        function transposeMatrix(matrix) {
            return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
        }

        function matrixMultiply(a, b) {
            return a.map(row =>
                b[0].map((_, i) =>
                    row.reduce((sum, cell, j) => sum + cell * b[j][i], 0)
                )
            );
        }

        function scaleMatrix(matrix, scale) {
            return matrix.map(row => row.map(cell => cell * scale));
        }

        function applySoftmax(matrix) {
            return matrix.map(row => {
                const expValues = row.map(Math.exp);
                const sumExp = expValues.reduce((a, b) => a + b, 0);
                return expValues.map(exp => exp / sumExp);
            });
        }

        function createMatrix(matrix, label) {
            const table = document.createElement('table');
            table.style.borderCollapse = 'collapse';
            table.style.margin = '10px 0';

            const caption = table.createCaption();
            caption.textContent = label;

            matrix.forEach(row => {
                const tr = table.insertRow();
                row.forEach(cell => {
                    const td = tr.insertCell();
                    td.textContent = cell.toFixed(4);
                    td.style.border = '1px solid black';
                    td.style.padding = '5px';
                });
            });

            return table;
        }

        // 초기 시각화 실행
        visualizeAttentionMath();
    }

    // 파인튜닝 데모 생성 함수
    function createFineTuningDemo(container) {
        const demo = document.createElement('div');
        demo.innerHTML = `
            <h4>모델 파인튜닝 데모</h4>
            <div>
                <label for="task-select">태스크 선택:</label>
                <select id="task-select">
                    <option value="sentiment">감성 분석</option>
                    <option value="translation">기계 번역</option>
                    <option value="summarization">텍스트 요약</option>
                </select>
            </div>
            <div>
                <label for="dataset-size">데이터셋 크기:</label>
                <input type="range" id="dataset-size" min="100" max="10000" step="100" value="1000">
                <span id="dataset-size-value">1000</span>
            </div>
            <div>
                <label for="epochs">학습 에폭:</label>
                <input type="number" id="epochs" min="1" max="50" value="5">
            </div>
            <div>
                <label for="learning-rate">학습률:</label>
                <input type="number" id="learning-rate" min="0.0001" max="0.1" step="0.0001" value="0.001">
            </div>
            <button id="start-finetuning">파인튜닝 시작</button>
            <div id="finetuning-progress" style="margin-top: 20px;">
                <div id="progress-bar" style="width: 0%; height: 20px; background-color: #4CAF50;"></div>
            </div>
            <div id="finetuning-results" style="margin-top: 20px;"></div>
        `;
        container.appendChild(demo);

        const taskSelect = demo.querySelector('#task-select');
        const datasetSizeInput = demo.querySelector('#dataset-size');
        const datasetSizeValue = demo.querySelector('#dataset-size-value');
        const epochsInput = demo.querySelector('#epochs');
        const learningRateInput = demo.querySelector('#learning-rate');
        const startButton = demo.querySelector('#start-finetuning');
        const progressBar = demo.querySelector('#progress-bar');
        const resultsContainer = demo.querySelector('#finetuning-results');

        datasetSizeInput.addEventListener('input', (e) => {
            datasetSizeValue.textContent = e.target.value;
        });

        startButton.addEventListener('click', startFineTuning);

        function startFineTuning() {
            const task = taskSelect.value;
            const datasetSize = parseInt(datasetSizeInput.value);
            const epochs = parseInt(epochsInput.value);
            const learningRate = parseFloat(learningRateInput.value);

            // 파인튜닝 시뮬레이션 시작
            simulateFineTuning(task, datasetSize, epochs, learningRate);
        }

        function createChart(container, label, color) {
            const chartContainer = document.createElement('div');
            chartContainer.style.width = '300px';
            chartContainer.style.height = '200px';
            chartContainer.style.border = '1px solid #ccc';
            chartContainer.style.position = 'relative';
            chartContainer.style.marginBottom = '20px';

            const titleElement = document.createElement('div');
            titleElement.textContent = label;
            titleElement.style.textAlign = 'center';
            chartContainer.appendChild(titleElement);

            const canvasElement = document.createElement('div');
            canvasElement.style.width = '100%';
            canvasElement.style.height = '180px';
            canvasElement.style.position = 'relative';
            chartContainer.appendChild(canvasElement);

            container.appendChild(chartContainer);

            return {
                container: canvasElement,
                data: [],
                color: color
            };
        }

        function updateChart(chart, epoch, value) {
            chart.data.push({ x: epoch, y: value });
            drawChart(chart);
        }

        function drawChart(chart) {
            const { container, data, color } = chart;
            container.innerHTML = '';
            const width = container.clientWidth;
            const height = container.clientHeight;
            const padding = 20;
            const maxY = Math.max(...data.map(d => d.y), 1);

            // y축
            const yAxis = document.createElement('div');
            yAxis.style.position = 'absolute';
            yAxis.style.left = '0';
            yAxis.style.top = '0';
            yAxis.style.bottom = '0';
            yAxis.style.width = '1px';
            yAxis.style.backgroundColor = '#000';
            container.appendChild(yAxis);

            // x축
            const xAxis = document.createElement('div');
            xAxis.style.position = 'absolute';
            xAxis.style.left = '0';
            xAxis.style.right = '0';
            xAxis.style.bottom = '0';
            xAxis.style.height = '1px';
            xAxis.style.backgroundColor = '#000';
            container.appendChild(xAxis);

            // 데이터 포인트
            data.forEach((point, index) => {
                if (index === 0) return;
                const x1 = (data[index - 1].x / data.length) * width;
                const y1 = height - (data[index - 1].y / maxY) * (height - padding);
                const x2 = (point.x / data.length) * width;
                const y2 = height - (point.y / maxY) * (height - padding);

                const line = document.createElement('div');
                line.style.position = 'absolute';
                line.style.left = `${x1}px`;
                line.style.bottom = `${y1}px`;
                line.style.width = `${x2 - x1}px`;
                line.style.height = '2px';
                line.style.backgroundColor = color;
                line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
                line.style.transformOrigin = 'left bottom';
                container.appendChild(line);

                const dot = document.createElement('div');
                dot.style.position = 'absolute';
                dot.style.left = `${x2}px`;
                dot.style.bottom = `${y2}px`;
                dot.style.width = '4px';
                dot.style.height = '4px';
                dot.style.borderRadius = '50%';
                dot.style.backgroundColor = color;
                container.appendChild(dot);
            });
        }

        // simulateFineTuning 함수 내부의 변경사항

        function simulateFineTuning(task, datasetSize, epochs, learningRate) {
            let currentEpoch = 0;
            let accuracy = 0.5;
            const accuracyGain = (0.9 - accuracy) / epochs;
            const lossReduction = 0.5 / epochs;

            resultsContainer.innerHTML = '<h5>파인튜닝 결과</h5>';
            const accuracyChart = createChart(resultsContainer, '정확도', 'rgb(75, 192, 192)');
            const lossChart = createChart(resultsContainer, '손실', 'rgb(255, 99, 132)');

            function updateProgress() {
                currentEpoch++;
                const progress = (currentEpoch / epochs) * 100;
                progressBar.style.width = `${progress}%`;

                accuracy += accuracyGain * (1 + Math.random() * 0.2 - 0.1);
                const loss = Math.max(0, 0.5 - lossReduction * currentEpoch * (1 + Math.random() * 0.2 - 0.1));

                updateChart(accuracyChart, currentEpoch, accuracy);
                updateChart(lossChart, currentEpoch, loss);

                if (currentEpoch < epochs) {
                    setTimeout(updateProgress, 1000);
                } else {
                    finishFineTuning(task, accuracy);
                }
            }

            updateProgress();
        }

        function finishFineTuning(task, finalAccuracy) {
            const taskResults = {
                'sentiment': '긍정/부정 분류',
                'translation': '번역 품질 (BLEU 점수)',
                'summarization': '요약 품질 (ROUGE 점수)'
            };

            const resultMessage = document.createElement('p');
            resultMessage.textContent = `파인튜닝 완료! 최종 ${taskResults[task]} 성능: ${(finalAccuracy * 100).toFixed(2)}%`;
            resultsContainer.appendChild(resultMessage);

            const testButton = document.createElement('button');
            testButton.textContent = '파인튜닝된 모델 테스트';
            testButton.addEventListener('click', () => testFineTunedModel(task, finalAccuracy));
            resultsContainer.appendChild(testButton);
        }

        function testFineTunedModel(task, accuracy) {
            const testContainer = document.createElement('div');
            testContainer.innerHTML = '<h5>파인튜닝된 모델 테스트</h5>';
            resultsContainer.appendChild(testContainer);

            const inputField = document.createElement('textarea');
            inputField.placeholder = '테스트할 텍스트를 입력하세요...';
            testContainer.appendChild(inputField);

            const testButton = document.createElement('button');
            testButton.textContent = '테스트 실행';
            testContainer.appendChild(testButton);

            const resultDisplay = document.createElement('div');
            testContainer.appendChild(resultDisplay);

            testButton.addEventListener('click', () => {
                const input = inputField.value;
                let result;
                switch (task) {
                    case 'sentiment':
                        result = Math.random() < accuracy ? '긍정적' : '부정적';
                        break;
                    case 'translation':
                        result = `번역된 텍스트 (정확도: ${(accuracy * 100).toFixed(2)}%)`;
                        break;
                    case 'summarization':
                        result = `요약된 텍스트 (품질: ${(accuracy * 100).toFixed(2)}%)`;
                        break;
                }
                resultDisplay.textContent = `결과: ${result}`;
            });
        }
    }

    // NLP 데모 생성 함수
    function createNLPDemo(container) {
        const demo = document.createElement('div');
        demo.innerHTML = `
            <h4>NLP 태스크 데모</h4>
            <div>
                <label for="nlp-task">태스크 선택:</label>
                <select id="nlp-task">
                    <option value="sentiment">감성 분석</option>
                    <option value="ner">개체명 인식</option>
                    <option value="summarization">텍스트 요약</option>
                </select>
            </div>
            <div>
                <textarea id="nlp-input" rows="5" cols="50" placeholder="분석할 텍스트를 입력하세요..."></textarea>
            </div>
            <button id="run-nlp">분석 실행</button>
            <div id="nlp-result" style="margin-top: 20px;"></div>
        `;
        container.appendChild(demo);

        const taskSelect = demo.querySelector('#nlp-task');
        const inputTextarea = demo.querySelector('#nlp-input');
        const runButton = demo.querySelector('#run-nlp');
        const resultContainer = demo.querySelector('#nlp-result');

        runButton.addEventListener('click', runNLPTask);

        function runNLPTask() {
            const task = taskSelect.value;
            const inputText = inputTextarea.value;

            if (!inputText.trim()) {
                resultContainer.innerHTML = '<p style="color: red;">텍스트를 입력해주세요.</p>';
                return;
            }

            let result;
            switch (task) {
                case 'sentiment':
                    result = performSentimentAnalysis(inputText);
                    break;
                case 'ner':
                    result = performNamedEntityRecognition(inputText);
                    break;
                case 'summarization':
                    result = performTextSummarization(inputText);
                    break;
            }

            displayResult(task, result);
        }

        function performSentimentAnalysis(text) {
            // 간단한 감성 분석 시뮬레이션
            const positiveWords = ['좋은', '훌륭한', '멋진', '행복한', '즐거운'];
            const negativeWords = ['나쁜', '슬픈', '화난', '실망한', '불행한'];

            let score = 0;
            text.split(' ').forEach(word => {
                if (positiveWords.includes(word)) score += 1;
                if (negativeWords.includes(word)) score -= 1;
            });

            if (score > 0) return '긍정적';
            if (score < 0) return '부정적';
            return '중립적';
        }

        function performNamedEntityRecognition(text) {
            // 간단한 개체명 인식 시뮬레이션
            const entities = [
                { type: '인물', words: ['김철수', '이영희', '박민수'] },
                { type: '장소', words: ['서울', '부산', '대전', '광주'] },
                { type: '조직', words: ['삼성', 'LG', '현대', 'SK'] }
            ];

            const words = text.split(' ');
            const recognizedEntities = [];

            words.forEach(word => {
                entities.forEach(entity => {
                    if (entity.words.includes(word)) {
                        recognizedEntities.push({ word, type: entity.type });
                    }
                });
            });

            return recognizedEntities;
        }

        function performTextSummarization(text) {
            // 간단한 텍스트 요약 시뮬레이션
            const sentences = text.split('.').filter(s => s.trim());
            const numSentences = sentences.length;
            const summaryLength = Math.max(1, Math.floor(numSentences / 3));

            // 간단히 처음 몇 문장을 요약으로 선택
            return sentences.slice(0, summaryLength).join('. ') + '.';
        }

        function displayResult(task, result) {
            let htmlResult = '<h5>분석 결과</h5>';

            switch (task) {
                case 'sentiment':
                    htmlResult += `<p>감성 분석 결과: <strong>${result}</strong></p>`;
                    break;
                case 'ner':
                    htmlResult += '<p>인식된 개체:</p><ul>';
                    result.forEach(entity => {
                        htmlResult += `<li>${entity.word} - ${entity.type}</li>`;
                    });
                    htmlResult += '</ul>';
                    break;
                case 'summarization':
                    htmlResult += `<p>요약:</p><blockquote>${result}</blockquote>`;
                    break;
            }

            resultContainer.innerHTML = htmlResult;
        }
    }

    // CV 데모 생성 함수
    function createCVDemo(container) {
        const demo = document.createElement('div');
        demo.innerHTML = `
            <h4>컴퓨터 비전 태스크 데모</h4>
            <div>
                <label for="cv-task">태스크 선택:</label>
                <select id="cv-task">
                    <option value="classification">이미지 분류</option>
                    <option value="detection">객체 검출</option>
                    <option value="captioning">이미지 캡셔닝</option>
                </select>
            </div>
            <div>
                <input type="file" id="image-upload" accept="image/*">
            </div>
            <div>
                <canvas id="cv-canvas" width="300" height="300" style="border:1px solid #000000;"></canvas>
            </div>
            <button id="run-cv">분석 실행</button>
            <div id="cv-result" style="margin-top: 20px;"></div>
        `;
        container.appendChild(demo);

        const taskSelect = demo.querySelector('#cv-task');
        const imageUpload = demo.querySelector('#image-upload');
        const canvas = demo.querySelector('#cv-canvas');
        const runButton = demo.querySelector('#run-cv');
        const resultContainer = demo.querySelector('#cv-result');

        let currentImage = null;

        imageUpload.addEventListener('change', handleImageUpload);
        runButton.addEventListener('click', runCVTask);

        function handleImageUpload(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = new Image();
                    img.onload = function () {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
                        currentImage = img;
                    }
                    img.src = event.target.result;
                }
                reader.readAsDataURL(file);
            }
        }

        function runCVTask() {
            if (!currentImage) {
                resultContainer.innerHTML = '<p style="color: red;">이미지를 먼저 업로드해주세요.</p>';
                return;
            }

            const task = taskSelect.value;
            let result;

            switch (task) {
                case 'classification':
                    result = performImageClassification();
                    break;
                case 'detection':
                    result = performObjectDetection();
                    break;
                case 'captioning':
                    result = performImageCaptioning();
                    break;
            }

            displayResult(task, result);
        }

        function performImageClassification() {
            // 이미지 분류 시뮬레이션
            const categories = ['고양이', '강아지', '새', '자동차', '꽃'];
            const randomIndex = Math.floor(Math.random() * categories.length);
            const confidence = Math.random().toFixed(2);
            return {
                category: categories[randomIndex],
                confidence: confidence
            };
        }

        function performObjectDetection() {
            // 객체 검출 시뮬레이션
            const objects = ['사람', '자동차', '나무', '건물', '동물'];
            const numObjects = Math.floor(Math.random() * 3) + 1;
            const detections = [];

            for (let i = 0; i < numObjects; i++) {
                const obj = objects[Math.floor(Math.random() * objects.length)];
                const x = Math.floor(Math.random() * (canvas.width - 50));
                const y = Math.floor(Math.random() * (canvas.height - 50));
                const width = Math.floor(Math.random() * 50) + 30;
                const height = Math.floor(Math.random() * 50) + 30;
                detections.push({ object: obj, x, y, width, height });
            }

            return detections;
        }

        function performImageCaptioning() {
            // 이미지 캡셔닝 시뮬레이션
            const captions = [
                "푸른 하늘 아래 펼쳐진 아름다운 풍경",
                "도시의 번화가에서 바쁘게 움직이는 사람들",
                "숲 속에서 평화롭게 쉬고 있는 동물들",
                "화려한 색채로 가득한 꽃밭",
                "해변에서 일몰을 감상하는 사람들"
            ];
            return captions[Math.floor(Math.random() * captions.length)];
        }

        function displayResult(task, result) {
            let htmlResult = '<h5>분석 결과</h5>';

            switch (task) {
                case 'classification':
                    htmlResult += `<p>분류 결과: <strong>${result.category}</strong> (신뢰도: ${result.confidence})</p>`;
                    break;
                case 'detection':
                    htmlResult += '<p>검출된 객체:</p><ul>';
                    result.forEach(detection => {
                        htmlResult += `<li>${detection.object} (x: ${detection.x}, y: ${detection.y}, 너비: ${detection.width}, 높이: ${detection.height})</li>`;
                        drawDetectionBox(detection);
                    });
                    htmlResult += '</ul>';
                    break;
                case 'captioning':
                    htmlResult += `<p>이미지 설명: "${result}"</p>`;
                    break;
            }

            resultContainer.innerHTML = htmlResult;
        }

        function drawDetectionBox(detection) {
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.strokeRect(detection.x, detection.y, detection.width, detection.height);
            ctx.fillStyle = '#00FF00';
            ctx.font = '12px Arial';
            ctx.fillText(detection.object, detection.x, detection.y - 5);
        }
    }
});