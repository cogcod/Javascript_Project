import BLOCKS from "./block.js";

// DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// Variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem; // movingItem을 실질적으로 사용하기 전에 잠깐 담아두는 용도

const movingItem = {
  // block의 타입, 좌표 등의 정보
  type: "",
  direction: 1, // 화살표(위) 방향키를 눌렀을 때 블럭의 방향을 돌리는 지표
  top: 0, // 지표를 기준으로 어디까지 내려와야 되는지 표현
  left: 0, // 좌우값을 알려주는 역할
};

init(); // init이 호출되면서 아래 함수들이 실행, 총 20개의 li를 제작하게 됨

// Functions
function init() {
  tempMovingItem = { ...movingItem };
  for (let i = 0; i < GAME_ROWS; i++) {
    prependNewLine();
  }
  generateNewBlock();
}

function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");

  for (let j = 0; j < GAME_COLS; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }

  li.prepend(ul);
  playground.prepend(li);
}

function renderBlocks(moveType = "") {
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving"); // 블럭 모양을 바꾸면 이전 style을 제거
    // console.log(moving);
  });

  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left; // row 안에 들어있는 li의 값 + left값 만큼 이동
    const y = block[1] + top; // row 값 + top값 만큼 이동

    // const target = playground.childNodes[y].childNodes[0].childNodes[x];
    // 삼항연산자 -> 조건 ? 참일경우 : 거짓일 경우
    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const isAvailable = checkEmpty(target);
    if (isAvailable) {
      target.classList.add(type, "moving");
    } else {
      tempMovingItem = { ...movingItem }; // 빈 공간이 있으면 좌표를 원상태로 옮겨놓고 renderBlocks 실행
      if (moveType === "retry") {
        clearInterval(downInterval);
        showGameoverText();
      }
      setTimeout(() => {
        renderBlocks("retry"); // 재귀함수는 에러가 날 수 있어서 setTimeout을 이용
        if (moveType === "top") {
          seizeBlock();
        }
      }, 0);
      // renderBlocks();
      return true; // forEach는 반복을 중간에 멈출 수 없어서 some을 쓰고 return true로 멈추기
    }
    // target.classList.add(type, "moving"); // type(tree)를 class로 줌 -> css에서 색 넣어주기
  });

  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkMatch();
}

// 한줄이 완성되면, 완성된 줄이 없어짐과 동시에 맨위에 새로운 한줄이 생성되는 것!!
function checkMatch() {
  const childNodes = playground.childNodes;
  childNodes.forEach((child) => {
    let matched = true;
    child.children[0].childNodes.forEach((li) => {
      if (!li.classList.contains("seized")) {
        matched = false;
      }
    });
    if (matched) {
      child.remove();
      prependNewLine();
      score++;
      scoreDisplay.innerText = score;
    }
  });
  generateNewBlock();
}

// 새로운 블럭 생성하기
function generateNewBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, duration);

  const blockArray = Object.entries(BLOCKS);
  // 랜덤한 숫자 가져오기
  // Math.floor로 감싸면 뒤의 소수점이 안보인다.
  const randomIndex = Math.floor(Math.random() * blockArray.length);

  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}

function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) {
    return false;
  }
  return true;
}

function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}

function changeDirection() {
  // tempMovingItem.direction += 1;
  // if (tempMovingItem.direction === 4) {
  //   tempMovingItem.direction = 0;
  // } -> 삼항연산자로 코드 깔끔하게

  const direction = tempMovingItem.direction;
  direction === 3
    ? (tempMovingItem.direction = 0)
    : (tempMovingItem.direction += 1);
  renderBlocks();
}

function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 10);
}

function showGameoverText() {
  gameText.style.display = "flex";
}

// Event Handling
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39:
      moveBlock("left", 1); // 좌우 움직이기
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1); // 아래로 움직이기
      break;
    case 38:
      changeDirection();
      break;
    case 32:
      dropBlock();
      break;
    default:
      break;
  }
});

restartButton.addEventListener("click", () => {
  playground.innerHTML = "";
  gameText.style.display = "none";
  init();
});
