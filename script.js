const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

//-----------------------------------------------------------------------------//

// 게임 초기화 함수
function resetGame() {
  // 플레이어 초기화
  player.x = 210;
  player.y = 800;
  player.dx = 0;
  player.dy = 0;
  player.grounded = false;

  // 점수 초기화
  score = 0;

  // 코인 초기화
  coins.length = 0; // 기존 코인 배열 초기화
  coins.push(
    { x: 150, y: 700, radius: 5 }, // 첫 번째 코인
    { x: 300, y: 500, radius: 5 }  // 두 번째 코인
  );

  //하트 초기화
  hearts = 3; // 하트를 3개로 초기화
  HeartThree();

  console.log("Game Reset!");
}

// 키 이벤트 처리
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  // R 키를 눌렀을 때 게임 초기화
  if (e.key === 'r' || e.key === 'R') {
    resetGame();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

//-----------------------------------------------------------------------------//


// 게임 오버 화면 관련 JavaScript
function showGameOverScreen(finalScore) {
  const gameOverScreen = document.getElementById('game-over-screen');
  const finalScoreElement = document.getElementById('final-score');
  finalScoreElement.textContent = finalScore; // 최종 점수 표시
  gameOverScreen.style.display = 'block'; // 화면 표시
}

function hideGameOverScreen() {
  const gameOverScreen = document.getElementById('game-over-screen');
  gameOverScreen.style.display = 'none'; // 화면 숨기기
}

// Restart 버튼 클릭 시 게임 초기화
document.getElementById('restart-button').addEventListener('click', () => {
  hideGameOverScreen();
  resetGame(); // 게임 초기화 함수 호출
});



//-----------------------------------------------------------------------------//

//여기에 장애물에 닿으면 하트 1 줄어드는 함수 만들거임

function HeartThree() {
  // 텍스트를 바꿀 HTML 요소 선택
  const textElement = document.getElementById('heart-info');
  // 새로운 텍스트로 변경
  textElement.innerHTML = '<p style="font-size: 20px; color: #ffffff;">★ ★ ★</p>'; //텍스트를 바꾸면서 스타일도 변경 가능
}
'<h3>style="font-size: 20px; color: #ffffff;>Life</h3>';
function HeartTwo() {
  // 텍스트를 바꿀 HTML 요소 선택
  const textElement = document.getElementById('heart-info');
  // 새로운 텍스트로 변경
  textElement.innerHTML = '<p style="font-size: 20px; color: #ffffff;">★ ★ ☆</p>'; //텍스트를 바꾸면서 스타일도 변경 가능
}

function HeartOne() {
  // 텍스트를 바꿀 HTML 요소 선택
  const textElement = document.getElementById('heart-info');
  // 새로운 텍스트로 변경
  textElement.innerHTML = '<p style="font-size: 20px; color: #ffffff;">★ ☆ ☆</p>'; //텍스트를 바꾸면서 스타일도 변경 가능
}

function HeartZero() {
  // 텍스트를 바꿀 HTML 요소 선택
  const textElement = document.getElementById('heart-info');
  // 새로운 텍스트로 변경
  textElement.innerHTML = '<p style="font-size: 20px; color: #ffffff;">☆ ☆ ☆</p>'; //텍스트를 바꾸면서 스타일도 변경 가능
}


// 하트 상태를 관리할 변수
let hearts = 3; // 초기 하트 개수

// 마지막 충돌 시간을 저장하는 변수
let lastCollisionTime = 0; // 초기값 0으로 설정
const collisionCooldown = 1500; // 충돌 쿨타임 (밀리초, 1.5초)

// 하트 감소 함수 수정
function MinusHeart() {
  // 현재 시간
  const currentTime = Date.now();

  // 쿨타임이 지나지 않았다면 충돌 무시
  if (currentTime - lastCollisionTime < collisionCooldown) {
    return;
  }

  // 장애물과 충돌 체크
  obstacle.forEach((obs) => {
    const obsTop = obs.y;
    const obsBottom = obs.y + obs.height;
    const obsLeft = obs.x;
    const obsRight = obs.x + obs.width;

    if (
      player.x + player.width > obsLeft && // 플레이어 오른쪽이 장애물 왼쪽에 겹침
      player.x < obsRight &&               // 플레이어 왼쪽이 장애물 오른쪽에 겹침
      player.y + player.height > obsTop && // 플레이어 아래가 장애물 위에 겹침
      player.y < obsBottom                 // 플레이어 위가 장애물 아래에 겹침
    ) {
      // 하트 감소 처리
      if (hearts === 3) {
        HeartTwo();
        console.log("하트 3 → 2");
      } else if (hearts === 2) {
        HeartOne();
        console.log("하트 2 → 1");
      } else if (hearts === 1) {
        HeartZero();
        console.log("하트 1 → 0, 게임 종료 처리 필요");
        // 게임 종료 처리 (필요 시 구현)
        showGameOverScreen(score);//지금은 리셋하는걸로 잠시 대체(나중에 게임 오버 화면 구현하기)

      }
      hearts--; // 하트 감소
      lastCollisionTime = currentTime; // 마지막 충돌 시간 업데이트
    }
  });
}


//-----------------------------------------------------------------------------//


// 코인 설정 (radius 추가)
const coins = [
  { x: 300, y: 400, radius: 5 }, // 코인 위치와 반지름
  { x: 300, y: 300, radius: 5 } // 추가 코인

];

// 점수 변수
let score = 0;

// 코인 그리기
function drawCoins() {
  ctx.fillStyle = '#FFFFFF'; // 흰색
  coins.forEach((coin) => {
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2); // 반지름 사용
    ctx.fill();
  });
}

// 코인 생성 함수 (겹침 방지)
function generateRandomCoin() {
  let coinX, coinY;
  let overlap = true;

  // 코인이 장애물이나 플랫폼과 겹치지 않도록 위치가 유효할 때까지 반복
  while (overlap) {
    coinX = Math.random() * (canvas.width - 30); // 랜덤 X 위치
    coinY = Math.random() * (canvas.height - 50); // 랜덤 Y 위치 (플랫폼 위쪽)

    overlap = false;

    // 장애물과 겹치는지 확인
    obstacle.forEach((obs) => {
      if (
        coinX + 30 > obs.x &&
        coinX < obs.x + obs.width &&
        coinY + 30 > obs.y &&
        coinY < obs.y + obs.height
      ) {
        overlap = true;
      }
    });

    // 플랫폼과 겹치는지 확인
    platforms.forEach((platform) => {
      if (
        coinX + 30 > platform.x &&
        coinX < platform.x + platform.width &&
        coinY + 30 > platform.y &&
        coinY < platform.y + platform.height
      ) {
        overlap = true;
      }
    });
  }

  // 겹치지 않으면 코인 생성 (radius를 추가하여 반환)
  return { x: coinX, y: coinY, radius: 5 }; // 반지름을 추가
}

// 코인 충돌 감지
function checkCoinCollision() {
  coins.forEach((coin, index) => {
    const distX = player.x + player.width / 2 - coin.x;
    const distY = player.y + player.height / 2 - coin.y;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);

    if (distance < coin.radius + player.width / 2) {
      // 충돌 발생
      score += 3; // 점수 증가
      console.log('Coin collected! Score:', score);

      // 기존 코인 제거 후 새로운 코인 추가
      coins[index] = generateRandomCoin();
    }
  });
}

// 점수 표시 함수
function drawScore() {
  const scoreElement = document.querySelector('#score-info p'); // 점수 표시 영역 선택
  if (scoreElement) {
    scoreElement.textContent = `Score: ${score}`; // 점수를 업데이트
  }
}

//-----------------------------------------------------------------------------//

// 게임 화면 크기 설정
canvas.width = 450;
canvas.height = 850;

// 캐릭터 기본 설정
const player = {
  x: 210,
  y: 800,
  width: 30,
  height: 30,
  speed: 5,
  dx: 0,
  dy: 0,
  gravity: 0.4,
  jumpPower: -15,
  grounded: false
};

// 플랫폼 설정
const platforms = [
  { x: 0, y: canvas.height - 50, width: canvas.width, height: 50 }, // 바닥
  { x: 50, y: 600, width: 100, height: 20 }, // 아무 효과 없는 블록
  { x: 110, y: 100, width: 100, height: 20 },
  { x: 280, y: 350, width: 100, height: 20 } 
];

// 닿으면 죽는 블록 설정
const obstacle = [
  { x: 100, y: 350, width: 30, height: 30, dx:1.8, minX: 20, maxX: 260 },// 닿으면 죽는 블록
  { x: 300, y: 600, width: 30, height: 30, dx:1.8, minX: 180, maxX: 430 },
  { x: 300, y: 100, width: 30, height: 30, dx:1.8, minX: 230, maxX: 430 } 
];

// 키 이벤트 처리
let keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// 플레이어 이동 및 점프
function movePlayer() {
  if (keys['ArrowRight'] || keys['d']) {
    player.dx = player.speed;
  } else if (keys['ArrowLeft'] || keys['a']) {
    player.dx = -player.speed;
  } else {
    player.dx = 0;
  }

  if (keys['ArrowUp'] || keys[' ']) {
    if (player.grounded) {
      player.dy = player.jumpPower;
      player.grounded = false;
    }
  }

  // 중력 처리
  player.dy += player.gravity;

  // 충돌 감지 및 위치 업데이트
  player.x += player.dx;
  player.y += player.dy;

  // 화면 경계를 넘어가면 반대쪽으로 이동
  if (player.x + player.width < 0) {
    player.x = canvas.width; // 왼쪽으로 나가면 오른쪽으로 이동
  } else if (player.x > canvas.width) {
    player.x = -player.width; // 오른쪽으로 나가면 왼쪽으로 이동
  }

  // 바닥과 충돌 체크
  if (player.y + player.height > canvas.height - 50) {
    player.y = canvas.height - 50 - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // 플랫폼과 충돌 체크
  platforms.forEach((platform) => {
    const platformTop = platform.y;
    const platformBottom = platform.y + platform.height;
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;

    // 플랫폼의 윗면 충돌
    if (player.x + player.width > platformLeft && player.x < platformRight &&
        player.y + player.height > platformTop && player.y + player.height < platformTop + 10 &&
        player.dy >= 0) {
      player.dy = 0;
      player.y = platformTop - player.height;
      player.grounded = true;
    }

    // 플랫폼의 아랫면 충돌 (아래에서 위로 점프할 때)
    if (player.x + player.width > platformLeft && player.x < platformRight &&
        player.y < platformBottom && player.y > platformBottom - 10 &&
        player.dy < 0) {
      player.dy = 0;
      player.y = platformBottom;
    }

    // 왼쪽 면 충돌
    if (player.x + player.width > platformLeft && player.x < platformLeft + 10 &&
        player.y + player.height > platformTop && player.y < platformBottom) {
      player.x = platformLeft - player.width; // 캐릭터가 플랫폼 왼쪽으로 겹치지 않도록
    }

    // 오른쪽 면 충돌
    if (player.x < platformRight && player.x + player.width > platformRight - 10 &&
        player.y + player.height > platformTop && player.y < platformBottom) {
      player.x = platformRight; // 캐릭터가 플랫폼 오른쪽으로 겹치지 않도록
    }
  });

  // 플레이어가 캔버스의 윗쪽 면을 통과해 올라가지 못하게 하기 (Y 좌표가 0보다 작아지지 않도록)
  if (player.y < 0) {
    player.y = 0;  // Y 좌표가 0보다 작으면 0으로 설정
    player.dy = 0; // 위로 더 이상 이동하지 않도록 속도 0으로 설정
  }

  // 장애물과 충돌 체크
  obstacle.forEach((obs) => {
    const obsTop = obs.y;
    const obsBottom = obs.y + obs.height;
    const obsLeft = obs.x;
    const obsRight = obs.x + obs.width;

    if (
      player.x + player.width > obsLeft && // 플레이어 오른쪽이 장애물 왼쪽에 겹침
      player.x < obsRight &&               // 플레이어 왼쪽이 장애물 오른쪽에 겹침
      player.y + player.height > obsTop && // 플레이어 아래가 장애물 위에 겹침
      player.y < obsBottom                 // 플레이어 위가 장애물 아래에 겹침
    ) {
      MinusHeart(); // 충돌 시 게임 초기화
    }
  });
}

// 캐릭터 그리기
function drawPlayer() {
  ctx.fillStyle = '#3964B7'; // 파란색 캐릭터
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 아무 효과 없는 블록 그리기
function drawPlatforms() {
  ctx.fillStyle = '#424242'; // 회색 플랫폼
  platforms.forEach((platform) => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

// 장애물 그리기
// 장애물 그리기 및 움직임 처리
function drawObstacle() {
  ctx.fillStyle = '#FF7F50'; // 장애물 색 (코랄색)

  obstacle.forEach((obs) => {
    // 장애물이 설정된 범위 내에서만 움직이도록 처리
    obs.x += obs.dx;

    // 장애물이 minX와 maxX 범위 내에서만 움직이도록 제한
    if (obs.x <= obs.minX || obs.x + obs.width >= obs.maxX) {
      obs.dx = -obs.dx; // 범위에 도달하면 방향 반전
    }

    // 장애물 그리기
    const centerX = obs.x + obs.width / 2; // 마름모 중심의 X 좌표
    const centerY = obs.y + obs.height / 2; // 마름모 중심의 Y 좌표
    const halfWidth = obs.width / 2; // 마름모 가로 반폭
    const halfHeight = obs.height / 2; // 마름모 세로 반폭

    // 마름모 그리기
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - halfHeight); // 위쪽 꼭짓점
    ctx.lineTo(centerX + halfWidth, centerY); // 오른쪽 꼭짓점
    ctx.lineTo(centerX, centerY + halfHeight); // 아래쪽 꼭짓점
    ctx.lineTo(centerX - halfWidth, centerY); // 왼쪽 꼭짓점
    ctx.closePath();
    ctx.fill();
  });
}

function updateGame() {
  movePlayer(); // 여기서 movePlayer() 호출
  checkCoinCollision(); // 코인 충돌 감지
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 화면 초기화
  drawPlayer();       // 플레이어 그리기
  drawPlatforms();    // 아무 효과 없는 블록 그리기
  drawObstacle();     // 닿으면 죽는 블록 그리기
  drawCoins();        // 코인 그리기
  drawScore();        // 점수 표시
  requestAnimationFrame(updateGame); // 다음 프레임 요청
}

// 게임 시작
updateGame();
