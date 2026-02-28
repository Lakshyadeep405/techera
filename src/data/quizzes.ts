import type { Quiz } from '@/types/quiz';

// All questions combined into one mega quiz
const allQuestions = [
  // Management Questions
  {
    id: 1,
    question: 'Who is known as the father of Scientific Management?',
    options: ['Henri Fayol', 'Peter Drucker', 'F.W. Taylor', 'Elton Mayo'],
    correctAnswer: 2,
    category: 'Management'
  },
  {
    id: 2,
    question: 'Planning, Organizing, Staffing, Directing, Controlling are functions of:',
    options: ['Leadership', 'Management', 'Entrepreneurship', 'Administration'],
    correctAnswer: 1,
    category: 'Management'
  },
  {
    id: 3,
    question: 'Which management theory focuses on human relations?',
    options: ['Classical', 'Behavioral', 'Quantitative', 'Systems'],
    correctAnswer: 1,
    category: 'Management'
  },
  {
    id: 4,
    question: 'Maslow\'s theory is related to:',
    options: ['Motivation', 'Leadership', 'Communication', 'Control'],
    correctAnswer: 0,
    category: 'Management'
  },
  {
    id: 5,
    question: 'Management by Objectives (MBO) was introduced by:',
    options: ['Taylor', 'Fayol', 'Peter Drucker', 'Mayo'],
    correctAnswer: 2,
    category: 'Management'
  },
  {
    id: 6,
    question: 'Span of control refers to:',
    options: ['Number of departments', 'Number of subordinates under a manager', 'Control techniques', 'Authority level'],
    correctAnswer: 1,
    category: 'Management'
  },
  {
    id: 7,
    question: 'Which leadership style involves employee participation?',
    options: ['Autocratic', 'Laissez-faire', 'Democratic', 'Bureaucratic'],
    correctAnswer: 2,
    category: 'Management'
  },
  {
    id: 8,
    question: 'SWOT analysis is used for:',
    options: ['Budgeting', 'Strategic planning', 'Recruitment', 'Performance appraisal'],
    correctAnswer: 1,
    category: 'Management'
  },
  {
    id: 9,
    question: 'Unity of command principle was given by:',
    options: ['Taylor', 'Fayol', 'Weber', 'Drucker'],
    correctAnswer: 1,
    category: 'Management'
  },
  {
    id: 10,
    question: 'The Hawthorne studies were conducted at:',
    options: ['Ford Motors', 'General Electric', 'Western Electric', 'IBM'],
    correctAnswer: 2,
    category: 'Management'
  },
  // Indian History & Polity
  {
    id: 11,
    question: 'Who founded the Indian National Congress?',
    options: ['Dadabhai Naoroji', 'A.O. Hume', 'Bal Gangadhar Tilak', 'Gopal Krishna Gokhale'],
    correctAnswer: 1,
    category: 'Indian Polity'
  },
  {
    id: 12,
    question: 'The Non-Cooperation Movement was launched in:',
    options: ['1917', '1919', '1920', '1922'],
    correctAnswer: 2,
    category: 'Indian Polity'
  },
  {
    id: 13,
    question: '\'Do or Die\' slogan was given during:',
    options: ['Civil Disobedience', 'Quit India Movement', 'Non-Cooperation', 'Khilafat'],
    correctAnswer: 1,
    category: 'Indian Polity'
  },
  {
    id: 14,
    question: 'The Jallianwala Bagh massacre occurred in:',
    options: ['1917', '1918', '1919', '1920'],
    correctAnswer: 2,
    category: 'Indian Polity'
  },
  {
    id: 15,
    question: 'Who wrote \'Discovery of India\'?',
    options: ['Gandhi', 'Nehru', 'Tilak', 'Ambedkar'],
    correctAnswer: 1,
    category: 'Indian Polity'
  },
  {
    id: 16,
    question: 'Partition of Bengal took place in:',
    options: ['1905', '1911', '1920', '1947'],
    correctAnswer: 0,
    category: 'Indian Polity'
  },
  {
    id: 17,
    question: 'Who started the Home Rule League in India?',
    options: ['Tilak & Annie Besant', 'Gandhi & Nehru', 'Bose & Patel', 'Gokhale & Naoroji'],
    correctAnswer: 0,
    category: 'Indian Polity'
  },
  {
    id: 18,
    question: 'Which act gave provincial autonomy?',
    options: ['1909 Act', '1919 Act', '1935 Act', '1947 Act'],
    correctAnswer: 2,
    category: 'Indian Polity'
  },
  {
    id: 19,
    question: 'The Dandi March was related to:',
    options: ['Indigo revolt', 'Salt Satyagraha', 'Quit India', 'Swadeshi'],
    correctAnswer: 1,
    category: 'Indian Polity'
  },
  {
    id: 20,
    question: 'Fundamental duties are borrowed from:',
    options: ['UK', 'USA', 'USSR', 'FRANCE'],
    correctAnswer: 2,
    category: 'Indian Polity'
  },
  // Logical Reasoning
  {
    id: 21,
    question: 'Pointing to a woman, Ram says: "She is my mother\'s only daughter." Who is she?',
    options: ['Sister', 'Cousin', 'Mother', 'Wife'],
    correctAnswer: 0,
    category: 'Logical'
  },
  {
    id: 22,
    question: 'A is father of B, but B is not son of A. How?',
    options: ['B is adopted', 'B is daughter', 'A is uncle', 'Data insufficient'],
    correctAnswer: 1,
    category: 'Logical'
  },
  {
    id: 23,
    question: 'If P is brother of Q and Q is mother of R, P is R\'s:',
    options: ['Uncle', 'Father', 'Brother', 'Cousin'],
    correctAnswer: 0,
    category: 'Logical'
  },
  {
    id: 24,
    question: 'My father\'s brother\'s son is my:',
    options: ['Uncle', 'Brother', 'Cousin', 'Nephew'],
    correctAnswer: 2,
    category: 'Logical'
  },
  {
    id: 25,
    question: 'A woman introduces a man as \'my mother\'s only son\'. Who is the man?',
    options: ['Brother', 'Husband', 'Son', 'Cousin'],
    correctAnswer: 0,
    category: 'Logical'
  },
  {
    id: 26,
    question: 'If A is sister of B, B is brother of C, C is daughter of D. How is A related to D?',
    options: ['Daughter', 'Sister', 'Niece', 'Wife'],
    correctAnswer: 0,
    category: 'Logical'
  },
  {
    id: 27,
    question: 'Pointing to a boy, Rita says: "He is the son of my grandfather\'s only son." Who is he?',
    options: ['Brother', 'Cousin', 'Son', 'Uncle'],
    correctAnswer: 0,
    category: 'Logical'
  },
  {
    id: 28,
    question: 'If X is mother of Y and Y is mother of Z, X is Z\'s:',
    options: ['Aunt', 'Mother', 'Grandmother', 'Sister'],
    correctAnswer: 2,
    category: 'Logical'
  },
  {
    id: 29,
    question: 'A\'s son is B\'s brother. How is A related to B?',
    options: ['Mother', 'Father', 'Aunt', 'Sister'],
    correctAnswer: 0,
    category: 'Logical'
  },
  {
    id: 30,
    question: 'My sister\'s father is your father. How are we related?',
    options: ['Cousins', 'Siblings', 'Friends', 'Uncle'],
    correctAnswer: 1,
    category: 'Logical'
  },
  // Sports
  {
    id: 31,
    question: 'Which country won the first Cricket World Cup?',
    options: ['India', 'Australia', 'England', 'West Indies'],
    correctAnswer: 3,
    category: 'Sports'
  },
  {
    id: 32,
    question: 'How many players are there in a football team?',
    options: ['9', '10', '11', '12'],
    correctAnswer: 2,
    category: 'Sports'
  },
  {
    id: 33,
    question: 'Olympics are held every:',
    options: ['2 years', '3 years', '4 years', '5 years'],
    correctAnswer: 2,
    category: 'Sports'
  },
  {
    id: 34,
    question: '\'The God of Cricket\' refers to:',
    options: ['Kohli', 'Dravid', 'Tendulkar', 'Gavaskar'],
    correctAnswer: 2,
    category: 'Sports'
  },
  {
    id: 35,
    question: 'Wimbledon is related to:',
    options: ['Cricket', 'Tennis', 'Football', 'Golf'],
    correctAnswer: 1,
    category: 'Sports'
  },
  {
    id: 36,
    question: 'Which country invented badminton?',
    options: ['China', 'England', 'India', 'Japan'],
    correctAnswer: 1,
    category: 'Sports'
  },
  {
    id: 37,
    question: 'Which Indian won the first individual Olympic gold medal?',
    options: ['Milkha Singh', 'Abhinav Bindra', 'Neeraj Chopra', 'PV Sindhu'],
    correctAnswer: 1,
    category: 'Sports'
  },
  {
    id: 38,
    question: 'FIFA headquarters is located in:',
    options: ['France', 'Germany', 'Switzerland', 'Spain'],
    correctAnswer: 2,
    category: 'Sports'
  },
  {
    id: 39,
    question: 'How many rings are there in the Olympic symbol?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 1,
    category: 'Sports'
  },
  {
    id: 40,
    question: '\'Hat-trick\' term originated in:',
    options: ['Football', 'Cricket', 'Hockey', 'Tennis'],
    correctAnswer: 1,
    category: 'Sports'
  },
  // Entertainment
  {
    id: 41,
    question: 'Oscar awards are related to:',
    options: ['Music', 'Sports', 'Films', 'Literature'],
    correctAnswer: 2,
    category: 'Entertainment'
  },
  {
    id: 42,
    question: 'Which is the highest-grossing Indian movie (approx.)?',
    options: ['Dangal', 'Baahubali 2', 'RRR', 'Jawan'],
    correctAnswer: 1,
    category: 'Entertainment'
  },
  {
    id: 43,
    question: 'Who composed the music for \'Slumdog Millionaire\'?',
    options: ['AR Rahman', 'Shankar-Ehsaan-Loy', 'Ilaiyaraaja', 'Amit Trivedi'],
    correctAnswer: 0,
    category: 'Entertainment'
  },
  {
    id: 44,
    question: 'OTT stands for:',
    options: ['Over the Top', 'On the Time', 'Open Tech Transfer', 'Online Telecast Tool'],
    correctAnswer: 0,
    category: 'Entertainment'
  },
  {
    id: 45,
    question: 'Which Indian actor won an Oscar?',
    options: ['Amitabh Bachchan', 'Irrfan Khan', 'None', 'AR Rahman'],
    correctAnswer: 3,
    category: 'Entertainment'
  },
  {
    id: 46,
    question: 'Filmfare Awards are given for:',
    options: ['Regional films only', 'Indian cinema', 'World cinema', 'TV serials'],
    correctAnswer: 1,
    category: 'Entertainment'
  },
  {
    id: 47,
    question: 'Which movie popularized the dialogue "Mogambo Khush Hua"?',
    options: ['Sholay', 'Mr. India', 'Don', 'Deewar'],
    correctAnswer: 1,
    category: 'Entertainment'
  },
  {
    id: 48,
    question: 'Who is the director of \'3 Idiots\'?',
    options: ['Karan Johar', 'Rajkumar Hirani', 'Anurag Kashyap', 'Sanjay Leela Bhansali'],
    correctAnswer: 1,
    category: 'Entertainment'
  },
  {
    id: 49,
    question: 'Grammy Awards are related to:',
    options: ['Acting', 'Direction', 'Music', 'Dance'],
    correctAnswer: 2,
    category: 'Entertainment'
  },
  {
    id: 50,
    question: 'The first Indian OTT platform was:',
    options: ['NETFLIX', 'HOTSTAR', 'ZEE 5', 'SONY LIVE'],
    correctAnswer: 1,
    category: 'Entertainment'
  },
  // Economics
  {
    id: 51,
    question: 'GDP stands for:',
    options: ['Gross Domestic Product', 'Global Development Process', 'Gross Demand Price', 'General Domestic Profit'],
    correctAnswer: 0,
    category: 'Economics'
  },
  {
    id: 52,
    question: 'Which is NOT a factor of production?',
    options: ['Land', 'Labour', 'Capital', 'Money'],
    correctAnswer: 3,
    category: 'Economics'
  },
  {
    id: 53,
    question: 'Who is known as the father of Economics?',
    options: ['Keynes', 'Marshall', 'Adam Smith', 'Ricardo'],
    correctAnswer: 2,
    category: 'Economics'
  },
  {
    id: 54,
    question: 'Sensex is associated with:',
    options: ['NSE', 'BSE', 'RBI', 'SEBI'],
    correctAnswer: 1,
    category: 'Economics'
  },
  {
    id: 55,
    question: 'Inflation refers to:',
    options: ['Rise in prices', 'Fall in prices', 'Rise in output', 'Fall in income'],
    correctAnswer: 0,
    category: 'Economics'
  },
  {
    id: 56,
    question: 'Which bank issues currency notes in India?',
    options: ['SBI', 'RBI', 'NABARD', 'SEBI'],
    correctAnswer: 1,
    category: 'Economics'
  },
  {
    id: 57,
    question: 'Startup India initiative was launched to promote:',
    options: ['Agriculture', 'Entrepreneurship', 'Exports', 'Education'],
    correctAnswer: 1,
    category: 'Economics'
  },
  {
    id: 58,
    question: 'SEBI regulates:',
    options: ['Banks', 'Stock market', 'Insurance', 'Mutual funds only'],
    correctAnswer: 1,
    category: 'Economics'
  },
  {
    id: 59,
    question: 'Fiscal policy is related to:',
    options: ['Interest rates', 'Government expenditure and taxation', 'Banking', 'Foreign trade'],
    correctAnswer: 1,
    category: 'Economics'
  },
  {
    id: 60,
    question: 'Which sector contributes the most to India\'s GDP?',
    options: ['Primary', 'Secondary', 'Tertiary', 'Quaternary'],
    correctAnswer: 2,
    category: 'Economics'
  },
  // Mythology
  {
    id: 61,
    question: 'Who narrated the Bhagavad Gita?',
    options: ['Arjuna', 'Krishna', 'Vyasa', 'Bhishma'],
    correctAnswer: 1,
    category: 'Mythology'
  },
  {
    id: 62,
    question: 'The Bhagavad Gita is part of:',
    options: ['Ramayana', 'Vedas', 'Mahabharata', 'Upanishads'],
    correctAnswer: 2,
    category: 'Mythology'
  },
  {
    id: 63,
    question: 'Kurukshetra war lasted for:',
    options: ['10 days', '12 days', '18 days', '21 days'],
    correctAnswer: 2,
    category: 'Mythology'
  },
  {
    id: 64,
    question: 'Who wrote the Mahabharata?',
    options: ['Valmiki', 'Ved Vyasa', 'Tulsidas', 'Kalidasa'],
    correctAnswer: 1,
    category: 'Mythology'
  },
  {
    id: 65,
    question: 'Ramayana was written by:',
    options: ['Vyasa', 'Valmiki', 'Tulsidas', 'Kalidasa'],
    correctAnswer: 1,
    category: 'Mythology'
  },
  {
    id: 66,
    question: 'Sita was daughter of:',
    options: ['Dasharatha', 'Janaka', 'Ravana', 'Sugriva'],
    correctAnswer: 1,
    category: 'Mythology'
  },
  {
    id: 67,
    question: 'Karma Yoga emphasizes:',
    options: ['Knowledge', 'Devotion', 'Action without attachment', 'Meditation'],
    correctAnswer: 2,
    category: 'Mythology'
  },
  {
    id: 68,
    question: 'Who broke the bow of Shiva?',
    options: ['Rama', 'Lakshmana', 'Bharata', 'Ravana'],
    correctAnswer: 0,
    category: 'Mythology'
  },
  {
    id: 69,
    question: 'The Bhagavad Gita contains how many chapters?',
    options: ['15', '16', '18', '20'],
    correctAnswer: 2,
    category: 'Mythology'
  },
  {
    id: 70,
    question: 'Who was Karna\'s biological mother?',
    options: ['Kunti', 'Gandhari', 'Radha', 'Draupadi'],
    correctAnswer: 0,
    category: 'Mythology'
  },
  // Current Affairs
  {
    id: 71,
    question: 'India\'s G20 Presidency theme was:',
    options: ['One Earth, One Family, One Future', 'Digital India', 'Make in India', 'Vasudhaiva Kutumbakam'],
    correctAnswer: 0,
    category: 'Current Affairs'
  },
  {
    id: 72,
    question: 'Who is the current Chief Justice of India (2024-25)?',
    options: ['DY Chandrachud', 'NV Ramana', 'UU Lalit', 'SA Bobde'],
    correctAnswer: 0,
    category: 'Current Affairs'
  },
  {
    id: 73,
    question: 'Which city hosted the G20 Summit in India?',
    options: ['Mumbai', 'New Delhi', 'Bengaluru', 'Hyderabad'],
    correctAnswer: 1,
    category: 'Current Affairs'
  },
  {
    id: 74,
    question: 'Which Indian state launched the \'Startup Village\' concept first?',
    options: ['Karnataka', 'Kerala', 'Gujarat', 'Telangana'],
    correctAnswer: 1,
    category: 'Current Affairs'
  },
  {
    id: 75,
    question: 'Which country hosted the FIFA World Cup 2022?',
    options: ['Russia', 'USA', 'Qatar', 'France'],
    correctAnswer: 2,
    category: 'Current Affairs'
  },
  {
    id: 76,
    question: 'UPI is related to:',
    options: ['Transport', 'Digital payments', 'Education', 'Healthcare'],
    correctAnswer: 1,
    category: 'Current Affairs'
  },
  {
    id: 77,
    question: 'Which organization publishes World Happiness Report?',
    options: ['WHO', 'IMF', 'UN', 'World Bank'],
    correctAnswer: 2,
    category: 'Current Affairs'
  },
  {
    id: 78,
    question: 'India\'s first Chief of Defence Staff was:',
    options: ['Bipin Rawat', 'MM Naravane', 'VK Singh', 'Dalbir Singh'],
    correctAnswer: 0,
    category: 'Current Affairs'
  },
  {
    id: 79,
    question: 'Which Indian company became the first to cross $200B market cap?',
    options: ['TCS', 'Infosys', 'Reliance Industries', 'HDFC Bank'],
    correctAnswer: 2,
    category: 'Current Affairs'
  },
  {
    id: 80,
    question: 'ISRO headquarters is at:',
    options: ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai'],
    correctAnswer: 2,
    category: 'Current Affairs'
  },
  // Additional Questions from the document
  {
    id: 81,
    question: 'Which latitude divides earth into halves?',
    options: ['Tropic of Cancer', 'Tropic of Capricorn', 'Equator', 'Prime Meridian'],
    correctAnswer: 2,
    category: 'Geography'
  },
  {
    id: 82,
    question: 'The prime meridian passes through:',
    options: ['Paris', 'Greenwich', 'Rome', 'Berlin'],
    correctAnswer: 1,
    category: 'Geography'
  },
  {
    id: 83,
    question: 'What can travel around the world while staying in a corner?',
    options: ['Moon', 'Sun', 'Stamp', 'Air'],
    correctAnswer: 2,
    category: 'Logical'
  },
  {
    id: 84,
    question: 'Which number comes next? 2 → 6 → 12 → 20 → ?',
    options: ['24', '28', '30', '32'],
    correctAnswer: 1,
    category: 'Logical'
  },
  {
    id: 85,
    question: 'If 🔺 = 3, ⬛ = 4, ⭐ = 5, What is 🔺 + ⬛ × ⭐?',
    options: ['23', '35', '15', '32'],
    correctAnswer: 0,
    category: 'Logical'
  },
  {
    id: 86,
    question: 'A man is looking at a portrait. Someone asks "Whose picture are you looking at?" He replies, "Brothers and sisters, I have none. But that man\'s father is my father\'s son." Who is in the portrait?',
    options: ['His father', 'His son', 'Himself', 'His uncle'],
    correctAnswer: 1,
    category: 'Logical'
  },
  {
    id: 87,
    question: 'Fundamental rights are given in:',
    options: ['Part II', 'Part III', 'Part IV', 'Part V'],
    correctAnswer: 1,
    category: 'Indian Polity'
  },
  {
    id: 88,
    question: 'Blue chip companies are:',
    options: ['New startups', 'Loss-making firms', 'Large & stable companies', 'Govt companies only'],
    correctAnswer: 2,
    category: 'Economics'
  },
  {
    id: 89,
    question: 'Which tax is indirect?',
    options: ['Income tax', 'Corporate tax', 'GST', 'Wealth tax'],
    correctAnswer: 2,
    category: 'Economics'
  },
  {
    id: 90,
    question: 'Repo rate is decided by:',
    options: ['Finance Ministry', 'RBI', 'SEBI', 'SBI'],
    correctAnswer: 1,
    category: 'Economics'
  },
  {
    id: 91,
    question: 'A monopoly market has:',
    options: ['Many sellers', 'Few sellers', 'One seller', 'Two sellers'],
    correctAnswer: 2,
    category: 'Economics'
  },
  {
    id: 92,
    question: 'What is the full form of TQM?',
    options: ['Total quality measurement', 'Total quantity management', 'Typical quality management', 'Total quality management'],
    correctAnswer: 3,
    category: 'Management'
  },
  {
    id: 93,
    question: 'Which weapon did Arjuna receive from Shiva?',
    options: ['Sudarshan Chakra', 'Pashupatastra', 'Brahmastra', 'Narayanastra'],
    correctAnswer: 1,
    category: 'Mythology'
  },
  {
    id: 94,
    question: 'Who composed Ramcharitmanas?',
    options: ['Valmiki', 'Tulsidas', 'Vyasa', 'Kabir'],
    correctAnswer: 1,
    category: 'Mythology'
  },
  {
    id: 95,
    question: 'Krishna belonged to which dynasty?',
    options: ['Kuru', 'Yadu', 'Ikshvaku', 'Bharata'],
    correctAnswer: 1,
    category: 'Mythology'
  },
  {
    id: 96,
    question: 'The capital of Maurya empire was:',
    options: ['Ujjain', 'Patliputra', 'Taxila', 'Kashi'],
    correctAnswer: 1,
    category: 'History'
  },
  {
    id: 97,
    question: 'Management is considered a:',
    options: ['Science only', 'Art only', 'Both art and science', 'Neither'],
    correctAnswer: 2,
    category: 'Management'
  },
  {
    id: 98,
    question: 'Which skill is most required at top management level?',
    options: ['Technical', 'Human', 'Conceptual', 'Operational'],
    correctAnswer: 2,
    category: 'Management'
  },
  {
    id: 99,
    question: 'Which is a qualitative technique of control?',
    options: ['Budgetary control', 'ROI', 'Performance appraisal', 'Cost control'],
    correctAnswer: 2,
    category: 'Management'
  },
  {
    id: 100,
    question: 'Demand curve slopes downward due to:',
    options: ['Income effect', 'Substitution effect', 'Law of demand', 'All of these'],
    correctAnswer: 3,
    category: 'Economics'
  }
];

export const megaQuiz: Quiz = {
  id: 'mega-quiz',
  title: 'MANAGEMENT DAY QUIZ',
  description: 'The ultimate challenge! Test your knowledge across Management, History, Sports, Entertainment, Economics, Mythology, and Current Affairs. 100 questions, 20 minutes. Play Bold, Be Unleashed!',
  category: 'All Categories',
  color: '#6B46C1',
  timeLimit: 1200, // 20 minutes = 1200 seconds
  difficulty: 'Medium',
  questions: allQuestions
};

export const quizzes: Quiz[] = [megaQuiz];

export const getQuizById = (id: string): Quiz | undefined => {
  return quizzes.find(quiz => quiz.id === id);
};

export const getAllCategories = (): string[] => {
  return [...new Set(allQuestions.map(q => q.category))];
};
