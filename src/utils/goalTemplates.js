export const TEMPLATES = [
  {
    id: 'morning-run',
    category: 'Health',
    title: 'Morning Run Routine',
    description: 'Build a consistent running habit starting with short jogs.',
    tags: ['fitness', 'habit'],
    milestones: [
      'Jog 15 minutes, 3 days this week',
      'Jog 30 minutes, 3 days this week',
      'Run 5 km without stopping',
      'Run 5 km in under 30 minutes',
    ],
  },
  {
    id: 'meal-prep',
    category: 'Health',
    title: 'Weekly Meal Prep',
    description: 'Plan, shop, and cook for the week so eating well is easy.',
    tags: ['nutrition', 'routine'],
    milestones: [
      'Pick the week\'s menu',
      'Grocery shop once for the week',
      'Cook three batches on Sunday',
      'Pack weekday lunches',
      'Log what you ate each day',
    ],
  },
  {
    id: 'read-12-books',
    category: 'Personal',
    title: 'Read 12 Books This Year',
    description: 'Read one book a month to learn and grow.',
    tags: ['reading', 'learning'],
    milestones: [
      'Pick a reading list of 12 books',
      'Read 1 book (month 1)',
      'Read 6 books (halfway)',
      'Read 12 books',
    ],
  },
  {
    id: 'emergency-fund',
    category: 'Finance',
    title: 'Build a 3-Month Emergency Fund',
    description: 'Save three months of expenses for peace of mind.',
    tags: ['savings', 'money'],
    milestones: [
      'Set a savings target',
      'Automate a monthly transfer',
      'Save 25% of the target',
      'Save 50% of the target',
      'Save 100% of the target',
    ],
  },
  {
    id: 'study-exams',
    category: 'Education',
    title: 'Ace My Final Exams',
    description: 'A structured study plan for exam season.',
    tags: ['study', 'exams'],
    milestones: [
      'Make a study timetable',
      'Review notes for every subject',
      'Do 2 practice papers',
      'Take a full mock exam',
      'Rest the day before',
    ],
  },
  {
    id: 'side-project',
    category: 'Career',
    title: 'Ship a Side Project',
    description: 'Take an idea from notes to a live product.',
    tags: ['coding', 'product'],
    milestones: [
      'Define the MVP scope',
      'Design the core screens',
      'Build the core feature',
      'Get 3 people to try it',
      'Launch publicly',
    ],
  },
];

const KEYWORDS = {
  'morning-run': ['run', 'running', 'jog', 'jogging', 'fit', 'fitness', 'exercise', 'cardio'],
  'meal-prep': ['meal', 'meals', 'cook', 'cooking', 'food', 'nutrition', 'diet', 'eat', 'recipe'],
  'read-12-books': ['read', 'reading', 'book', 'books'],
  'emergency-fund': ['save', 'saving', 'savings', 'fund', 'money', 'budget', 'emergency', 'finance'],
  'study-exams': ['study', 'studying', 'exam', 'exams', 'test', 'school', 'class', 'grade', 'learn'],
  'side-project': ['project', 'app', 'code', 'coding', 'programming', 'startup', 'freelance', 'freelancing', 'product', 'launch', 'career'],
};

export const matchTemplate = (prompt) => {
  const tokens = (prompt || '').toLowerCase().match(/[a-z]+/g) || [];
  let best = null;
  let bestScore = 0;
  for (const template of TEMPLATES) {
    const words = KEYWORDS[template.id] || [];
    const score = words.reduce(
      (n, word) => n + (tokens.some(token => token === word || token.startsWith(word)) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = template;
    }
  }
  return best;
};
