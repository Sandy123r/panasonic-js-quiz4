const startBtn = document.getElementById("startBtn");
const unitInput = document.getElementById("unit");
const nameInput = document.getElementById("name");
const empIdInput = document.getElementById("empId");

const pages = document.querySelectorAll(".page");
const qImg = document.getElementById("questionImage");
const qNumber = document.getElementById("qNumber");
const options = document.querySelectorAll(".option");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreText = document.getElementById("scoreText");

const TOTAL_QUESTIONS = 63;

let currentQ = 0;
let score = 0;
let answered = Array(TOTAL_QUESTIONS).fill(false);
let selectedAnswer = Array(TOTAL_QUESTIONS).fill(null);

/* ANSWER KEY */
const answers = [
  "A","G","B","C","A","D","F","A","B","G",
  "A","C","D","A","E","B","A","G","A","C",
  "A","D","B","A","G","A","C","D","B","F",
  "A","G","A","B","D","C","A","G","E","B",
  "A","F","G","D","A","C","B","A","G","D",
  "A","B","C","A","G","D","A","B","C","B",
  "A","F","B"
];

/* PAGE CONTROL */
function showPage(i) {
  pages.forEach(p => p.classList.remove("active"));
  pages[i].classList.add("active");
}

showPage(0);

/* START BUTTON ENABLE */
function checkStartEnable() {
  startBtn.disabled = !(unitInput.value && nameInput.value && empIdInput.value);
}

unitInput.addEventListener("change", checkStartEnable);
nameInput.addEventListener("input", checkStartEnable);
empIdInput.addEventListener("input", checkStartEnable);

/* START QUIZ */
startBtn.onclick = () => {
  showPage(1);
  loadQuestion();
};

/* LOAD QUESTION */
function loadQuestion() {
  qNumber.textContent = `Question ${currentQ + 1} / ${TOTAL_QUESTIONS}`;
  qImg.src = `images/q${currentQ + 1}.png`;

  options.forEach(opt => {
    opt.className = "option";
    if (selectedAnswer[currentQ]) {
      opt.classList.add("disabled");
      if (opt.dataset.option === selectedAnswer[currentQ]) {
        opt.classList.add(
          opt.dataset.option === answers[currentQ] ? "correct" : "wrong"
        );
      }
    }
  });

  prevBtn.disabled = currentQ === 0;
  nextBtn.textContent = currentQ === TOTAL_QUESTIONS - 1 ? "SUBMIT" : "NEXT >";
}

/* OPTION CLICK */
options.forEach(opt => {
  opt.onclick = () => {
    if (answered[currentQ]) return;

    answered[currentQ] = true;
    selectedAnswer[currentQ] = opt.dataset.option;

    options.forEach(o => o.classList.add("disabled"));

    if (opt.dataset.option === answers[currentQ]) {
      opt.classList.add("correct");
      score++;
    } else {
      opt.classList.add("wrong");
    }
  };
});

/* NAVIGATION */
prevBtn.onclick = () => {
  if (currentQ > 0) {
    currentQ--;
    loadQuestion();
  }
};

nextBtn.onclick = () => {
  if (currentQ < TOTAL_QUESTIONS - 1) {
    currentQ++;
    loadQuestion();
  } else {
    submitQuiz();
  }
};

/* SUBMIT */
function submitQuiz() {
  showPage(2);
  scoreText.textContent = `Your score: ${score} / ${TOTAL_QUESTIONS}`;

  fetch("https://script.google.com/macros/s/AKfycbzE76URdE9-uAlqZqWQG1dcJKJEX2zw8pbPOuICPyKAjQqYb4TbG7LPXQvtOCq6xop6/exec", {
    method: "POST",
    body: JSON.stringify({
      unit: unitInput.value,
      name: nameInput.value,
      empId: empIdInput.value,
      score: `${score}/${TOTAL_QUESTIONS}`
    })
  });
}
