// DOM
const playground = document.querySelector(".playground>ul");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// Variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem; // movingItem을 실질적으로 사용하기 전에 잠깐 담아두는 용도

const BLOCKS = {
  tree: [
    // 하나의 블럭의 4가지 모양 (상,하,좌,우를 보는 각각의 모양)
    [
      [2, 1],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [],
    [],
    [],
  ],
};

// top,left값을 통해 좌표가 변경이 되도록

const movingItem = {
  // block의 타입, 좌표 등의 정보
  type: "tree", // 위에서 만든 tree의 형태를 가져옴
  direction: 0, // 화살표(위) 방향키를 눌렀을 때 블럭의 방향을 돌리는 지표
  top: 10, // 지표를 기준으로 어디까지 내려와야 되는지 표현
  left: 3, // 좌우값을 알려주는 역할
};

init(); // init이 호출되면서 아래 함수들이 실행, 총 20개의 li를 제작하게 됨

// Functions
function init() {
  /*
    spread operator를 사용하여 movingItem의 값만 가져와서 넣는다.
    (movingItem 자체를 가져오는게 아니라, 껍데기를 벗긴 안의 내용만 가져옴!)
    tempMovingItem = movingItem; 라고 직접적으로 넣게 되면 
    movingItem의 값이 바뀌면 tempMovingItem도 같이 바뀌기 때문에.
    - 즉, movingItem이 변경되더라도 tempMovingItem의 값은 변경되지 않는다.
    - tempMovingItem 내용을 변경해본 후 맞는지 안맞는지 확인한 후에 movingItem 값을 변경하려고 하는 것 
  */
  tempMovingItem = { ...movingItem };
  for (let i = 0; i < GAME_ROWS; i++) {
    prependNewLine();
  }
  renderBlocks();
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

function renderBlocks() {
  /*
        tempMovingItem.type;
        tempMovingItem.direction;
        tempMovingItem.top;
        tempMovingItem.left;
        - 이렇게 하나씩 접근하기 힘드니까 바로바로 변수처럼 접근할 수 있도록 
    */

  const { type, direction, top, left } = tempMovingItem;
  //   console.log(type, direction, top, left);
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving");
    console.log(moving);
  });

  //   BLOCKS[type][direction];
  //   console.log(BLOCKS[type][direction]);

  BLOCKS[type][direction].forEach((block) => {
    const x = block[0] + left; // row 안에 들어있는 li의 값 + left값 만큼 이동
    const y = block[1] + top; // row 값 + top값 만큼 이동
    // console.log(playground);
    // childNodes는 forEach같은 배열함수를 사용할 수 있는 형태로 변환시켜준다.
    const target = playground.childNodes[y].childNodes[0].childNodes[x];
    // console.log(target);
    target.classList.add(type, "moving"); // tree를 class로 줌 -> css에서 색 넣어주기
  });
}

function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  renderBlocks();
}

// Event Handling
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1);
      break;
    default:
      break;
  }
  //   console.log(e);
});
