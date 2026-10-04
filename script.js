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
  
  applyStageEffects(0);
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById('question-text').innerText = q.question;
  
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(index);
    optionsContainer.appendChild(btn);
  });

  document.getElementById('water-action-card').classList.add('hidden');
  document.getElementById('question-card').classList.remove('hidden');
}

function checkAnswer(selectedIndex) {
  const correctIndex = questions[currentQuestionIndex].correct;

  if (selectedIndex === correctIndex) {
    document.getElementById('question-card').classList.add('hidden');
    document.getElementById('water-action-card').classList.remove('hidden');
  } else {
    const optionBtns = document.querySelectorAll('#options-container .option-btn');
    if (optionBtns[selectedIndex]) {
      optionBtns[selectedIndex].classList.add('wrong');
      setTimeout(() => optionBtns[selectedIndex].classList.remove('wrong'), 900);
    }
    showToast('خطأ', 'إجابة محتاجة مراجعة، حاول مرة أخرى لتسقي غرسك 💧', 'error');
  }
}

function waterPlant() {
  waterLevel++;
  
  const wateringCan = document.getElementById('watering-can');
  const plantAvatar = document.getElementById('plant-stage');
  
  // إظهار دلو السقي والقطرات المتحركة
  wateringCan.classList.remove('hidden');
  plantAvatar.classList.add('plant-pulse');

  setTimeout(() => {
    wateringCan.classList.add('hidden');
    plantAvatar.classList.remove('plant-pulse');
    
    updateProgress();
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      showFinalResult();
    }
  }, 1000);
}

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

function resetGame() {
  currentQuestionIndex = 0;
  waterLevel = 0;
  document.body.className = '';
  document.getElementById('progress-bar').style.width = '0%';
  document.getElementById('water-count').innerText = '0';
  
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('selection-screen').classList.remove('hidden');
}