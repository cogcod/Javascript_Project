const typingText = document.querySelector(".typing-text p"),
  inpField = document.querySelector(".wrapper .input-field"),
  tryAgainBtn = document.querySelector(".content button"),
  timeTag = document.querySelector(".time span b"),
  mistakeTag = document.querySelector(".mistake span"),
  wpmTag = document.querySelector(".wpm span"),
  cpmTag = document.querySelector(".cpm span");

let timer,
  maxtime = 60,
  timeLeft = maxtime;
charIndex = mistakes = isTyping = 0;

function randomParagraph() {
  // 랜덤 숫자를 가져와서 문장 배열의 길이보다 적도록
  let randIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = "";
  // 문장의 모든 알파벳을 쪼갠다.
  paragraphs[randIndex].split("").forEach((span) => {
    let spanTag = `<span>${span}</span>`;
    typingText.innerHTML += spanTag;
    typingText.querySelectorAll("span")[0].classList.add("active");
  });
  // keydown,click event 로 input에 포커스 (input 태그는 보이지 않는다.)
  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
  const characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex]; // input의 모든 값(알파벳)을 가져옴

  if (charIndex < characters.length - 1 && timeLeft > 0) {
    // timer가 한번 시작하면 어떤 키입력에도 다시 시작하지 않도록
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    if (typedChar == null) {
      // 만약 user가 backspace를 누른다면 index를 증감시키고 클래스를 지운다.
      charIndex--;

      // index span이 incorrect 클래스를 포함할 때만 mistakes를 증감시킴
      if (characters[charIndex].classList.contains("incorrect")) {
        mistakes--;
      }

      characters[charIndex].classList.remove("correct", "incorrect");
    } else {
      // User가 타이핑한 것과 매치해서 correct & incorrect 클래스를 추가한다. + style
      if (characters[charIndex].innerText === typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++; //알파벳의 correct & incorrect 타입을 증가시킴
    }

    characters.forEach((span) => span.classList.remove("active")); // 먼저 모든 active를 삭제하고
    characters[charIndex].classList.add("active"); // 현재 요소에만 active 클래스로 밑줄표시

    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxtime - timeLeft)) * 60
    );
    // 만약 wpm이 0, empty, infinity면 값을 0으로 세팅할 것
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    //   화면의 mistakes 란에 틀린 숫자 반환 (지우면 다시 감소)
    mistakeTag.innerText = mistakes;
    wpmTag.innerText = wpm;
    cpmTag.innerText = charIndex - mistakes;
  } else {
    // timer가 0이되면 user는 타이핑 할 수 없다.
    inpField.value = "";
    clearInterval(timer);
  }
}

function initTimer() {
  // timeLeft(남은시간)이 0보다 크면 timeLeft를 감소시켜라
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
  } else {
    clearInterval(timer);
  }
}

// try again 버튼 이벤트
function resetGame() {
  randomParagraph();
  inpField.value = "";
  clearInterval(timer);
  timeLeft = maxtime;
  charIndex = mistakes = isTyping = 0;
  timeTag.innerText = timeLeft;
  mistakeTag.innerText = mistakes;
  wpmTag.innerText = 0;
  cpmTag.innerText = 0;
}

randomParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
