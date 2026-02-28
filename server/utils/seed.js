/**
 * Seed script to populate the DB with a sample contest and problems.
 * Run: node utils/seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Contest } from '../models/Contest.js';
import { Problem } from '../models/Problem.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/debugx';

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear old data
        await Contest.deleteMany({});
        await Problem.deleteMany({});
        console.log('Cleared old contest and problem data');

        // Create a contest that starts now and lasts 2 hours
        const now = new Date();
        const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

        const contest = await Contest.create({
            title: 'DebugX Launch Contest #1',
            startTime: now,
            endTime: endTime,
            status: 'live',
        });
        console.log(`Created contest: ${contest.title} (ID: ${contest._id})`);

        // Create sample problems
        const problems = [
            {
                title: 'Two Sum',
                description: 'Given an array of integers and a target sum, find two numbers that add up to the target.\n\nReturn the two numbers separated by a space.',
                inputFormat: 'First line: N (number of elements)\nSecond line: N space-separated integers\nThird line: Target sum',
                outputFormat: 'Two space-separated integers that add up to target',
                testCases: [
                    { input: '4\n2 7 11 15\n9', output: '2 7', isHidden: false },
                    { input: '3\n3 2 4\n6', output: '2 4', isHidden: false },
                    { input: '5\n1 5 3 8 2\n10', output: '2 8', isHidden: true },
                ],
                timeLimit: 2000,
                contestId: contest._id,
            },
            {
                title: 'Reverse String',
                description: 'Given a string, return it reversed.',
                inputFormat: 'A single string on one line',
                outputFormat: 'The reversed string',
                testCases: [
                    { input: 'hello', output: 'olleh', isHidden: false },
                    { input: 'DebugX', output: 'XgubeD', isHidden: false },
                    { input: 'racecar', output: 'racecar', isHidden: true },
                ],
                timeLimit: 1000,
                contestId: contest._id,
            },
            {
                title: 'FizzBuzz',
                description: 'Print numbers from 1 to N. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz".',
                inputFormat: 'A single integer N',
                outputFormat: 'N lines of output',
                testCases: [
                    { input: '5', output: '1\n2\nFizz\n4\nBuzz', isHidden: false },
                    { input: '15', output: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', isHidden: true },
                ],
                timeLimit: 1000,
                contestId: contest._id,
            },
        ];

        for (const prob of problems) {
            const created = await Problem.create(prob);
            console.log(`  Created problem: ${created.title}`);
        }

        console.log('\n✅ Seed complete! Contest and problems are ready.');
        console.log(`\nContest ID: ${contest._id}`);
        console.log(`Use this ID to test the frontend.`);

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
}

seed();
