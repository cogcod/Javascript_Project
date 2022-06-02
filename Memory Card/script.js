const cards = document.querySelectorAll(".card");

function flipCard(e) {
  //   console.log(e.target); -> li태그 출력되는지 확인!
  let clickedCard = e.target; // 클릭된 li태그를 변수에 할당
  clickedCard.classList.add("flip"); // flip 스타일도 추가!
}

// 모든 cards(li)에 card 클릭 이벤트를 넣어준다.
cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});
