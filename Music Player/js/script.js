const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = musicList.querySelector("#close");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
isMusicPaused = true;

// Calling load music function once
window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
});

// load music function
function loadMusic(indexNumb) {
  // 현재 재생되고 있는 노래 제목에 allMusic(music-list.js)의 인덱스번호에 해당하는 이름을 넣기
  // 0부터 시작하는 allMusic 배열을 선택하기 위해, musicIndex에서 -1을 해준다.
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
function playMusic() {
  wrapper.classList.add("paused");
  // icon 변경
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// pause music function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// next music function
function nextMusic() {
  musicIndex++;
  // musicIndex가 음악갯수보다 커지면 musicIndex = 1을 주어 첫번째 음악을 재생시킨다.
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// prev music function
function prevMusic() {
  musicIndex--;
  // musicIndex가 1보다 작아지면 인덱스 6을 주어 마지막 곡을 재생시킨다.
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// Play or music button event
playPauseBtn.addEventListener("click", () => {
  // classList.contains : 해당 요소의 클래스 유무 확인 (true/false)
  const isMusicPaused = wrapper.classList.contains("paused");
  /*
    버튼 클릭시, 'paused'클래스가 있으면(현재 재생중이면) pauseMusic함수 실행
    없으면 playMusic함수를 실행한다. 
  */
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

// next music btn event
nextBtn.addEventListener("click", () => {
  nextMusic();
});

// prev music btn event
prevBtn.addEventListener("click", () => {
  prevMusic();
});

// -----------------------------------
// update progress bar width according to music current time
// timeupdate 이벤트를 사용하면 현재 재생시간과 총 duration을 얻을 수 있다.
mainAudio.addEventListener("timeupdate", (e) => {
  //   console.log(e); currentTime과 duration을 확인할 수 있다.
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;

  // 현재 재생 위치를 progress bar에 반환
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

  // 해당 오디오가 로딩을 완료하면 발생시키는 이벤트
  mainAudio.addEventListener("loadeddata", () => {
    // update song total duration : 총 재생시간 보여주기
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      // adding 0 if sec is less than 10 (3:5 -> 3:05)
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  // update playing song current time : 현재 재생시간 반환하기
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    // adding 0 if sec is less than 10 (3:5 -> 3:05)
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Let's update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; // progress bar의 너비
  let clickedOffsetX = e.offsetX; // 파생된 x 값
  let songDuration = mainAudio.duration; // 총 재생시간

  mainAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
  playMusic(); // 일시정지 상태에서 progress bar 누르면 재생되도록
});

// Let's work on "repeat", shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText; // repeat 아이콘의 텍스트를 불러온다.
  switch (getText) {
    case "repeat": // 만약 현재 텍스트가 repeat이면
      repeatBtn.innerText = "repeat_one"; // 그 텍스트를 repeat_one으로 변경하고
      repeatBtn.setAttribute("title", "song looped"); // title 속성값을 변경하라
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

// Above we just change the icon, now let's work on what to do
// After the song ended

//  Audio 엘리먼트의 재생이 종료되었을 때의 이벤트
mainAudio.addEventListener("ended", () => {
  // User가 음악 반복으로 세팅해놓았다면, 현재 음악을 다시 반복해준다.
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat": // 만약 현재 아이콘이 repeat으로 세팅되어있으면 (전체노래반복)
      nextMusic(); // 간단하게 nextMusic 함수를 호출하여 다음 노래를 재생시킨다.
      break;
    case "repeat_one": // repeat_one 이면
      mainAudio.currentTime = 0; // 현재 current time을 0으로 넣어서 노래의 시작지점으로 돌아간다.
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle": // shuffle 이면
      // 배열 범위 안에서 인덱스를 랜덤으로 생성한다.
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); // 다음 랜덤 숫자가 현재 인덱스와 동일하지 않을 때까지 이 반복문을 실행한다.
      musicIndex = randIndex; // 랜덤인덱스를 뮤직인덱스로 넘겨서 랜덤음악 재생
      loadMusic(musicIndex); // loadMusic 함수를 불러온다.
      playMusic();
      playingNow();
      break;
  }
});

// 플레이리스트 열고 닫기
// showMoreBtn(재생목록 아이콘) 클릭 시 show 클래스 토글
showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

// 재생목록 닫기버튼 클릭 시 showMoreBtn 클릭이 진행되어 토글 클래스가 사라짐
hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click(); // 실제 클릭한 효과를 주는 메서드
});

// Let's create li according to the array length
const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  // li로 노래제목과 아티스트명을 배열에서 넘겨주자
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
              </li>`;
  // insertAdjacentHTML(삽입될 위치, 삽입할 내용)
  ulTag.insertAdjacentHTML("beforeend", liTag); // 6개의 li가 생김

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`); // span 태그 선택 (duration)
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`); // audio 태그 선택 (src)

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}

// Let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    if (allLiTags[j].classList.contains("playing")) {
      // play되지 않는 목록은 클래스 제거해서 스타일 없애기!
      allLiTags[j].classList.remove("playing");
      // t-duration 받아서 innerText로 넣어주기
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    // musicIndex와 같은 li-index가 있으면 playing클래스를 추가해서 style해준다.
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    // onclick 속성을 모든 li 태그에 넣기
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

// Let's play song on li click
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index"); // 클릭된 li index를 받아서
  musicIndex = getLiIndex; // li index를 music index로 넘긴다.
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
