const blanks = [...document.querySelectorAll(".blank")];
const scoreEl = document.getElementById("score");
const doneBanner = document.getElementById("doneBanner");
let lastFocused = null;

const SYMBOL_MAP = {
  "①": "1", "②": "2", "③": "3", "④": "4", "⑤": "5",
  "○": "o", "◯": "o", "×": "x", "✕": "x", "½": "1/2",
};

function normalize(text) {
  return text
    .replace(/[①-⑤○◯×✕½]/g, (c) => SYMBOL_MAP[c])
    .toLowerCase()
    .replace(/[\s·.,()∠″"']/g, "");
}

function acceptedAnswers(blank) {
  const alts = (blank.dataset.alt || "").split("|").filter(Boolean);
  return [blank.dataset.answer, ...alts].map(normalize);
}

function isCorrect(blank, value) {
  return acceptedAnswers(blank).includes(normalize(value));
}

function buildBlanks() {
  blanks.forEach((blank, i) => {
    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", `빈칸 ${i + 1}`);
    input.style.width = `${Math.max(4, blank.dataset.answer.length * 1.1 + 1.2)}em`;
    blank.appendChild(input);

    input.addEventListener("focus", () => {
      lastFocused = blank;
    });
    input.addEventListener("input", () => {
      blank.classList.remove("wrong");
      if (isCorrect(blank, input.value)) {
        markCorrect(blank);
        focusNext(i);
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      checkBlank(blank);
      focusNext(i);
    });
  });
}

function markCorrect(blank) {
  const input = blank.querySelector("input");
  input.value = blank.dataset.answer;
  input.readOnly = true;
  blank.classList.remove("wrong", "revealed");
  blank.classList.add("correct");
  updateScore();
}

function checkBlank(blank) {
  const input = blank.querySelector("input");
  if (blank.classList.contains("correct") || blank.classList.contains("revealed")) return;
  if (isCorrect(blank, input.value)) markCorrect(blank);
  else if (input.value.trim()) blank.classList.add("wrong");
}

function focusNext(index) {
  for (let k = 1; k <= blanks.length; k++) {
    const next = blanks[(index + k) % blanks.length];
    if (!next.classList.contains("correct") && !next.classList.contains("revealed")) {
      next.querySelector("input").focus();
      return;
    }
  }
}

function updateScore() {
  const correct = blanks.filter((b) => b.classList.contains("correct")).length;
  scoreEl.textContent = `${correct} / ${blanks.length}`;
  doneBanner.hidden = correct !== blanks.length;
}

function checkAll() {
  blanks.forEach(checkBlank);
  updateScore();
}

function revealAll() {
  blanks.forEach((blank) => {
    if (blank.classList.contains("correct")) return;
    const input = blank.querySelector("input");
    input.value = blank.dataset.answer;
    input.readOnly = true;
    blank.classList.remove("wrong");
    blank.classList.add("revealed");
  });
  updateScore();
}

function resetAll() {
  blanks.forEach((blank) => {
    const input = blank.querySelector("input");
    input.value = "";
    input.readOnly = false;
    blank.classList.remove("correct", "wrong", "revealed");
  });
  updateScore();
  blanks[0].querySelector("input").focus();
}

function giveHint() {
  const unsolved = (b) => !b.classList.contains("correct") && !b.classList.contains("revealed");
  const target = lastFocused && unsolved(lastFocused) ? lastFocused : blanks.find(unsolved);
  if (!target) return;
  const input = target.querySelector("input");
  const answer = target.dataset.answer;
  let n = 0;
  while (n < input.value.length && input.value[n] === answer[n]) n++;
  input.value = answer.slice(0, n + 1);
  input.focus();
  input.dispatchEvent(new Event("input"));
}

document.getElementById("checkAll").addEventListener("click", checkAll);
document.getElementById("revealAll").addEventListener("click", revealAll);
document.getElementById("resetAll").addEventListener("click", resetAll);
document.getElementById("hintBtn").addEventListener("mousedown", (e) => e.preventDefault());
document.getElementById("hintBtn").addEventListener("click", giveHint);
document.getElementById("togglePhoto").addEventListener("click", (e) => {
  const wrap = document.getElementById("photoWrap");
  wrap.hidden = !wrap.hidden;
  e.currentTarget.textContent = wrap.hidden ? "원본 사진 보기" : "원본 사진 닫기";
});

buildBlanks();
updateScore();
