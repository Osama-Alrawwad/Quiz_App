// selctors
let qustionCount = document.querySelector(
    ".quiz-app .quiz-info .qustion-count span"
  ),
  bullets = document.querySelector(".quiz-app .bulltes .spans"),
  qustionArea = document.querySelector(".quiz-app .qustion-area"),
  answerArea = document.querySelector(".quiz-app .answer-area"),
  btn = document.getElementById("sumbit-answer"),
  result = document.querySelector(".result"),
  CountElements = document.querySelector(".count-down"),
  choosenLanguage = document.getElementById("select"),
  choosenLevel = document.getElementById("level"),
  category = document.querySelector(".quiz-app .category span"),
  countDownInterval,
  curentNum = 0,
  score = 0,
  timer;
//Make  Interface
function main() {
  let h = document.createElement("h1");
  let q = "Programming Language Test";
  h.textContent = q;
  qustionArea.appendChild(h);
  let startQuiz = document.createElement("button");
  startQuiz.textContent = "Start Quiz !";
  startQuiz.classList.add("start");
  answerArea.appendChild(startQuiz);
  startQuiz.onclick = function () {
    if (choosenLevel.value === "hard") {
      timer = 2;
    } else if (choosenLevel.value === "mid") {
      timer = 4;
    } else {
      timer = 5;
    }
    answerArea.innerHTML = "";
    qustionArea.innerHTML = "";
    startQuiz.remove();
    getRequest();
  };
}
main();
/* fetch  */
function getRequest() {
  fetch(`Json_Files/${choosenLanguage.value}.json`)
    .then((respons) => respons.json())
    .then((data) => {
      let qcount = data.length;
      category.innerHTML = `${choosenLanguage.value}`;
      createBullets(qcount);
      getQustion(data[curentNum], qcount);
      countDown(timer, qcount);
      btn.style.display = "block";
      btn.onclick = () => {
        let rightAnswer = data[curentNum].correct_answer;
        qustionCount.innerHTML = qcount - (curentNum + 2);
        curentNum++;
        checkAnswer(rightAnswer, qcount);
        qustionArea.innerHTML = "";
        answerArea.innerHTML = "";
        getQustion(data[curentNum], qcount);
        handleBullets(qcount);
        if (curentNum === 9) {
          showResult();
        }
        clearInterval(countDownInterval);
        countDown(timer, qcount);
      };
    });
}

// set bullets and count of qustion
function createBullets(num) {
  qustionCount.innerHTML = num - 1;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    if (i === 0) {
      span.classList.add("on");
    }
    bullets.appendChild(span);
  }
}
// set qustion and answer
function getQustion(obj, num) {
  if (curentNum < 10) {
    //create qustions
    let h = document.createElement("h1");
    let q = obj.title;
    h.textContent = q;
    qustionArea.appendChild(h);
    //create answers
    for (let i = 1; i <= 4; i++) {
      let divAnswer = document.createElement("div");
      divAnswer.classList.add(`answer_${i}`);
      let input = document.createElement("input");
      input.type = "radio";
      input.id = `answer_${i}`;
      input.name = `question`;
      input.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        input.checked = true;
      }
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.textContent = obj[`answer_${i}`];
      divAnswer.appendChild(input);
      divAnswer.appendChild(label);
      answerArea.appendChild(divAnswer);
    }
  }
}

function checkAnswer(rAnswer, qusCount) {
  let answers = document.getElementsByName("question");
  let choosenAnwer;
  for (let i = 0; i < 4; i++) {
    if (answers[i].checked) {
      choosenAnwer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === choosenAnwer) {
    score++;
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".quiz-app .bulltes .spans span");
  let arrBullets = Array.from(bulletsSpan);

  arrBullets.forEach((span, index) => {
    if (index === curentNum) {
      span.classList.add("on");
    }
  });
}
function showResult() {
  qustionArea.innerHTML = "Refresh Web-Page If you Want To Start Quiz Again";
  qustionArea.style.textAlign = "center";
  qustionArea.style.fontSize = "22px";
  answerArea.innerHTML = "";
  bullets.innerHTML = "";
  btn.style.display = "none";
  result.style.display = "block";
  let color = score < 5 ? "red" : "green";
  result.innerHTML = `Your Mark Is <span style="color:${color}; font-weight:700">${score}</span> / 10`;
  CountElements.innerHTML = "";
}

function countDown(num, qcount) {
  if (curentNum + 1 < qcount) {
    countDownInterval = setInterval(function () {
      let minutes = parseInt(num / 60);
      let secound = parseInt(num % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      secound = secound < 10 ? `0${secound}` : secound;
      CountElements.innerHTML = `${minutes} : ${secound}`;
      if (--num < 0) {
        clearInterval(countDownInterval);
        btn.click();
      }
    }, 1000);
  }
}
