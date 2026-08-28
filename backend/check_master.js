const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('./models/Department');
const Programme = require('./models/Programme');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const depts = await Department.find({});
        const progs = await Programme.find({});
        console.log('--- DEPARTMENTS ---');
        console.log(JSON.stringify(depts, null, 2));
        console.log('--- PROGRAMMES ---');
        console.log(JSON.stringify(progs, null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();