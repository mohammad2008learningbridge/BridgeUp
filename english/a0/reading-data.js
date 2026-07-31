/* بيانات مهارة القراءة — المستوى A0 (الصفر المطلق) — 5 نصوص */

var READING_LEVEL = "a0";

/* كلمات شائعة مشتركة بين كل نصوص المستوى، لتقليل التكرار */
var COMMON_WORDS = {
  "i": { ar: "أنا", pos: "ضمير", ph: "آي" },
  "my": { ar: "ـي (ملكية)", pos: "ضمير ملكية", ph: "ماي" },
  "is": { ar: "يكون / هو", pos: "فعل", ph: "إز" },
  "am": { ar: "أكون", pos: "فعل", ph: "آم" },
  "are": { ar: "تكون / يكونون", pos: "فعل", ph: "آر" },
  "a": { ar: "أداة تنكير (لا تُترجم)", pos: "أداة", ph: "إيه" },
  "the": { ar: "أداة تعريف (لا تُترجم)", pos: "أداة", ph: "ذا" },
  "and": { ar: "و", pos: "حرف عطف", ph: "آند" },
  "to": { ar: "إلى", pos: "حرف جر", ph: "تو" },
  "this": { ar: "هذا / هذه", pos: "اسم إشارة", ph: "ذِس" },
  "have": { ar: "أملك / لدي", pos: "فعل", ph: "هاڤ" },
  "one": { ar: "واحد", pos: "عدد", ph: "وَن" },
  "two": { ar: "اثنان", pos: "عدد", ph: "تو" },
  "we": { ar: "نحن", pos: "ضمير", ph: "وي" },
  "you": { ar: "أنت", pos: "ضمير", ph: "يو" },
  "from": { ar: "من", pos: "حرف جر", ph: "فروم" },
  "with": { ar: "مع", pos: "حرف جر", ph: "ويذ" },
  "in": { ar: "في", pos: "حرف جر", ph: "إن" },
  "on": { ar: "على", pos: "حرف جر", ph: "أون" },
  "near": { ar: "بالقرب من", pos: "حرف جر", ph: "نير" },
  "there": { ar: "يوجد", pos: "ظرف", ph: "ذير" },
  "many": { ar: "كثير من", pos: "صفة", ph: "ميني" },
  "old": { ar: "العمر / قديم", pos: "صفة", ph: "أولد" },
  "nice": { ar: "لطيف", pos: "صفة", ph: "نايس" },
  "happy": { ar: "سعيد", pos: "صفة", ph: "هابي" },
  "years": { ar: "سنوات", pos: "اسم", ph: "يِرز" },
  "meet": { ar: "يقابل", pos: "فعل", ph: "ميت" },
  "like": { ar: "يحب / مثل", pos: "فعل", ph: "لايك" },
  "go": { ar: "يذهب", pos: "فعل", ph: "گو" },
  "off": { ar: "إجازة / غير عامل", pos: "صفة", ph: "أوف" },
  "together": { ar: "معًا", pos: "ظرف", ph: "توگذر" }
};

var READING_DATA = [
  {
    id: "a0-r1",
    title: "1. Hello, My Name",
    text: "Hello! My name is Sara. I am ten years old. I am from Jordan. Nice to meet you!",
    words: {
      "hello": { ar: "مرحبًا", pos: "تحية", ph: "هَلو" },
      "name": { ar: "اسم", pos: "اسم", ph: "نيم" },
      "sara": { ar: "سارة (اسم علم)", pos: "اسم علم", ph: "سارا" },
      "ten": { ar: "عشرة", pos: "عدد", ph: "تِن" },
      "jordan": { ar: "الأردن", pos: "اسم علم", ph: "جوردِن" }
    },
    questions: [
      { q: "What is the girl's name?", options: ["Sara", "Lina", "Amal", "Nour"], correct: 0 },
      { q: "True or False: She is from Egypt.", options: ["True", "False"], correct: 1 },
      { q: "What does 'Nice to meet you' mean?", options: ["تشرفت بلقائك", "إلى اللقاء", "صباح الخير", "مع السلامة"], correct: 0 }
    ],
    vocabulary: [
      { word: "name", ar: "اسم", ph: "نيم", example: "My name is Omar." },
      { word: "from", ar: "من", ph: "فروم", example: "I am from Jordan." },
      { word: "meet", ar: "يقابل", ph: "ميت", example: "Nice to meet you." },
      { word: "nice", ar: "لطيف", ph: "نايس", example: "She is very nice." },
      { word: "old (years old)", ar: "العمر", ph: "أولد", example: "I am ten years old." }
    ]
  },
  {
    id: "a0-r2",
    title: "2. My Family",
    text: "This is my family. I have a mother and a father. I have one brother and one sister. We are happy together.",
    words: {
      "family": { ar: "عائلة", pos: "اسم", ph: "فاميلي" },
      "mother": { ar: "أم", pos: "اسم", ph: "مَذر" },
      "father": { ar: "أب", pos: "اسم", ph: "فاذر" },
      "brother": { ar: "أخ", pos: "اسم", ph: "براذر" },
      "sister": { ar: "أخت", pos: "اسم", ph: "سيستر" }
    },
    questions: [
      { q: "How many brothers does she have?", options: ["1", "2", "0", "3"], correct: 0 },
      { q: "True or False: She has one sister.", options: ["True", "False"], correct: 0 },
      { q: "How does the family feel together?", options: ["Happy", "Sad", "Angry", "Bored"], correct: 0 }
    ],
    vocabulary: [
      { word: "family", ar: "عائلة", ph: "فاميلي", example: "This is my family." },
      { word: "mother", ar: "أم", ph: "مَذر", example: "My mother is kind." },
      { word: "father", ar: "أب", ph: "فاذر", example: "My father works a lot." },
      { word: "brother", ar: "أخ", ph: "براذر", example: "I have one brother." },
      { word: "sister", ar: "أخت", ph: "سيستر", example: "My sister is happy." }
    ]
  },
  {
    id: "a0-r3",
    title: "3. Colors",
    text: "I like colors. The sky is blue. The sun is yellow. Grass is green. My shirt is red.",
    words: {
      "colors": { ar: "ألوان", pos: "اسم", ph: "كَلرز" },
      "sky": { ar: "سماء", pos: "اسم", ph: "سكاي" },
      "blue": { ar: "أزرق", pos: "صفة", ph: "بلو" },
      "sun": { ar: "شمس", pos: "اسم", ph: "صَن" },
      "yellow": { ar: "أصفر", pos: "صفة", ph: "يِلو" },
      "grass": { ar: "عشب", pos: "اسم", ph: "گراس" },
      "green": { ar: "أخضر", pos: "صفة", ph: "گرين" },
      "shirt": { ar: "قميص", pos: "اسم", ph: "شيرت" },
      "red": { ar: "أحمر", pos: "صفة", ph: "رِد" }
    },
    questions: [
      { q: "What color is the sky?", options: ["Blue", "Red", "Green", "Yellow"], correct: 0 },
      { q: "True or False: The sun is green.", options: ["True", "False"], correct: 1 },
      { q: "Which color is NOT mentioned in the text?", options: ["Purple", "Blue", "Yellow", "Red"], correct: 0 }
    ],
    vocabulary: [
      { word: "colors", ar: "ألوان", ph: "كَلرز", example: "I like colors." },
      { word: "sky", ar: "سماء", ph: "سكاي", example: "The sky is blue." },
      { word: "sun", ar: "شمس", ph: "صَن", example: "The sun is yellow." },
      { word: "grass", ar: "عشب", ph: "گراس", example: "Grass is green." },
      { word: "shirt", ar: "قميص", ph: "شيرت", example: "My shirt is red." }
    ]
  },
  {
    id: "a0-r4",
    title: "4. Numbers and Days",
    text: "I go to school five days a week. Monday, Tuesday, Wednesday, Thursday, and Friday. I have two days off: Saturday and Sunday.",
    words: {
      "school": { ar: "مدرسة", pos: "اسم", ph: "سكول" },
      "five": { ar: "خمسة", pos: "عدد", ph: "فايڤ" },
      "days": { ar: "أيام", pos: "اسم", ph: "دِيز" },
      "week": { ar: "أسبوع", pos: "اسم", ph: "ويك" },
      "monday": { ar: "الإثنين", pos: "اسم علم", ph: "مَندي" },
      "tuesday": { ar: "الثلاثاء", pos: "اسم علم", ph: "تيوزدي" },
      "wednesday": { ar: "الأربعاء", pos: "اسم علم", ph: "وِنزدي" },
      "thursday": { ar: "الخميس", pos: "اسم علم", ph: "ثيرزدي" },
      "friday": { ar: "الجمعة", pos: "اسم علم", ph: "فرايدي" },
      "saturday": { ar: "السبت", pos: "اسم علم", ph: "سَاترداي" },
      "sunday": { ar: "الأحد", pos: "اسم علم", ph: "صَنداي" }
    },
    questions: [
      { q: "How many school days are there?", options: ["5", "2", "7", "4"], correct: 0 },
      { q: "True or False: Sunday is a school day.", options: ["True", "False"], correct: 1 },
      { q: "Which day comes right after Wednesday?", options: ["Thursday", "Friday", "Tuesday", "Monday"], correct: 0 }
    ],
    vocabulary: [
      { word: "school", ar: "مدرسة", ph: "سكول", example: "I go to school." },
      { word: "week", ar: "أسبوع", ph: "ويك", example: "Five days a week." },
      { word: "days", ar: "أيام", ph: "دِيز", example: "I have two days off." },
      { word: "Friday", ar: "الجمعة", ph: "فرايدي", example: "See you on Friday!" },
      { word: "off", ar: "إجازة", ph: "أوف", example: "Saturday is a day off." }
    ]
  },
  {
    id: "a0-r5",
    title: "5. My Room",
    text: "This is my room. I have a bed and a desk. There is a window near my bed. I have many books on the desk.",
    words: {
      "room": { ar: "غرفة", pos: "اسم", ph: "روم" },
      "bed": { ar: "سرير", pos: "اسم", ph: "بيد" },
      "desk": { ar: "مكتب", pos: "اسم", ph: "ديسك" },
      "window": { ar: "نافذة", pos: "اسم", ph: "وِندو" },
      "books": { ar: "كتب", pos: "اسم", ph: "بُكس" }
    },
    questions: [
      { q: "What is near the bed?", options: ["A window", "A door", "A chair", "A TV"], correct: 0 },
      { q: "True or False: She has many books.", options: ["True", "False"], correct: 0 },
      { q: "Where are the books?", options: ["On the desk", "Under the bed", "In the bag", "On the chair"], correct: 0 }
    ],
    vocabulary: [
      { word: "room", ar: "غرفة", ph: "روم", example: "This is my room." },
      { word: "bed", ar: "سرير", ph: "بيد", example: "I have a bed." },
      { word: "desk", ar: "مكتب", ph: "ديسك", example: "Books are on the desk." },
      { word: "window", ar: "نافذة", ph: "وِندو", example: "The window is near my bed." },
      { word: "books", ar: "كتب", ph: "بُكس", example: "I have many books." }
    ]
  }
];
