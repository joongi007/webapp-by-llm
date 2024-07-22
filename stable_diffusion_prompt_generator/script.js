document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('negativePromptDropdown');
    const header = dropdown.querySelector('.dropdown-header');
    const options = dropdown.querySelector('.dropdown-options');

    header.addEventListener('click', function() {
        dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('open');
        }
    });

    options.addEventListener('change', function() {
        const checkedOptions = options.querySelectorAll('input:checked');
        if (checkedOptions.length > 0) {
            header.textContent = `${checkedOptions.length} option(s) selected`;
        } else {
            header.textContent = 'Select Negative Prompts';
        }
    });

    const inputs = {
        subject: document.getElementById('subject'),
        style: document.getElementById('style'),
        artistStyle: document.getElementById('artistStyle'),
        mood: document.getElementById('mood'),
        colorPalette: document.getElementById('colorPalette'),
        texture: document.getElementById('texture'),
        artMedium: document.getElementById('artMedium'),
        lighting: document.getElementById('lighting'),
        composition: document.getElementById('composition'),
        perspective: document.getElementById('perspective'),
        timePeriod: document.getElementById('timePeriod'),
        environment: document.getElementById('environment'),
        weather: document.getElementById('weather'),
        specialEffects: document.getElementById('specialEffects'),
        complexity: document.getElementById('complexity'),
        version: document.getElementById('version')
    };

    const complexityValue = document.getElementById('complexityValue');
    const generateButton = document.getElementById('generateButton');
    const resultDiv = document.getElementById('result');

    inputs.complexity.addEventListener('input', (e) => {
        complexityValue.textContent = e.target.value;
    });

    generateButton.addEventListener('click', generatePrompt);

    function generatePrompt() {
        const values = Object.fromEntries(
            Object.entries(inputs).map(([key, element]) => [key, element.value])
        );

        if (!values.subject) {
            alert('Please enter a subject');
            return;
        }

        let prompt = '';

        switch (values.version) {
            case '1.4':
                prompt = generatePromptV1_4(values);
                break;
            case '1.5':
                prompt = generatePromptV1_5(values);
                break;
            case '2.0':
                prompt = generatePromptV2_0(values);
                break;
            case '2.1':
                prompt = generatePromptV2_1(values);
                break;
            default:
                prompt = 'Unsupported version';
        }

        const negativePrompt = generateNegativePrompt();
        if (negativePrompt) {
            prompt += `<br><br><strong>Negative prompt:</strong><br>${negativePrompt}`;
        }

        resultDiv.innerHTML = `<strong>Generated Prompt:</strong><br>${prompt}`;
    }

    function generateNegativePrompt() {
        const checkedOptions = options.querySelectorAll('input:checked');
        return Array.from(checkedOptions).map(option => option.value).join(', ');
    }


    function generatePromptV1_4(values) {
        const detailLevel = values.complexity > 7 ? 'highly detailed' : 'simple';
        return `A ${detailLevel} ${values.style} ${values.artMedium} of ${values.subject} in a ${values.environment} setting from the ${values.timePeriod} era, with a ${values.mood} mood. 
                ${values.artistStyle ? `In the style of ${values.artistStyle}.` : ''} 
                ${values.colorPalette ? `Using a ${values.colorPalette} color palette.` : ''} 
                ${values.texture ? `The texture is ${values.texture}.` : ''} 
                ${values.lighting ? `Illuminated by ${values.lighting}.` : ''} 
                ${values.composition ? `Composition: ${values.composition}.` : ''} 
                ${values.perspective ? `Perspective: ${values.perspective}.` : ''} 
                ${values.weather ? `Weather conditions: ${values.weather}.` : ''} 
                ${values.specialEffects ? `Special effects: ${values.specialEffects}.` : ''} 
                Trending on artstation`;
    }

    function generatePromptV1_5(values) {
        const detailLevel = values.complexity > 7 ? 'Intricate' : 'Basic';
        return `${detailLevel} ${values.style} ${values.artMedium} depiction of ${values.subject} in a ${values.environment} from ${values.timePeriod} times, evoking a ${values.mood} atmosphere. 
                ${values.artistStyle ? `Inspired by ${values.artistStyle}.` : ''} 
                ${values.colorPalette ? `Utilizing ${values.colorPalette} colors.` : ''} 
                ${values.texture ? `${values.texture} textures.` : ''} 
                ${values.lighting ? `Lighting: ${values.lighting}.` : ''} 
                ${values.composition ? `Composed using ${values.composition}.` : ''} 
                ${values.perspective ? `Viewed from ${values.perspective}.` : ''} 
                ${values.weather ? `With ${values.weather} conditions.` : ''} 
                ${values.specialEffects ? `Enhanced with ${values.specialEffects} effects.` : ''} 
                Digital art`;
    }

    function generatePromptV2_0(values) {
        const qualityTags = values.complexity > 7 ? 'high quality, 4k, detailed' : 'simple, clear';
        return `${qualityTags}, ${values.style} ${values.artMedium} representation of ${values.subject} in a ${values.environment} environment, set in ${values.timePeriod}, ${values.mood} ambiance. 
                ${values.artistStyle ? `Artistic influence: ${values.artistStyle}.` : ''} 
                ${values.colorPalette ? `Color scheme: ${values.colorPalette}.` : ''} 
                ${values.texture ? `Textural quality: ${values.texture}.` : ''} 
                ${values.lighting ? `Illuminated with ${values.lighting}.` : ''} 
                ${values.composition ? `Compositional technique: ${values.composition}.` : ''} 
                ${values.perspective ? `Perspectival approach: ${values.perspective}.` : ''} 
                ${values.weather ? `Weather depicted: ${values.weather}.` : ''} 
                ${values.specialEffects ? `Featuring ${values.specialEffects} effects.` : ''} 
                Unreal engine render`;
    }

    function generatePromptV2_1(values) {
        const detailLevel = values.complexity > 7 ? 'hyper-detailed' : 'minimalistic';
        return `${detailLevel} ${values.style} ${values.artMedium} visualization of ${values.subject} in a ${values.environment} setting from the ${values.timePeriod} period, radiating ${values.mood} energy. 
                ${values.artistStyle ? `Channeling the essence of ${values.artistStyle}.` : ''} 
                ${values.colorPalette ? `Palette: ${values.colorPalette}.` : ''} 
                ${values.texture ? `Textural elements: ${values.texture}.` : ''} 
                ${values.lighting ? `Lit by ${values.lighting}.` : ''} 
                ${values.composition ? `Framed in ${values.composition}.` : ''} 
                ${values.perspective ? `Employing ${values.perspective} perspective.` : ''} 
                ${values.weather ? `Atmospheric conditions: ${values.weather}.` : ''} 
                ${values.specialEffects ? `Enhanced with ${values.specialEffects} post-processing.` : ''} 
                Octane render, trending on CGSociety`;
    }

    // 모바일 환경에서의 select 요소 포커스 처리
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('focus', function () {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
    });
});