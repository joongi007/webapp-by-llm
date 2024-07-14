(
    () => {
        // 프랙탈 파라미터
        let params = {
            type: 'tree',
            iterations: 8,
            startColor: '#000000',
            endColor: '#ffffff',
            branchAngle: 30,
            branchRatio: 0.7
        };

        // 캔버스 설정
        const canvas = document.getElementById('fractalCanvas');
        const ctx = canvas.getContext('2d');

        // 줌 및 팬 변수
        let zoomLevel = 1;
        let panX = 0;
        let panY = 0;

        // 애니메이션 ID
        let animationId = null;

        // 프랙탈 생성 함수
        function generateFractal(params) {
            switch (params.type) {
                case 'tree':
                    return generateTree(params);
                case 'mandelbrot':
                    return generateMandelbrot(params);
                case 'julia':
                    return generateJulia(params);
                case 'sierpinski':
                    return generateSierpinski(params);
            }
        }

        // 트리 프랙탈 생성
        function generateTree(params) {
            return (x, y, length, angle, depth) => {
                if (depth >= params.iterations) return;

                const endX = x + length * Math.cos(angle);
                const endY = y + length * Math.sin(angle);

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = interpolateColor(params.startColor, params.endColor, depth / params.iterations);
                ctx.stroke();

                generateTree(params)(endX, endY, length * params.branchRatio, angle - params.branchAngle * Math.PI / 180, depth + 1);
                generateTree(params)(endX, endY, length * params.branchRatio, angle + params.branchAngle * Math.PI / 180, depth + 1);
            };
        }

        // 만델브로트 집합 생성
        function generateMandelbrot(params) {
            return () => {
                const maxIterations = params.iterations * 10;
                const zoom = 250;
                for (let x = 0; x < canvas.width; x++) {
                    for (let y = 0; y < canvas.height; y++) {
                        let a = (x - canvas.width / 2) / zoom;
                        let b = (y - canvas.height / 2) / zoom;
                        let ca = a;
                        let cb = b;
                        let n = 0;
                        while (n < maxIterations) {
                            let aa = a * a - b * b;
                            let bb = 2 * a * b;
                            a = aa + ca;
                            b = bb + cb;
                            if (a * a + b * b > 16) {
                                break;
                            }
                            n++;
                        }
                        let bright = interpolateColor(params.startColor, params.endColor, n / maxIterations);
                        ctx.fillStyle = bright;
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            };
        }

        // 줄리아 집합 생성
        function generateJulia(params) {
            return () => {
                const maxIterations = params.iterations * 10;
                const zoom = 250;
                const cx = -0.7;
                const cy = 0.27015;
                for (let x = 0; x < canvas.width; x++) {
                    for (let y = 0; y < canvas.height; y++) {
                        let a = (x - canvas.width / 2) / zoom;
                        let b = (y - canvas.height / 2) / zoom;
                        let n = 0;
                        while (n < maxIterations) {
                            let aa = a * a - b * b;
                            let bb = 2 * a * b;
                            a = aa + cx;
                            b = bb + cy;
                            if (a * a + b * b > 16) {
                                break;
                            }
                            n++;
                        }
                        let bright = interpolateColor(params.startColor, params.endColor, n / maxIterations);
                        ctx.fillStyle = bright;
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            };
        }

        // 시에르핀스키 삼각형 생성
        function generateSierpinski(params) {
            return () => {
                function drawTriangle(x1, y1, x2, y2, x3, y3, depth) {
                    if (depth === 0) {
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.lineTo(x3, y3);
                        ctx.closePath();
                        ctx.fillStyle = interpolateColor(params.startColor, params.endColor, depth / params.iterations);
                        ctx.fill();
                    } else {
                        let x12 = (x1 + x2) / 2;
                        let y12 = (y1 + y2) / 2;
                        let x23 = (x2 + x3) / 2;
                        let y23 = (y2 + y3) / 2;
                        let x31 = (x3 + x1) / 2;
                        let y31 = (y3 + y1) / 2;

                        drawTriangle(x1, y1, x12, y12, x31, y31, depth - 1);
                        drawTriangle(x12, y12, x2, y2, x23, y23, depth - 1);
                        drawTriangle(x31, y31, x23, y23, x3, y3, depth - 1);
                    }
                }

                let h = canvas.height * 0.9;
                let w = (Math.sqrt(3) / 2) * h;
                let x = (canvas.width - w) / 2;
                let y = canvas.height * 0.95;

                drawTriangle(x, y, x + w, y, x + w / 2, y - h, params.iterations);
            };
        }

        // 프랙탈 렌더링 함수
        function renderFractal() {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(panX, panY);
            ctx.scale(zoomLevel, zoomLevel);

            const fractalGenerator = generateFractal(params);

            if (params.type === 'tree') {
                fractalGenerator(canvas.width / 2, canvas.height, canvas.height / 4, -Math.PI / 2, 0);
            } else {
                fractalGenerator();
            }
        }

        // 색상 보간 함수
        function interpolateColor(color1, color2, factor) {
            const r1 = parseInt(color1.substr(1, 2), 16);
            const g1 = parseInt(color1.substr(3, 2), 16);
            const b1 = parseInt(color1.substr(5, 2), 16);

            const r2 = parseInt(color2.substr(1, 2), 16);
            const g2 = parseInt(color2.substr(3, 2), 16);
            const b2 = parseInt(color2.substr(5, 2), 16);

            const r = Math.round(r1 + factor * (r2 - r1));
            const g = Math.round(g1 + factor * (g2 - g1));
            const b = Math.round(b1 + factor * (b2 - b1));

            return `rgb(${r}, ${g}, ${b})`;
        }

        // 공유 링크 생성 함수
        function generateShareLink() {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            document.getElementById('shareLink').value = url.toString();
        }

        // URL에서 파라미터 로드
        function loadParamsFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            for (let [key, value] of urlParams) {
                if (key in params) {
                    params[key] = isNaN(value) ? value : parseFloat(value);
                }
            }
        }

        // 컨트롤 업데이트 함수
        function updateControls() {
            document.getElementById('fractalType').value = params.type;
            document.getElementById('iterations').value = params.iterations;
            document.getElementById('startColor').value = params.startColor;
            document.getElementById('endColor').value = params.endColor;
            document.getElementById('branchAngle').value = params.branchAngle;
            document.getElementById('branchRatio').value = params.branchRatio * 100;

            updateSliderValue(document.getElementById('iterations'), document.getElementById('iterationsValue'));
            updateSliderValue(document.getElementById('branchAngle'), document.getElementById('branchAngleValue'));
            updateSliderValue(document.getElementById('branchRatio'), document.getElementById('branchRatioValue'));
        }

        // 슬라이더 값 업데이트 함수
        function updateSliderValue(slider, valueSpan) {
            valueSpan.textContent = slider.value + (slider.id === 'branchAngle' ? '°' : '%');
        }

        // 랜덤 파라미터 생성 함수
        function randomizeParams() {
            params.type = ['tree', 'mandelbrot', 'julia', 'sierpinski'][Math.floor(Math.random() * 4)];
            params.iterations = Math.floor(Math.random() * 10) + 3;
            params.startColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            params.endColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            params.branchAngle = Math.random() * 90;
            params.branchRatio = Math.random() * 0.5 + 0.5;
        }

        // 애니메이션 토글 함수
        function toggleAnimation() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            } else {
                animate();
            }
        }

        // 애니메이션 함수
        function animate() {
            params.branchAngle = 30 + 10 * Math.sin(Date.now() * 0.001);
            params.branchRatio = 0.7 + 0.1 * Math.sin(Date.now() * 0.0007);
            renderFractal();
            animationId = requestAnimationFrame(animate);
        }

        // 프랙탈 저장 함수
        function saveFractal() {
            const link = document.createElement('a');
            link.download = 'fractal.png';
            link.href = canvas.toDataURL();
            link.click();
        }

        // 공유 링크 복사 함수
        function copyShareLink() {
            const shareLink = document.getElementById('shareLink');
            shareLink.select();
            document.execCommand('copy');
            alert('링크가 클립보드에 복사되었습니다!');
        }

        // 줌 처리 함수
        function handleZoom(e) {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const scale = e.deltaY < 0 ? 1.1 : 0.9;
            zoomLevel *= scale;

            panX += (x - panX) * (1 - scale);
            panY += (y - panY) * (1 - scale);

            renderFractal();
        }

        // 패닝 시작 함수
        function startPan(e) {
            canvas.style.cursor = 'grabbing';
            canvas.addEventListener('mousemove', pan);
            canvas.addEventListener('mouseup', endPan);
            canvas.addEventListener('mouseleave', endPan);
            lastX = e.clientX;
            lastY = e.clientY;
        }

        // 패닝 함수
        function pan(e) {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            panX += dx;
            panY += dy;
            lastX = e.clientX;
            lastY = e.clientY;
            renderFractal();
        }

        // 패닝 종료 함수
        function endPan() {
            canvas.style.cursor = 'grab';
            canvas.removeEventListener('mousemove', pan);
            canvas.removeEventListener('mouseup', endPan);
            canvas.removeEventListener('mouseleave', endPan);
        }

        // 이벤트 리스너 설정
        function setupEventListeners() {
            document.getElementById('generate').addEventListener('click', () => {
                renderFractal();
                generateShareLink();
            });

            document.getElementById('random').addEventListener('click', () => {
                randomizeParams();
                updateControls();
                renderFractal();
                generateShareLink();
            });

            document.getElementById('animate').addEventListener('click', toggleAnimation);

            document.getElementById('save').addEventListener('click', saveFractal);

            document.getElementById('copyLink').addEventListener('click', copyShareLink);

            document.getElementById('fractalType').addEventListener('change', (e) => {
                params.type = e.target.value;
                renderFractal();
                generateShareLink();
            });

            document.getElementById('iterations').addEventListener('input', (e) => {
                params.iterations = parseInt(e.target.value);
                updateSliderValue(e.target, document.getElementById('iterationsValue'));
                renderFractal();
                generateShareLink();
            });

            document.getElementById('startColor').addEventListener('input', (e) => {
                params.startColor = e.target.value;
                renderFractal();
                generateShareLink();
            });

            document.getElementById('endColor').addEventListener('input', (e) => {
                params.endColor = e.target.value;
                renderFractal();
                generateShareLink();
            });

            document.getElementById('branchAngle').addEventListener('input', (e) => {
                params.branchAngle = parseFloat(e.target.value);
                updateSliderValue(e.target, document.getElementById('branchAngleValue'));
                renderFractal();
                generateShareLink();
            });

            document.getElementById('branchRatio').addEventListener('input', (e) => {
                params.branchRatio = parseFloat(e.target.value) / 100;
                updateSliderValue(e.target, document.getElementById('branchRatioValue'));
                renderFractal();
                generateShareLink();
            });

            canvas.addEventListener('wheel', handleZoom);
            canvas.addEventListener('mousedown', startPan);
            canvas.style.cursor = 'grab';
        }

        // 초기화 함수
        function init() {
            loadParamsFromURL();
            updateControls();
            renderFractal();
            generateShareLink();
            setupEventListeners();
        }

        // 캔버스 크기 설정 함수
        function setCanvasSize() {
            canvas.width = Math.min(800, window.innerWidth - 40);
            canvas.height = Math.min(600, window.innerHeight - 200);
            renderFractal();
        }

        // 윈도우 리사이즈 이벤트 리스너
        window.addEventListener('resize', setCanvasSize);

        // 페이지 로드 시 초기화
        window.addEventListener('load', () => {
            setCanvasSize();
            init();
        });
    }
)();