// 캔버스 및 기본 설정
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const center = { x: canvas.width / 2, y: canvas.height / 2 };

// 육각형 관련 변수
const hexagonRadius = 150;
let hexRotationAngle = 0;
let rotationSpeed = parseFloat(document.getElementById('rotationSpeed').value);

// 옵션 컨트롤 값
let ballSpeedFactor = parseFloat(document.getElementById('ballSpeed').value);
let obstaclesEnabled = document.getElementById('obstacleToggle').checked;
let numObstacles = parseInt(document.getElementById('numObstacles').value);
let obstacleSize = parseInt(document.getElementById('obstacleSize').value);
let ballSize = parseInt(document.getElementById('ballSize').value);

// 이벤트 리스너 설정
document.getElementById('rotationSpeed').addEventListener('input', (e) => {
  rotationSpeed = parseFloat(e.target.value);
});

document.getElementById('ballSpeed').addEventListener('input', (e) => {
  let newSpeedFactor = parseFloat(e.target.value);
  // 공 속도의 크기만 비례 변경
  let currentSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
  if(currentSpeed !== 0) {
    let factor = newSpeedFactor / currentSpeed;
    ball.vx *= factor;
    ball.vy *= factor;
  }
  ballSpeedFactor = newSpeedFactor;
});

document.getElementById('obstacleToggle').addEventListener('change', (e) => {
  obstaclesEnabled = e.target.checked;
});

document.getElementById('numObstacles').addEventListener('input', (e) => {
  numObstacles = parseInt(e.target.value);
  generateObstacles();
});

document.getElementById('obstacleSize').addEventListener('input', (e) => {
  obstacleSize = parseInt(e.target.value);
  // 장애물 배열 내 모든 장애물의 크기 업데이트
  obstacles.forEach(obstacle => obstacle.radius = obstacleSize);
});

document.getElementById('ballSize').addEventListener('input', (e) => {
  ballSize = parseInt(e.target.value);
  ball.radius = ballSize;
});

// 공 객체
let ball = {
  x: center.x,
  y: center.y,
  radius: ballSize,
  // 초기 속도는 임의의 방향
  vx: 3,
  vy: 3
};

// 장애물 배열 (육각형 내부에 상대 좌표로 저장)
let obstacles = [];

// 안전하게 장애물이 육각형 내부에 위치하도록 생성 (중심 기준 상대 좌표)
function generateObstacles() {
  obstacles = [];
  // 장애물이 들어갈 수 있는 안전 영역: 반지름 = hexagonRadius * 0.65
  const safeRadius = hexagonRadius * 0.65;
  for (let i = 0; i < numObstacles; i++) {
    // 극좌표를 이용해 랜덤 위치 결정
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * safeRadius;
    // 상대 좌표
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    obstacles.push({ x, y, radius: obstacleSize });
  }
}
generateObstacles();

// 육각형의 정점 (현재 회전 적용) 계산
function getHexagonVertices() {
  const vertices = [];
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3 + hexRotationAngle;
    const x = center.x + hexagonRadius * Math.cos(angle);
    const y = center.y + hexagonRadius * Math.sin(angle);
    vertices.push({ x, y });
  }
  return vertices;
}

// 육각형 그리기
function drawHexagon(vertices) {
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// 장애물 그리기 (육각형과 함께 회전)
function drawObstacles() {
  for (let obstacle of obstacles) {
    // 회전 변환: 장애물의 상대 좌표에 회전 적용 후 캔버스 중심에 더함
    const cos = Math.cos(hexRotationAngle);
    const sin = Math.sin(hexRotationAngle);
    const x = center.x + obstacle.x * cos - obstacle.y * sin;
    const y = center.y + obstacle.x * sin + obstacle.y * cos;
    ctx.beginPath();
    ctx.arc(x, y, obstacle.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f00';
    ctx.fill();
  }
}

// 공 그리기
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0f0';
  ctx.fill();
}

// 선분과 점 사이의 최단 거리 계산 (충돌 판정용)
function pointLineDistance(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = (len_sq !== 0) ? dot / len_sq : -1;
  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  const dx = px - xx;
  const dy = py - yy;
  return { distance: Math.sqrt(dx * dx + dy * dy), closestX: xx, closestY: yy };
}

// 벡터 정규화
function normalize(vx, vy) {
  const len = Math.sqrt(vx * vx + vy * vy);
  return len === 0 ? { x: 0, y: 0 } : { x: vx / len, y: vy / len };
}

// 공의 속도를 주어진 법선 벡터에 대해 반사
function reflectVelocity(normal) {
  const dot = ball.vx * normal.x + ball.vy * normal.y;
  ball.vx = ball.vx - 2 * dot * normal.x;
  ball.vy = ball.vy - 2 * dot * normal.y;
}

// 충돌 해결: 장애물 또는 육각형 경계와의 충돌
function handleCollision() {
  // 육각형 경계(각 변)와의 충돌 체크
  const vertices = getHexagonVertices();
  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;
    const v1 = vertices[i], v2 = vertices[next];
    const result = pointLineDistance(ball.x, ball.y, v1.x, v1.y, v2.x, v2.y);
    if (result.distance < ball.radius) {
      // 해당 선분의 벡터 및 법선 계산
      const edgeVec = { x: v2.x - v1.x, y: v2.y - v1.y };
      let normal = normalize(edgeVec.y, -edgeVec.x);
      // 공이 육각형 내부에서 밖으로 나가려는 방향인지 확인
      const centerToBall = { x: ball.x - center.x, y: ball.y - center.y };
      if (normal.x * centerToBall.x + normal.y * centerToBall.y < 0) {
        normal.x = -normal.x;
        normal.y = -normal.y;
      }
      // 공이 해당 방향으로 움직이고 있다면 반사
      if (ball.vx * normal.x + ball.vy * normal.y > 0) {
        reflectVelocity(normal);
        // 공이 겹치지 않도록 보정
        ball.x += normal.x * (ball.radius - result.distance);
        ball.y += normal.y * (ball.radius - result.distance);
      }
    }
  }
  
  // 장애물과의 충돌 체크 (장애물이 육각형 내부에 고정되어 회전)
  if (obstaclesEnabled) {
    for (let obstacle of obstacles) {
      // 장애물의 실제 위치 계산
      const cos = Math.cos(hexRotationAngle);
      const sin = Math.sin(hexRotationAngle);
      const ox = center.x + obstacle.x * cos - obstacle.y * sin;
      const oy = center.y + obstacle.x * sin + obstacle.y * cos;
      const dx = ball.x - ox;
      const dy = ball.y - oy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < ball.radius + obstacle.radius) {
        const normal = normalize(dx, dy);
        if (ball.vx * normal.x + ball.vy * normal.y > 0) {
          reflectVelocity(normal);
          ball.x += normal.x * ((ball.radius + obstacle.radius) - dist);
          ball.y += normal.y * ((ball.radius + obstacle.radius) - dist);
        }
      }
    }
  }
  
  // 보조: 캔버스 경계 충돌 처리
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.vx = -ball.vx;
  }
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.vy = -ball.vy;
  }
}

// 시뮬레이션 업데이트 함수
function update() {
  // 육각형 회전 업데이트
  hexRotationAngle += rotationSpeed;
  
  // 공 위치 업데이트
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  handleCollision();
}

// 매 프레임마다 화면 갱신
function loop() {
  update();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const vertices = getHexagonVertices();
  drawHexagon(vertices);
  if (obstaclesEnabled) {
    drawObstacles();
  }
  drawBall();
  requestAnimationFrame(loop);
}

loop();
