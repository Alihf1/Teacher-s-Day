// الأسئلة التربوية
const questions = [
  {
    question: "1. ما هو الهدف الأساسي من التقييم التكويني (البنائي) خلال الدرس؟",
    options: [
      "متابعة تقدم الطلاب وتوجيه عملية التعلم باستمرار",
      "إعطاء الدرجات النهائية للطلاب في نهاية العام",
      "ترتيب الطلاب حسب التحصيل الدراسي فقط"
    ],
    correct: 0
  },
  {
    question: "2. أي الاستراتيجيات التالية تشجع التفكير النقدي والابتكاري؟",
    options: [
      "الحفظ والتلقين المباشر للمعلومة",
      "التعلم القائم على حل المشكلات والاستكشاف",
      "القراءة الصامتة الفردية طوال الحصة"
    ],
    correct: 1
  },
  {
    question: "3. ما أفضل طريقة لمراعاة الفروق الفردية بين المتعلمين؟",
    options: [
      "تطبيق استراتيجية واحدة موحدة للجميع",
      "تنويع الأساليب والأنشطة والوسائط التعليمية",
      "التركيز على الشرح للطلاب المتفوقين فقط"
    ],
    correct: 1
  },
  {
    question: "4. كيف يسهم الدمج الرقمي في الفصل الدراسي في تعزيز التفاعل؟",
    options: [
      "يستبدل دور المعلم بالكامل داخل الصف",
      "يزيد من تفاعل الطلاب ويجعل التعلم أكثر جاذبية وعمقاً",
      "يُستخدم فقط لملء وقت الفراغ في نهاية الحصة"
    ],
    correct: 1
  },
  {
    question: "5. ما هو السلوك الأنسب للمعلم عند التعامل مع أخطاء الطلاب؟",
    options: [
      "تجاهل الخطأ والانتقال إلى طالب آخر فوراً",
      "اعتبار الخطأ فرصة ذكية للتعلم وإعادة الشرح بأسلوب تبسيطي",
      "إحراج الطالب أمام زملائه لعدم تكرار الخطأ"
    ],
    correct: 1
  }
];

const wisdoms = [
  "\"من علّم الناس الخير، جرى أجره ونفعه في الدنيا والآخرة.\"",
  "\"المعلم هو الشمعة التي تضيء طريق الآخرين وتُزرع الأثر الطيب.\"",
  "\"التعليم ليس ملء وعاء، بل إيقاد شعلة الابتكار والفضول.\"",
  "\"عطاؤك اليوم يحصد أثماره جيل الغد المشرف.\""
];

// مراحل النمو + الألوان الخاصة بهالة كل مرحلة
const growthStages = [
  { icon: '🫘', name: 'البذرة الغارسة', glow: 'rgba(121, 85, 72, 0.4)', scale: 0.9 },
  { icon: '🌱', name: 'بداية البرعم', glow: 'rgba(76, 175, 80, 0.4)', scale: 1.0 },
  { icon: '🌿', name: 'نبات غض فتّي', glow: 'rgba(46, 125, 50, 0.5)', scale: 1.1 },
  { icon: '🪴', name: 'شتلة قوية واعدة', glow: 'rgba(56, 142, 60, 0.6)', scale: 1.25 },
  { icon: '🍃', name: 'غصن يانع مورق', glow: 'rgba(212, 175, 55, 0.6)', scale: 1.4 }
];

let currentPlantEmoji = '🌸';
let currentQuestionIndex = 0;
let waterLevel = 0;
const totalSteps = questions.length;

function selectPlant(emoji, name) {
  currentPlantEmoji = emoji;
  document.getElementById('chosen-plant-name').innerText = name;
  document.getElementById('selection-screen').classList.add('hidden');
  document.getElementById('quiz-screen').classList.remove('hidden');
  
  resetQuestions();
  applyStageEffects(0);
  loadQuestion();
}

function loadQuestion() {
  const qList = activeQuestions.length > 0 ? activeQuestions : shuffleQuestionsWithAnswers();
  if (activeQuestions.length === 0) activeQuestions = qList;
  const q = qList[currentQuestionIndex];
  document.getElementById('question-text').innerText = q.question;
  
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  const optionIndices = Array.from({ length: q.options.length }, (_, i) => i);
  const shuffledOpts = shuffleArray(optionIndices);
  shuffledOpts.forEach((origIdx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = q.options[origIdx];
    btn.onclick = () => checkAnswer(origIdx);
    optionsContainer.appendChild(btn);
  });

  document.getElementById('water-action-card').classList.add('hidden');
  document.getElementById('question-card').classList.remove('hidden');
}

function checkAnswer(selectedIndex) {
  const qList = activeQuestions.length > 0 ? activeQuestions : questions;
  const correctIndex = qList[currentQuestionIndex].correct;

  if (selectedIndex === correctIndex) {
    document.getElementById('question-card').classList.add('hidden');
    document.getElementById('water-action-card').classList.remove('hidden');
    attachWaterHoldEvents();
  } else {
    const optionBtns = document.querySelectorAll('#options-container .option-btn');
    if (optionBtns[selectedIndex]) {
      optionBtns[selectedIndex].classList.add('wrong');
      setTimeout(() => optionBtns[selectedIndex].classList.remove('wrong'), 900);
    }
    showToast('خطأ', 'إجابة محتاجة مراجعة، حاول مرة أخرى لتسقي غرسك 💧', 'error');
  }
}

let waterHoldStartTime = 0;
let waterHoldInterval = null;
let waterHoldDone = false;
const WATER_HOLD_MS = 1000;

function triggerWatering() {
  if (waterHoldDone) return;
  waterHoldDone = true;

  if (waterHoldInterval) {
    clearInterval(waterHoldInterval);
    waterHoldInterval = null;
  }

  waterLevel++;

  const wateringCan = document.getElementById('watering-can');
  const plantAvatar = document.getElementById('plant-stage');
  const waterBtn = document.getElementById('water-hold-btn');

  if (waterBtn) {
    waterBtn.disabled = true;
    waterBtn.classList.add('pressed');
    waterBtn.classList.remove('holding');
  }

  wateringCan.classList.remove('hidden');
  plantAvatar.classList.add('plant-pulse');

  setTimeout(() => {
    wateringCan.classList.add('hidden');
    plantAvatar.classList.remove('plant-pulse');
    if (waterBtn) {
      waterBtn.disabled = false;
      waterBtn.classList.remove('pressed');
      waterBtn.textContent = 'اضغط واستمر لمدة ١ ثانية للسقي 💧';
    }
    waterHoldDone = false;
    waterHoldStartTime = 0;
    waterHoldElapsed = 0;
    waterIsHolding = false;

    updateProgress();
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      showFinalResult();
    }
  }, 1000);
}



let waterHoldElapsed = 0;
let waterIsHolding = false;

function startWaterHold() {
  if (waterHoldDone) return;
  waterIsHolding = true;
  waterHoldStartTime = Date.now();
  const waterBtn = document.getElementById('water-hold-btn');
  if (waterBtn) {
    waterBtn.classList.add('holding');
    waterBtn.textContent = 'جارٍ السقي... 💧';
    waterBtn.classList.remove('progress');
  }
  if (waterHoldInterval) clearInterval(waterHoldInterval);
  waterHoldInterval = setInterval(() => {
    if (waterHoldDone) return;
    const elapsed = waterIsHolding
      ? waterHoldElapsed + (Date.now() - waterHoldStartTime)
      : waterHoldElapsed;
    const progress = Math.min(1, elapsed / WATER_HOLD_MS);
    if (waterBtn) {
      if (progress > 0) waterBtn.classList.add('progress');
      if (waterIsHolding) waterBtn.style.setProperty('--w', progress * 100 + '%');
    }
    if (waterIsHolding && elapsed >= WATER_HOLD_MS) {
      clearInterval(waterHoldInterval);
      waterHoldInterval = null;
      waterIsHolding = false;
      waterHoldElapsed = 0;
      if (waterBtn) waterBtn.style.removeProperty('--w');
      triggerWatering();
    }
  }, 16);
}

function cancelWaterHold() {
  if (!waterIsHolding || waterHoldDone) return;
  waterIsHolding = false;
  waterHoldElapsed = waterHoldElapsed + (Date.now() - waterHoldStartTime);
  waterHoldStartTime = 0;
  // لا نوقف المؤقت، نتركه يحسب عند عودة الضغط
}

function endWaterHold() {
  waterIsHolding = false;
  waterHoldElapsed = 0;
  waterHoldStartTime = 0;
  if (waterHoldInterval) {
    clearInterval(waterHoldInterval);
    waterHoldInterval = null;
  }
  if (!waterHoldDone) {
    const waterBtn = document.getElementById('water-hold-btn');
    if (waterBtn) {
      waterBtn.classList.remove('holding');
      waterBtn.textContent = 'اضغط واستمر لمدة ١ ثانية للسقي 💧';
    }
  }
}

function waterPlant() {}


function updateProgress() {
  document.getElementById('water-count').innerText = waterLevel;
  const percentage = (waterLevel / totalSteps) * 100;
  document.getElementById('progress-bar').style.width = percentage + '%';

  if (waterLevel < totalSteps) {
    applyStageEffects(waterLevel);
  }
}

function applyStageEffects(stageIndex) {
  const stage = growthStages[stageIndex];
  const plantAvatar = document.getElementById('plant-stage');
  const stageText = document.getElementById('stage-text');
  const glowRing = document.getElementById('growth-glow');
  const gameCard = document.getElementById('game-card');

  plantAvatar.innerText = stage.icon;
  stageText.innerText = stage.name;

  document.body.className = `bg-stage-${stageIndex}`;
  glowRing.style.background = stage.glow;
  plantAvatar.style.transform = `scale(${stage.scale})`;
  gameCard.style.boxShadow = `0 20px 50px ${stage.glow}`;
}

function showFinalResult() {
  document.getElementById('quiz-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');

  document.getElementById('final-plant-icon').innerText = currentPlantEmoji;
  document.body.className = 'bg-stage-4';

  const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];
  document.getElementById('wisdom-text').innerText = randomWisdom;

  if (typeof confetti === 'function') {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  }

  try {
    const audio = new Audio('win.mp3');
    audio.volume = 0.7;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    setTimeout(() => {
      try { audio.pause(); audio.currentTime = 0; } catch (e) {}
    }, 1000);
  } catch (e) {}
}

function showToast(title, message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-header">${title}</div>
    <div class="toast-message">${message}</div>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 1600);
}

function attachWaterHoldEvents() {
  const waterBtn = document.getElementById('water-hold-btn');
  if (!waterBtn) return;
  waterBtn.removeEventListener('mousedown', startWaterHold);
  waterBtn.removeEventListener('mouseup', endWaterHold);
  waterBtn.removeEventListener('mouseleave', endWaterHold);
  waterBtn.removeEventListener('touchstart', () => {});
  waterBtn.removeEventListener('touchend', () => {});
  waterBtn.removeEventListener('touchcancel', () => {});

  waterBtn.addEventListener('mousedown', startWaterHold);
  waterBtn.addEventListener('mouseup', endWaterHold);
  waterBtn.addEventListener('mouseleave', endWaterHold);
  waterBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startWaterHold(); }, { passive: false });
  waterBtn.addEventListener('touchend', (e) => { e.preventDefault(); endWaterHold(); }, { passive: false });
  waterBtn.addEventListener('touchcancel', (e) => { e.preventDefault(); endWaterHold(); }, { passive: false });
}

function shuffleArray(arr) {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let activeQuestions = [];

function resetQuestions() {
  activeQuestions = shuffleQuestionsWithAnswers();
  currentQuestionIndex = 0;
}

function shuffleQuestionsWithAnswers() {
  const indices = Array.from({ length: questions.length }, (_, i) => i);
  const shuffledIndices = shuffleArray(indices);
  const shuffledQuestions = shuffledIndices.map((origIndex) => {
    const q = questions[origIndex];
    const optionIndices = Array.from({ length: q.options.length }, (_, i) => i);
    const shuffledOptionIndices = shuffleArray(optionIndices);
    const newOptions = shuffledOptionIndices.map((oi) => q.options[oi]);
    const newCorrect = shuffledOptionIndices.indexOf(q.correct);
    return {
      question: q.question,
      options: newOptions,
      correct: newCorrect
    };
  });
  return shuffledQuestions;
}

function resetGame() {
  currentQuestionIndex = 0;
  waterLevel = 0;
  waterHoldDone = false;
  waterIsHolding = false;
  waterHoldElapsed = 0;
  waterHoldStartTime = 0;
  if (waterHoldInterval) {
    clearInterval(waterHoldInterval);
    waterHoldInterval = null;
  }
  const waterBtn = document.getElementById('water-hold-btn');
  if (waterBtn) {
    waterBtn.disabled = false;
    waterBtn.classList.remove('holding', 'pressed', 'progress');
    waterBtn.style.removeProperty('--w');
    waterBtn.textContent = 'اضغط واستمر لمدة ١ ثانية للسقي 💧';
  }
  resetQuestions();
  document.body.className = '';
  document.getElementById('progress-bar').style.width = '0%';
  document.getElementById('water-count').innerText = '0';
  
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('selection-screen').classList.remove('hidden');
}
