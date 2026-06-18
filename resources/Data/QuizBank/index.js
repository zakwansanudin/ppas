// Data/QuizBank/index.js

// Import all year files
import { L1_questions, getAllL1Questions } from './Primary/L1_7yo';
import { L2_questions, getAllL2Questions } from './Primary/L2_8yo';
import { L3_questions, getAllL3Questions } from './Primary/L3_9yo';
import { L4_questions, getAllL4Questions } from './Primary/L4_10yo';
import { L5_questions, getAllL5Questions } from './Primary/L5_11yo';
import { L6_questions, getAllL6Questions } from './Primary/L6_12yo';
import { U1_questions, getAllU1Questions } from './Secondary/U1_13yo';
import { U2_questions, getAllU2Questions } from './Secondary/U2_14yo';
import { U3_questions, getAllU3Questions } from './Secondary/U3_15yo';
import { U4_questions, getAllU4Questions } from './Secondary/U4_16yo';
import { U5_questions, getAllU5Questions } from './Secondary/U5_17yo';

// Organized by year/grade level
export const quizBank = {
    L1: L1_questions,
    L2: L2_questions,
    L3: L3_questions,
    L4: L4_questions,
    L5: L5_questions,
    L6: L6_questions,
    U1: U1_questions,
    U2: U2_questions,
    U3: U3_questions,
    U4: U4_questions,
    U5: U5_questions
};

// Helper functions
export const getQuestionsByLevel = (level) => {
    return quizBank[level] || { mathematic: [], science: [], history: [] };
};

export const getAllQuestionsByLevel = (level) => {
    const questions = quizBank[level];
    if (!questions) return [];
    
    return [
        ...(questions.mathematic || []),
        ...(questions.science || []),
        ...(questions.history || [])
    ];
};

export const getQuestionsByLevelAndSubject = (level, subject) => {
    const levelQuestions = quizBank[level];
    if (!levelQuestions) return [];
    
    return levelQuestions[subject] || [];
};

export const getRandomQuestionsFromLevel = (level, count = 5, subject = null) => {
    let questions = [];
    
    if (subject) {
        questions = getQuestionsByLevelAndSubject(level, subject);
    } else {
        questions = getAllQuestionsByLevel(level);
    }
    
    if (questions.length === 0) return [];
    
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

export const getMixedQuestionsFromLevel = (level, count = 5) => {
    console.log('Getting mixed questions for level:', level);
    
    // First, get all questions for this level
    const allQuestions = getAllQuestionsByLevel(level);
    console.log('Total questions available for level', level + ':', allQuestions.length);
    
    if (allQuestions.length === 0) {
        console.warn('No questions found for level:', level);
        return [];
    }
    
    // If we have fewer questions than requested, return all available
    if (allQuestions.length <= count) {
        return [...allQuestions];
    }
    
    // Simple random selection without subject mixing
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// Simplified version - just get first 5 questions
export const getSimpleQuestionsFromLevel = (level, count = 5) => {
    const questions = getAllQuestionsByLevel(level);
    return questions.slice(0, count);
};

export const levelInfo = {
    L1: { age: '7 tahun', category: 'Primary', name: 'Tahun 1' },
    L2: { age: '8 tahun', category: 'Primary', name: 'Tahun 2' },
    L3: { age: '9 tahun', category: 'Primary', name: 'Tahun 3' },
    L4: { age: '10 tahun', category: 'Primary', name: 'Tahun 4' },
    L5: { age: '11 tahun', category: 'Primary', name: 'Tahun 5' },
    L6: { age: '12 tahun', category: 'Primary', name: 'Tahun 6' },
    U1: { age: '13 tahun', category: 'Secondary', name: 'Tingkatan 1' },
    U2: { age: '14 tahun', category: 'Secondary', name: 'Tingkatan 2' },
    U3: { age: '15 tahun', category: 'Secondary', name: 'Tingkatan 3' },
    U4: { age: '16 tahun', category: 'Secondary', name: 'Tingkatan 4' },
    U5: { age: '17 tahun', category: 'Secondary', name: 'Tingkatan 5' }
};

export default quizBank;