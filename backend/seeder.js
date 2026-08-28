const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('./models/Role');
const User = require('./models/User');
const Department = require('./models/Department');
const Programme = require('./models/Programme');
const Block = require('./models/Block');
const Room = require('./models/Room');
const Complaint = require('./models/Complaint');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // 1. Seed Roles
        console.log('Seeding roles...');
        const roleNames = [
            'SuperAdmin',
            'User',
            'Networking Staff',
            'Plumber',
            'Electrician',
            'Software Developer',
            'Student',
            'Teacher'
        ];
        const roles = {};
        for (const name of roleNames) {
            roles[name] = await Role.findOneAndUpdate(
                { name },
                { name },
                { upsert: true, new: true }
            );
        }
        console.log('Roles seeded successfully');

        // 2. Seed Departments
        console.log('Seeding departments...');
        const departmentsToSeed = [
            { name: 'Computer Science', shortName: 'CS' },
            { name: 'Electrical Engineering', shortName: 'EE' },
            { name: 'Computer Applicants', shortName: 'CA' }
        ];
        const depts = {};
        for (const deptData of departmentsToSeed) {
            depts[deptData.shortName] = await Department.findOneAndUpdate(
                { name: deptData.name },
                deptData,
                { upsert: true, new: true }
            );
        }
        console.log('Departments seeded successfully');

        // 3. Seed Programmes
        console.log('Seeding programmes...');
        const programmesToSeed = [
            { name: 'B.Tech Computer Science', shortName: 'BTech CS', deptShort: 'CS' },
            { name: 'Mca', shortName: 'MCA', deptShort: 'CA' }
        ];
        const programmes = {};
        for (const progData of programmesToSeed) {
            const department = depts[progData.deptShort]._id;
            programmes[progData.shortName] = await Programme.findOneAndUpdate(
                { name: progData.name },
                { name: progData.name, shortName: progData.shortName, department },
                { upsert: true, new: true }
            );
        }
        console.log('Programmes seeded successfully');

        // 4. Seed Blocks
        console.log('Seeding blocks...');
        const blocksToSeed = [
            { name: 'Block A', deptShort: 'CS', progShort: 'BTech CS' },
            { name: 'Block A', deptShort: 'CA', progShort: 'MCA' },
            { name: 'Block B', deptShort: 'CA', progShort: 'MCA' },
            { name: 'Main Block', deptShort: 'CA', progShort: 'MCA' }
        ];
        const blocks = {};
        for (const blockData of blocksToSeed) {
            const department = depts[blockData.deptShort]._id;
            const programme = programmes[blockData.progShort]._id;
            let block = await Block.findOne({ name: blockData.name, department, programme });
            if (!block) {
                block = await Block.create({ name: blockData.name, department, programme });
            }
            const key = `${blockData.name}_${blockData.deptShort}`;
            blocks[key] = block;
        }
        console.log('Blocks seeded successfully');

        // 5. Seed Rooms
        console.log('Seeding rooms...');
        const roomsToSeed = [
            { roomNumber: '101', blockKey: 'Block A_CS', deptShort: 'CS', progShort: 'BTech CS' },
            { roomNumber: '102', blockKey: 'Block A_CS', deptShort: 'CS', progShort: 'BTech CS' },
            // CA Block A rooms
            { roomNumber: 'A-101', blockKey: 'Block A_CA', deptShort: 'CA', progShort: 'MCA' },
            { roomNumber: 'A-102', blockKey: 'Block A_CA', deptShort: 'CA', progShort: 'MCA' },
            { roomNumber: 'A-103', blockKey: 'Block A_CA', deptShort: 'CA', progShort: 'MCA' },
            // CA Block B rooms
            { roomNumber: 'B-101', blockKey: 'Block B_CA', deptShort: 'CA', progShort: 'MCA' },
            { roomNumber: 'B-102', blockKey: 'Block B_CA', deptShort: 'CA', progShort: 'MCA' },
            { roomNumber: 'B-103', blockKey: 'Block B_CA', deptShort: 'CA', progShort: 'MCA' },
            // CA Main Block rooms
            { roomNumber: 'M-101', blockKey: 'Main Block_CA', deptShort: 'CA', progShort: 'MCA' },
            { roomNumber: 'M-102', blockKey: 'Main Block_CA', deptShort: 'CA', progShort: 'MCA' },
            { roomNumber: 'M-103', blockKey: 'Main Block_CA', deptShort: 'CA', progShort: 'MCA' }
        ];
        const rooms = {};
        for (const roomData of roomsToSeed) {
            const block = blocks[roomData.blockKey]._id;
            const department = depts[roomData.deptShort]._id;
            const programme = programmes[roomData.progShort]._id;
            let room = await Room.findOne({ roomNumber: roomData.roomNumber, block });
            if (!room) {
                room = await Room.create({
                    roomNumber: roomData.roomNumber,
                    block,
                    department,
                    programme
                });
            }
            rooms[roomData.roomNumber] = room;
        }
        console.log('Rooms seeded successfully');

        // 6. Seed Users
        console.log('Seeding users...');
        const usersToSeed = [
            {
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'password123',
                phone: '1234567890',
                roleKey: 'SuperAdmin'
            },
            {
                name: 'Hari Babu',
                email: 'haribabu@example.com',
                password: 'password123',
                phone: '9876543210',
                roleKey: 'User'
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890',
                roleKey: 'Student',
                deptShort: 'CS',
                progShort: 'BTech CS'
            },
            {
                name: 'Jane Smith',
                email: 'smith@example.com',
                password: 'password123',
                phone: '0987654321',
                roleKey: 'Teacher',
                deptShort: 'CS',
                progShort: 'BTech CS'
            },
            {
                name: 'Alice Student',
                email: 'alice@example.com',
                password: 'password123',
                phone: '1112223330',
                roleKey: 'User',
                deptShort: 'CA',
                progShort: 'MCA'
            },
            {
                name: 'Bob Staff (Network)',
                email: 'bob_network@example.com',
                password: 'password123',
                phone: '1112223331',
                roleKey: 'Networking Staff',
                deptShort: 'CA',
                progShort: 'MCA'
            },
            {
                name: 'Charlie Staff (Plumber)',
                email: 'charlie_plumber@example.com',
                password: 'password123',
                phone: '1112223332',
                roleKey: 'Plumber',
                deptShort: 'CA',
                progShort: 'MCA'
            }
        ];
        const seededUsers = {};
        for (const userData of usersToSeed) {
            const roleId = roles[userData.roleKey]._id;
            const userPayload = {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                role: roleId,
                department: userData.deptShort ? depts[userData.deptShort]._id : undefined,
                programme: userData.progShort ? programmes[userData.progShort]._id : undefined
            };

            let user = await User.findOne({ email: userData.email });
            if (!user) {
                user = await User.create(userPayload);
                console.log(`User created: ${userData.email}`);
            } else {
                user.name = userPayload.name;
                user.password = userPayload.password;
                user.phone = userPayload.phone;
                user.role = userPayload.role;
                if (userPayload.department) user.department = userPayload.department;
                if (userPayload.programme) user.programme = userPayload.programme;
                await user.save();
                console.log(`User updated: ${userData.email}`);
            }
            seededUsers[userData.email] = user;
        }
        console.log('Users seeded successfully');

        // 7. Seed Complaints
        console.log('Seeding complaints...');
        const complaintsToSeed = [
            {
                blockKey: 'Block A_CA',
                roomNumber: 'A-101',
                type: 'Network',
                remarks: 'Wi-Fi is not working in this room.',
                raisedByEmail: 'alice@example.com',
                status: 'Pending'
            },
            {
                blockKey: 'Block B_CA',
                roomNumber: 'B-101',
                type: 'Plumbing',
                remarks: 'Water leakage from the AC.',
                raisedByEmail: 'alice@example.com',
                status: 'Assigned',
                assignedToEmail: 'charlie_plumber@example.com'
            },
            {
                blockKey: 'Main Block_CA',
                roomNumber: 'M-101',
                type: 'PC Hardware',
                remarks: 'Monitor is flickering.',
                raisedByEmail: 'alice@example.com',
                status: 'In-Progress'
            },
            {
                blockKey: 'Block A_CA',
                roomNumber: 'A-102',
                type: 'Application Issues',
                remarks: 'Unable to login to the portal.',
                raisedByEmail: 'alice@example.com',
                status: 'Completed'
            }
        ];

        for (const cData of complaintsToSeed) {
            const block = blocks[cData.blockKey]._id;
            const room = rooms[cData.roomNumber]._id;
            const raisedBy = seededUsers[cData.raisedByEmail]._id;
            const assignedTo = cData.assignedToEmail ? seededUsers[cData.assignedToEmail]._id : undefined;

            const payload = {
                block,
                room,
                type: cData.type,
                remarks: cData.remarks,
                raisedBy,
                status: cData.status,
                assignedTo
            };

            const exists = await Complaint.findOne({ remarks: cData.remarks });
            if (!exists) {
                await Complaint.create(payload);
                console.log(`Complaint created: ${cData.remarks}`);
            } else {
                exists.block = payload.block;
                exists.room = payload.room;
                exists.type = payload.type;
                exists.raisedBy = payload.raisedBy;
                exists.status = payload.status;
                if (payload.assignedTo) exists.assignedTo = payload.assignedTo;
                await exists.save();
                console.log(`Complaint updated: ${cData.remarks}`);
            }
        }
        console.log('Complaints seeded successfully');

        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
