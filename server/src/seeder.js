import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Course from './models/Course.js';

dotenv.config();

connectDB();

const sampleCourses = [
    {
        title: 'Finding Inner Peace',
        price: 49,
        rating: 4.9,
        numReviews: 120,
        description: 'A simple, effective course to calm your mind and reduce daily anxiety.',
        benefits: ['Grounding techniques', 'Setting boundaries', 'Morning rules'],
    },
    {
        title: 'The Habit Builder',
        price: 39,
        rating: 4.8,
        numReviews: 85,
        description: 'Learn the core principles of building life-changing habits that actually stick.',
        benefits: ['Habit stacking', 'Identity change', 'Consistency tracking'],
    },
    {
        title: 'Overcoming Burnout',
        price: 59,
        rating: 5.0,
        numReviews: 210,
        description: 'A practical roadmap to recovery from chronic stress and occupational burnout.',
        benefits: ['Energy management', 'Stress cycles', 'Re-alignment'],
    },
    {
        title: 'Mindful Productivity',
        price: 45,
        rating: 4.7,
        numReviews: 64,
        description: 'Achieve more by doing less. Focus on what truly matters without the hustle.',
        benefits: ['Deep work', 'Time blocking', 'Digital detox'],
    },
    {
        title: 'Healing Emotional Wounds',
        price: 65,
        rating: 4.9,
        numReviews: 155,
        description: 'Deep guided healing exercises to process past trauma and move forward.',
        benefits: ['Inner child work', 'Forgiveness', 'Grief processing'],
    },
    {
        title: 'The Confidence Blueprint',
        price: 50,
        rating: 4.8,
        numReviews: 92,
        description: 'Rewire your self-belief and step out of your comfort zone with confidence.',
        benefits: ['Imposter syndrome', 'Public speaking', 'Self-worth'],
    }
];

const importData = async () => {
    try {
        await Course.deleteMany(); // Clear existing

        await Course.insertMany(sampleCourses);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
