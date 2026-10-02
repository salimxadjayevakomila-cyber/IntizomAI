 export type Language = "uz" | "ru" | "en";

export const t = {
  uz: {
    // Nav / Sidebar
    overview: "Bosh sahifa",
    goals: "Maqsadlar",
    insights: "Tahlil",
    stepCounter: "Qadamlar",
    gymFinder: "Zallar",
    recipes: "Retseptlar",
    aiTrainer: "AI Murabbiy",
    adminPanel: "Admin panel",
    settings: "Sozlamalar",
    needHand: "Yordam kerakmi?",
    helpCenterText: "Ovqatlanish maqsadlariga erishish bo'yicha maslahatlar oling.",
    visitHelp: "Yordam markazi",
    freePlan: "Bepul tarif",

    // Header & Greeting
    salom: "Salom",
    dailyOverview: "Kunlik umumiy ko'rinish",
    nutritionGoalsText: "Ovqatlanish maqsadlaringiz bilan birga bo'ling.",
    logMeal: "Ovqat qo'shish",

    // Daily Summary / Macros
    todaysCalories: "Bugungi kaloriyalar",
    kcalLeft: "kcal qoldi",
    weeklyAverage: "Haftalik o'rtacha",
    betterThanLastWeek: "o'tgan haftaga qaraganda yaxshiroq",
    carbs: "Uglevodlar",
    protein: "Oqsil",
    fat: "Yog'lar",
    macroBreakdown: "Makronutrientlar tahlili",
    targetsProgress: "Bugungi maqsadlaringizga nisbatan natijangiz",

    // Camera / AI Scan
    scanWithCamera: "Kamera bilan skanerlash",
    cameraIdentify: "Kamera orqali aniqlash",
    cameraQuestion: "Bugun nima yedingiz? Suratga oling va AI kaloriyalarni hisoblasin.",
    takePhoto: "Rasmga olish & AI hisoblash",
    uploadPhoto: "Rasm yuklash",
    dragAndDrop: "yoki shu yerga tashlang",

    // Fasting Plan
    fastingPlan: "Ro'za/Intervallik rejasi",
    stepByStepFasting: "Bosqichma-bosqich reja",
    gentleRhythm: "Bugun uchun mos 14:10 ritm.",
    eatingWindow: "Ovqatlanish oynasi",
    fastingActive: "Interval aktiv",
    startFast: "Intervalni boshlash",
    smallHabits: "Kichik odatlar, barqaror natija",
    fastingDesc: "Odatlaringizni bajarish muntazam ovqatlanish tartibini yaratishga va kaloriyalarni to'g'ri kuzatishga yordam beradi.",
    stepsDone: "bajarildi",
    fastingGoal: "vaqt maqsadi",
    todaysPlan: "bugungi reja",

    // My Meals
    myMeals: "Mening ovqatlarim",
    fuelYourDay: "Kuningizni sifatli ovqatlar bilan boyiting",
    visualLog: "Bugun iste'mol qilgan barcha taomlaringiz ro'yxati.",
    youHaveLogged: "Bugun siz",
    mealsLoggedText: "ta taom",
    addAnotherMeal: "Yana taom qo'shish",

    // Camera Modal
    foodVisionAI: "Food Vision AI",
    cameraClose: "Yopish",
    analyzingMeal: "Taom tahlil qilinmoqda...",
    cameraPrompt: "Taom rasmini yuklang yoki nomini kiriting:",
    enterFoodName: "Taom nomini kiriting...",
    scanButton: "Tahlil qilish & Saqlash",

    // Settings Section
    selectLanguage: "Ilova tilini tanlang",
    selectLanguageDesc: "Tizim tili o'zgarganda barcha bo'limlar mos tilda ko'rsatiladi.",
    logout: "Tizimdan chiqish",
  },
  ru: {
    // Nav / Sidebar
    overview: "Главная",
    goals: "Цели",
    insights: "Аналитика",
    stepCounter: "Шаги",
    gymFinder: "Залы",
    recipes: "Рецепты",
    aiTrainer: "AI Тренер",
    adminPanel: "Админ панель",
    settings: "Настройки",
    needHand: "Нужна помощь?",
    helpCenterText: "Получите советы по достижению ваших целей в питании.",
    visitHelp: "Центр помощи",
    freePlan: "Бесплатный план",

    // Header & Greeting
    salom: "Привет",
    dailyOverview: "Ежедневный обзор",
    nutritionGoalsText: "Следите за своими целями по питанию.",
    logMeal: "Добавить блюдо",

    // Daily Summary / Macros
    todaysCalories: "Сегодняшние калории",
    kcalLeft: "ккал осталось",
    weeklyAverage: "Среднее за неделю",
    betterThanLastWeek: "лучше, чем на прошлой неделе",
    carbs: "Углеводы",
    protein: "Белки",
    fat: "Жиры",
    macroBreakdown: "Анализ макронутриентов",
    targetsProgress: "Ваш прогресс по сравнению с целями на сегодня",

    // Camera / AI Scan
    scanWithCamera: "Сканировать камерой",
    cameraIdentify: "Определение через камеру",
    cameraQuestion: "Что вы сегодня ели? Сделайте фото, и AI рассчитает калории.",
    takePhoto: "Сделать фото и рассчитать",
    uploadPhoto: "Загрузить фото",
    dragAndDrop: "или перетащите сюда",

    // Fasting Plan
    fastingPlan: "План голодания",
    stepByStepFasting: "Пошаговый план",
    gentleRhythm: "Удобный ритм 14:10 на сегодня.",
    eatingWindow: "Окно приема пищи",
    fastingActive: "Голодание активно",
    startFast: "Начать голодание",
    smallHabits: "Маленькие привычки, стабильный результат",
    fastingDesc: "Соблюдение режима помогает сформировать постоянный рацион и лучше контролировать калории.",
    stepsDone: "выполнено",
    fastingGoal: "цель голодания",
    todaysPlan: "план на сегодня",

    // My Meals
    myMeals: "Мои блюда",
    fuelYourDay: "Наполните день качественной едой",
    visualLog: "Визуальный журнал всего, что вы съели сегодня.",
    youHaveLogged: "Сегодня вы записали",
    mealsLoggedText: "блюд(а)",
    addAnotherMeal: "Добавить еще блюдо",

    // Camera Modal
    foodVisionAI: "Food Vision AI",
    cameraClose: "Закрыть",
    analyzingMeal: "Анализируем блюдо...",
    cameraPrompt: "Загрузите фото блюда или введите название:",
    enterFoodName: "Введите название блюда...",
    scanButton: "Анализировать и сохранить",

    // Settings Section
    selectLanguage: "Выберите язык приложения",
    selectLanguageDesc: "При изменении языка весь интерфейс будет обновлен.",
    logout: "Выйти из системы",
  },
  en: {
    // Nav / Sidebar
    overview: "Overview",
    goals: "Goals",
    insights: "Insights",
    stepCounter: "Step Counter",
    gymFinder: "Gym Finder",
    recipes: "Recipes",
    aiTrainer: "AI Trainer",
    adminPanel: "Admin panel",
    settings: "Settings",
    needHand: "Need a hand?",
    helpCenterText: "Get tips for reaching your nutrition goals.",
    visitHelp: "Visit help center",
    freePlan: "Free plan",

    // Header & Greeting
    salom: "Hello",
    dailyOverview: "Your daily overview",
    nutritionGoalsText: "Stay on track with your nutrition goals.",
    logMeal: "Log a meal",

    // Daily Summary / Macros
    todaysCalories: "Today's calories",
    kcalLeft: "kcal left",
    weeklyAverage: "Weekly average",
    betterThanLastWeek: "better than last week",
    carbs: "Carbs",
    protein: "Protein",
    fat: "Fat",
    macroBreakdown: "Macro breakdown",
    targetsProgress: "Your progress against today's targets",

    // Camera / AI Scan
    scanWithCamera: "Scan with camera",
    cameraIdentify: "Identify via camera",
    cameraQuestion: "What did you eat today? Take a photo and let AI compute calories.",
    takePhoto: "Take photo & AI compute",
    uploadPhoto: "Upload a photo",
    dragAndDrop: "or drag and drop here",

    // Fasting Plan
    fastingPlan: "Fasting plan",
    stepByStepFasting: "Step-by-step fasting",
    gentleRhythm: "A gentle 14:10 rhythm for today.",
    eatingWindow: "Eating window",
    fastingActive: "Fasting active",
    startFast: "Start fast",
    smallHabits: "Small habits, steady progress",
    fastingDesc: "Completing your routine helps create a consistent eating pattern and makes your calorie trend easier to understand.",
    stepsDone: "steps done",
    fastingGoal: "fasting goal",
    todaysPlan: "today's plan",

    // My Meals
    myMeals: "My meals",
    fuelYourDay: "Fuel your day, one plate at a time",
    visualLog: "A visual log of everything you've enjoyed today.",
    youHaveLogged: "You've logged",
    mealsLoggedText: "meals",
    addAnotherMeal: "Add another meal",

    // Camera Modal
    foodVisionAI: "Food Vision AI",
    cameraClose: "Close",
    analyzingMeal: "Analyzing meal...",
    cameraPrompt: "Upload a photo or enter meal name:",
    enterFoodName: "Enter food name...",
    scanButton: "Analyze & Save",

    // Settings Section
    selectLanguage: "Select App Language",
    selectLanguageDesc: "Changing language updates the whole interface instantly.",
    logout: "Log out",
  },
};