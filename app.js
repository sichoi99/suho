const STORAGE_KEY = "passage-memorize-progress";
const VOCAB_STORAGE_KEY = "passage-vocab-progress";
const STAR_STORAGE_KEY = "passage-starred";
const GAME_STORAGE_KEY = "passage-memorize-game";

const XP_PER_LEVEL = 100;
const TIME_CHALLENGE_SEC = 180;
const TIME_CHALLENGE_TARGET = 5;
const TIME_CHALLENGE_BONUS_XP = 50;

const VOCAB_VIEWS = ["quiz", "write", "card", "list"];
const VOCAB_VIEW_LABELS = {
  quiz: "퀴즈",
  write: "영작",
  card: "카드",
  list: "목록",
};

let progressByPassage = { invention: [], shopper: [] };
let vocabProgressByPassage = { shopper: { quiz: [], write: [], card: [], list: [] } };
let starsByPassage = {
  invention: { sentences: [], vocab: [] },
  shopper: { sentences: [], vocab: [] },
};

const state = {
  mode: "scramble",
  sectionFilter: "all",
  keyOnly: false,
  starOnly: false,
  hideEnglish: false,
  mastered: new Set(),
  starredSentences: new Set(),
  practiceIds: [],
  practiceIndex: 0,
  vocabSectionFilter: "all",
  vocabStarOnly: false,
  vocabMasteredByView: {
    quiz: new Set(),
    write: new Set(),
    card: new Set(),
    list: new Set(),
  },
  starredVocab: new Set(),
  vocabIds: [],
  vocabIndex: 0,
  vocabView: "quiz",
  vocabQuizAnswered: false,
  vocabWriteAnswered: false,
  vocabCardFlipped: false,
};

const game = {
  xp: 0,
  combo: 0,
  timeChallenge: {
    active: false,
    endsAt: 0,
    correct: 0,
  },
};

let scrambleState = {
  picked: [],
  bank: [],
  correctTokens: [],
  checkCount: 0,
};
let challengeTimerInterval = null;
let xpToastTimer = null;

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        progressByPassage.invention = data;
        progressByPassage.shopper = [];
      } else {
        progressByPassage = { invention: data.invention || [], shopper: data.shopper || [] };
      }
    }
  } catch {
    progressByPassage = { invention: [], shopper: [] };
  }
}

function emptyVocabProgress() {
  return { quiz: [], write: [], card: [], list: [] };
}

function normalizeVocabProgressEntry(entry) {
  if (Array.isArray(entry)) {
    return { ...emptyVocabProgress(), quiz: [...entry] };
  }
  if (entry && typeof entry === "object") {
    const base = emptyVocabProgress();
    for (const view of VOCAB_VIEWS) {
      if (Array.isArray(entry[view])) base[view] = entry[view];
    }
    return base;
  }
  return emptyVocabProgress();
}

function normalizeVocabProgressStore(data) {
  if (!data || typeof data !== "object") {
    return { shopper: emptyVocabProgress() };
  }
  const result = {};
  for (const [passageId, entry] of Object.entries(data)) {
    result[passageId] = normalizeVocabProgressEntry(entry);
  }
  if (!result.shopper) result.shopper = emptyVocabProgress();
  return result;
}

function getVocabMasteredSet(view = state.vocabView) {
  return state.vocabMasteredByView[view] || state.vocabMasteredByView.quiz;
}

function syncVocabMasteredForPassage() {
  const data = vocabProgressByPassage[activePassageId] || emptyVocabProgress();
  for (const view of VOCAB_VIEWS) {
    state.vocabMasteredByView[view] = new Set(data[view] || []);
  }
}

function syncMasteredForPassage() {
  const ids = progressByPassage[activePassageId] || [];
  state.mastered = new Set(ids);
  syncVocabMasteredForPassage();
  syncStarsForPassage();
}

function loadStars() {
  try {
    const raw = localStorage.getItem(STAR_STORAGE_KEY);
    if (raw) starsByPassage = JSON.parse(raw);
  } catch {
    starsByPassage = {
      invention: { sentences: [], vocab: [] },
      shopper: { sentences: [], vocab: [] },
    };
  }
}

function syncStarsForPassage() {
  const data = starsByPassage[activePassageId] || { sentences: [], vocab: [] };
  state.starredSentences = new Set(data.sentences || []);
  state.starredVocab = new Set(data.vocab || []);
}

function saveStars() {
  starsByPassage[activePassageId] = {
    sentences: [...state.starredSentences],
    vocab: [...state.starredVocab],
  };
  localStorage.setItem(STAR_STORAGE_KEY, JSON.stringify(starsByPassage));
}

function updateStarButton(btn, starred) {
  if (!btn) return;
  btn.textContent = starred ? "★" : "☆";
  btn.classList.toggle("starred", starred);
  btn.setAttribute("aria-pressed", String(starred));
}

function toggleStarSentence(id) {
  if (state.starredSentences.has(id)) state.starredSentences.delete(id);
  else state.starredSentences.add(id);
  saveStars();
  if (state.starOnly) {
    buildPracticeQueue();
    renderCurrentMode();
  }
  renderProgressDots();
  if (state.mode === "read") renderReadMode();
}

function toggleStarVocab(id) {
  if (state.starredVocab.has(id)) state.starredVocab.delete(id);
  else state.starredVocab.add(id);
  saveStars();
  if (state.vocabStarOnly) {
    buildVocabQueue();
    renderVocabMode();
  }
  renderProgressDots();
  if (state.mode === "vocab-star") renderVocabStarMode();
  else if (state.vocabView === "list") renderVocabList();
}

function bindSentenceStarButton(btn, sentenceId) {
  if (!btn || !sentenceId) return;
  updateStarButton(btn, state.starredSentences.has(sentenceId));
  btn.onclick = () => {
    toggleStarSentence(sentenceId);
    updateStarButton(btn, state.starredSentences.has(sentenceId));
  };
}

function bindVocabStarButton(btn, vocabId) {
  if (!btn || !vocabId) return;
  updateStarButton(btn, state.starredVocab.has(vocabId));
  btn.onclick = () => {
    toggleStarVocab(vocabId);
    updateStarButton(btn, state.starredVocab.has(vocabId));
  };
}

function loadVocabProgress() {
  try {
    const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
    vocabProgressByPassage = raw
      ? normalizeVocabProgressStore(JSON.parse(raw))
      : { shopper: emptyVocabProgress() };
  } catch {
    vocabProgressByPassage = { shopper: emptyVocabProgress() };
  }
}

function saveVocabProgress() {
  const entry = emptyVocabProgress();
  for (const view of VOCAB_VIEWS) {
    entry[view] = [...getVocabMasteredSet(view)];
  }
  vocabProgressByPassage[activePassageId] = entry;
  localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(vocabProgressByPassage));
}

function isVocabMode() {
  return state.mode === "vocab";
}

function isVocabStarMode() {
  return state.mode === "vocab-star";
}

function isVocabRelatedMode() {
  return state.mode === "vocab" || state.mode === "vocab-star";
}

function getStarredVocabList() {
  let list = getAllVocab().filter((v) => state.starredVocab.has(v.id));
  if (state.vocabSectionFilter !== "all") {
    list = list.filter((v) => v.sectionId === state.vocabSectionFilter);
  }
  return list;
}

function getFilteredVocab() {
  let list = getAllVocab();
  if (state.vocabSectionFilter !== "all") {
    list = list.filter((v) => v.sectionId === state.vocabSectionFilter);
  }
  if (state.vocabStarOnly) list = list.filter((v) => state.starredVocab.has(v.id));
  return list;
}

function buildVocabQueue() {
  state.vocabIds = getFilteredVocab().map((v) => v.id);
  if (state.vocabIndex >= state.vocabIds.length) {
    state.vocabIndex = Math.max(0, state.vocabIds.length - 1);
  }
}

function currentVocabItem() {
  const id = state.vocabIds[state.vocabIndex];
  return id ? getVocabById(id) : null;
}

function markVocabMastered(id, view = state.vocabView) {
  getVocabMasteredSet(view).add(id);
  saveVocabProgress();
  updateProgressUI();
  if (state.vocabView === "list" || view === "list") renderVocabList();
}

function loadGame() {
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    if (typeof data.xp === "number") game.xp = data.xp;
    if (typeof data.combo === "number") game.combo = data.combo;

    if (data.timeChallenge?.active && data.timeChallenge.endsAt > Date.now()) {
      game.timeChallenge = {
        active: true,
        endsAt: data.timeChallenge.endsAt,
        correct: data.timeChallenge.correct || 0,
      };
    } else {
      game.timeChallenge = { active: false, endsAt: 0, correct: 0 };
    }
  } catch {
    resetGameState();
  }
}

function resetGameState() {
  game.xp = 0;
  game.combo = 0;
  game.timeChallenge = { active: false, endsAt: 0, correct: 0 };
}

function saveProgress() {
  progressByPassage[activePassageId] = [...state.mastered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progressByPassage));
}

function saveGame() {
  try {
    localStorage.setItem(
      GAME_STORAGE_KEY,
      JSON.stringify({
        xp: game.xp,
        combo: game.combo,
        timeChallenge: game.timeChallenge,
      })
    );
  } catch {
    /* localStorage unavailable */
  }
}

function getLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function getXpInLevel(xp) {
  return xp % XP_PER_LEVEL;
}

function emptySentenceMessage() {
  if (state.starOnly) {
    return "별표한 문장이 없습니다. 읽기 탭에서 ☆를 눌러 추가하세요.";
  }
  return "선택한 조건에 맞는 문장이 없습니다.";
}

function emptyVocabMessage() {
  if (state.vocabStarOnly) {
    return "별표한 단어가 없습니다. 목록에서 ☆를 눌러 추가하세요.";
  }
  return "표시할 단어가 없습니다.";
}

function getFilteredSentences() {
  let list = getAllSentences();
  if (state.sectionFilter !== "all") {
    list = list.filter((s) => s.sectionId === state.sectionFilter);
  }
  if (state.keyOnly) list = list.filter((s) => s.highlight);
  if (state.starOnly) list = list.filter((s) => state.starredSentences.has(s.id));
  return list;
}

function buildPracticeQueue() {
  state.practiceIds = getFilteredSentences().map((s) => s.id);
  if (state.practiceIndex >= state.practiceIds.length) {
    state.practiceIndex = Math.max(0, state.practiceIds.length - 1);
  }
}

function currentPracticeSentence() {
  const id = state.practiceIds[state.practiceIndex];
  return id ? getSentenceById(id) : null;
}

function normalizeAnswer(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:]/g, (m) => (m === "?" ? "?" : ""));
}

function compareSentences(user, correct) {
  const a = normalizeAnswer(user);
  const b = normalizeAnswer(correct);
  if (a === b) return true;
  const stripPunct = (s) => s.replace(/[.,!?;:]/g, "").trim();
  return stripPunct(a) === stripPunct(b);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function updateGameUI() {
  const level = getLevel(game.xp);
  const inLevel = getXpInLevel(game.xp);
  const pct = (inLevel / XP_PER_LEVEL) * 100;

  const levelEl = document.getElementById("gameLevel");
  const xpTextEl = document.getElementById("gameXpText");
  const xpBar = document.getElementById("xpBar");
  const headerGame = document.getElementById("headerGame");
  const comboEl = document.getElementById("comboCount");
  const comboDisplay = document.getElementById("comboDisplay");

  if (levelEl) levelEl.textContent = String(level);
  if (xpTextEl) xpTextEl.textContent = `${inLevel} / ${XP_PER_LEVEL} XP`;
  if (xpBar) xpBar.style.width = `${pct}%`;
  if (headerGame) {
    headerGame.textContent =
      game.combo > 0
        ? `Lv.${level} · ${game.xp} XP · 🔥 콤보 ${game.combo}`
        : `Lv.${level} · ${game.xp} XP`;
  }
  if (comboEl) comboEl.textContent = String(game.combo);
  if (comboDisplay) {
    comboDisplay.classList.toggle("combo-hot", game.combo >= 3);
  }

  const mainGame = document.getElementById("mainScreenGame");
  if (mainGame) {
    if (game.xp > 0 || game.combo > 0) {
      mainGame.hidden = false;
      mainGame.textContent =
        game.combo > 0
          ? `Lv.${level} · ${game.xp} XP · 🔥 콤보 ${game.combo}`
          : `Lv.${level} · ${game.xp} XP`;
    } else {
      mainGame.hidden = true;
    }
  }

  updateTimeChallengeUI();
}

function showXpToast(amount, combo) {
  const toast = document.getElementById("xpToast");
  if (!toast) return;
  let msg = `+${amount} XP`;
  if (combo >= 2) msg += ` · 콤보 ×${combo}`;
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(xpToastTimer);
  xpToastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

function showComboPopup(combo) {
  if (combo < 2) return;
  const pop = document.getElementById("comboPopup");
  if (!pop) return;
  pop.textContent = `COMBO ×${combo}!`;
  pop.hidden = false;
  setTimeout(() => {
    pop.hidden = true;
  }, 1200);
}

function onAnswerWrong() {
  game.combo = 0;
  saveGame();
  updateGameUI();
}

function onAnswerCorrect({ sentenceId, mode, checkCount }) {
  const wasMastered = state.mastered.has(sentenceId);
  game.combo += 1;

  let earned = mode === "scramble" ? 15 : mode === "vocab" ? 8 : 12;
  if (!wasMastered) earned += 10;
  if (mode === "scramble" && checkCount === 1) earned += 10;
  if (game.combo >= 2) earned += (game.combo - 1) * 5;

  const oldLevel = getLevel(game.xp);
  game.xp += earned;
  const newLevel = getLevel(game.xp);

  if (game.timeChallenge.active) {
    game.timeChallenge.correct += 1;
    if (game.timeChallenge.correct >= TIME_CHALLENGE_TARGET) {
      game.xp += TIME_CHALLENGE_BONUS_XP;
      endTimeChallenge(true);
      saveGame();
      updateGameUI();
      showXpToast(earned + TIME_CHALLENGE_BONUS_XP, game.combo);
      showComboPopup(game.combo);
      if (getLevel(game.xp) > oldLevel) showLevelUp(getLevel(game.xp));
      return;
    }
  }

  saveGame();
  updateGameUI();
  showXpToast(earned, game.combo);
  showComboPopup(game.combo);
  if (newLevel > oldLevel) showLevelUp(newLevel);
}

function showLevelUp(level) {
  const toast = document.getElementById("xpToast");
  if (!toast) return;
  toast.textContent = `🎉 레벨 업! Lv.${level}`;
  toast.hidden = false;
  clearTimeout(xpToastTimer);
  xpToastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

function markMastered(id) {
  state.mastered.add(id);
  saveProgress();
  updateProgressUI();
  if (state.mode === "read") renderReadMode();
}

function updateProgressUI() {
  const vocab = isVocabMode();
  const starMode = isVocabStarMode();
  const total = vocab || starMode ? getVocabCount() : getPassageSentenceCount();
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const resetBtn = document.getElementById("resetProgress");

  if (starMode) {
    const starred = getStarredVocabList().length;
    const allStarred = [...state.starredVocab].length;
    if (progressBar) progressBar.style.width = total ? `${(allStarred / total) * 100}%` : "0%";
    if (progressText) {
      progressText.textContent =
        starred === allStarred
          ? `★ ${allStarred}개 별표`
          : `★ ${starred}개 별표 (전체 ${allStarred}개)`;
    }
    if (resetBtn) resetBtn.hidden = true;
  } else {
    const done = vocab ? getVocabMasteredSet().size : state.mastered.size;
    const pct = total ? (done / total) * 100 : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressText) {
      progressText.textContent = vocab
        ? `${done} / ${total} 단어 완료 (${VOCAB_VIEW_LABELS[state.vocabView]})`
        : `${done} / ${total} 문장 완료`;
    }
    if (resetBtn) resetBtn.hidden = false;
  }

  renderProgressDots();
}

function ensureSentenceInQueue(sentenceId) {
  if (getFilteredSentences().some((s) => s.id === sentenceId)) {
    buildPracticeQueue();
    return true;
  }
  state.sectionFilter = "all";
  state.keyOnly = false;
  state.starOnly = false;
  const keyEl = document.getElementById("keyOnly");
  const starEl = document.getElementById("starOnly");
  if (keyEl) keyEl.checked = false;
  if (starEl) starEl.checked = false;
  document.querySelectorAll("#filterBtns .filter-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.section === "all");
  });
  buildPracticeQueue();
  return state.practiceIds.includes(sentenceId);
}

function scrollToSentenceInRead(sentenceId) {
  const el = document.getElementById(`sentence-${sentenceId}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function goToSentence(sentenceId) {
  if (!ensureSentenceInQueue(sentenceId)) return;

  const idx = state.practiceIds.indexOf(sentenceId);
  if (idx < 0) return;

  state.practiceIndex = idx;

  if (state.mode === "read") {
    renderReadMode();
    requestAnimationFrame(() => scrollToSentenceInRead(sentenceId));
  } else {
    renderCurrentMode();
  }
  renderProgressDots();
}

function goToVocab(vocabId) {
  const inFilter = getFilteredVocab().some((v) => v.id === vocabId);
  if (!inFilter) {
    state.vocabSectionFilter = "all";
    state.vocabStarOnly = false;
    const starEl = document.getElementById("vocabStarOnly");
    if (starEl) starEl.checked = false;
    document.querySelectorAll("#vocabFilterBtns .filter-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.section === "all");
    });
  }
  buildVocabQueue();
  const idx = state.vocabIds.indexOf(vocabId);
  if (idx < 0) return;
  state.vocabIndex = idx;
  renderVocabMode();
  renderProgressDots();
  if (state.vocabView === "list") {
    requestAnimationFrame(() => {
      const el = document.getElementById(`vocab-item-${vocabId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
}

function renderProgressDots() {
  const container = document.getElementById("progressDots");
  if (!container) return;
  container.innerHTML = "";

  if (isVocabRelatedMode()) {
    const vocabItems = isVocabStarMode() ? getStarredVocabList() : getAllVocab();
    const currentId = isVocabStarMode() ? null : state.vocabIds[state.vocabIndex];
    const mastered = isVocabStarMode() ? null : getVocabMasteredSet();

    vocabItems.forEach((v) => {
      const done = mastered ? mastered.has(v.id) : false;
      const starred = state.starredVocab.has(v.id);
      const isCurrent = v.id === currentId;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `progress-dot${done ? " done" : ""}${starred ? " starred" : ""}${isCurrent ? " current" : ""}`;
      btn.textContent = starred ? `★${formatId(v.id)}` : formatId(v.id);
      btn.title = isVocabStarMode()
        ? `${v.word} — 클릭하여 학습`
        : `${v.word}${starred ? " · 별표" : ""}${done ? ` · 완료 (${VOCAB_VIEW_LABELS[state.vocabView]})` : ""} — 클릭하여 이동`;
      btn.addEventListener("click", () => {
        if (isVocabStarMode()) goToStarredVocabPractice(v.id);
        else goToVocab(v.id);
      });
      container.appendChild(btn);
    });
    return;
  }

  const currentId = state.practiceIds[state.practiceIndex];
  getAllSentences().forEach((s) => {
    const done = state.mastered.has(s.id);
    const starred = state.starredSentences.has(s.id);
    const isCurrent = s.id === currentId;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `progress-dot${done ? " done" : ""}${starred ? " starred" : ""}${isCurrent ? " current" : ""}`;
    btn.textContent = starred ? `★${formatId(s.id)}` : formatId(s.id);
    btn.title = `문장 ${formatId(s.id)}${starred ? " · 별표" : ""}${done ? " · 완료" : ""} — 클릭하여 이동`;
    btn.addEventListener("click", () => goToSentence(s.id));
    container.appendChild(btn);
  });
}

function updatePassageUI() {
  const hasVocab = hasVocabulary();
  const vocabTab = document.getElementById("vocabTab");
  const vocabStarTab = document.getElementById("vocabStarTab");
  if (vocabTab) vocabTab.hidden = !hasVocab;
  if (vocabStarTab) vocabStarTab.hidden = !hasVocab;
  if (!hasVocab && isVocabRelatedMode()) setMode("scramble");
  updateSidebarPanels();
}

function updateSidebarPanels() {
  const vocabRelated = isVocabRelatedMode();
  const sentencePanel = document.getElementById("sentenceFilterPanel");
  const vocabPanel = document.getElementById("vocabFilterPanel");
  const keyOnlyLabel = document.querySelector("#keyOnly")?.closest(".checkbox-label");
  const vocabStarOnlyLabel = document.querySelector("#vocabStarOnly")?.closest(".checkbox-label");
  if (sentencePanel) sentencePanel.hidden = vocabRelated;
  if (vocabPanel) vocabPanel.hidden = !vocabRelated;
  if (keyOnlyLabel) keyOnlyLabel.hidden = vocabRelated;
  if (vocabStarOnlyLabel) vocabStarOnlyLabel.hidden = isVocabStarMode();
}

function renderVocabFilterButtons() {
  const container = document.getElementById("vocabFilterBtns");
  if (!container) return;
  const sections = [
    { id: "all", title: "전체" },
    { id: "watch", title: "Watch and Talk" },
    { id: "reading", title: "Reading" },
    { id: "review", title: "Review" },
  ];
  container.innerHTML = sections
    .map(
      (s) =>
        `<button class="filter-btn${state.vocabSectionFilter === s.id ? " active" : ""}" data-section="${s.id}">${s.title}</button>`
    )
    .join("");
  container.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.vocabSectionFilter = btn.dataset.section;
      buildVocabQueue();
      if (state.mode === "vocab-star") renderVocabStarMode();
      else renderVocabMode();
      updateProgressUI();
    });
  });
}

function setVocabView(view) {
  state.vocabView = view;
  document.querySelectorAll(".vocab-view-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.vocabView === view);
  });
  document.querySelectorAll(".vocab-view").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `vocab${view.charAt(0).toUpperCase() + view.slice(1)}View`);
  });
  renderVocabMode();
  updateProgressUI();
}

function normalizeVocabAnswer(text) {
  return text.trim().toLowerCase().replace(/~/g, "").replace(/\s+/g, " ").trim();
}

function checkVocabWriteAnswer(userInput, item) {
  return normalizeVocabAnswer(userInput) === normalizeVocabAnswer(item.word);
}

function renderVocabWrite() {
  buildVocabQueue();
  state.vocabWriteAnswered = false;
  const item = currentVocabItem();
  const meta = document.getElementById("vocabWriteMeta");
  const meaningEl = document.getElementById("vocabMeaningPrompt");
  const defEl = document.getElementById("vocabWriteDefinition");
  const input = document.getElementById("vocabWriteInput");
  const feedback = document.getElementById("vocabWriteFeedback");
  feedback.hidden = true;

  if (!item) {
    meta.textContent = "—";
    meaningEl.textContent = emptyVocabMessage();
    defEl.hidden = true;
    input.value = "";
    input.disabled = true;
    input.classList.remove("correct", "wrong");
    const starBtn = document.getElementById("vocabWriteStar");
    if (starBtn) starBtn.hidden = true;
    return;
  }

  meta.textContent = `${formatId(item.id)} · ${item.sectionTitle}`;
  meaningEl.textContent = item.meaning;
  if (item.definition) {
    defEl.hidden = false;
    defEl.textContent = item.definition;
  } else {
    defEl.hidden = true;
  }

  input.value = "";
  input.disabled = false;
  input.classList.remove("correct", "wrong");
  input.focus();

  const writeStar = document.getElementById("vocabWriteStar");
  if (writeStar) writeStar.hidden = false;
  bindVocabStarButton(writeStar, item.id);
}

function checkVocabWrite() {
  if (state.vocabWriteAnswered) return;
  const item = currentVocabItem();
  const input = document.getElementById("vocabWriteInput");
  const feedback = document.getElementById("vocabWriteFeedback");
  if (!item || !input) return;

  const answer = input.value.trim();
  if (!answer) {
    feedback.hidden = false;
    feedback.className = "feedback error";
    feedback.textContent = "영어 단어를 입력하세요.";
    return;
  }

  state.vocabWriteAnswered = true;
  const correct = checkVocabWriteAnswer(answer, item);
  input.disabled = true;
  input.classList.add(correct ? "correct" : "wrong");
  feedback.hidden = false;
  feedback.className = `feedback ${correct ? "success" : "error"}`;
  feedback.textContent = correct
    ? "정답입니다!"
    : `틀렸습니다. 정답: ${item.word}`;

  if (correct) {
    onAnswerCorrect({ sentenceId: item.id, mode: "vocab" });
    markVocabMastered(item.id);
  } else {
    onAnswerWrong();
  }
}

function revealVocabWrite() {
  const item = currentVocabItem();
  const input = document.getElementById("vocabWriteInput");
  const feedback = document.getElementById("vocabWriteFeedback");
  if (!item || !input) return;

  state.vocabWriteAnswered = true;
  input.value = item.word;
  input.disabled = true;
  input.classList.remove("wrong");
  input.classList.add("correct");
  feedback.hidden = false;
  feedback.className = "feedback";
  feedback.textContent = `정답: ${item.word}`;
}

function renderVocabQuiz() {
  buildVocabQueue();
  state.vocabQuizAnswered = false;
  const item = currentVocabItem();
  const meta = document.getElementById("vocabMeta");
  const wordEl = document.getElementById("vocabWord");
  const defEl = document.getElementById("vocabDefinition");
  const choicesEl = document.getElementById("vocabChoices");
  const feedback = document.getElementById("vocabFeedback");
  feedback.hidden = true;

  if (!item) {
    meta.textContent = "—";
    wordEl.textContent = emptyVocabMessage();
    defEl.hidden = true;
    choicesEl.innerHTML = "";
    const starBtn = document.getElementById("vocabQuizStar");
    if (starBtn) starBtn.hidden = true;
    return;
  }

  meta.textContent = `${formatId(item.id)} · ${item.sectionTitle}`;
  wordEl.textContent = item.word;
  if (item.definition) {
    defEl.hidden = false;
    defEl.textContent = item.definition;
  } else {
    defEl.hidden = true;
  }

  const pool = getAllVocab().filter((v) => v.id !== item.id);
  const distractors = shuffle(pool).slice(0, 3);
  const choices = shuffle([item, ...distractors]);

  choicesEl.innerHTML = "";
  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-choice";
    btn.textContent = choice.meaning;
    btn.addEventListener("click", () => {
      if (state.vocabQuizAnswered) return;
      state.vocabQuizAnswered = true;
      const correct = choice.id === item.id;
      choicesEl.querySelectorAll(".quiz-choice").forEach((b) => {
        b.disabled = true;
        if (b.textContent === item.meaning) b.classList.add("correct");
        else if (b === btn) b.classList.add("wrong");
      });
      feedback.hidden = false;
      feedback.className = `feedback ${correct ? "success" : "error"}`;
      feedback.textContent = correct
        ? "정답입니다!"
        : `틀렸습니다. 정답: ${item.meaning}`;
      if (correct) {
        onAnswerCorrect({ sentenceId: item.id, mode: "vocab" });
        markVocabMastered(item.id);
      } else {
        onAnswerWrong();
      }
    });
    choicesEl.appendChild(btn);
  });
  const quizStar = document.getElementById("vocabQuizStar");
  if (quizStar) quizStar.hidden = false;
  bindVocabStarButton(quizStar, item.id);
}

function setVocabCardSide(flipped) {
  state.vocabCardFlipped = flipped;
  const front = document.getElementById("vocabCardFront");
  const back = document.getElementById("vocabCardBack");
  if (!front || !back) return;
  front.hidden = flipped;
  back.hidden = !flipped;
}

function renderVocabCard() {
  buildVocabQueue();
  const item = currentVocabItem();
  const meta = document.getElementById("vocabCardMeta");
  const front = document.getElementById("vocabCardFront");
  const back = document.getElementById("vocabCardBack");

  if (!item) {
    meta.textContent = "—";
    front.textContent = emptyVocabMessage();
    back.textContent = "";
    setVocabCardSide(false);
    const starBtn = document.getElementById("vocabCardStar");
    if (starBtn) starBtn.hidden = true;
    return;
  }

  meta.textContent = `${formatId(item.id)} · ${item.sectionTitle}`;
  front.innerHTML = `<span class="flash-label">English</span>${escapeHtml(item.word)}`;
  let backText = item.meaning;
  if (item.definition) backText += `\n${item.definition}`;
  back.textContent = backText;
  setVocabCardSide(false);
  const cardStar = document.getElementById("vocabCardStar");
  if (cardStar) cardStar.hidden = false;
  bindVocabStarButton(cardStar, item.id);
}

function goToStarredVocabPractice(vocabId) {
  state.vocabStarOnly = true;
  const starEl = document.getElementById("vocabStarOnly");
  if (starEl) starEl.checked = true;
  setMode("vocab");
  setVocabView("quiz");
  goToVocab(vocabId);
}

function renderVocabStarMode() {
  const container = document.getElementById("vocabStarList");
  if (!container) return;

  const filtered = getStarredVocabList();
  let html = "";
  let lastSection = "";

  for (const v of filtered) {
    if (v.sectionTitle !== lastSection) {
      lastSection = v.sectionTitle;
      html += `<h3 class="section-heading">${escapeHtml(v.sectionTitle)}</h3>`;
    }
    html += `
      <article id="vocab-star-item-${v.id}" class="vocab-item vocab-starred">
        <span class="vocab-item-num">★ ${formatId(v.id)}</span>
        <div class="vocab-item-body">
          <p class="vocab-item-word">${escapeHtml(v.word)}</p>
          <p class="vocab-item-meaning">${escapeHtml(v.meaning)}</p>
          ${v.definition ? `<p class="vocab-item-def">${escapeHtml(v.definition)}</p>` : ""}
        </div>
        <div class="item-actions">
          <button type="button" class="star-btn starred" data-vocab-star="${v.id}" aria-label="별표 해제">★</button>
          <button type="button" class="btn-secondary btn-study" data-vocab-study="${v.id}">학습</button>
        </div>
      </article>`;
  }

  container.innerHTML =
    html ||
    '<p style="padding:1rem;color:#5c5c5c">별표한 단어가 없습니다.<br>어휘 암기에서 ☆를 눌러 추가하세요.</p>';

  container.querySelectorAll("[data-vocab-star]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleStarVocab(Number(btn.dataset.vocabStar));
    });
  });
  container.querySelectorAll("[data-vocab-study]").forEach((btn) => {
    btn.addEventListener("click", () => {
      goToStarredVocabPractice(Number(btn.dataset.vocabStudy));
    });
  });

  renderProgressDots();
}

function renderVocabList() {
  const container = document.getElementById("vocabList");
  if (!container) return;
  const filtered = getFilteredVocab();
  let html = "";
  let lastSection = "";

  for (const v of filtered) {
    if (v.sectionTitle !== lastSection) {
      lastSection = v.sectionTitle;
      html += `<h3 class="section-heading">${escapeHtml(v.sectionTitle)}</h3>`;
    }
    const listMastered = getVocabMasteredSet("list");
    const done = listMastered.has(v.id);
    const starred = state.starredVocab.has(v.id);
    const isCurrent = state.vocabIds[state.vocabIndex] === v.id;
    html += `
      <article id="vocab-item-${v.id}" class="vocab-item${done ? " vocab-done" : ""}${starred ? " vocab-starred" : ""}${isCurrent ? " vocab-current" : ""}">
        <span class="vocab-item-num">
          <span class="sentence-dot${done ? " done" : ""}"></span>
          ${formatId(v.id)}
        </span>
        <div class="vocab-item-body">
          <p class="vocab-item-word">${escapeHtml(v.word)}</p>
          <p class="vocab-item-meaning">${escapeHtml(v.meaning)}</p>
          ${v.definition ? `<p class="vocab-item-def">${escapeHtml(v.definition)}</p>` : ""}
        </div>
        <div class="item-actions">
          <button type="button" class="star-btn${starred ? " starred" : ""}" data-vocab-star="${v.id}" aria-label="별표">${starred ? "★" : "☆"}</button>
          <button type="button" class="master-btn${done ? " done" : ""}" data-vocab-master="${v.id}">
            ${done ? "✓ 완료" : "완료"}
          </button>
        </div>
      </article>`;
  }

  container.innerHTML =
    html || `<p style="padding:1rem;color:#5c5c5c">${emptyVocabMessage()}</p>`;
  container.querySelectorAll("[data-vocab-star]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleStarVocab(Number(btn.dataset.vocabStar));
      renderVocabList();
    });
  });
  container.querySelectorAll("[data-vocab-master]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.vocabMaster);
      const listMastered = getVocabMasteredSet("list");
      if (listMastered.has(id)) listMastered.delete(id);
      else listMastered.add(id);
      saveVocabProgress();
      updateProgressUI();
      renderVocabList();
    });
  });
}

function renderVocabMode() {
  if (state.vocabView === "quiz") renderVocabQuiz();
  else if (state.vocabView === "write") renderVocabWrite();
  else if (state.vocabView === "card") renderVocabCard();
  else renderVocabList();
  renderProgressDots();
}

function navigateVocab(delta) {
  buildVocabQueue();
  if (!state.vocabIds.length) return;
  state.vocabIndex =
    (state.vocabIndex + delta + state.vocabIds.length) % state.vocabIds.length;
  renderVocabMode();
}

function updateHeaderForPassage() {
  const passage = getActivePassage();
  const titleEl = document.getElementById("appTitle");
  const subEl = document.getElementById("appSubtitle");
  if (titleEl) titleEl.textContent = passage.title;
  if (subEl) subEl.textContent = `문장 01–${formatId(getPassageSentenceCount())}`;
  document.title = `${passage.title} — 지문 암기`;
}

function renderFilterButtons() {
  const container = document.getElementById("filterBtns");
  if (!container) return;
  const passage = getActivePassage();
  let html = '<button class="filter-btn active" data-section="all">전체</button>';
  for (const section of passage.sections) {
    html += `<button class="filter-btn" data-section="${section.id}">${escapeHtml(section.title)}</button>`;
  }
  container.innerHTML = html;
  state.sectionFilter = "all";
  container.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.sectionFilter = btn.dataset.section;
      buildPracticeQueue();
      renderCurrentMode();
    });
  });
}

function enterPassage(passageId) {
  setActivePassage(passageId);
  syncMasteredForPassage();
  state.practiceIndex = 0;
  state.vocabIndex = 0;
  state.sectionFilter = "all";
  state.vocabSectionFilter = "all";
  updateHeaderForPassage();
  renderFilterButtons();
  renderVocabFilterButtons();
  updatePassageUI();
  updateProgressUI();
  updateGameUI();
  buildPracticeQueue();
  buildVocabQueue();
  showAppScreen();
  setMode("scramble");
}

function navigatePractice(delta) {
  buildPracticeQueue();
  if (!state.practiceIds.length) return;
  state.practiceIndex =
    (state.practiceIndex + delta + state.practiceIds.length) %
    state.practiceIds.length;
  renderCurrentMode();
  renderProgressDots();
}

function renderReadMode() {
  const container = document.getElementById("readList");
  const filtered = getFilteredSentences();
  let html = "";
  let lastSection = "";

  for (const s of filtered) {
    if (s.sectionTitle !== lastSection) {
      lastSection = s.sectionTitle;
      html += `<h3 class="section-heading">${escapeHtml(s.sectionTitle)}</h3>`;
    }
    const mastered = state.mastered.has(s.id);
    const starred = state.starredSentences.has(s.id);
    const isCurrent = state.practiceIds[state.practiceIndex] === s.id;
    html += `
      <article id="sentence-${s.id}" class="sentence-item${s.highlight ? " highlight" : ""}${mastered ? " sentence-done" : ""}${starred ? " sentence-starred" : ""}${isCurrent ? " sentence-current" : ""}">
        <span class="sentence-num">
          <span class="sentence-dot${mastered ? " done" : ""}" aria-hidden="true"></span>
          ${formatId(s.id)}
        </span>
        <div class="sentence-body">
          <p class="sentence-en${state.hideEnglish ? " hidden" : ""}">${escapeHtml(s.text)}</p>
        </div>
        <div class="item-actions">
          <button type="button" class="star-btn${starred ? " starred" : ""}" data-sentence-star="${s.id}" aria-label="별표">${starred ? "★" : "☆"}</button>
          <button type="button" class="master-btn${mastered ? " done" : ""}" data-master="${s.id}">
            ${mastered ? "✓ 완료" : "완료"}
          </button>
        </div>
      </article>`;
  }

  container.innerHTML =
    html || `<p style="color:#5c5c5c;padding:1rem">${emptySentenceMessage()}</p>`;

  container.querySelectorAll("[data-sentence-star]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleStarSentence(Number(btn.dataset.sentenceStar));
      renderReadMode();
    });
  });
  container.querySelectorAll("[data-master]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.master);
      if (state.mastered.has(id)) state.mastered.delete(id);
      else state.mastered.add(id);
      saveProgress();
      updateProgressUI();
      renderReadMode();
    });
  });
}

function buildClozeHtml(sentence) {
  const words = sentence.cloze || [];
  let text = sentence.text;
  const inputs = [];
  const sorted = [...words].sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    const regex = new RegExp(`\\b(${escapeRegex(word)})\\b`, "i");
    const match = text.match(regex);
    if (match) {
      const id = `cloze-${inputs.length}`;
      inputs.push({ id, answer: match[1] });
      text = text.replace(regex, `__BLANK_${id}__`);
    }
  }

  let html = escapeHtml(text);
  for (const inp of inputs) {
    html = html.replace(
      `__BLANK_${inp.id}__`,
      `<input type="text" class="cloze-input" data-answer="${escapeHtml(inp.answer)}" autocomplete="off" spellcheck="false">`
    );
  }

  if (!inputs.length) {
    const tokens = sentence.text.split(/\s+/);
    const hideCount = Math.min(3, Math.max(1, Math.floor(tokens.length / 4)));
    const indices = pickRandomIndices(tokens.length, hideCount);
    let rebuilt = "";
    tokens.forEach((tok, i) => {
      if (indices.has(i)) {
        const clean = tok.replace(/[.,!?;:]/g, "");
        rebuilt += `<input type="text" class="cloze-input" data-answer="${escapeHtml(clean)}" autocomplete="off" spellcheck="false"> `;
      } else {
        rebuilt += escapeHtml(tok) + " ";
      }
    });
    return rebuilt.trim();
  }
  return html;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pickRandomIndices(len, count) {
  const set = new Set();
  while (set.size < count && set.size < len) {
    set.add(Math.floor(Math.random() * len));
  }
  return set;
}

function renderClozeMode() {
  buildPracticeQueue();
  const s = currentPracticeSentence();
  const meta = document.getElementById("clozeMeta");
  const el = document.getElementById("clozeSentence");
  const feedback = document.getElementById("clozeFeedback");
  feedback.hidden = true;

  if (!s) {
    meta.textContent = "—";
    el.textContent = emptySentenceMessage();
    const starBtn = document.getElementById("clozeStar");
    if (starBtn) starBtn.hidden = true;
    return;
  }
  meta.textContent = `${formatId(s.id)} · ${s.sectionTitle}`;
  el.innerHTML = buildClozeHtml(s);
  const starBtn = document.getElementById("clozeStar");
  if (starBtn) starBtn.hidden = false;
  bindSentenceStarButton(starBtn, s.id);
}

function checkClozeMode() {
  const inputs = document.querySelectorAll("#clozeSentence .cloze-input");
  let allOk = true;
  inputs.forEach((inp) => {
    const ok = inp.value.trim().toLowerCase() === inp.dataset.answer.toLowerCase();
    inp.style.borderColor = ok ? "var(--success)" : "var(--error)";
    if (!ok) allOk = false;
  });

  const feedback = document.getElementById("clozeFeedback");
  feedback.hidden = false;

  if (allOk) {
    const s = currentPracticeSentence();
    if (s) {
      onAnswerCorrect({ sentenceId: s.id, mode: "cloze" });
      markMastered(s.id);
    }
    feedback.className = "feedback success";
    feedback.textContent = "모든 빈칸이 맞습니다!";
  } else {
    onAnswerWrong();
    feedback.className = "feedback error";
    feedback.textContent = "틀린 빈칸이 있습니다. 다시 확인해 보세요.";
  }
}

function revealClozeMode() {
  const s = currentPracticeSentence();
  if (!s) return;
  document.getElementById("clozeSentence").textContent = s.text;
}

function updateScrambleCheckCountDisplay() {
  const el = document.getElementById("scrambleCheckCount");
  if (el) el.textContent = String(scrambleState.checkCount);
}

function tokenizeSentence(text) {
  return text.match(/[^\s]+/g) || [];
}

let scrambleDropZonesReady = false;

function insertFromBank(bankIndex, atIndex) {
  if (scrambleState.picked.some((p) => p.bankIndex === bankIndex)) return;
  const item = scrambleState.bank[bankIndex];
  if (!item) return;
  const index = Math.max(0, Math.min(atIndex, scrambleState.picked.length));
  scrambleState.picked.splice(index, 0, { ...item, bankIndex });
  drawScrambleChips();
}

function pickFromBank(bankIndex) {
  insertFromBank(bankIndex, scrambleState.picked.length);
}

function removePicked(pickedIndex) {
  if (pickedIndex < 0 || pickedIndex >= scrambleState.picked.length) return;
  scrambleState.picked.splice(pickedIndex, 1);
  drawScrambleChips();
}

function clearDropSlotActive(exceptSlot) {
  document.querySelectorAll("#scrambleAnswer .drop-slot.active").forEach((el) => {
    if (el !== exceptSlot) el.classList.remove("active");
  });
}

function handleScrambleDrop(e, atIndex) {
  e.preventDefault();
  e.stopPropagation();
  clearDropSlotActive();
  const source = e.dataTransfer.getData("scramble-source");
  if (source === "bank") {
    const bankIndex = Number(e.dataTransfer.getData("scramble-bank-index"));
    if (!Number.isNaN(bankIndex)) insertFromBank(bankIndex, atIndex);
  } else if (source === "answer") {
    const fromIndex = Number(e.dataTransfer.getData("scramble-picked-index"));
    if (!Number.isNaN(fromIndex)) movePickedWord(fromIndex, atIndex);
  }
}

function movePickedWord(fromIndex, toIndex) {
  if (fromIndex < 0 || fromIndex >= scrambleState.picked.length) return;
  let target = Math.max(0, Math.min(toIndex, scrambleState.picked.length));
  const [item] = scrambleState.picked.splice(fromIndex, 1);
  if (fromIndex < target) target -= 1;
  scrambleState.picked.splice(target, 0, item);
  drawScrambleChips();
}

function setupScrambleDropZones() {
  if (scrambleDropZonesReady) return;
  const bank = document.getElementById("scrambleBank");
  const answer = document.getElementById("scrambleAnswer");

  bank.addEventListener("dragover", (e) => {
    if (e.dataTransfer.types.includes("scramble-source")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      bank.classList.add("drag-over");
    }
  });
  bank.addEventListener("dragleave", (e) => {
    if (!bank.contains(e.relatedTarget)) bank.classList.remove("drag-over");
  });
  bank.addEventListener("drop", (e) => {
    e.preventDefault();
    bank.classList.remove("drag-over");
    if (e.dataTransfer.getData("scramble-source") === "answer") {
      const pickedIndex = Number(e.dataTransfer.getData("scramble-picked-index"));
      if (!Number.isNaN(pickedIndex)) removePicked(pickedIndex);
    }
  });

  scrambleDropZonesReady = true;
}

function createScrambleChip(text, className) {
  const chip = document.createElement("span");
  chip.className = className;
  chip.textContent = text;
  chip.setAttribute("role", "button");
  return chip;
}

function appendDropSlot(answer, index) {
  const slot = document.createElement("span");
  slot.className = "drop-slot";
  slot.dataset.index = String(index);
  slot.setAttribute("aria-hidden", "true");

  slot.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    slot.classList.add("active");
    clearDropSlotActive(slot);
    answer.classList.add("drag-over");
  });
  slot.addEventListener("dragleave", () => {
    slot.classList.remove("active");
  });
  slot.addEventListener("drop", (e) => {
    answer.classList.remove("drag-over");
    slot.classList.remove("active");
    handleScrambleDrop(e, index);
  });

  answer.appendChild(slot);
}

function drawScrambleChips() {
  const bank = document.getElementById("scrambleBank");
  const answer = document.getElementById("scrambleAnswer");
  bank.innerHTML = "";
  answer.innerHTML = "";
  answer.classList.remove("drag-over");

  appendDropSlot(answer, 0);

  scrambleState.bank.forEach((item, i) => {
    const used = scrambleState.picked.some((p) => p.bankIndex === i);
    const chip = createScrambleChip(item.text, `word-chip${used ? " used" : ""}`);
    if (!used) {
      chip.draggable = true;
      chip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("scramble-source", "bank");
        e.dataTransfer.setData("scramble-bank-index", String(i));
        e.dataTransfer.effectAllowed = "move";
        chip.classList.add("dragging");
      });
      chip.addEventListener("dragend", () => {
        chip.classList.remove("dragging");
        clearDropSlotActive();
        answer.classList.remove("drag-over");
      });
      chip.addEventListener("click", () => pickFromBank(i));
      chip.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pickFromBank(i);
        }
      });
    }
    bank.appendChild(chip);
  });

  scrambleState.picked.forEach((item, pi) => {
    const chip = createScrambleChip(item.text, "word-chip in-answer");
    chip.draggable = true;
    chip.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("scramble-source", "answer");
      e.dataTransfer.setData("scramble-picked-index", String(pi));
      e.dataTransfer.effectAllowed = "move";
      chip.classList.add("dragging");
    });
    chip.addEventListener("dragend", () => {
      chip.classList.remove("dragging");
      clearDropSlotActive();
      answer.classList.remove("drag-over");
    });
    chip.addEventListener("click", () => removePicked(pi));
    chip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        removePicked(pi);
      }
    });
    answer.appendChild(chip);
    appendDropSlot(answer, pi + 1);
  });
}

function renderScrambleMode({ reshuffleOnly = false } = {}) {
  setupScrambleDropZones();
  if (!reshuffleOnly) {
    buildPracticeQueue();
  }

  const s = currentPracticeSentence();
  const meta = document.getElementById("scrambleMeta");
  const bank = document.getElementById("scrambleBank");
  const answer = document.getElementById("scrambleAnswer");
  const feedback = document.getElementById("scrambleFeedback");
  feedback.hidden = true;

  if (!s) {
    meta.textContent = "—";
    bank.innerHTML = `<p style="color:#5c5c5c;padding:0.5rem 0">${emptySentenceMessage()}</p>`;
    answer.innerHTML = "";
    scrambleState.checkCount = 0;
    updateScrambleCheckCountDisplay();
    const starBtn = document.getElementById("scrambleStar");
    if (starBtn) starBtn.hidden = true;
    return;
  }

  meta.textContent = `${formatId(s.id)} · ${s.sectionTitle}`;
  const starBtn = document.getElementById("scrambleStar");
  if (starBtn) starBtn.hidden = false;
  bindSentenceStarButton(starBtn, s.id);
  const tokens = tokenizeSentence(s.text);
  scrambleState.correctTokens = tokens;
  scrambleState.bank = shuffle(tokens.map((t, i) => ({ text: t, idx: i })));
  scrambleState.picked = [];

  if (!reshuffleOnly) {
    scrambleState.checkCount = 0;
    updateScrambleCheckCountDisplay();
  }

  drawScrambleChips();
}

function checkScrambleMode() {
  const s = currentPracticeSentence();
  if (!s) return;

  scrambleState.checkCount += 1;
  updateScrambleCheckCountDisplay();

  const user = scrambleState.picked.map((p) => p.text).join(" ");
  const ok = compareSentences(user, s.text);
  const feedback = document.getElementById("scrambleFeedback");
  feedback.hidden = false;

  if (ok) {
    onAnswerCorrect({
      sentenceId: s.id,
      mode: "scramble",
      checkCount: scrambleState.checkCount,
    });
    markMastered(s.id);
    feedback.className = "feedback success";
    feedback.textContent = "순서가 맞습니다!";
  } else {
    onAnswerWrong();
    feedback.className = "feedback error";
    feedback.textContent = "순서가 다릅니다. 단어를 다시 배열해 보세요.";
  }
}

function startTimeChallenge() {
  if (game.timeChallenge.active) return;
  game.timeChallenge = {
    active: true,
    endsAt: Date.now() + TIME_CHALLENGE_SEC * 1000,
    correct: 0,
  };
  saveGame();
  updateTimeChallengeUI();
  startChallengeTimer();
  const toast = document.getElementById("xpToast");
  if (toast) {
    toast.textContent = "타임 챌린지 시작! 3분 안에 5문장!";
    toast.hidden = false;
    clearTimeout(xpToastTimer);
    xpToastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2000);
  }
}

function endTimeChallenge(success) {
  game.timeChallenge = { active: false, endsAt: 0, correct: 0 };
  stopChallengeTimer();
  saveGame();
  updateTimeChallengeUI();
  const toast = document.getElementById("xpToast");
  if (!toast) return;
  if (success) {
    toast.textContent = `챌린지 성공! +${TIME_CHALLENGE_BONUS_XP} XP 보너스!`;
  } else {
    toast.textContent = "시간 종료! 다음에 다시 도전해 보세요.";
  }
  toast.hidden = false;
  clearTimeout(xpToastTimer);
  xpToastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

function stopChallengeTimer() {
  if (challengeTimerInterval) {
    clearInterval(challengeTimerInterval);
    challengeTimerInterval = null;
  }
}

function startChallengeTimer() {
  stopChallengeTimer();
  challengeTimerInterval = setInterval(() => {
    if (!game.timeChallenge.active) {
      stopChallengeTimer();
      return;
    }
    const left = Math.max(0, Math.ceil((game.timeChallenge.endsAt - Date.now()) / 1000));
    updateTimeChallengeUI(left);
    if (left <= 0) endTimeChallenge(false);
  }, 500);
  updateTimeChallengeUI();
}

function updateTimeChallengeUI(remainingSec) {
  const activeBox = document.getElementById("timeChallengeActive");
  const startBtn = document.getElementById("startTimeChallenge");
  const timerEl = document.getElementById("challengeTimer");
  const progressEl = document.getElementById("challengeProgress");

  if (!activeBox) return;

  if (game.timeChallenge.active) {
    const left =
      remainingSec ??
      Math.max(0, Math.ceil((game.timeChallenge.endsAt - Date.now()) / 1000));
    activeBox.hidden = false;
    if (startBtn) startBtn.disabled = true;
    if (timerEl) timerEl.textContent = formatTime(left);
    if (progressEl) progressEl.textContent = String(game.timeChallenge.correct);
  } else {
    activeBox.hidden = true;
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = "타임 챌린지 (3분·5문장)";
    }
  }
}

function renderCurrentMode() {
  if (state.mode === "read") renderReadMode();
  else if (state.mode === "cloze") renderClozeMode();
  else if (state.mode === "scramble") renderScrambleMode();
  else if (state.mode === "vocab") renderVocabMode();
  else if (state.mode === "vocab-star") renderVocabStarMode();
  if (state.mode !== "vocab" && state.mode !== "vocab-star") renderProgressDots();
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active);
  });
  document.querySelectorAll(".mode-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `mode-${mode}`);
  });
  const readOpts = document.getElementById("readOptions");
  if (readOpts) readOpts.hidden = mode !== "read";
  updateSidebarPanels();
  if (mode === "vocab") {
    buildVocabQueue();
    renderVocabMode();
    updateProgressUI();
  } else if (mode === "vocab-star") {
    renderVocabStarMode();
    updateProgressUI();
  } else {
    buildPracticeQueue();
    renderCurrentMode();
    updateProgressUI();
  }
}

function showMainScreen() {
  document.getElementById("mainScreen").hidden = false;
  document.getElementById("appScreen").hidden = true;
  document.title = "지문 암기 프로그램";
}

function showAppScreen() {
  document.getElementById("mainScreen").hidden = true;
  document.getElementById("appScreen").hidden = false;
}

function init() {
  loadProgress();
  loadVocabProgress();
  loadStars();
  syncMasteredForPassage();
  loadGame();
  updateGameUI();

  window.addEventListener("pagehide", saveGame);

  if (game.timeChallenge.active) startChallengeTimer();

  document.querySelectorAll("[data-passage]").forEach((btn) => {
    btn.addEventListener("click", () => enterPassage(btn.dataset.passage));
  });
  document.getElementById("goHome").addEventListener("click", showMainScreen);

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.mode));
  });

  document.getElementById("keyOnly").addEventListener("change", (e) => {
    state.keyOnly = e.target.checked;
    buildPracticeQueue();
    renderCurrentMode();
  });

  document.getElementById("starOnly").addEventListener("change", (e) => {
    state.starOnly = e.target.checked;
    buildPracticeQueue();
    renderCurrentMode();
  });

  document.getElementById("vocabStarOnly").addEventListener("change", (e) => {
    state.vocabStarOnly = e.target.checked;
    buildVocabQueue();
    renderVocabMode();
  });

  document.getElementById("hideEnglish").addEventListener("change", (e) => {
    state.hideEnglish = e.target.checked;
    if (state.mode === "read") renderReadMode();
  });

  document.getElementById("resetProgress").addEventListener("click", () => {
    const title = getActivePassage().title;
    const label = isVocabMode()
      ? `어휘 [${VOCAB_VIEW_LABELS[state.vocabView]}] 완료 기록`
      : "문장 완료 기록";
    if (confirm(`「${title}」 ${label}을 초기화할까요?\n(XP·콤보·챌린지는 유지됩니다)`)) {
      if (isVocabMode()) {
        getVocabMasteredSet().clear();
        saveVocabProgress();
        renderVocabMode();
      } else {
        state.mastered.clear();
        progressByPassage[activePassageId] = [];
        saveProgress();
        if (state.mode === "read") renderReadMode();
        else renderCurrentMode();
      }
      updateProgressUI();
    }
  });

  document.querySelectorAll(".vocab-view-tab").forEach((tab) => {
    tab.addEventListener("click", () => setVocabView(tab.dataset.vocabView));
  });
  document.getElementById("vocabPrev").addEventListener("click", () => navigateVocab(-1));
  document.getElementById("vocabNext").addEventListener("click", () => navigateVocab(1));
  document.getElementById("vocabWritePrev").addEventListener("click", () => navigateVocab(-1));
  document.getElementById("vocabWriteNext").addEventListener("click", () => navigateVocab(1));
  document.getElementById("vocabWriteCheck").addEventListener("click", checkVocabWrite);
  document.getElementById("vocabWriteReveal").addEventListener("click", revealVocabWrite);
  document.getElementById("vocabWriteInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkVocabWrite();
  });
  document.getElementById("vocabCardPrev").addEventListener("click", () => navigateVocab(-1));
  document.getElementById("vocabCardNext").addEventListener("click", () => navigateVocab(1));
  document.getElementById("vocabFlip").addEventListener("click", () => {
    setVocabCardSide(!state.vocabCardFlipped);
  });
  document.getElementById("vocabFlashcard").addEventListener("click", () => {
    setVocabCardSide(!state.vocabCardFlipped);
  });
  document.getElementById("vocabDone").addEventListener("click", () => {
    const item = currentVocabItem();
    if (item) markVocabMastered(item.id);
    navigateVocab(1);
  });

  document.getElementById("startTimeChallenge").addEventListener("click", startTimeChallenge);

  document.getElementById("clozeCheck").addEventListener("click", checkClozeMode);
  document.getElementById("clozeReveal").addEventListener("click", revealClozeMode);
  document.getElementById("clozePrev").addEventListener("click", () => navigatePractice(-1));
  document.getElementById("clozeNext").addEventListener("click", () => navigatePractice(1));

  document.getElementById("scrambleCheck").addEventListener("click", checkScrambleMode);
  document.getElementById("scrambleReset").addEventListener("click", () =>
    renderScrambleMode({ reshuffleOnly: true })
  );
  document.getElementById("scramblePrev").addEventListener("click", () => navigatePractice(-1));
  document.getElementById("scrambleNext").addEventListener("click", () => navigatePractice(1));
}

init();
