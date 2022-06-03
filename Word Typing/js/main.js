const GAME_TIME = 9;
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".word-display");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const button = document.querySelector(".button");

init();

// 처음 초기값으로 세팅할 내용들 넣어주기
function init() {
  buttonChange("Loading...");
  getWords(); // 단어 불러오기
  wordInput.addEventListener("input", checkMatch);
}

// 게임실행
function run() {
  if (isPlaying) {
    return;
  }
  isPlaying = true;
  time = GAME_TIME;
  wordInput.focus(); // input에 포커스 가도록
  scoreDisplay.innerText = 0; // 점수 초기화
  timeInterval = setInterval(countDown, 1000);
  checkInterval = setInterval(checkStatus, 50); // 짧은 시간동안 계속 상태를 체크하도록
  buttonChange("Game in progress..");
}

function checkStatus() {
  if (!isPlaying && time === 0) {
    buttonChange("Game Start");
    clearInterval(checkInterval);
  }
}

// 단어 불러오기
//axios 사용해서 단어 API 불러오기
function getWords() {
  axios
    .get("https://random-word-api.herokuapp.com/word?number=100")
    .then(function (response) {
      response.data.forEach((word) => {
        if (word.length < 10) {
          words.push(word);
        }
      });
      buttonChange("Game Start");
      console.log(words);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

// input창에 어떤 글자를 입력했는지 그 값을 받아오기
// 보여진 예시와 입력한 글자가 같을 경우에 점수를 1점 올려준다.

// 단어일치 체크
function checkMatch() {
  if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
    wordInput.value = "";
    if (!isPlaying) {
      return; // 게임중이 아니면 리턴시켜서 종료된다.
    }
    score++;
    scoreDisplay.innerText = score;
    time = GAME_TIME;

    // 랜덤 인덱스로 단어 뿌려주기
    const randomIndex = Math.floor(Math.random() * words.length);
    wordDisplay.innerText = words[randomIndex];
  }
}

// buttonChange("게임시작");

// 버튼을 눌렀을 때 시간이 카운트 되도록
function countDown() {
  time > 0 ? time-- : (isPlaying = false);
  if (!isPlaying) {
    clearInterval(timeInterval);
  }
  timeDisplay.innerText = time;
}

function buttonChange(text) {
  button.innerText = text;
  text === "Game Start"
    ? button.classList.remove("loading")
    : button.classList.add("loading");
}
