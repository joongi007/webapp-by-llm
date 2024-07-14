document.addEventListener('DOMContentLoaded', () => {
    const normalMode = document.getElementById('normalMode');
    const sharedMode = document.getElementById('sharedMode');
    const pads = document.querySelectorAll('.pad');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const volumeControl = document.getElementById('volume');
    const sharedVolumeControl = document.getElementById('sharedVolume');
    const tempoControl = document.getElementById('tempo');
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const playButton = document.getElementById('playButton');
    const saveButton = document.getElementById('saveButton');
    const playSharedButton = document.getElementById('playSharedButton');
    const patternList = document.getElementById('patternList');
    const sharedPatternName = document.getElementById('sharedPatternName');
    const sharedTempo = document.getElementById('sharedTempo');
    const copyNotification = document.getElementById('copyNotification');

    let gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    const sounds = {
        'q': 'kick',
        'w': 'snare',
        'e': 'hihat',
        'r': 'tom',
        't': 'clap',
        'y': 'crash',
        'a': 'ride',
        's': 'percussion',
        'd': 'cowbell',
        'f': 'tambourine',
        'g': 'woodblock',
        'h': 'conga',
        'z': 'bongo',
        'x': 'clave',
        'c': 'shaker',
        'v': 'triangle',
        'b': 'guiro',
        'n': 'whistle'
    };

    let tempo = 120;
    let isRecording = false;
    let recordedPattern = [];
    let savedPatterns = JSON.parse(localStorage.getItem('savedPatterns')) || [];
    let currentPattern = null;
    let sharedPattern = null;

    function playSound(key) {
        const oscillator = audioContext.createOscillator();
        oscillator.connect(gainNode);

        let freq;
        switch (sounds[key]) {
            case 'kick': freq = 60; break;
            case 'snare': freq = 150; break;
            case 'hihat': freq = 800; break;
            case 'tom': freq = 100; break;
            case 'clap': freq = 300; break;
            case 'crash': freq = 500; break;
            case 'ride': freq = 400; break;
            case 'percussion': freq = 200; break;
            case 'cowbell': freq = 600; break;
            case 'tambourine': freq = 700; break;
            case 'woodblock': freq = 900; break;
            case 'conga': freq = 250; break;
            case 'bongo': freq = 350; break;
            case 'clave': freq = 1000; break;
            case 'shaker': freq = 1200; break;
            case 'triangle': freq = 1400; break;
            case 'guiro': freq = 1100; break;
            case 'whistle': freq = 1600; break;
        }

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);

        // Visual feedback
        const pad = document.querySelector(`[data-key="${key}"]`);
        padVisualFeedback(pad);
    }

    function padVisualFeedback(pad) {
        pad.classList.add('active');
        setTimeout(() => pad.classList.remove('active'), 100);
    }

    function handlePadActivation(key) {
        playSound(key);
        if (isRecording) {
            recordedPattern.push({key, time: Date.now()});
        }
    }

    pads.forEach(pad => {
        pad.addEventListener('click', () => {
            const key = pad.getAttribute('data-key');
            handlePadActivation(key);
        });

        // Mobile support
        pad.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const key = pad.getAttribute('data-key');
            handlePadActivation(key);
        });
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (sounds.hasOwnProperty(key)) {
            handlePadActivation(key);
            const pad = document.querySelector(`[data-key="${key}"]`);
            padVisualFeedback(pad);
        }
    });

    // Volume control
    volumeControl.addEventListener('input', (e) => {
        gainNode.gain.setValueAtTime(e.target.value, audioContext.currentTime);
    });

    sharedVolumeControl.addEventListener('input', (e) => {
        gainNode.gain.setValueAtTime(e.target.value, audioContext.currentTime);
    });

    // Tempo control
    tempoControl.addEventListener('input', (e) => {
        tempo = parseInt(e.target.value);
    });

    // Recording controls
    recordButton.addEventListener('click', () => {
        isRecording = true;
        recordedPattern = [];
        recordButton.disabled = true;
        stopButton.disabled = false;
        playButton.disabled = true;
        saveButton.disabled = true;
    });

    stopButton.addEventListener('click', () => {
        isRecording = false;
        recordButton.disabled = false;
        stopButton.disabled = true;
        playButton.disabled = false;
        saveButton.disabled = false;
    });

    playButton.addEventListener('click', () => {
        if (currentPattern) {
            playPattern(currentPattern);
        } else if (recordedPattern.length > 0) {
            playPattern(recordedPattern);
        }
    });

    saveButton.addEventListener('click', () => {
        if (recordedPattern.length > 0) {
            const patternName = prompt("패턴의 이름을 입력하세요:");
            if (patternName) {
                savePattern(patternName);
            }
        }
    });

    playSharedButton.addEventListener('click', () => {
        if (sharedPattern) {
            playPattern(sharedPattern);
        }
    });

    function playPattern(pattern) {
        let startTime = pattern[0].time;
        pattern.forEach(note => {
            setTimeout(() => {
                playSound(note.key);
                const pad = document.querySelector(`[data-key="${note.key}"]`);
                padVisualFeedback(pad);
            }, note.time - startTime);
        });
    }

    function updatePatternList() {
        patternList.innerHTML = '';
        savedPatterns.forEach((pattern, index) => {
            const li = document.createElement('li');
            
            const patternName = document.createElement('span');
            patternName.textContent = pattern.name;
            patternName.className = 'pattern-name';
            li.appendChild(patternName);
    
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
            
            const playBtn = document.createElement('button');
            playBtn.textContent = '재생';
            playBtn.className = 'play';
            playBtn.addEventListener('click', () => {
                currentPattern = pattern.pattern;
                tempo = pattern.tempo;
                tempoControl.value = tempo;
                playPattern(pattern.pattern);
            });
    
            const shareBtn = document.createElement('button');
            shareBtn.textContent = '공유';
            shareBtn.className = 'share';
            shareBtn.addEventListener('click', () => {
                sharePattern(pattern);
            });
    
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.className = 'delete';
            deleteBtn.addEventListener('click', () => {
                deletePattern(index);
            });
    
            buttonGroup.appendChild(playBtn);
            buttonGroup.appendChild(shareBtn);
            buttonGroup.appendChild(deleteBtn);
            li.appendChild(buttonGroup);
    
            patternList.appendChild(li);
        });
    }

    function savePattern(patternName) {
        if (recordedPattern.length > 0) {
            savedPatterns.push({name: patternName, pattern: recordedPattern, tempo: tempo});
            localStorage.setItem('savedPatterns', JSON.stringify(savedPatterns));
            updatePatternList();
            recordedPattern = [];
            saveButton.disabled = true;
        }
    }

    function deletePattern(index) {
        if (confirm('정말로 이 패턴을 삭제하시겠습니까?')) {
            savedPatterns.splice(index, 1);
            localStorage.setItem('savedPatterns', JSON.stringify(savedPatterns));
            updatePatternList();
        }
    }

    function sharePattern(pattern) {
        const url = new URL(window.location.href);
        url.searchParams.set('pattern', JSON.stringify(pattern.pattern));
        url.searchParams.set('tempo', pattern.tempo);
        url.searchParams.set('name', pattern.name);
        
        // 클립보드에 URL 복사
        navigator.clipboard.writeText(url.toString()).then(() => {
            showNotification();
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
        });
    }

    function showNotification() {
        copyNotification.style.display = 'block';
        copyNotification.classList.add('show');
        setTimeout(() => {
            copyNotification.classList.remove('show');
            setTimeout(() => {
                copyNotification.style.display = 'none';
            }, 300);
        }, 2000);
    }

    // Load shared pattern
    const urlParams = new URLSearchParams(window.location.search);
    const sharedPatternParam = urlParams.get('pattern');
    const sharedTempoParam = urlParams.get('tempo');
    const sharedNameParam = urlParams.get('name');
    updatePatternList();

    if (sharedPatternParam && sharedTempoParam && sharedNameParam) {
        sharedPattern = JSON.parse(sharedPatternParam);
        const sharedTempoValue = parseInt(sharedTempoParam);
        normalMode.style.display = 'none';
        sharedMode.style.display = 'block';
        sharedPatternName.textContent = sharedNameParam;
        sharedTempo.textContent = sharedTempoValue;
    }
});