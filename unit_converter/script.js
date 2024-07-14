(
    () => {
        const conversionTypes = {
            acceleration: { units: ['m/s²', 'ft/s²', 'g'], base: 'm/s²' },
            angle: { units: ['degree', 'radian', 'gradian'], base: 'degree' },
            length: { units: ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mile'], base: 'm' },
            dataSize: { units: ['bit', 'byte', 'KB', 'MB', 'GB', 'TB'], base: 'byte' },
            weight: { units: ['kg', 'g', 'mg', 'lb', 'oz'], base: 'kg' },
            volume: { units: ['m³', 'L', 'mL', 'gal', 'qt', 'pt', 'cup'], base: 'L' },
            speed: { units: ['m/s', 'km/h', 'mph', 'knot'], base: 'm/s' },
            time: { units: ['s', 'min', 'hr', 'day', 'week', 'month', 'year'], base: 's' },
            pressure: { units: ['Pa', 'kPa', 'bar', 'psi', 'atm'], base: 'Pa' },
            energy: { units: ['J', 'kJ', 'cal', 'kcal', 'Wh', 'kWh'], base: 'J' },
            power: { units: ['W', 'kW', 'hp', 'BTU/h'], base: 'W' },
            area: { units: ['m²', 'cm²', 'km²', 'ha', 'acre', 'ft²'], base: 'm²' },
            torque: { units: ['Nm', 'kgfm', 'ftlb'], base: 'Nm' },
            currency: { units: ['USD', 'EUR', 'JPY', 'GBP', 'KRW'], base: 'USD' },
            force: { units: ['N', 'kN', 'kgf', 'lbf'], base: 'N' },
            screenSize: { units: ['px', 'pt', 'em', 'rem', 'vh', 'vw'], base: 'px' },
            temperature: { units: ['°C', '°F', 'K'], base: '°C' }
        };

        const conversionRates = {
            acceleration: {
                'm/s²': { 'm/s²': 1, 'ft/s²': 3.28084, 'g': 0.101972 },
                'ft/s²': { 'm/s²': 0.3048, 'ft/s²': 1, 'g': 0.031081 },
                'g': { 'm/s²': 9.80665, 'ft/s²': 32.1740, 'g': 1 }
            },
            angle: {
                'degree': { 'degree': 1, 'radian': 0.0174533, 'gradian': 1.11111 },
                'radian': { 'degree': 57.2958, 'radian': 1, 'gradian': 63.6620 },
                'gradian': { 'degree': 0.9, 'radian': 0.015708, 'gradian': 1 }
            },
            length: {
                'm': { 'm': 1, 'cm': 100, 'mm': 1000, 'km': 0.001, 'in': 39.3701, 'ft': 3.28084, 'yd': 1.09361, 'mile': 0.000621371 },
                'cm': { 'm': 0.01, 'cm': 1, 'mm': 10, 'km': 0.00001, 'in': 0.393701, 'ft': 0.0328084, 'yd': 0.0109361, 'mile': 0.00000621371 },
                'mm': { 'm': 0.001, 'cm': 0.1, 'mm': 1, 'km': 0.000001, 'in': 0.0393701, 'ft': 0.00328084, 'yd': 0.00109361, 'mile': 6.21371e-7 },
                'km': { 'm': 1000, 'cm': 100000, 'mm': 1000000, 'km': 1, 'in': 39370.1, 'ft': 3280.84, 'yd': 1093.61, 'mile': 0.621371 },
                'in': { 'm': 0.0254, 'cm': 2.54, 'mm': 25.4, 'km': 0.0000254, 'in': 1, 'ft': 0.0833333, 'yd': 0.0277778, 'mile': 0.0000157828 },
                'ft': { 'm': 0.3048, 'cm': 30.48, 'mm': 304.8, 'km': 0.0003048, 'in': 12, 'ft': 1, 'yd': 0.333333, 'mile': 0.000189394 },
                'yd': { 'm': 0.9144, 'cm': 91.44, 'mm': 914.4, 'km': 0.0009144, 'in': 36, 'ft': 3, 'yd': 1, 'mile': 0.000568182 },
                'mile': { 'm': 1609.34, 'cm': 160934, 'mm': 1609340, 'km': 1.60934, 'in': 63360, 'ft': 5280, 'yd': 1760, 'mile': 1 }
            },
            dataSize: {
                'bit': { 'bit': 1, 'byte': 0.125, 'KB': 0.000125, 'MB': 1.25e-7, 'GB': 1.25e-10, 'TB': 1.25e-13 },
                'byte': { 'bit': 8, 'byte': 1, 'KB': 0.001, 'MB': 1e-6, 'GB': 1e-9, 'TB': 1e-12 },
                'KB': { 'bit': 8000, 'byte': 1000, 'KB': 1, 'MB': 0.001, 'GB': 1e-6, 'TB': 1e-9 },
                'MB': { 'bit': 8e6, 'byte': 1e6, 'KB': 1000, 'MB': 1, 'GB': 0.001, 'TB': 1e-6 },
                'GB': { 'bit': 8e9, 'byte': 1e9, 'KB': 1e6, 'MB': 1000, 'GB': 1, 'TB': 0.001 },
                'TB': { 'bit': 8e12, 'byte': 1e12, 'KB': 1e9, 'MB': 1e6, 'GB': 1000, 'TB': 1 }
            },
            weight: {
                'kg': { 'kg': 1, 'g': 1000, 'mg': 1e6, 'lb': 2.20462, 'oz': 35.274 },
                'g': { 'kg': 0.001, 'g': 1, 'mg': 1000, 'lb': 0.00220462, 'oz': 0.035274 },
                'mg': { 'kg': 1e-6, 'g': 0.001, 'mg': 1, 'lb': 2.20462e-6, 'oz': 3.5274e-5 },
                'lb': { 'kg': 0.453592, 'g': 453.592, 'mg': 453592, 'lb': 1, 'oz': 16 },
                'oz': { 'kg': 0.0283495, 'g': 28.3495, 'mg': 28349.5, 'lb': 0.0625, 'oz': 1 }
            },
            volume: {
                'm³': { 'm³': 1, 'L': 1000, 'mL': 1e6, 'gal': 264.172, 'qt': 1056.69, 'pt': 2113.38, 'cup': 4226.75 },
                'L': { 'm³': 0.001, 'L': 1, 'mL': 1000, 'gal': 0.264172, 'qt': 1.05669, 'pt': 2.11338, 'cup': 4.22675 },
                'mL': { 'm³': 1e-6, 'L': 0.001, 'mL': 1, 'gal': 0.000264172, 'qt': 0.00105669, 'pt': 0.00211338, 'cup': 0.00422675 },
                'gal': { 'm³': 0.00378541, 'L': 3.78541, 'mL': 3785.41, 'gal': 1, 'qt': 4, 'pt': 8, 'cup': 16 },
                'qt': { 'm³': 0.000946353, 'L': 0.946353, 'mL': 946.353, 'gal': 0.25, 'qt': 1, 'pt': 2, 'cup': 4 },
                'pt': { 'm³': 0.000473176, 'L': 0.473176, 'mL': 473.176, 'gal': 0.125, 'qt': 0.5, 'pt': 1, 'cup': 2 },
                'cup': { 'm³': 0.000236588, 'L': 0.236588, 'mL': 236.588, 'gal': 0.0625, 'qt': 0.25, 'pt': 0.5, 'cup': 1 }
            },
            speed: {
                'm/s': { 'm/s': 1, 'km/h': 3.6, 'mph': 2.23694, 'knot': 1.94384 },
                'km/h': { 'm/s': 0.277778, 'km/h': 1, 'mph': 0.621371, 'knot': 0.539957 },
                'mph': { 'm/s': 0.44704, 'km/h': 1.60934, 'mph': 1, 'knot': 0.868976 },
                'knot': { 'm/s': 0.514444, 'km/h': 1.852, 'mph': 1.15078, 'knot': 1 }
            },
            time: {
                's': { 's': 1, 'min': 1 / 60, 'hr': 1 / 3600, 'day': 1 / 86400, 'week': 1 / 604800, 'month': 1 / 2592000, 'year': 1 / 31536000 },
                'min': { 's': 60, 'min': 1, 'hr': 1 / 60, 'day': 1 / 1440, 'week': 1 / 10080, 'month': 1 / 43200, 'year': 1 / 525600 },
                'hr': { 's': 3600, 'min': 60, 'hr': 1, 'day': 1 / 24, 'week': 1 / 168, 'month': 1 / 720, 'year': 1 / 8760 },
                'day': { 's': 86400, 'min': 1440, 'hr': 24, 'day': 1, 'week': 1 / 7, 'month': 1 / 30, 'year': 1 / 365 },
                'week': { 's': 604800, 'min': 10080, 'hr': 168, 'day': 7, 'week': 1, 'month': 1 / 4.34524, 'year': 1 / 52.1429 },
                'month': { 's': 2592000, 'min': 43200, 'hr': 720, 'day': 30, 'week': 4.34524, 'month': 1, 'year': 1 / 12 },
                'year': { 's': 31536000, 'min': 525600, 'hr': 8760, 'day': 365, 'week': 52.1429, 'month': 12, 'year': 1 }
            },
            pressure: {
                'Pa': { 'Pa': 1, 'kPa': 0.001, 'bar': 0.00001, 'psi': 0.000145038, 'atm': 9.86923e-6 },
                'kPa': { 'Pa': 1000, 'kPa': 1, 'bar': 0.01, 'psi': 0.145038, 'atm': 0.00986923 },
                'bar': { 'Pa': 100000, 'kPa': 100, 'bar': 1, 'psi': 14.5038, 'atm': 0.986923 },
                'psi': { 'Pa': 6894.76, 'kPa': 6.89476, 'bar': 0.0689476, 'psi': 1, 'atm': 0.068046 },
                'atm': { 'Pa': 101325, 'kPa': 101.325, 'bar': 1.01325, 'psi': 14.6959, 'atm': 1 }
            },
            energy: {
                'J': { 'J': 1, 'kJ': 0.001, 'cal': 0.239006, 'kcal': 0.000239006, 'Wh': 0.000277778, 'kWh': 2.77778e-7 },
                'kJ': { 'J': 1000, 'kJ': 1, 'cal': 239.006, 'kcal': 0.239006, 'Wh': 0.277778, 'kWh': 0.000277778 },
                'cal': { 'J': 4.184, 'kJ': 0.004184, 'cal': 1, 'kcal': 0.001, 'Wh': 0.00116222, 'kWh': 1.16222e-6 },
                'kcal': { 'J': 4184, 'kJ': 4.184, 'cal': 1000, 'kcal': 1, 'Wh': 1.16222, 'kWh': 0.00116222 },
                'Wh': { 'J': 3600, 'kJ': 3.6, 'cal': 860.421, 'kcal': 0.860421, 'Wh': 1, 'kWh': 0.001 },
                'kWh': { 'J': 3.6e6, 'kJ': 3600, 'cal': 860421, 'kcal': 860.421, 'Wh': 1000, 'kWh': 1 }
            },
            power: {
                'W': { 'W': 1, 'kW': 0.001, 'hp': 0.00134102, 'BTU/h': 3.41214 },
                'kW': { 'W': 1000, 'kW': 1, 'hp': 1.34102, 'BTU/h': 3412.14 },
                'hp': { 'W': 745.7, 'kW': 0.7457, 'hp': 1, 'BTU/h': 2544.43 },
                'BTU/h': { 'W': 0.293071, 'kW': 0.000293071, 'hp': 0.000393011, 'BTU/h': 1 }
            },
            area: {
                'm²': { 'm²': 1, 'cm²': 10000, 'km²': 1e-6, 'ha': 0.0001, 'acre': 0.000247105, 'ft²': 10.7639 },
                'cm²': { 'm²': 0.0001, 'cm²': 1, 'km²': 1e-10, 'ha': 1e-8, 'acre': 2.47105e-8, 'ft²': 0.00107639 },
                'km²': { 'm²': 1e6, 'cm²': 1e10, 'km²': 1, 'ha': 100, 'acre': 247.105, 'ft²': 1.076e7 },
                'ha': { 'm²': 10000, 'cm²': 1e8, 'km²': 0.01, 'ha': 1, 'acre': 2.47105, 'ft²': 107639 },
                'acre': { 'm²': 4046.86, 'cm²': 4.047e7, 'km²': 0.00404686, 'ha': 0.404686, 'acre': 1, 'ft²': 43560 },
                'ft²': { 'm²': 0.092903, 'cm²': 929.03, 'km²': 9.2903e-8, 'ha': 9.2903e-6, 'acre': 2.2957e-5, 'ft²': 1 }
            },
            torque: {
                'Nm': { 'Nm': 1, 'kgfm': 0.101972, 'ftlb': 0.737562 },
                'kgfm': { 'Nm': 9.80665, 'kgfm': 1, 'ftlb': 7.23301 },
                'ftlb': { 'Nm': 1.35582, 'kgfm': 0.138255, 'ftlb': 1 }
            },
            currency: {
                'USD': { 'USD': 1, 'EUR': 0.84, 'JPY': 110, 'GBP': 0.72, 'KRW': 1100 },
                'EUR': { 'USD': 1.19, 'EUR': 1, 'JPY': 131, 'GBP': 0.86, 'KRW': 1310 },
                'JPY': { 'USD': 0.0091, 'EUR': 0.0076, 'JPY': 1, 'GBP': 0.0065, 'KRW': 10 },
                'GBP': { 'USD': 1.39, 'EUR': 1.16, 'JPY': 153, 'GBP': 1, 'KRW': 1530 },
                'KRW': { 'USD': 0.00091, 'EUR': 0.00076, 'JPY': 0.1, 'GBP': 0.00065, 'KRW': 1 }
            },
            force: {
                'N': { 'N': 1, 'kN': 0.001, 'kgf': 0.101972, 'lbf': 0.224809 },
                'kN': { 'N': 1000, 'kN': 1, 'kgf': 101.972, 'lbf': 224.809 },
                'kgf': { 'N': 9.80665, 'kN': 0.00980665, 'kgf': 1, 'lbf': 2.20462 },
                'lbf': { 'N': 4.44822, 'kN': 0.00444822, 'kgf': 0.453592, 'lbf': 1 }
            },
            screenSize: {
                'px': { 'px': 1, 'pt': 0.75, 'em': 0.0625, 'rem': 0.0625, 'vh': 0.01, 'vw': 0.01 },
                'pt': { 'px': 1.33333, 'pt': 1, 'em': 0.0833333, 'rem': 0.0833333, 'vh': 0.0133333, 'vw': 0.0133333 },
                'em': { 'px': 16, 'pt': 12, 'em': 1, 'rem': 1, 'vh': 0.16, 'vw': 0.16 },
                'rem': { 'px': 16, 'pt': 12, 'em': 1, 'rem': 1, 'vh': 0.16, 'vw': 0.16 },
                'vh': { 'px': 100, 'pt': 75, 'em': 6.25, 'rem': 6.25, 'vh': 1, 'vw': 1 },
                'vw': { 'px': 100, 'pt': 75, 'em': 6.25, 'rem': 6.25, 'vh': 1, 'vw': 1 }
            }
        };

        // 온도 변환을 위한 특별한 함수
        function convertTemperature(value, fromUnit, toUnit) {
            if (fromUnit === toUnit) return value;

            let celsius;
            switch (fromUnit) {
                case '°C': celsius = value; break;
                case '°F': celsius = (value - 32) * 5 / 9; break;
                case 'K': celsius = value - 273.15; break;
            }

            switch (toUnit) {
                case '°C': return celsius;
                case '°F': return celsius * 9 / 5 + 32;
                case 'K': return celsius + 273.15;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const conversionTypeSelect = document.getElementById('conversionType');
            const inputUnitSelect = document.getElementById('inputUnit');
            const outputUnitSelect = document.getElementById('outputUnit');
            const inputValue = document.getElementById('inputValue');
            const outputValue = document.getElementById('outputValue');
            const swapUnitsBtn = document.getElementById('swapUnits');
            const errorMessage = document.getElementById('errorMessage');

            // 변환 유형 옵션 생성
            for (const type in conversionTypes) {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                conversionTypeSelect.appendChild(option);
            }

            // 이벤트 리스너 설정
            conversionTypeSelect.addEventListener('change', updateUnitOptions);
            inputUnitSelect.addEventListener('change', performConversion);
            outputUnitSelect.addEventListener('change', performConversion);
            inputValue.addEventListener('input', performConversion);
            swapUnitsBtn.addEventListener('click', swapUnits);

            // 초기 설정
            loadLastUsedType();
            updateUnitOptions();
            performConversion();

            function updateUnitOptions() {
                const selectedType = conversionTypeSelect.value;
                const units = conversionTypes[selectedType].units;

                [inputUnitSelect, outputUnitSelect].forEach(select => {
                    select.innerHTML = units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
                });

                saveLastUsedType(selectedType);
                performConversion();
            }

            function performConversion() {
                const type = conversionTypeSelect.value;
                const fromUnit = inputUnitSelect.value;
                const toUnit = outputUnitSelect.value;
                const value = parseFloat(inputValue.value.replace(/,/g, ''));

                if (isNaN(value)) {
                    outputValue.value = '';
                    return;
                }

                try {
                    const result = convert(value, fromUnit, toUnit, type);
                    outputValue.value = formatNumber(result);
                    errorMessage.textContent = '';
                } catch (error) {
                    errorMessage.textContent = error.message;
                }
            }

            function convert(value, fromUnit, toUnit, type) {
                if (fromUnit === toUnit) {
                    return value;
                }

                if (type === 'temperature') {
                    return convertTemperature(value, fromUnit, toUnit);
                }

                const rates = conversionRates[type];
                if (!rates) {
                    throw new Error(`변환 유형 "${type}"에 대한 변환율이 정의되지 않았습니다.`);
                }

                const fromRates = rates[fromUnit];
                if (!fromRates) {
                    throw new Error(`"${fromUnit}" 단위에 대한 변환율이 정의되지 않았습니다.`);
                }

                const conversionFactor = fromRates[toUnit];
                if (conversionFactor === undefined) {
                    throw new Error(`"${fromUnit}"에서 "${toUnit}"로의 변환율이 정의되지 않았습니다.`);
                }

                return value * conversionFactor;
            }

            function swapUnits() {
                const temp = inputUnitSelect.value;
                inputUnitSelect.value = outputUnitSelect.value;
                outputUnitSelect.value = temp;
                performConversion();
            }

            function formatNumber(num) {
                return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
            }

            function saveLastUsedType(type) {
                localStorage.setItem('lastUsedConversionType', type);
            }

            function loadLastUsedType() {
                const lastUsedType = localStorage.getItem('lastUsedConversionType');
                if (lastUsedType && conversionTypes[lastUsedType]) {
                    conversionTypeSelect.value = lastUsedType;
                }
            }

            // 숫자 입력 시 천 단위 구분자 추가
            inputValue.addEventListener('input', function (e) {
                let value = e.target.value.replace(/,/g, '');
                if (value !== '') {
                    e.target.value = formatNumber(parseFloat(value));
                }
            });
        });
    }
)();