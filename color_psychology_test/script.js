(
    () => {
        const colors = [
            { name: '빨강', hex: '#FF0000', meaning: '열정, 에너지, 힘' },
            { name: '파랑', hex: '#0000FF', meaning: '평화, 신뢰, 안정' },
            { name: '노랑', hex: '#FFFF00', meaning: '행복, 긍정, 창의성' },
            { name: '초록', hex: '#00FF00', meaning: '자연, 성장, 조화' },
            { name: '보라', hex: '#800080', meaning: '고귀함, 신비, 창의성' },
            { name: '주황', hex: '#FFA500', meaning: '모험, 사교성, 열정' },
            { name: '핑크', hex: '#FFC0CB', meaning: '사랑, 부드러움, 동정심' },
            { name: '갈색', hex: '#A52A2A', meaning: '안정, 신뢰성, 편안함' },
            { name: '회색', hex: '#808080', meaning: '중립, 균형, 차분함' },
            { name: '검정', hex: '#000000', meaning: '권위, 힘, 우아함' },
            { name: '하늘색', hex: '#87CEEB', meaning: '평화, 순수, 휴식' },
            { name: '민트', hex: '#98FF98', meaning: '신선함, 차분함, 평화' },
            { name: '네이비', hex: '#000080', meaning: '지식, 권위, 성실' },
            { name: '터콰이즈', hex: '#40E0D0', meaning: '진정, 치유, 보호' },
            { name: '라벤더', hex: '#E6E6FA', meaning: '우아함, 여성성, 은혜' },
            { name: '마젠타', hex: '#FF00FF', meaning: '조화, 감정적 균형, 변화' },
            { name: '올리브', hex: '#808000', meaning: '평화, 조화, 지혜' },
            { name: '버건디', hex: '#800020', meaning: '풍요, 고급스러움, 야망' },
            { name: '베이지', hex: '#F5F5DC', meaning: '편안함, 신뢰, 중립' },
            { name: '코랄', hex: '#FF7F50', meaning: '에너지, 열정, 낙관주의' },
            { name: '인디고', hex: '#4B0082', meaning: '직관, 깊이, 통찰력' },
            { name: '머스타드', hex: '#FFDB58', meaning: '자신감, 창의성, 열정' },
            { name: '티일', hex: '#008080', meaning: '창의성, 신뢰, 안정' },
            { name: '플럼', hex: '#8E4585', meaning: '독창성, 고귀함, 지혜' }
        ];

        const colorOptions = document.getElementById('color-options');
        const resultArea = document.getElementById('result-area');
        const resultText = document.getElementById('result-text');
        const detailedAnalysis = document.getElementById('detailed-analysis');
        const restartBtn = document.getElementById('restart-btn');
        const historyArea = document.getElementById('history-area');
        const historyList = document.getElementById('history-list');
        const resetColorsBtn = document.getElementById('reset-colors');
        const submitColorsBtn = document.getElementById('submit-colors');
        const moodTracker = document.getElementById('mood-tracker');
        const moodChart = document.getElementById('mood-chart');

        let userHistory = JSON.parse(localStorage.getItem('colorHistory')) || [];
        let selectedColors = [];
        let chart = null;

        function resetColors() {
            selectedColors = [];
            initTest();
            updateSubmitButton();
        }

        function initTest() {
            colorOptions.innerHTML = '';
            colors.forEach(color => {
                const button = document.createElement('button');
                button.className = 'color-option';
                button.style.backgroundColor = color.hex;
                button.addEventListener('click', () => toggleColorSelection(color, button));
                colorOptions.appendChild(button);
            });
            selectedColors = [];
            updateSubmitButton();
        }

        function toggleColorSelection(color, button) {
            const index = selectedColors.findIndex(c => c.name === color.name);
            if (index === -1) {
                selectedColors.push(color);
                button.classList.add('selected');
            } else {
                selectedColors.splice(index, 1);
                button.classList.remove('selected');
            }
            updateSubmitButton();
        }

        function updateSubmitButton() {
            submitColorsBtn.disabled = selectedColors.length === 0;
        }

        function getPersonalityTrait(colorName) {
            switch (colorName) {
                case '빨강': return '열정적이고 활동적인';
                case '파랑': return '차분하고 신중한';
                case '노랑': return '낙천적이고 창의적인';
                case '초록': return '균형 잡히고 조화로운';
                case '보라': return '독창적이고 직관적인';
                case '주황': return '사교적이고 모험을 즐기는';
                case '핑크': return '따뜻하고 동정심 많은';
                case '갈색': return '안정적이고 신뢰할 수 있는';
                case '회색': return '중립적이고 차분한';
                case '검정': return '강력하고 우아한';
                case '하늘색': return '평화롭고 순수한';
                case '민트': return '상쾌하고 진정되는';
                case '네이비': return '지적이고 성실한';
                case '터콰이즈': return '치유력 있고 보호적인';
                case '라벤더': return '우아하고 여성적인';
                case '마젠타': return '감정적으로 균형 잡힌';
                case '올리브': return '평화로우면서 지혜로운';
                case '버건디': return '야망이 있고 고급스러운';
                case '베이지': return '편안하고 중립적인';
                case '코랄': return '활기차고 낙관적인';
                case '인디고': return '직관적이고 통찰력 있는';
                case '머스타드': return '자신감 있고 열정적인';
                case '티일': return '창의적이면서 안정적인';
                case '플럼': return '독창적이고 고귀한';
                default: return '다양한 특성을 가진';
            }
        }

        function getDetailedAnalysis(colorName) {
            switch (colorName) {
                case '빨강':
                    return '목표 지향적이며 리더십을 발휘할 수 있습니다. 당신은 열정적이고 결단력이 있으며, 도전을 즐기는 성향을 가지고 있을 수 있습니다.';
                case '파랑':
                    return '신중하게 판단하고 깊이 있는 관계를 형성할 수 있습니다. 당신은 신뢰할 수 있고 책임감이 강하며, 평화를 추구하는 성향을 가지고 있을 수 있습니다.';
                case '노랑':
                    return '긍정적인 에너지로 주변을 밝게 만들고 새로운 아이디어를 창출할 수 있습니다. 당신은 낙관적이고 창의적이며, 사교적인 성향을 가지고 있을 수 있습니다.';
                case '초록':
                    return '자연과 조화를 이루며 안정감 있는 환경을 조성할 수 있습니다. 당신은 균형 잡힌 시각을 가지고 있으며, 성장과 발전을 추구하는 성향을 가지고 있을 수 있습니다.';
                case '보라':
                    return '예술적 감각과 직관력을 바탕으로 독특한 관점을 제시할 수 있습니다. 당신은 창의적이고 신비로우며, 영적인 면에 관심이 많은 성향을 가지고 있을 수 있습니다.';
                case '주황':
                    return '활발한 사교 활동과 새로운 경험을 통해 삶을 즐길 수 있습니다. 당신은 모험을 좋아하고 열정적이며, 유쾌한 성향을 가지고 있을 수 있습니다.';
                case '핑크':
                    return '타인을 배려하고 부드러운 카리스마로 주변을 이끌어갈 수 있습니다. 당신은 사랑과 동정심이 많으며, 낭만적인 성향을 가지고 있을 수 있습니다.';
                case '갈색':
                    return '실용적이고 신뢰할 수 있는 태도로 안정된 관계를 유지할 수 있습니다. 당신은 책임감이 강하고 현실적이며, 안정을 추구하는 성향을 가지고 있을 수 있습니다.';
                case '회색':
                    return '중립적인 시각으로 상황을 판단하고 균형을 유지할 수 있습니다. 당신은 차분하고 신중하며, 중재자 역할을 잘 하는 성향을 가지고 있을 수 있습니다.';
                case '검정':
                    return '권위와 우아함을 갖추고 강한 인상을 남길 수 있습니다. 당신은 힘과 권위를 추구하며, 신비로운 매력을 가진 성향을 가지고 있을 수 있습니다.';
                case '하늘색':
                    return '평화로운 환경을 조성하고 순수한 마음으로 소통할 수 있습니다. 당신은 차분하고 이해심이 많으며, 편안한 분위기를 만드는 성향을 가지고 있을 수 있습니다.';
                case '민트':
                    return '신선한 아이디어로 주변에 활력을 불어넣고 편안한 분위기를 조성할 수 있습니다. 당신은 창의적이고 상쾌한 에너지를 가지며, 치유와 회복을 추구하는 성향을 가지고 있을 수 있습니다.';
                case '네이비':
                    return '깊이 있는 지식과 권위를 바탕으로 신뢰를 줄 수 있습니다. 당신은 지적이고 성실하며, 전문성을 추구하는 성향을 가지고 있을 수 있습니다.';
                case '터콰이즈':
                    return '치유와 보호의 에너지로 주변에 긍정적인 영향을 줄 수 있습니다. 당신은 창의적이고 직관적이며, 소통을 중요시하는 성향을 가지고 있을 수 있습니다.';
                case '라벤더':
                    return '우아함과 여성성을 바탕으로 부드러운 리더십을 발휘할 수 있습니다. 당신은 섬세하고 예민하며, 예술적 감각이 뛰어난 성향을 가지고 있을 수 있습니다.';
                case '마젠타':
                    return '감정적 균형을 유지하며 변화에 잘 적응할 수 있습니다. 당신은 열정적이고 창의적이며, 독특한 개성을 가진 성향을 가지고 있을 수 있습니다.';
                case '올리브':
                    return '평화와 조화를 추구하며 지혜로운 결정을 내릴 수 있습니다. 당신은 안정적이고 중재를 잘하며, 자연을 사랑하는 성향을 가지고 있을 수 있습니다.';
                case '버건디':
                    return '풍요와 고급스러움을 추구하며 강한 야망을 가질 수 있습니다. 당신은 열정적이고 고급스러운 취향을 가지며, 리더십이 있는 성향을 가지고 있을 수 있습니다.';
                case '베이지':
                    return '편안하고 신뢰할 수 있는 환경을 조성하며 중립적인 입장을 취할 수 있습니다. 당신은 안정적이고 실용적이며, 조화를 추구하는 성향을 가지고 있을 수 있습니다.';
                case '코랄':
                    return '에너지와 열정으로 주변을 활기차게 만들고 낙관적인 태도를 유지할 수 있습니다. 당신은 사교적이고 따뜻하며, 생동감 있는 성향을 가지고 있을 수 있습니다.';
                case '인디고':
                    return '깊은 직관과 통찰력으로 복잡한 문제를 해결할 수 있습니다. 당신은 지적이고 신비로우며, 영적인 면에 관심이 많은 성향을 가지고 있을 수 있습니다.';
                case '머스타드':
                    return '자신감과 창의성을 바탕으로 새로운 도전을 즐길 수 있습니다. 당신은 독특하고 대담하며, 지적 호기심이 강한 성향을 가지고 있을 수 있습니다.';
                case '티일':
                    return '창의성과 안정성을 동시에 추구하며 균형 잡힌 결정을 내릴 수 있습니다. 당신은 차분하면서도 혁신적이며, 소통을 중요시하는 성향을 가지고 있을 수 있습니다.';
                case '플럼':
                    return '독창성과 고귀함을 바탕으로 특별한 가치를 창출할 수 있습니다. 당신은 우아하고 지혜로우며, 깊이 있는 통찰력을 가진 성향을 가지고 있을 수 있습니다.';
                default:
                    return '다양한 상황에 적응하며 유연한 태도를 유지할 수 있습니다. 당신은 여러 가지 특성을 균형 있게 가지고 있을 수 있습니다.';
            }
        }

        function showResult() {
            const combinedMeaning = selectedColors.map(color => color.meaning).join(', ');
            resultText.textContent = `당신이 선택한 색상 조합은 ${selectedColors.map(c => c.name).join(', ')}입니다. 
            이는 ${combinedMeaning}을(를) 나타냅니다.`;

            const detailedResult = `이 색상 조합은 ${getColorCombinationAnalysis(selectedColors)}한 성향을 나타낼 수 있습니다.
            이는 당신이 ${getCombinedPersonalityTrait(selectedColors)}할 수 있음을 의미합니다.`;

            detailedAnalysis.innerHTML = detailedResult;

            document.getElementById('test-area').style.display = 'none';
            resultArea.style.display = 'block';
            historyArea.style.display = 'block';
            moodTracker.style.display = 'block';

            resultArea.classList.add('fade-in');
            historyArea.classList.add('fade-in');
            moodTracker.classList.add('fade-in');

            saveToHistory(selectedColors);
            updateMoodTracker();
        }

        function getColorCombinationAnalysis(colors) {
            // This is a simplified analysis. In a real application, you might want to create more sophisticated combinations.
            if (colors.length === 1) {
                return getPersonalityTrait(colors[0].name);
            } else if (colors.length === 2) {
                return `${getPersonalityTrait(colors[0].name)}하면서도 ${getPersonalityTrait(colors[1].name)}`;
            } else {
                return colors.map(color => getPersonalityTrait(color.name)).join(', ');
            }
        }

        function getCombinedPersonalityTrait(colors) {
            // This is a simplified combination. You might want to create more meaningful combinations based on color theory.
            const traits = colors.map(color => getDetailedAnalysis(color.name));
            return traits.join(' 그리고 ');
        }

        function saveToHistory(colors) {
            const date = new Date().toLocaleString();
            userHistory.unshift({ colors: colors.map(c => c.name), date: date });
            if (userHistory.length > 5) userHistory.pop();
            localStorage.setItem('colorHistory', JSON.stringify(userHistory));
            updateHistory();
        }

        function updateHistory() {
            historyList.innerHTML = '';
            userHistory.forEach(item => {
                const li = document.createElement('li');
                const colorNames = Array.isArray(item.colors) ? item.colors : [item.color]; // 이전 버전과의 호환성을 위해
                li.textContent = `${colorNames.join(', ')} - ${item.date}`;
                const firstColor = colors.find(c => c.name === colorNames[0]);
                li.style.borderLeft = firstColor ? `5px solid ${firstColor.hex}` : '5px solid #000000';
                historyList.appendChild(li);
            });
        }

        function updateMoodTracker() {
            const ctx = moodChart.getContext('2d');
            const moodData = userHistory.slice().reverse();

            if (chart) {
                chart.destroy();
            }

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: moodData.map(item => item.date),
                    datasets: [{
                        label: '무드 변화',
                        data: moodData.map(item => {
                            const mainColor = colors.find(c => c.name === item.colors[0]);
                            return Object.values(hexToRgb(mainColor.hex)).reduce((a, b) => a + b, 0) / 3;
                        }),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 255
                        }
                    }
                }
            });
        }

        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        resetColorsBtn.addEventListener('click', resetColors);
        submitColorsBtn.addEventListener('click', showResult);
        restartBtn.addEventListener('click', () => {
            document.getElementById('test-area').style.display = 'block';
            resultArea.style.display = 'none';
            historyArea.style.display = 'none';
            moodTracker.style.display = 'none';
            colorOptions.innerHTML = '';
            resultArea.classList.remove('fade-in');
            historyArea.classList.remove('fade-in');
            moodTracker.classList.remove('fade-in');
            initTest();
        });

        initTest();
        if (userHistory.length > 0) {
            updateHistory();
            updateMoodTracker();
        }

        // Helper functions (getPersonalityTrait, getDetailedAnalysis) remain the same as in the previous version
    }
)();