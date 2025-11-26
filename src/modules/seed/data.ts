export const questions = [
  {
    section: 'Math',
    skill: 'Algebra: Linear Equations',
    content: 'Nếu 2x - 5 = 7 thì x bằng bao nhiêu?',
    difficulty: 'easy',
  },
  {
    section: 'Math',
    skill: 'Functions: Evaluation',
    content: 'Cho f(x)=x^2 - 4x + 1. Tính f(3).',
    difficulty: 'easy',
  },
  {
    section: 'Math',
    skill: 'Ratios & Proportions',
    content: 'Một xe đi 120 km trong 3 giờ. Trung bình xe đi được bao nhiêu km/h?',
    difficulty: 'medium',
  },
  {
    section: 'RW',
    skill: 'Vocabulary',
    passage:
      'The scientist noted that the reaction was *transient*, lasting only a few seconds before disappearing.',
    content: 'Từ "transient" gần nghĩa nhất với:',
    difficulty: 'medium',
  },
  {
    section: 'RW',
    skill: 'Information & Ideas',
    passage:
      'The author argues that technological innovation must always be paired with ethical responsibility to ensure long-term societal benefit.',
    content: 'Câu nào sau đây thể hiện ý chính của đoạn văn?',
    difficulty: 'hard',
  }
];

export const questionChoices = [
  // Q001
  { questionId: 1, choiceText: '4', isCorrect: true, choiceOrder: 1 },
  { questionId: 1, choiceText: '5', isCorrect: false, choiceOrder: 2 },
  { questionId: 1, choiceText: '6', isCorrect: false, choiceOrder: 3 },
  { questionId: 1, choiceText: '2', isCorrect: false, choiceOrder: 4 },

  // Q002
  { questionId: 2, choiceText: '4', isCorrect: false, choiceOrder: 1 },
  { questionId: 2, choiceText: '2', isCorrect: true, choiceOrder: 2 },
  { questionId: 2, choiceText: '6', isCorrect: false, choiceOrder: 3 },
  { questionId: 2, choiceText: '7', isCorrect: false, choiceOrder: 4 },


  // Q003
  { questionId: 3, choiceText: '20', isCorrect: false, choiceOrder: 1 },
  { questionId: 3, choiceText: '30', isCorrect: false, choiceOrder: 2 },
  { questionId: 3, choiceText: '40', isCorrect: true, choiceOrder: 3 },
  { questionId: 3, choiceText: '35', isCorrect: false, choiceOrder: 4 },


  // Q004
  { questionId: 4, choiceText: 'Tạm thời', isCorrect: true, choiceOrder: 1 },
  { questionId: 4, choiceText: 'Khó khăn', isCorrect: false, choiceOrder: 2 },
  { questionId: 4, choiceText: 'Phức tạp', isCorrect: false, choiceOrder: 3 },
  { questionId: 4, choiceText: 'Ổn định', isCorrect: false, choiceOrder: 4 },

  // Q005
  { questionId: 5, choiceText: 'Công nghệ ngày càng phát triển nhanh chóng.', isCorrect: false, choiceOrder: 1 },
  { questionId: 5, choiceText: 'Trách nhiệm đạo đức phải đi cùng đổi mới công nghệ.', isCorrect: true, choiceOrder: 2 },
  { questionId: 5, choiceText: 'Xã hội cần nhiều đổi mới hơn.', isCorrect: false, choiceOrder: 3 },
  { questionId: 5, choiceText: 'Công nghệ cũ nên bị loại bỏ.', isCorrect: false, choiceOrder: 4 },
];

export const irtParameters = [
  { questionId: 1, a: 1.12, b: -0.2, c: 0.20 },
  { questionId: 2, a: 1.05, b: -0.1, c: 0.20 },
  { questionId: 3, a: 1.30, b: 0.2, c: 0.18 },
  { questionId: 4, a: 1.25, b: 0.15, c: 0.20 },
  { questionId: 5, a: 1.40, b: 0.45, c: 0.15 }
];
