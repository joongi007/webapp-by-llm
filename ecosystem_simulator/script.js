(
    () => {
        // 유틸리티 함수
        function randomRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        // 유전자 클래스
        class Gene {
            constructor() {
                this.size = randomRange(0.5, 1.5);
                this.speed = randomRange(0.5, 1.5);
                this.energyEfficiency = randomRange(0.5, 1.5);
            }

            static combine(gene1, gene2) {
                const newGene = new Gene();
                newGene.size = (gene1.size + gene2.size) / 2 + randomRange(-0.1, 0.1);
                newGene.speed = (gene1.speed + gene2.speed) / 2 + randomRange(-0.1, 0.1);
                newGene.energyEfficiency = (gene1.energyEfficiency + gene2.energyEfficiency) / 2 + randomRange(-0.1, 0.1);
                return newGene;
            }
        }

        // 지형 클래스
        class Terrain {
            static WATER = 0;
            static LAND = 1;
            static MOUNTAIN = 2;

            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.map = Array(height).fill().map(() => Array(width).fill(Terrain.LAND));
                this.generateTerrain();
            }

            generateTerrain() {
                // 단순한 지형 생성 (실제 구현시 더 복잡한 알고리즘 사용 가능)
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        const r = Math.random();
                        if (r < 0.1) this.map[y][x] = Terrain.WATER;
                        else if (r < 0.2) this.map[y][x] = Terrain.MOUNTAIN;
                    }
                }
            }

            getTerrainAt(x, y) {
                const gridX = Math.floor(x / 10);
                const gridY = Math.floor(y / 10);
                if (gridX >= 0 && gridX < this.width && gridY >= 0 && gridY < this.height) {
                    return this.map[gridY][gridX];
                }
                return Terrain.LAND;
            }
        }

        // 환경 클래스 확장
        class Environment {
            static sunlight = 1;
            static temperature = 20;
            static rainfall = 0.5;
            static season = 'Spring';
            static seasonDuration = 1000; // frames
            static currentSeasonFrame = 0;

            static update() {
                this.currentSeasonFrame++;
                if (this.currentSeasonFrame >= this.seasonDuration) {
                    this.changeSeason();
                }

                this.updateSeasonalFactors();
            }

            static changeSeason() {
                this.currentSeasonFrame = 0;
                switch (this.season) {
                    case 'Spring': this.season = 'Summer'; break;
                    case 'Summer': this.season = 'Autumn'; break;
                    case 'Autumn': this.season = 'Winter'; break;
                    case 'Winter': this.season = 'Spring'; break;
                }
            }

            static updateSeasonalFactors() {
                switch (this.season) {
                    case 'Spring':
                        this.temperature = randomRange(15, 25);
                        this.sunlight = randomRange(0.7, 1);
                        this.rainfall = randomRange(0.5, 0.8);
                        break;
                    case 'Summer':
                        this.temperature = randomRange(25, 35);
                        this.sunlight = randomRange(0.9, 1.2);
                        this.rainfall = randomRange(0.3, 0.6);
                        break;
                    case 'Autumn':
                        this.temperature = randomRange(10, 20);
                        this.sunlight = randomRange(0.5, 0.8);
                        this.rainfall = randomRange(0.6, 0.9);
                        break;
                    case 'Winter':
                        this.temperature = randomRange(-5, 10);
                        this.sunlight = randomRange(0.3, 0.6);
                        this.rainfall = randomRange(0.2, 0.5);
                        break;
                }
            }
        }

        // 질병 클래스
        class Disease {
            constructor(name, infectivity, lethality, duration) {
                this.name = name;
                this.infectivity = infectivity;
                this.lethality = lethality;
                this.duration = duration;
            }
        }

        // 기본 유기체 클래스 확장
        class Organism {
            constructor(x, y, energy, gene) {
                this.x = x;
                this.y = y;
                this.energy = energy;
                this.gene = gene || new Gene();
                this.disease = null;
                this.diseaseTimer = 0;
            }

            move(terrain) {
                const speed = 2 * this.gene.speed;
                let newX = this.x + (Math.random() * 2 - 1) * speed;
                let newY = this.y + (Math.random() * 2 - 1) * speed;

                // 지형에 따른 이동 제한
                const newTerrain = terrain.getTerrainAt(newX, newY);
                if (newTerrain === Terrain.WATER && !(this instanceof Aquatic)) {
                    // 물에 빠지지 않도록
                    newX = this.x;
                    newY = this.y;
                } else if (newTerrain === Terrain.MOUNTAIN) {
                    // 산에서는 느리게 이동
                    newX = this.x + (newX - this.x) * 0.5;
                    newY = this.y + (newY - this.y) * 0.5;
                }

                this.x = Math.max(0, Math.min(newX, terrain.width * 10));
                this.y = Math.max(0, Math.min(newY, terrain.height * 10));

                this.energy -= 0.1 / this.gene.energyEfficiency;
            }

            eat(food) {
                this.energy += food.energy * this.gene.energyEfficiency;
            }

            reproduce() {
                if (this.energy > 15) {
                    this.energy -= 10;
                    const childGene = Gene.combine(this.gene, this.gene);
                    return new this.constructor(this.x, this.y, 10, childGene);
                }
                return null;
            }

            updateDisease() {
                if (this.disease) {
                    this.diseaseTimer++;
                    this.energy -= this.disease.lethality;
                    if (this.diseaseTimer >= this.disease.duration) {
                        this.disease = null;
                        this.diseaseTimer = 0;
                    }
                }
            }
        }

        class Plant extends Organism {
            constructor(x, y) {
                super(x, y, 5);
                this.growthRate = 0.2;
            }

            grow() {
                const growthFactor =
                    Environment.sunlight *
                    (1 + (Environment.temperature - 20) / 20) *
                    (1 + (Environment.rainfall - 0.5) / 0.5);
                this.energy += this.growthRate * growthFactor * this.gene.energyEfficiency;
            }

            move() { } // Plants don't move
        }

        class Animal extends Organism {
            constructor(x, y, energy) {
                super(x, y, energy);
            }

            move(terrain) {
                const speed = 2 * this.gene.speed;
                let newX = this.x + (Math.random() * 2 - 1) * speed;
                let newY = this.y + (Math.random() * 2 - 1) * speed;

                // 지형에 따른 이동 제한
                const newTerrain = terrain.getTerrainAt(newX, newY);
                if (newTerrain === Terrain.WATER && !(this instanceof Aquatic)) {
                    // 물에 빠지지 않도록
                    newX = this.x;
                    newY = this.y;
                } else if (newTerrain === Terrain.MOUNTAIN) {
                    // 산에서는 느리게 이동
                    newX = this.x + (newX - this.x) * 0.5;
                    newY = this.y + (newY - this.y) * 0.5;
                }

                this.x = Math.max(0, Math.min(newX, terrain.width * 10));
                this.y = Math.max(0, Math.min(newY, terrain.height * 10));

                this.energy -= 0.1 / this.gene.energyEfficiency;
            }

            interact(other) {
                if (this.disease && !other.disease && Math.random() < this.disease.infectivity) {
                    other.disease = this.disease;
                }
            }
        }

        class Herbivore extends Animal {
            constructor(x, y) {
                super(x, y, 10);
            }

            eat(plant) {
                if (plant instanceof Plant) {
                    super.eat(plant);
                    return true;
                }
                return false;
            }
        }

        class Carnivore extends Animal {
            constructor(x, y) {
                super(x, y, 15);
            }

            eat(herbivore) {
                if (herbivore instanceof Herbivore) {
                    super.eat(herbivore);
                    return true;
                }
                return false;
            }
        }

        class Omnivore extends Animal {
            constructor(x, y) {
                super(x, y, 12);
            }

            eat(food) {
                if (food instanceof Plant || food instanceof Herbivore) {
                    super.eat(food);
                    return true;
                }
                return false;
            }
        }

        class Decomposer extends Organism {
            constructor(x, y) {
                super(x, y, 8);
            }

            eat(deadOrganism) {
                if (deadOrganism.energy <= 0) {
                    super.eat(deadOrganism);
                    return true;
                }
                return false;
            }
        }

        class Aquatic extends Animal {
            constructor(x, y) {
                super(x, y, 10);
            }

            move(terrain) {
                // Aquatic organisms move freely in water
                const speed = 2 * this.gene.speed;
                this.x += (Math.random() * 2 - 1) * speed;
                this.y += (Math.random() * 2 - 1) * speed;
                this.x = Math.max(0, Math.min(this.x, terrain.width * 10));
                this.y = Math.max(0, Math.min(this.y, terrain.height * 10));
                this.energy -= 0.1 / this.gene.energyEfficiency;
            }
        }

        // 생태계 클래스 확장
        class Ecosystem {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.organisms = [];
                this.terrain = new Terrain(width / 10, height / 10);
                this.isRunning = false;
                this.canvas = document.getElementById('ecosystem-canvas');
                this.ctx = this.canvas.getContext('2d');
                this.statistics = {
                    plants: 0,
                    herbivores: 0,
                    carnivores: 0,
                    omnivores: 0,
                    decomposers: 0,
                    aquatics: 0
                };
                this.diseases = [
                    new Disease("Flu", 0.3, 0.1, 100),
                    new Disease("Plague", 0.1, 0.5, 200)
                ];
                this.frame = 0;
                this.maxOrganisms = 1000; // 최대 유기체 수 제한
                this.spatialHash = new SpatialHash(width, height, 50); // 공간 해시 추가
            }

            addOrganism(organism) {
                // 유기체의 위치가 생태계 범위 내에 있는지 확인
                organism.x = Math.max(0, Math.min(organism.x, this.width));
                organism.y = Math.max(0, Math.min(organism.y, this.height));
                this.organisms.push(organism);
            }

            update() {
                this.frame++;
                Environment.update();

                // 질병 발생 (프레임 수를 줄여 계산 횟수 감소)
                if (this.frame % 5000 === 0) {
                    this.spreadDisease();
                }

                // 공간 해시 업데이트
                this.spatialHash.clear();
                this.organisms.forEach(org => {
                    // 유기체의 위치가 생태계 범위 내에 있는지 다시 한 번 확인
                    org.x = Math.max(0, Math.min(org.x, this.width));
                    org.y = Math.max(0, Math.min(org.y, this.height));
                    this.spatialHash.insert(org);
                });

                const newOrganisms = [];
                this.organisms = this.organisms.filter(org => {
                    org.move(this.terrain);
                    org.updateDisease();

                    if (org instanceof Plant) {
                        org.grow();
                    } else if (org instanceof Animal) {
                        this.handleAnimalBehavior(org, newOrganisms);
                    }

                    const offspring = org.reproduce();
                    if (offspring && this.organisms.length < this.maxOrganisms) {
                        newOrganisms.push(offspring);
                    }

                    return org.energy > 0;
                });

                // 새로운 유기체 추가 (제한된 수만큼)
                const organismCountToAdd = Math.min(newOrganisms.length, this.maxOrganisms - this.organisms.length);
                this.organisms.push(...newOrganisms.slice(0, organismCountToAdd));

                // 새로운 식물 생성 (식물 수가 일정 수준 이하일 때만)
                if (Math.random() < 0.1 && this.organisms.filter(org => org instanceof Plant).length < this.maxOrganisms * 0.5) {
                    this.addOrganism(new Plant(Math.random() * this.width, Math.random() * this.height));
                }

                // 통계 업데이트 (프레임마다 하지 않고 주기적으로)
                if (this.frame % 10 === 0) {
                    this.updateStatistics();
                }
            }

            spreadDisease() {
                const victim = this.organisms[Math.floor(Math.random() * this.organisms.length)];
                if (victim instanceof Animal) {
                    victim.disease = this.diseases[Math.floor(Math.random() * this.diseases.length)];
                }
            }

            handleAnimalBehavior(animal, newOrganisms) {
                const nearbyOrganisms = this.spatialHash.query(animal.x, animal.y, 50);
                const food = nearbyOrganisms.find(
                    potentialFood =>
                        (animal instanceof Herbivore && potentialFood instanceof Plant) ||
                        (animal instanceof Carnivore && potentialFood instanceof Herbivore) ||
                        (animal instanceof Omnivore && (potentialFood instanceof Plant || potentialFood instanceof Herbivore)) ||
                        (animal instanceof Decomposer && potentialFood.energy <= 0)
                );

                if (food) {
                    const eaten = animal.eat(food);
                    if (eaten) {
                        this.organisms = this.organisms.filter(o => o !== food);
                    }
                }

                // 상호작용 및 질병 전파 (주변 생물체만 확인)
                nearbyOrganisms.forEach(other => {
                    if (other !== animal && other instanceof Animal) {
                        const distance = Math.sqrt((animal.x - other.x) ** 2 + (animal.y - other.y) ** 2);
                        if (distance < 10) {
                            animal.interact(other);
                        }
                    }
                });
            }


            updateStatistics() {
                this.statistics = {
                    plants: 0,
                    herbivores: 0,
                    carnivores: 0,
                    omnivores: 0,
                    decomposers: 0,
                    aquatics: 0
                };
                this.organisms.forEach(org => {
                    if (org instanceof Plant) this.statistics.plants++;
                    else if (org instanceof Herbivore) this.statistics.herbivores++;
                    else if (org instanceof Carnivore) this.statistics.carnivores++;
                    else if (org instanceof Omnivore) this.statistics.omnivores++;
                    else if (org instanceof Decomposer) this.statistics.decomposers++;
                    else if (org instanceof Aquatic) this.statistics.aquatics++;
                });
            }

            start() {
                this.isRunning = true;
                this.run();
            }

            pause() {
                this.isRunning = false;
            }

            run() {
                if (this.isRunning) {
                    this.update();
                    this.render();
                    requestAnimationFrame(() => this.run());
                }
            }

            render() {
                this.ctx.clearRect(0, 0, this.width, this.height);

                // 지형 렌더링
                for (let y = 0; y < this.terrain.height; y++) {
                    for (let x = 0; x < this.terrain.width; x++) {
                        switch (this.terrain.map[y][x]) {
                            case Terrain.WATER:
                                this.ctx.fillStyle = 'blue';
                                break;
                            case Terrain.LAND:
                                this.ctx.fillStyle = 'green';
                                break;
                            case Terrain.MOUNTAIN:
                                this.ctx.fillStyle = 'grey';
                                break;
                        }
                        this.ctx.fillRect(x * 10, y * 10, 10, 10);
                    }
                }

                // 유기체 렌더링
                // 유기체 렌더링
                this.organisms.forEach(org => {
                    this.ctx.beginPath();
                    if (org instanceof Plant) {
                        this.ctx.fillStyle = 'darkgreen';
                        this.ctx.arc(org.x, org.y, 3 * org.gene.size, 0, 2 * Math.PI);
                    } else if (org instanceof Herbivore) {
                        this.ctx.fillStyle = 'blue';
                        this.ctx.arc(org.x, org.y, 5 * org.gene.size, 0, 2 * Math.PI);
                    } else if (org instanceof Carnivore) {
                        this.ctx.fillStyle = 'red';
                        this.ctx.arc(org.x, org.y, 7 * org.gene.size, 0, 2 * Math.PI);
                    } else if (org instanceof Omnivore) {
                        this.ctx.fillStyle = 'purple';
                        this.ctx.arc(org.x, org.y, 6 * org.gene.size, 0, 2 * Math.PI);
                    } else if (org instanceof Decomposer) {
                        this.ctx.fillStyle = 'brown';
                        this.ctx.arc(org.x, org.y, 4 * org.gene.size, 0, 2 * Math.PI);
                    } else if (org instanceof Aquatic) {
                        this.ctx.fillStyle = 'cyan';
                        this.ctx.arc(org.x, org.y, 5 * org.gene.size, 0, 2 * Math.PI);
                    }
                    this.ctx.fill();

                    // 질병에 걸린 유기체 표시
                    if (org.disease) {
                        this.ctx.strokeStyle = 'yellow';
                        this.ctx.lineWidth = 2;
                        this.ctx.stroke();
                    }
                });

                // 환경 정보 및 통계 표시
                this.ctx.fillStyle = 'black';
                this.ctx.font = '12px Arial';
                this.ctx.fillText(`Season: ${Environment.season}`, 10, 20);
                this.ctx.fillText(`Temperature: ${Environment.temperature.toFixed(1)}°C`, 10, 40);
                this.ctx.fillText(`Sunlight: ${Environment.sunlight.toFixed(2)}`, 10, 60);
                this.ctx.fillText(`Rainfall: ${Environment.rainfall.toFixed(2)}`, 10, 80);

                let yOffset = 100;
                for (const [key, value] of Object.entries(this.statistics)) {
                    this.ctx.fillText(`${key}: ${value}`, 10, yOffset);
                    yOffset += 20;
                }
            }

            addRandomOrganism() {
                const x = Math.random() * this.width;
                const y = Math.random() * this.height;
                const organismTypes = [Plant, Herbivore, Carnivore, Omnivore, Decomposer, Aquatic];
                const RandomOrganism = organismTypes[Math.floor(Math.random() * organismTypes.length)];

                let newOrganism;
                switch (RandomOrganism) {
                    case Plant:
                        newOrganism = new Plant(x, y);
                        break;
                    case Herbivore:
                        newOrganism = new Herbivore(x, y);
                        break;
                    case Carnivore:
                        newOrganism = new Carnivore(x, y);
                        break;
                    case Omnivore:
                        newOrganism = new Omnivore(x, y);
                        break;
                    case Decomposer:
                        newOrganism = new Decomposer(x, y);
                        break;
                    case Aquatic:
                        newOrganism = new Aquatic(x, y);
                        break;
                }

                this.addOrganism(newOrganism);
            }

            removeRandomOrganism() {
                if (this.organisms.length > 0) {
                    const index = Math.floor(Math.random() * this.organisms.length);
                    this.organisms.splice(index, 1);
                }
            }

            adjustEnvironment(factor, amount) {
                switch (factor) {
                    case 'temperature':
                        Environment.temperature += amount;
                        break;
                    case 'sunlight':
                        Environment.sunlight = Math.max(0, Math.min(Environment.sunlight + amount, 1));
                        break;
                    case 'rainfall':
                        Environment.rainfall = Math.max(0, Math.min(Environment.rainfall + amount, 1));
                        break;
                }
            }
        }

        // 공간 해시 클래스 추가
        class SpatialHash {
            constructor(width, height, cellSize) {
                this.cellSize = cellSize;
                this.width = Math.ceil(width / cellSize);
                this.height = Math.ceil(height / cellSize);
                this.grid = new Array(this.width * this.height).fill().map(() => []);
            }

            clear() {
                this.grid.forEach(cell => cell.length = 0);
            }

            getHash(x, y) {
                const gridX = Math.floor(x / this.cellSize);
                const gridY = Math.floor(y / this.cellSize);
                return gridY * this.width + gridX;
            }

            insert(organism) {
                const hash = this.getHash(organism.x, organism.y);
                if (hash >= 0 && hash < this.grid.length) {
                    this.grid[hash].push(organism);
                } else {
                    console.warn(`Invalid hash ${hash} for organism at (${organism.x}, ${organism.y})`);
                }
            }

            query(x, y, radius) {
                const results = [];
                const startX = Math.max(0, Math.floor((x - radius) / this.cellSize));
                const endX = Math.min(this.width - 1, Math.floor((x + radius) / this.cellSize));
                const startY = Math.max(0, Math.floor((y - radius) / this.cellSize));
                const endY = Math.min(this.height - 1, Math.floor((y + radius) / this.cellSize));

                for (let gridY = startY; gridY <= endY; gridY++) {
                    for (let gridX = startX; gridX <= endX; gridX++) {
                        const hash = gridY * this.width + gridX;
                        if (hash >= 0 && hash < this.grid.length) {
                            results.push(...this.grid[hash]);
                        }
                    }
                }

                return results;
            }
        }

        // 그래프 데이터 관리 클래스
        class GraphData {
            constructor() {
                this.data = {
                    plants: [],
                    herbivores: [],
                    carnivores: [],
                    omnivores: [],
                    decomposers: [],
                    aquatics: []
                };
            }

            update(statistics) {
                for (const [key, value] of Object.entries(statistics)) {
                    if (this.data[key].length >= 100) {
                        this.data[key].shift();
                    }
                    this.data[key].push(value);
                }
            }

            getChartData() {
                return Object.keys(this.data).map(key => ({
                    name: key,
                    data: this.data[key]
                }));
            }
        }

        // Chart 객체를 전역 변수로 선언
        let chart;
        let populationChart;

        // 차트 초기화 함수
        function initializeChart() {
            const ctx = document.getElementById('population-chart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        { label: 'Plants', data: [], borderColor: 'green', fill: false },
                        { label: 'Herbivores', data: [], borderColor: 'blue', fill: false },
                        { label: 'Carnivores', data: [], borderColor: 'red', fill: false },
                        { label: 'Omnivores', data: [], borderColor: 'purple', fill: false },
                        { label: 'Decomposers', data: [], borderColor: 'brown', fill: false },
                        { label: 'Aquatics', data: [], borderColor: 'cyan', fill: false }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { type: 'linear', position: 'bottom' },
                        y: { beginAtZero: true }
                    },
                    animation: {
                        duration: 0 // 애니메이션 비활성화
                    }
                }
            });
        }

        // 차트 업데이트 함수
        function updateChart() {
            if (!chart) return; // chart가 초기화되지 않았다면 함수 종료

            graphData.update(ecosystem.statistics);
            const chartData = graphData.getChartData();

            // 데이터 포인트가 100개를 넘으면 오래된 데이터 제거
            if (chart.data.labels.length > 100) {
                chart.data.labels.shift();
                chart.data.datasets.forEach(dataset => dataset.data.shift());
            }

            chart.data.labels.push(ecosystem.frame);
            chartData.forEach((item, index) => {
                chart.data.datasets[index].data.push(item.data[item.data.length - 1]);
            });

            chart.update('none'); // 애니메이션 없이 업데이트
        }

        // 시뮬레이터 초기화 및 이벤트 리스너 설정
        const ecosystem = new Ecosystem(600, 400);
        const graphData = new GraphData();

        // 초기 유기체 추가 (각 종류별로 추가)
        for (let i = 0; i < 20; i++) ecosystem.addOrganism(new Plant(Math.random() * 600, Math.random() * 400));
        for (let i = 0; i < 10; i++) ecosystem.addOrganism(new Herbivore(Math.random() * 600, Math.random() * 400));
        for (let i = 0; i < 5; i++) ecosystem.addOrganism(new Carnivore(Math.random() * 600, Math.random() * 400));
        for (let i = 0; i < 5; i++) ecosystem.addOrganism(new Omnivore(Math.random() * 600, Math.random() * 400));
        for (let i = 0; i < 5; i++) ecosystem.addOrganism(new Decomposer(Math.random() * 600, Math.random() * 400));
        for (let i = 0; i < 5; i++) ecosystem.addOrganism(new Aquatic(Math.random() * 600, Math.random() * 400));


        // 차트 초기화
        initializeChart();

        document.getElementById('start-btn').addEventListener('click', () => {
            ecosystem.start();
            // 그래프 업데이트 시작
            setInterval(updateChart, 1000); // 1초마다 업데이트
        });

        document.getElementById('pause-btn').addEventListener('click', () => ecosystem.pause());
        document.getElementById('reset-btn').addEventListener('click', () => {
            ecosystem.pause();
            ecosystem.organisms = [];
            // 각 종류별로 유기체 다시 추가
            for (let i = 0; i < 20; i++) ecosystem.addOrganism(new Plant(Math.random() * 600, Math.random() * 400));
            for (let i = 0; i < 10; i++) ecosystem.addOrganism(new Herbivore(Math.random() * 600, Math.random() * 400));
            for (let i = 0; i < 5; i++) ecosystem.addOrganism(new Carnivore(Math.random() * 600, Math.random() * 400));
            for (let i = 0; i < 5; i++) ecosystem.addOrganism(new Omnivore(Math.random() * 600, Math.random() * 400));
            for (let i = 0; i < 5; i++) ecosystem.addOrganism(new Decomposer(Math.random() * 600, Math.random() * 400));
            for (let i = 0; i < 5; i++) ecosystem.addOrganism(new Aquatic(Math.random() * 600, Math.random() * 400));

            graphData.data = { plants: [], herbivores: [], carnivores: [], omnivores: [], decomposers: [], aquatics: [] };

            // 차트 데이터 리셋
            populationChart.data.labels = [];
            populationChart.data.datasets.forEach(dataset => dataset.data = []);
            populationChart.update();
        });

        document.getElementById('add-organism').addEventListener('click', () => ecosystem.addRandomOrganism());
        document.getElementById('remove-organism').addEventListener('click', () => ecosystem.removeRandomOrganism());

        document.getElementById('temperature').addEventListener('input', function (e) {
            ecosystem.adjustEnvironment('temperature', parseFloat(e.target.value) - Environment.temperature);
            document.getElementById('temperature-value').textContent = `${e.target.value}°C`;
        });

        document.getElementById('sunlight').addEventListener('input', function (e) {
            ecosystem.adjustEnvironment('sunlight', parseFloat(e.target.value) - Environment.sunlight);
            document.getElementById('sunlight-value').textContent = e.target.value;
        });

        document.getElementById('rainfall').addEventListener('input', function (e) {
            ecosystem.adjustEnvironment('rainfall', parseFloat(e.target.value) - Environment.rainfall);
            document.getElementById('rainfall-value').textContent = e.target.value;
        });
    }
)();