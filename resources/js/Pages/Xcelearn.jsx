import React, { useState, useEffect, useRef } from "react";

export default function XceLearnLayout() {
    const [selectedWeek, setSelectedWeek] = useState('week');
    const [sekolahRendahOpen, setSekolahRendahOpen] = useState(true);
    const [sekolahMenengahOpen, setSekolahMenengahOpen] = useState(true);
    const [expandedLesson, setExpandedLesson] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [lessonPanel, setLessonPanel] = useState(null);
    const [expandedTimetableLesson, setExpandedTimetableLesson] = useState(null);

    // Feedback modal state
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [feedbackHover, setFeedbackHover] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackCategory, setFeedbackCategory] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    // Contact preference state
    const currentPhone = '+60 12-345 6789'; // replace with real user phone from session
    const [wantsContact, setWantsContact] = useState(false);
    const [contactOption, setContactOption] = useState('current'); // 'current' | 'other'
    const [otherPhone, setOtherPhone] = useState('');

    // Once the modal has been seen and dismissed, this ref lets the
    // next back-press navigate away instead of re-triggering the modal.
    const feedbackShown = useRef(false);

    useEffect(() => {
        window.history.pushState({ page: 'xcelearn' }, '', window.location.href);

        const handlePopState = () => {
            if (feedbackShown.current) {
                // Modal already dismissed — allow normal back navigation
                return;
            }
            // Block navigation, show modal
            window.history.pushState({ page: 'xcelearn' }, '', window.location.href);
            setShowFeedback(true);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Dismiss modal without navigating away. Mark as shown so the
    // very next back-press goes through cleanly (only one click needed).
    const dismissFeedback = () => {
        feedbackShown.current = true;
        setShowFeedback(false);
    };

    const handleFeedbackSubmit = () => {
        setFeedbackSubmitted(true);
        setTimeout(() => {
            feedbackShown.current = true;
            setShowFeedback(false);
            setFeedbackSubmitted(false);
            setFeedbackRating(0);
            setFeedbackText('');
            setFeedbackCategory('');
            setWantsContact(false);
            setContactOption('current');
            setOtherPhone('');
        }, 2000);
    };

    const sekolahRendah = [
        { id: 1, label: "Tahun 1", icon: "1️⃣", color: "bg-blue-500" },
        { id: 2, label: "Tahun 2", icon: "2️⃣", color: "bg-green-500" },
        { id: 3, label: "Tahun 3", icon: "3️⃣", color: "bg-purple-500" },
        { id: 4, label: "Tahun 4", icon: "4️⃣", color: "bg-orange-500" },
        { id: 5, label: "Tahun 5", icon: "5️⃣", color: "bg-pink-500" },
        { id: 6, label: "Tahun 6", icon: "6️⃣", color: "bg-red-500" },
    ];

    const sekolahMenengah = [
        { id: 7, label: "Tingkatan 1", icon: "1️⃣", color: "bg-teal-500" },
        { id: 8, label: "Tingkatan 2", icon: "2️⃣", color: "bg-cyan-500" },
        { id: 9, label: "Tingkatan 3", icon: "3️⃣", color: "bg-indigo-500" },
        { id: 10, label: "Tingkatan 4", icon: "4️⃣", color: "bg-violet-500" },
        { id: 11, label: "Tingkatan 5", icon: "5️⃣", color: "bg-fuchsia-500" },
    ];

    const timetable = [
        {
            day: "Sun 1/18",
            date: "18",
            lessons: [
                {
                    id: "tt-1",
                    teacher: "Miss Fina",
                    time: "6:05 pm - 7:00 pm",
                    color: "bg-yellow-600",
                    topic: "Standard English Lesson",
                    class: "(R) English Year 2",
                    status: "Ended",
                    date: "08/03/2026",
                    startTime: "6:05 pm",
                    duration: "1 hr",
                    rating: 5.0,
                    ratingCount: 1,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Students will understand and use standard English grammar in sentences.",
                    tutor: "Miss Fina",
                    notes: [{ label: "20260308 English Y2 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "55 mins" }],
                },
                {
                    id: "tt-2",
                    teacher: "Miss Qasrina",
                    time: "8:15 pm - 9:15 pm",
                    color: "bg-purple-600",
                    topic: "Advanced Mathematics",
                    class: "(L) 3M Year 3",
                    status: "Ended",
                    date: "08/03/2026",
                    startTime: "8:15 pm",
                    duration: "1 hr",
                    rating: 4.5,
                    ratingCount: 2,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Murid memahami dan menggunakan operasi darab dalam lingkungan nombor hingga 100.",
                    tutor: "Miss Qasrina",
                    notes: [{ label: "20260308 3M Y3 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 9 mins" }],
                },
            ],
        },
        {
            day: "Mon 1/19",
            date: "19",
            lessons: [
                {
                    id: "tt-3",
                    teacher: "Miss Sarah",
                    time: "4:45 pm - 5:45 pm",
                    color: "bg-green-600",
                    topic: "Science Fundamentals",
                    class: "(R) Science Year 2",
                    status: "Ended",
                    date: "19/01/2026",
                    startTime: "4:45 pm",
                    duration: "1 hr",
                    rating: 5.0,
                    ratingCount: 3,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Introduction to basic science concepts and observation skills.",
                    tutor: "Miss Sarah",
                    notes: [],
                    recordings: [{ label: "Recording 1", duration: "58 mins" }],
                },
                {
                    id: "tt-4",
                    teacher: "Miss Isma",
                    time: "6:00 pm - 7:00 pm",
                    color: "bg-orange-500",
                    topic: "Creative Writing",
                    class: "(L) English Year 4",
                    status: "Ended",
                    date: "19/01/2026",
                    startTime: "6:00 pm",
                    duration: "1 hr",
                    rating: 4.0,
                    ratingCount: 2,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Students practise creative writing using descriptive language and story structures.",
                    tutor: "Miss Isma",
                    notes: [{ label: "20260119 English Y4 - Notes" }],
                    recordings: [],
                },
                {
                    id: "tt-5",
                    teacher: "Miss Fina",
                    time: "8:15 pm - 9:15 pm",
                    color: "bg-yellow-600",
                    topic: "Grammar Focus",
                    class: "(R) English Year 3",
                    status: "Ended",
                    date: "19/01/2026",
                    startTime: "8:15 pm",
                    duration: "1 hr",
                    rating: 5.0,
                    ratingCount: 1,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Focus on adverbs and their usage in sentences.",
                    tutor: "Miss Fina",
                    notes: [{ label: "20260119 English Y3 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 2 mins" }],
                },
            ],
        },
        {
            day: "Tue 1/20",
            date: "20",
            lessons: [
                {
                    id: "tt-6",
                    teacher: "Teacher Syafiqah",
                    time: "4:45 pm - 5:45 pm",
                    color: "bg-green-700",
                    topic: "Standard English Lesson 1.1-3",
                    class: "(R) Bahasa Melayu Year 3",
                    status: "Ended",
                    date: "20/01/2026",
                    startTime: "4:45 pm",
                    duration: "1 hr",
                    rating: 4.5,
                    ratingCount: 2,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Murid memahami teks pendek dan menjawab soalan pemahaman.",
                    tutor: "Teacher Syafiqah",
                    notes: [],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 0 mins" }],
                },
                {
                    id: "tt-7",
                    teacher: "Sir Zul",
                    time: "6:00 pm - 7:00 pm",
                    color: "bg-green-600",
                    topic: "Mathematics Practice",
                    class: "(L) 3M Year 2",
                    status: "Ended",
                    date: "20/01/2026",
                    startTime: "6:00 pm",
                    duration: "1 hr",
                    rating: 5.0,
                    ratingCount: 4,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Murid berlatih operasi tambah dan tolak hingga 100.",
                    tutor: "Sir Zul",
                    notes: [{ label: "20260120 3M Y2 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 5 mins" }],
                },
                {
                    id: "tt-8",
                    teacher: "Teacher Taqina",
                    time: "8:15 pm - 9:15 pm",
                    color: "bg-teal-600",
                    topic: "Science Exploration",
                    class: "(R) Science Year 3",
                    status: "Ended",
                    date: "20/01/2026",
                    startTime: "8:15 pm",
                    duration: "1 hr",
                    rating: 4.0,
                    ratingCount: 1,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Students explore properties of materials through hands-on activities.",
                    tutor: "Teacher Taqina",
                    notes: [],
                    recordings: [],
                },
                {
                    id: "tt-9",
                    teacher: "Miss Emily",
                    time: "8:15 pm - 9:15 pm",
                    color: "bg-purple-700",
                    topic: "English Comprehension",
                    class: "(L) English Year 4",
                    status: "Upcoming",
                    date: "20/01/2026",
                    startTime: "8:15 pm",
                    duration: "1 hr",
                    rating: null,
                    ratingCount: 0,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Students practise reading comprehension with inference questions.",
                    tutor: "Miss Emily",
                    notes: [],
                    recordings: [],
                },
                {
                    id: "tt-10",
                    teacher: "Miss Munna",
                    time: "9:30 pm - 10:30 pm",
                    color: "bg-cyan-300",
                    topic: "Advanced Topics",
                    class: "(R) Science Year 5",
                    status: "Upcoming",
                    date: "20/01/2026",
                    startTime: "9:30 pm",
                    duration: "1 hr",
                    rating: null,
                    ratingCount: 0,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Introduction to advanced science topics for Year 5.",
                    tutor: "Miss Munna",
                    notes: [],
                    recordings: [],
                },
                {
                    id: "tt-11",
                    teacher: "Miss Zahra",
                    time: "9:30 pm - 10:30 pm",
                    color: "bg-green-600",
                    topic: "Mathematics Review",
                    class: "(L) 3M Year 4",
                    status: "Ended",
                    date: "20/01/2026",
                    startTime: "9:30 pm",
                    duration: "1 hr",
                    rating: 4.5,
                    ratingCount: 2,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Revision of multiplication and division concepts for Year 4.",
                    tutor: "Miss Zahra",
                    notes: [{ label: "20260120 3M Y4 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 3 mins" }],
                },
            ],
        },
        {
            day: "Wed 1/21",
            date: "21",
            lessons: [
                {
                    id: "tt-12",
                    teacher: "Teacher Diana",
                    time: "4:45 pm - 5:45 pm",
                    color: "bg-purple-600",
                    topic: "Language Studies",
                    class: "(R) Bahasa Melayu Year 2",
                    status: "Ended",
                    date: "21/01/2026",
                    startTime: "4:45 pm",
                    duration: "1 hr",
                    rating: 5.0,
                    ratingCount: 1,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Murid mempelajari kosa kata baru dan membina ayat.",
                    tutor: "Teacher Diana",
                    notes: [],
                    recordings: [{ label: "Recording 1", duration: "57 mins" }],
                },
                {
                    id: "tt-13",
                    teacher: "Teacher Farah",
                    time: "6:00 pm - 7:00 pm",
                    color: "bg-teal-600",
                    topic: "Science Lab",
                    class: "(L) Science Year 3",
                    status: "Ended",
                    date: "21/01/2026",
                    startTime: "6:00 pm",
                    duration: "1 hr",
                    rating: 4.5,
                    ratingCount: 3,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Students conduct a simple experiment to observe changes in matter.",
                    tutor: "Teacher Farah",
                    notes: [{ label: "20260121 Science Y3 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 8 mins" }],
                },
                {
                    id: "tt-14",
                    teacher: "Miss Nabilah",
                    time: "8:15 pm - 9:15 pm",
                    color: "bg-teal-600",
                    topic: "Physics Basics",
                    class: "(R) Science Year 4",
                    status: "Ended",
                    date: "21/01/2026",
                    startTime: "8:15 pm",
                    duration: "1 hr",
                    rating: 4.0,
                    ratingCount: 2,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Introduction to forces and motion for Year 4 students.",
                    tutor: "Miss Nabilah",
                    notes: [],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 1 min" }],
                },
                {
                    id: "tt-15",
                    teacher: "Miss Azizah",
                    time: "9:30 pm - 10:30 pm",
                    color: "bg-yellow-500",
                    topic: "History Lesson",
                    class: "(L) History Year 3",
                    status: "Ended",
                    date: "21/01/2026",
                    startTime: "9:30 pm",
                    duration: "1 hr",
                    rating: 5.0,
                    ratingCount: 2,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Students learn about early Malaysian civilisations and their contributions.",
                    tutor: "Miss Azizah",
                    notes: [{ label: "20260121 History Y3 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "59 mins" }],
                },
            ],
        },
        {
            day: "Thu 1/22",
            date: "22",
            lessons: [
                {
                    id: "tt-16",
                    teacher: "Miss Fadhilah",
                    time: "4:45 pm - 5:45 pm",
                    color: "bg-teal-600",
                    topic: "Every Day (Grammar Focus: Adverb)",
                    class: "(R) English Year 3",
                    status: "Ended",
                    date: "22/01/2026",
                    startTime: "4:45 pm",
                    duration: "1 hr",
                    rating: 5.0,
                    ratingCount: 1,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "1.2.2 Understand with support specific information and details of short simple texts.\n1.3.1 Guess the meaning of unfamiliar words by using visual clues.",
                    tutor: "Miss Fadhilah",
                    notes: [{ label: "20260122 English Y3 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 2 mins" }],
                },
                {
                    id: "tt-17",
                    teacher: "Miss Fatimah",
                    time: "6:00 pm - 7:00 pm",
                    color: "bg-purple-700",
                    topic: "Mathematics Drills",
                    class: "(L) 3M Year 3",
                    status: "Ended",
                    date: "22/01/2026",
                    startTime: "6:00 pm",
                    duration: "1 hr",
                    rating: 4.5,
                    ratingCount: 2,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Murid berlatih operasi darab dengan nombor hingga 100.",
                    tutor: "Miss Fatimah",
                    notes: [],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 4 mins" }],
                },
                {
                    id: "tt-18",
                    teacher: "Miss Alecya",
                    time: "8:15 pm - 9:15 pm",
                    color: "bg-teal-600",
                    topic: "Chemistry Introduction",
                    class: "(R) Science Year 4",
                    status: "Ended",
                    date: "22/01/2026",
                    startTime: "8:15 pm",
                    duration: "1 hr",
                    rating: 4.0,
                    ratingCount: 1,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Students explore basic chemistry concepts including elements and compounds.",
                    tutor: "Miss Alecya",
                    notes: [{ label: "20260122 Science Y4 - Notes" }],
                    recordings: [],
                },
                {
                    id: "tt-19",
                    teacher: "Miss Ayisy",
                    time: "9:30 pm - 10:30 pm",
                    color: "bg-teal-600",
                    topic: "Biology Basics",
                    class: "(L) Science Year 5",
                    status: "Upcoming",
                    date: "22/01/2026",
                    startTime: "9:30 pm",
                    duration: "1 hr",
                    rating: null,
                    ratingCount: 0,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Introduction to biology: cells, organisms, and life processes.",
                    tutor: "Miss Ayisy",
                    notes: [],
                    recordings: [],
                },
            ],
        },
        {
            day: "Fri 1/23",
            date: "23",
            lessons: [
                {
                    id: "tt-20",
                    teacher: "Miss Munna",
                    time: "8:15 pm - 9:15 pm",
                    color: "bg-teal-700",
                    topic: "Science Experiments",
                    class: "(R) Science Year 4",
                    status: "Ended",
                    date: "23/01/2026",
                    startTime: "8:15 pm",
                    duration: "1 hr",
                    rating: 5.0,
                    ratingCount: 3,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Students design and conduct a simple experiment to test a hypothesis.",
                    tutor: "Miss Munna",
                    notes: [{ label: "20260123 Science Y4 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 7 mins" }],
                },
                {
                    id: "tt-21",
                    teacher: "Miss Amirah",
                    time: "8:15 pm - 9:15 pm",
                    color: "bg-green-600",
                    topic: "English Reading",
                    class: "(L) English Year 3",
                    status: "Ended",
                    date: "23/01/2026",
                    startTime: "8:15 pm",
                    duration: "1 hr",
                    rating: 4.5,
                    ratingCount: 2,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Students practise reading aloud and answering comprehension questions.",
                    tutor: "Miss Amirah",
                    notes: [],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 0 mins" }],
                },
                {
                    id: "tt-22",
                    teacher: "Miss Qasrina",
                    time: "9:30 pm - 10:30 pm",
                    color: "bg-purple-600",
                    topic: "Math Problem Solving",
                    class: "(R) 3M Year 2",
                    status: "Ended",
                    date: "23/01/2026",
                    startTime: "9:30 pm",
                    duration: "1 hr",
                    rating: 5.0,
                    ratingCount: 1,
                    classSchedule: "Scheduled Class",
                    activity: "Lesson",
                    agenda: "Murid menyelesaikan masalah matematik yang melibatkan operasi asas.",
                    tutor: "Miss Qasrina",
                    notes: [{ label: "20260123 3M Y2 - Notes" }],
                    recordings: [{ label: "Recording 1", duration: "1 hr, 6 mins" }],
                },
            ],
        },
        {
            day: "Sat 1/24",
            date: "24",
            lessons: [],
        },
    ];

    const allLessons = {
        today: [
            {
                id: 1,
                classId: 3,
                subject: "English",
                type: "(R) English Year 3",
                typeColor: "text-red-500",
                title: "Every Day (Grammar Focus: Adverb)",
                date: "22/01/2026",
                time: "4:45 pm",
                duration: "1 hr",
                hasVideo: true,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "Miss Faqihah",
                classSchedule: "Scheduled Class",
                topic: "Every Day (Grammar Focus: Adverb)",
                agenda: [
                    "1.2.2 Understand with support specific information and details of short simple texts.",
                    "1.3.1 Guess the meaning of unfamiliar words by using visual clues when a teacher or classmates speaking."
                ],
                notes: "20260122 English Y3 - Notes"
            },
            {
                id: 2,
                classId: 2,
                subject: "Mathematics",
                type: "(R) 3M Year 2",
                typeColor: "text-purple-500",
                title: "Unit 3 (Mengira)",
                date: "22/01/2026",
                time: "6:00 pm",
                duration: "1 hr",
                hasVideo: true,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "Teacher Sarah",
                classSchedule: "Scheduled Class",
                topic: "Unit 3 (Mengira)",
                agenda: [
                    "Understanding basic counting concepts",
                    "Practice counting exercises"
                ],
                notes: null
            },
            {
                id: 3,
                classId: 2,
                subject: "Science",
                type: "(L) Science Year 2",
                typeColor: "text-teal-500",
                title: "Science Year 2",
                date: "22/01/2026",
                time: "8:15 pm",
                duration: "1 hr",
                hasVideo: false,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "Teacher Science",
                classSchedule: "Scheduled Class",
                topic: "Science Year 2",
                agenda: ["Introduction to basic science concepts"],
                notes: null
            },
            {
                id: 4,
                classId: 2,
                subject: "English",
                type: "(L) English Year 2",
                typeColor: "text-teal-500",
                title: "Unit 6 Free Time - Yes I do, No I don't",
                date: "22/01/2026",
                time: "9:30 pm",
                duration: "1 hr",
                hasVideo: true,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "Teacher English",
                classSchedule: "Scheduled Class",
                topic: "Unit 6 Free Time",
                agenda: ["Learning yes/no responses", "Practice conversations"],
                notes: null
            },
            {
                id: 101,
                classId: 1,
                subject: "Mathematics",
                type: "(R) Mathematics Year 1",
                typeColor: "text-blue-500",
                title: "Basic Addition",
                date: "22/01/2026",
                time: "3:00 pm",
                duration: "1 hr",
                hasVideo: true,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "Teacher Ali",
                classSchedule: "Scheduled Class",
                topic: "Basic Addition",
                agenda: ["Learn to add single digit numbers", "Practice with visual aids"],
                notes: "20260122 Math Y1 - Notes"
            },
            {
                id: 102,
                classId: 4,
                subject: "Science",
                type: "(L) Science Year 4",
                typeColor: "text-orange-500",
                title: "The Solar System",
                date: "22/01/2026",
                time: "7:00 pm",
                duration: "1 hr",
                hasVideo: true,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "Miss Astronomy",
                classSchedule: "Scheduled Class",
                topic: "The Solar System",
                agenda: ["Learn about planets", "Understanding orbits"],
                notes: null
            }
        ],
        tomorrow: [
            {
                id: 5,
                classId: 4,
                subject: "Science",
                type: "(L) Science Year 4",
                typeColor: "text-teal-500",
                title: "Science Year 4",
                date: "23/01/2026",
                time: "8:15 pm",
                duration: "1 hr",
                hasVideo: false,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "Science Teacher",
                classSchedule: "Scheduled Class",
                topic: "Science Year 4",
                agenda: ["Advanced science concepts"],
                notes: null
            },
            {
                id: 6,
                classId: 3,
                subject: "English",
                type: "(L) English Year 3",
                typeColor: "text-teal-500",
                title: "English Year 3",
                date: "23/01/2026",
                time: "8:15 pm",
                duration: "1 hr",
                hasVideo: false,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "English Teacher",
                classSchedule: "Scheduled Class",
                topic: "English Year 3",
                agenda: ["Reading comprehension exercises"],
                notes: null
            },
            {
                id: 7,
                classId: 2,
                subject: "Mathematics",
                type: "(L) 3M Year 2",
                typeColor: "text-purple-500",
                title: "3M Year 2",
                date: "23/01/2026",
                time: "9:30 pm",
                duration: "1 hr",
                hasVideo: false,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "Math Teacher",
                classSchedule: "Scheduled Class",
                topic: "3M Year 2",
                agenda: ["Mathematics practice"],
                notes: null
            },
            {
                id: 103,
                classId: 5,
                subject: "History",
                type: "(R) History Year 5",
                typeColor: "text-pink-500",
                title: "Malaysian Independence",
                date: "23/01/2026",
                time: "5:00 pm",
                duration: "1 hr",
                hasVideo: true,
                tags: ["Webinar", "Lesson", "Waiting"],
                tutor: "Teacher History",
                classSchedule: "Scheduled Class",
                topic: "Malaysian Independence",
                agenda: ["Study pre-independence events", "Key figures in independence"],
                notes: "20260123 History Y5 - Notes"
            }
        ]
    };

    const toggleLesson = (lessonId) => {
        setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
    };

    const handleClassClick = (classId) => {
        setSelectedClass(selectedClass === classId ? null : classId);
    };

    const getFilteredLessons = (lessons) => {
        if (!selectedClass) return lessons;
        return lessons.filter(lesson => lesson.classId === selectedClass);
    };

    const groupLessonsBySubject = (lessons) => {
        const grouped = {};
        lessons.forEach(lesson => {
            if (!grouped[lesson.subject]) grouped[lesson.subject] = [];
            grouped[lesson.subject].push(lesson);
        });
        return grouped;
    };

    const getPageTitle = () => {
        if (!selectedClass) return "All Lessons";
        const allClasses = [...sekolahRendah, ...sekolahMenengah];
        const selected = allClasses.find(cls => cls.id === selectedClass);
        return selected ? selected.label : "All Lessons";
    };

    const getSubjectColor = (subject) => {
        const colors = {
            'English': 'border-red-300 bg-red-50',
            'Mathematics': 'border-purple-300 bg-purple-50',
            'Science': 'border-teal-300 bg-teal-50',
            'History': 'border-pink-300 bg-pink-50',
        };
        return colors[subject] || 'border-gray-300 bg-gray-50';
    };

    const getSubjectIcon = (subject) => {
        const icons = {
            'English': '📚',
            'Mathematics': '🔢',
            'Science': '🔬',
            'History': '📜',
        };
        return icons[subject] || '📖';
    };

    // ── Lesson Detail Panel (shown when timetable card body is clicked) ──
    const LessonDetailPanel = ({ lesson, onClose }) => {
        const [showVideo, setShowVideo] = useState(false);
        const [showPdf, setShowPdf] = useState(false);

        const statusColor = lesson.status === "Ended"
            ? "bg-green-600"
            : lesson.status === "Upcoming"
                ? "bg-blue-500"
                : "bg-gray-500";

        return (
            <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
                {/* Top bar */}
                <div className="flex items-start gap-3 px-6 pt-5 pb-3 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="mt-0.5 text-gray-500 hover:text-gray-800 flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-yellow-600 font-semibold text-sm truncate">{lesson.class}</span>
                            <span className="text-gray-400">/</span>
                            <span className="font-semibold text-gray-900 text-sm">{lesson.topic}</span>
                            <span className={`text-white text-xs font-semibold px-2 py-0.5 rounded ${statusColor}`}>
                                {lesson.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                            <span>{lesson.date}, {lesson.startTime}</span>
                            <span>•</span>
                            <span>{lesson.duration}</span>
                            <span>•</span>
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            <span>•</span>
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4" />
                            </svg>
                        </div>
                        {lesson.rating !== null && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs font-semibold text-gray-700">{lesson.rating.toFixed(1)}</span>
                                <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs text-gray-500">({lesson.ratingCount} ratings)</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lesson Info */}
                <div className="px-8 py-5">
                    <h3 className="font-semibold text-gray-900 text-base mb-4">Lesson Info</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-800">Class Schedule</p>
                            <p className="text-gray-600 mt-0.5">{lesson.classSchedule}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Topic</p>
                            <p className="text-gray-600 mt-0.5">{lesson.topic}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Activity</p>
                            <p className="text-gray-600 mt-0.5">{lesson.activity}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Agenda</p>
                            <p className="text-gray-600 mt-0.5 whitespace-pre-line">{lesson.agenda}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Tutor</p>
                            <p className="text-blue-600 mt-0.5">{lesson.tutor}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 mx-8" />

                {/* Contents */}
                <div className="px-8 py-5">
                    <h3 className="font-semibold text-gray-900 text-base mb-4">Contents</h3>

                    {/* Notes */}
                    <div className="mb-5">
                        <p className="text-sm text-gray-700 mb-2">Notes ({lesson.notes.length})</p>
                        {lesson.notes.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {lesson.notes.map((note, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setShowPdf(true)}
                                        className="flex items-center gap-2 px-3 py-2 border border-blue-500 text-blue-600 rounded-lg text-sm hover:bg-blue-50 w-fit"
                                    >
                                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="2" width="14" height="18" rx="2" />
                                            <path d="M7 7h8M7 11h8M7 15h4" strokeLinecap="round" />
                                        </svg>
                                        {note.label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400">No notes available</p>
                        )}
                    </div>

                    {/* Recordings */}
                    <div>
                        <p className="text-sm text-gray-700 mb-2">Recordings ({lesson.recordings.length})</p>
                        {lesson.recordings.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {lesson.recordings.map((rec, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setShowVideo(true)}
                                        className="flex items-center gap-3 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 w-fit"
                                    >
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-sm">{rec.label}</div>
                                            <div className="text-xs text-gray-500">{rec.duration}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400">No recordings available</p>
                        )}
                    </div>
                </div>

                {/* ── PDF Fullscreen Overlay ── */}
                {showPdf && (
                    <div className="fixed inset-0 z-60 bg-black bg-opacity-80 flex flex-col">
                        <div className="flex items-center justify-between bg-gray-900 px-5 py-3 flex-shrink-0">
                            <span className="text-white font-medium text-sm">📄 Lesson Notes</span>
                            <button
                                onClick={() => setShowPdf(false)}
                                className="text-gray-300 hover:text-white p-1 rounded hover:bg-gray-700 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <iframe
                            src="/pdf/note.pdf"
                            className="flex-1 w-full"
                            title="Lesson Notes"
                        />
                    </div>
                )}

                {/* ── Video Fullscreen Overlay ── */}
                {showVideo && (
                    <div
                        className="fixed inset-0 z-60 bg-black bg-opacity-90 flex flex-col items-center justify-center"
                        onClick={() => setShowVideo(false)}
                    >
                        <div
                            className="w-full max-w-5xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between bg-gray-900 px-5 py-3 rounded-t-lg">
                                <span className="text-white font-medium text-sm">🎬 Recording</span>
                                <button
                                    onClick={() => setShowVideo(false)}
                                    className="text-gray-300 hover:text-white p-1 rounded hover:bg-gray-700 transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <video
                                src="/videos/class.mp4"
                                controls
                                autoPlay
                                className="w-full bg-black rounded-b-lg"
                                style={{ maxHeight: "80vh" }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const LessonItem = ({ lesson }) => {
        const isExpanded = expandedLesson === lesson.id;

        return (
            <div className="hover:bg-gray-50">
                <div
                    className="px-6 py-4 cursor-pointer group"
                    onClick={() => toggleLesson(lesson.id)}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`${lesson.typeColor} font-medium text-sm`}>{lesson.type}</span>
                                <span className="text-gray-400">/</span>
                                <span className="text-gray-900 font-medium text-sm">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                                <span>{lesson.date}, {lesson.time} • {lesson.duration}</span>
                                {lesson.hasVideo && (
                                    <>
                                        <span>•</span>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {lesson.tags.map((tag, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button className="text-gray-400 group-hover:text-gray-600">
                            <svg
                                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200">
                        <div className="pt-4 space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Lesson Info</h3>
                                <div className="grid grid-cols-3 gap-2 text-sm">

                                    <div>
                                        <span className="text-black font-extrabold">Class Schedule</span>
                                        <p className="text-gray-900">{lesson.classSchedule}</p>
                                    </div>

                                    <div>
                                        <span className="text-black font-extrabold">Topic</span>
                                        <p className="text-gray-900">{lesson.topic}</p>
                                    </div>

                                    <div></div> {/* empty column */}

                                    <div>
                                        <span className="text-black font-extrabold">Activity</span>
                                        <p className="text-gray-900">Lesson</p>
                                    </div>

                                    <div>
                                        <h4 className="text-black font-extrabold">Agenda</h4>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            {lesson.agenda.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div></div> {/* empty column */}

                                    <div>
                                        <span className="text-gray-600">Tutor</span>
                                        <p className="text-blue-700">{lesson.tutor}</p>
                                    </div>

                                    <div></div>
                                    <div></div>
                                </div>
                            </div>

                            <div className="border-b border-gray-300"></div>

                            {lesson.notes && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Contents</h4>
                                    <p className="text-sm text-gray-600 mb-2">Notes (1)</p>
                                    <button className="flex items-center gap-2 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="3" y="2" width="18" height="20" rx="2" />
                                            <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">PDF</text>
                                        </svg>
                                        {lesson.notes}
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-2 pt-2 justify-end">
                                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    JOIN
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    VIEW
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const LessonCard = ({ lesson }) => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <LessonItem lesson={lesson} />
        </div>
    );

    const filteredTodayLessons = getFilteredLessons(allLessons.today);
    const filteredTomorrowLessons = getFilteredLessons(allLessons.tomorrow);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-52 bg-indigo-600 text-white flex flex-col">
                <div className="p-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-indigo-900 font-bold text-sm">XL</span>
                    </div>
                    <div>
                        <div className="font-bold text-sm">xcelearn</div>
                        <div className="text-xs opacity-80">Student Room</div>
                    </div>
                </div>

                <div className="px-4 py-3 flex items-center justify-between bg-indigo-600">
                    <span className="text-sm font-semibold">Your Classes</span>
                    <div className="flex gap-1">
                        <button className="p-1 hover:bg-indigo-700 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <button className="p-1 hover:bg-indigo-700 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="px-4 py-2 text-xs font-semibold opacity-90">
                    2026/2027 Session
                </div>

                <nav className="flex-1 overflow-y-auto">
                    <div className="mb-2">
                        <button
                            onClick={() => setSekolahRendahOpen(!sekolahRendahOpen)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-indigo-700 text-left bg-indigo-700"
                        >
                            <span className="text-sm font-semibold">Sekolah Rendah</span>
                            <svg className={`w-4 h-4 transition-transform ${sekolahRendahOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {sekolahRendahOpen && (
                            <div className="bg-indigo-800 bg-opacity-50">
                                {sekolahRendah.map((cls) => (
                                    <button
                                        key={cls.id}
                                        onClick={() => handleClassClick(cls.id)}
                                        className={`w-full px-4 py-2 flex items-center gap-3 text-left transition-colors relative ${selectedClass === cls.id
                                            ? 'bg-white bg-opacity-15 border-l-4 border-yellow-300 pl-3'
                                            : 'hover:bg-indigo-700 border-l-4 border-transparent pl-3'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 ${cls.color} rounded flex items-center justify-center text-sm flex-shrink-0 ${selectedClass === cls.id ? 'ring-2 ring-yellow-300 ring-offset-1 ring-offset-indigo-800' : ''}`}>{cls.icon}</div>
                                        <span className={`text-sm ${selectedClass === cls.id ? 'font-bold text-yellow-200' : 'text-white'}`}>{cls.label}</span>
                                        {selectedClass === cls.id && (
                                            <span className="ml-auto w-2 h-2 rounded-full bg-yellow-300 flex-shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            onClick={() => setSekolahMenengahOpen(!sekolahMenengahOpen)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-indigo-700 text-left bg-indigo-700"
                        >
                            <span className="text-sm font-semibold">Sekolah Menengah</span>
                            <svg className={`w-4 h-4 transition-transform ${sekolahMenengahOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {sekolahMenengahOpen && (
                            <div className="bg-indigo-800 bg-opacity-50">
                                {sekolahMenengah.map((cls) => (
                                    <button
                                        key={cls.id}
                                        onClick={() => handleClassClick(cls.id)}
                                        className={`w-full px-4 py-2 flex items-center gap-3 text-left transition-colors relative ${selectedClass === cls.id
                                            ? 'bg-white bg-opacity-15 border-l-4 border-yellow-300 pl-3'
                                            : 'hover:bg-indigo-700 border-l-4 border-transparent pl-3'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 ${cls.color} rounded flex items-center justify-center text-sm flex-shrink-0 ${selectedClass === cls.id ? 'ring-2 ring-yellow-300 ring-offset-1 ring-offset-indigo-800' : ''}`}>{cls.icon}</div>
                                        <span className={`text-sm ${selectedClass === cls.id ? 'font-bold text-yellow-200' : 'text-white'}`}>{cls.label}</span>
                                        {selectedClass === cls.id && (
                                            <span className="ml-auto w-2 h-2 rounded-full bg-yellow-300 flex-shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm px-6 py-2 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded relative">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full"></span>
                        </button>
                        <button className="w-10 h-10 bg-green-500 text-white rounded-full font-bold flex items-center justify-center">M</button>
                    </div>
                </header>

                {/* Content area — relative so panel can overlay it */}
                <main className="flex-1 overflow-y-auto p-6 relative">
                    {/* Lesson Detail Panel overlay */}
                    {lessonPanel && (
                        <LessonDetailPanel
                            lesson={lessonPanel}
                            onClose={() => setLessonPanel(null)}
                        />
                    )}

                    <div className="bg-blue-50 border border-blue-300 text-blue-700 p-3 rounded mb-3 text-sm flex items-start gap-2">
                        <span className="text-blue-500">ℹ️</span>
                        <div className="flex-1">
                            <strong>Recommended: Install Zoom for Mobile Users (Optional for Desktop).</strong> If you already have Zoom installed, you can ignore this message.
                            <button className="ml-2 text-blue-600 underline">More</button>
                        </div>
                        <button className="text-blue-700 hover:text-blue-900">✕</button>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">Sample Timetable</h2>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-gray-600">Jan 18 – 24, 2026</p>
                            <div className="flex items-center">
                                <button onClick={() => setSelectedWeek('today')} className={`px-4 py-1.5 text-sm rounded-l-full ${selectedWeek === 'today' ? 'bg-gray-300 text-gray-900' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Today</button>
                                <button onClick={() => setSelectedWeek('week')} className={`px-4 py-1.5 text-sm ${selectedWeek === 'week' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Week</button>
                                <button onClick={() => setSelectedWeek('list')} className={`px-4 py-1.5 text-sm rounded-r-full ${selectedWeek === 'list' ? 'bg-gray-300 text-gray-900' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>List</button>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Timetable grid */}
                    <div className="bg-white rounded shadow overflow-hidden">
                        <div className="grid grid-cols-7 border-b">
                            {timetable.map((day, idx) => (
                                <div key={idx} className="border-r last:border-r-0">
                                    <div className="bg-gray-50 p-3 text-center border-b">
                                        <div className="text-xs text-black font-medium">{day.day}</div>
                                    </div>
                                    <div className="p-1 min-h-96 space-y-2">
                                        {day.lessons.length > 0 ? (
                                            day.lessons.map((lesson, i) => {
                                                const isExpanded = expandedTimetableLesson === lesson.id;
                                                return (
                                                    <div key={i}>
                                                        {/* Card body — click opens detail panel */}
                                                        <div
                                                            className={`${lesson.color} text-white rounded p-2 text-xs cursor-pointer hover:opacity-90 transition select-none`}
                                                            onClick={() => setLessonPanel(lesson)}
                                                        >
                                                            <div className="font-semibold mb-1 flex items-center justify-between">
                                                                <span>{lesson.teacher}</span>
                                                                {/* Chevron — click toggles dropdown only */}
                                                                <button
                                                                    className="ml-1 p-0.5 hover:bg-white hover:bg-opacity-20 rounded"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedTimetableLesson(isExpanded ? null : lesson.id);
                                                                    }}
                                                                >
                                                                    <svg
                                                                        className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="text-xs opacity-90 flex items-center gap-1">
                                                                <span>{lesson.time}</span>
                                                                <span className="text-[10px]">⏰</span>
                                                            </div>
                                                        </div>

                                                        {/* Dropdown detail */}
                                                        {isExpanded && (
                                                            <div className="mt-1 bg-white rounded p-2 text-xs border border-gray-200 shadow-sm">
                                                                <div className="space-y-1">
                                                                    <div>
                                                                        <span className="font-semibold text-gray-700">Topic:</span>
                                                                        <p className="text-gray-900">{lesson.topic}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-semibold text-gray-700">Class:</span>
                                                                        <p className="text-gray-900">{lesson.class}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="h-full flex items-center justify-center">
                                                <p className="text-gray-400 text-xs">No lessons</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-800 mt-5">Demo {getPageTitle()}</h2>
                    <div className="flex items-center gap-4 border-b">
                        <button className="px-4 py-3 text-teal-600 border-b-2 border-teal-600 font-medium text-sm">Upcoming</button>
                        <button className="px-4 py-3 text-gray-600 hover:text-gray-900 text-sm">Previous</button>
                        <button className="px-4 py-3 text-gray-600 hover:text-gray-900 text-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>

                    <div className="px-6 py-4 flex justify-center">
                        <button className="px-6 py-2 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300">Today</button>
                    </div>

                    <div className="space-y-4">
                        {filteredTodayLessons.length > 0 ? (
                            filteredTodayLessons.map((lesson) => (
                                <LessonCard key={lesson.id} lesson={lesson} />
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">No lessons found for this class today</div>
                        )}
                    </div>

                    <div className="px-6 py-4 flex justify-center">
                        <button className="px-6 py-2 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300">Tomorrow</button>
                    </div>

                    <div className="space-y-4">
                        {filteredTomorrowLessons.length > 0 ? (
                            filteredTomorrowLessons.map((lesson) => (
                                <LessonCard key={lesson.id} lesson={lesson} />
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">No lessons found for this class tomorrow</div>
                        )}
                    </div>
                </main>
            </div>

            {/* ── Back Button Feedback Modal ── */}
            {showFeedback && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={(e) => { if (e.target === e.currentTarget) dismissFeedback(); }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden">
                        {feedbackSubmitted ? (
                            <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
                                <p className="text-gray-500 text-sm">Your feedback helps us improve XceLearn.</p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="bg-indigo-600 px-6 py-5 flex items-start justify-between">
                                    <div>
                                        <h2 className="text-white font-bold text-lg">Maklum Balas Pengguna</h2>
                                        <p className="text-indigo-200 text-sm mt-0.5">Kami menghargai maklum balas anda mengenai Xcelearn</p>
                                    </div>
                                    <button onClick={dismissFeedback} className="text-indigo-200 hover:text-white mt-0.5 flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="px-6 py-5 space-y-5">
                                    {/* Star Rating */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Bagaimanakah pengalaman anda menggunakan Xcelearn?</p>
                                        <div className="flex gap-1 items-center justify-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setFeedbackRating(star)}
                                                    onMouseEnter={() => setFeedbackHover(star)}
                                                    onMouseLeave={() => setFeedbackHover(0)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    <svg
                                                        className={`w-9 h-9 transition-colors ${(feedbackHover || feedbackRating) >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                                        fill="currentColor" viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            ))}
                                            {feedbackRating > 0 && (
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][feedbackRating]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Category chips */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Maklum balas anda berkaitan:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Pembelajaran', 'Jadual kelas', 'Antara muka sistem', 'Prestasi sistem', 'Lain-lain'].map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setFeedbackCategory(feedbackCategory === cat ? '' : cat)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                                        feedbackCategory === cat
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Text area */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            Ada Komen Tambahan? <span className="font-normal text-gray-400">(optional)</span>
                                        </p>
                                        <textarea
                                            value={feedbackText}
                                            onChange={(e) => setFeedbackText(e.target.value)}
                                            placeholder="Kongsikan pendapat atau cadangan "
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
                                        />
                                    </div>

                                    {/* Contact preference */}
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        {/* Toggle row */}
                                        <button
                                            onClick={() => setWantsContact(!wantsContact)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 text-left">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">Boleh kami hubungi anda?</p>
                                                    <p className="text-xs text-gray-500">Kami akan menghubungi anda jika berminat untuk mengetahui lebih lanjut</p>
                                                </div>
                                            </div>
                                            {/* Pill toggle */}
                                            <div className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${wantsContact ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${wantsContact ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                        </button>

                                        {/* Expanded phone options */}
                                        {wantsContact && (
                                            <div className="px-4 py-4 space-y-3 border-t border-gray-200 bg-white">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pilih nombor telefon</p>

                                                {/* Option: current number */}
                                                <button
                                                    onClick={() => setContactOption('current')}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-colors ${
                                                        contactOption === 'current'
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                        contactOption === 'current' ? 'border-indigo-600' : 'border-gray-400'
                                                    }`}>
                                                        {contactOption === 'current' && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                                    </div>
                                                    <div className="text-left flex-1">
                                                        <p className="text-xs text-gray-500">Nombor semasa</p>
                                                        <p className="text-sm font-semibold text-gray-800">{currentPhone}</p>
                                                    </div>
                                                    <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Aktif</span>
                                                </button>

                                                {/* Option: other number */}
                                                <button
                                                    onClick={() => setContactOption('other')}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-colors ${
                                                        contactOption === 'other'
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                        contactOption === 'other' ? 'border-indigo-600' : 'border-gray-400'
                                                    }`}>
                                                        {contactOption === 'other' && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                                    </div>
                                                    <p className={`text-sm font-medium flex-1 text-left ${contactOption === 'other' ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                        Gunakan nombor lain
                                                    </p>
                                                </button>

                                                {/* Custom number input */}
                                                {contactOption === 'other' && (
                                                    <div className="flex items-center gap-2 pl-1">
                                                        <span className="text-sm text-gray-500 flex-shrink-0">+60</span>
                                                        <input
                                                            type="tel"
                                                            value={otherPhone}
                                                            onChange={(e) => setOtherPhone(e.target.value.replace(/[^0-9\s\-]/g, ''))}
                                                            placeholder="12-345 6789"
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 pb-5 flex gap-3">
                                    <button
                                        onClick={dismissFeedback}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Abaikan
                                    </button>
                                    <button
                                        onClick={handleFeedbackSubmit}
                                        disabled={feedbackRating === 0}
                                        className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                                            feedbackRating > 0
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Hantar Maklum Balas
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}