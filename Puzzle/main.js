const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");

const tileCount = 16;

let tiles = [];
const dragged = {
  el: null,
  class: null,
  index: null,
};
let isPlaying = false;
let timeInterval = null;
let time = 0;

//functions
function checkStatus() {
  const currentList = [...container.children];
  const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index;);
  if(unMatchedList.length === 0){
    gameText.style.display = "block";
    isPlaying = false;
    clearInterval(timeInterval) // 시간 멈추기 
  }
}

function setGame() {
  isPlaying = true;
  time = 0;
  container.innerHTML = "";
  gameText.style.display = 'none'
  clearInterval(timeInterval)

  tiles = createImageTiles();
  tiles.forEach((tile) => container.appendChild(tile));

  setTimeout(() => { 
    container.innerHTML = "";
    shuffle(tiles).forEach((tile) => container.appendChild(tile));
    timeInterval = setInterval(()=>{
      playTime.innerText = time;
      time++;
    },1000)
  }, 2000);
}

// 배열에 li 노드 16개 생성하기
function createImageTiles() {
  const tempArray = [];
  Array(tileCount)
    .fill()
    .forEach((_, i) => {
      // 현재 배열에 값이 없으니까 앞에는 빈값으로
      const li = document.createElement("li"); // li 노드 생성
      li.setAttribute("date-index", i); // li에 data-index 속성 추가
      li.setAttribute("draggable", "true");
      li.classList.add(`list${i}`); // 템플릿문법
      tempArray.push(li);
    });
  return tempArray;
}

// 사진 순서 섞기
function shuffle(array) {
  let index = array.length - 1; // 제일 마지막 인덱스 선택
  while (index > 0) {
    // 마지막 인덱스부터 1씩 감소하면서 0보다 큰 동안 반복 (뒤에서부터 앞으로 돌아가는것)
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    index--;
  }
  return array;
}

// dragstart
container.addEventListener("dragstart", (e) => {
  if(!isPlaying) return; //isPlaying이 false면 리턴 
  const obj = e.target;
  dragged.el = obj;
  dragged.class = obj.className;
  // ...은 가지고 있는 기본 원소가 불러진다. 그것을 강제로 배열로 만들어 index 추출
  dragged.index = [...obj.parentNode.children].indexOf(obj);
});

// dragover = 드래그 된 채로 다른 엘리먼트 위에 올라왔을 때
container.addEventListener("dragover", (e) => {
  e.preventDefault; // drop 이벤트가 발생하게 하기 위해
});

// drop = 떨어뜨렸을 때
container.addEventListener("drop", (e) => {
  if(!isPlaying) return;
  const obj = e.target;
  // console.log({ obj });

  // 만약에 obj의 className(현재)이 dragged의 class(원래 클래스네임)와 같으면 아무 이벤트도 발생하지 않으면 되고,
  // 같지 않다면 이벤트 발생
  if (obj.className !== dragged.class) {
    let originPlace;
    let isLast = false; // 마지막 엘리먼트인지 확인하는 변수

    // 마지막 li는 nextSibling이 없다. (null)
    if (dragged.el.nextSibling) {
      originPlace = dragged.el.nextSibling; // 드래그해온 그 위치를 저장
    } else {
      originPlace = dragged.el.previousSibling;
      isLast = true;
    }

    // drop 되었을 때의 인덱스가 담김
    const droppedIndex = [...obj.parentNode.children].indexOf(obj);
    // 가져온 인덱스가 drop된 인덱스보다 뒤에 있으면
    // before을 사용하여 앞에 넣어주고
    // 아니면 after를 사용하여 뒤에 넣어주도록 한다.
    dragged.index > droppedIndex
      ? obj.before(dragged.el)
      : obj.after(dragged.el);

    isLast ? originPlace.after(obj) : originPlace.before(obj);
  }

  checkStatus();
});

startButton.addEventListener("click", () => {
  setGame();
});
