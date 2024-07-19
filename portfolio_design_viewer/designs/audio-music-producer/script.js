(
    () => {
        // 오디오 컨텍스트 및 분석기 설정
        let audioContext, analyser;
        let visualizer, visualizerContext;

        // 트랙 데이터
        const tracks = [
            { title: "일렉트로닉 드림", genre: "Electronic", duration: "3:45" },
            { title: "힙합 비트", genre: "Hip Hop", duration: "2:55" },
            { title: "재즈 퓨전", genre: "Jazz", duration: "4:20" },
            { title: "팝 센세이션", genre: "Pop", duration: "3:30" }
        ];

        // 스킬 데이터
        const skills = ["Ableton Live", "FL Studio", "Pro Tools", "Logic Pro X", "Sound Design", "Mixing", "Mastering", "MIDI Programming"];

        document.addEventListener('DOMContentLoaded', () => {
            initAudioContext();
            setupAudioVisualizer();
            renderTracks();
            renderSkills();
            setupMixingConsole();
            setupContactForm();
        });

        function initAudioContext() {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
        }

        function setupAudioVisualizer() {
            visualizer = document.getElementById('audio-visualizer');
            visualizerContext = visualizer.getContext('2d');
            visualizer.width = visualizer.offsetWidth;
            visualizer.height = visualizer.offsetHeight;

            // 비주얼라이저 애니메이션
            function animate() {
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);

                visualizerContext.fillStyle = 'rgb(18, 18, 18)';
                visualizerContext.fillRect(0, 0, visualizer.width, visualizer.height);

                const barWidth = (visualizer.width / bufferLength) * 2.5;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = dataArray[i] / 2;
                    visualizerContext.fillStyle = `rgb(${dataArray[i]}, 255, 140)`;
                    visualizerContext.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
                    x += barWidth + 1;
                }

                requestAnimationFrame(animate);
            }

            animate();
        }

        function renderTracks() {
            const trackList = document.getElementById('track-list');
            tracks.forEach(track => {
                const trackElement = document.createElement('div');
                trackElement.className = 'track-item';
                trackElement.innerHTML = `
            <h3>${track.title}</h3>
            <p>${track.genre} - ${track.duration}</p>
        `;
                trackElement.addEventListener('click', () => playTrack(track));
                trackList.appendChild(trackElement);
            });
        }

        function renderSkills() {
            const skillList = document.getElementById('skill-list');
            skills.forEach(skill => {
                const skillElement = document.createElement('li');
                skillElement.textContent = skill;
                skillList.appendChild(skillElement);
            });
        }

        function setupMixingConsole() {
            const tracksMixer = document.getElementById('tracks-mixer');
            const effectsPanel = document.getElementById('effects-panel');

            // 가상 믹서 채널 생성
            for (let i = 0; i < 4; i++) {
                const channel = document.createElement('div');
                channel.className = 'mixer-channel';
                channel.innerHTML = `
            <span>Channel ${i + 1}</span>
            <div class="fader"></div>
            <input type="range" min="0" max="100" value="75" class="volume-control">
        `;
                tracksMixer.appendChild(channel);
            }

            // 가상 이펙트 컨트롤 생성
            const effects = ['Reverb', 'Delay', 'Compressor'];
            effects.forEach(effect => {
                const effectControl = document.createElement('div');
                effectControl.className = 'effect-control';
                effectControl.innerHTML = `
            <span>${effect}</span>
            <div class="knob"></div>
        `;
                effectsPanel.appendChild(effectControl);
            });

            // Tone.js를 사용한 간단한 믹서 기능 구현
            const mixer = new Tone.Gain().toDestination();
            const volumeControls = document.querySelectorAll('.volume-control');
            volumeControls.forEach((control, index) => {
                control.addEventListener('input', (e) => {
                    const volume = parseFloat(e.target.value) / 100;
                    mixer.gain.setValueAtTime(volume, Tone.now());
                });
            });
        }

        function playTrack(track) {
            // 여기에 실제 트랙 재생 로직을 구현합니다.
            // 예시를 위해 간단한 알림으로 대체합니다.
            alert(`Now playing: ${track.title}`);

            // 오디오 시각화를 위한 더미 데이터 생성
            function generateDummyAudioData() {
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                for (let i = 0; i < bufferLength; i++) {
                    dataArray[i] = Math.random() * 255;
                }
                analyser.getByteFrequencyData(dataArray);
                setTimeout(generateDummyAudioData, 50);
            }
            generateDummyAudioData();
        }

        function setupContactForm() {
            const contactForm = document.getElementById('contact-form');
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // 여기에 실제 폼 제출 로직을 구현합니다.
                alert('메시지가 전송되었습니다. 감사합니다!');
                contactForm.reset();
            });
        }

        // 오디오 플레이어 컨트롤 설정
        document.getElementById('play-pause').addEventListener('click', togglePlayPause);
        document.getElementById('prev-track').addEventListener('click', playPreviousTrack);
        document.getElementById('next-track').addEventListener('click', playNextTrack);

        let isPlaying = false;
        let currentTrackIndex = 0;

        function togglePlayPause() {
            isPlaying = !isPlaying;
            const playPauseButton = document.getElementById('play-pause');
            playPauseButton.textContent = isPlaying ? '일시정지' : '재생';
            if (isPlaying) {
                playTrack(tracks[currentTrackIndex]);
            } else {
                // 여기에 실제 일시정지 로직을 구현합니다.
            }
        }

        function playPreviousTrack() {
            currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
            playTrack(tracks[currentTrackIndex]);
        }

        function playNextTrack() {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            playTrack(tracks[currentTrackIndex]);
        }

        // 창 크기 변경 시 오디오 시각화 캔버스 크기 조정
        window.addEventListener('resize', () => {
            visualizer.width = visualizer.offsetWidth;
            visualizer.height = visualizer.offsetHeight;
        });
    }
)();