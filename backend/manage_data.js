const baseURL = 'http://localhost:5000/api';
const credentials = {
    email: 'admintms@gmail.com',
    password: 'password123'
};

const run = async () => {
    try {
        console.log('Logging in...');
        const authRes = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const auth = await authRes.json();
        const token = auth.token;
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        console.log('Fetching departments...');
        const deptsRes = await fetch(`${baseURL}/master/departments`, { headers });
        const depts = await deptsRes.json();
        
        // Remove "mkm" or empty departments
        for (const dept of depts) {
            const name = dept.name || '';
            if (name.toLowerCase().includes('mkm') || !name.trim()) {
                console.log(`Deleting department: ${name} (${dept._id})`);
                await fetch(`${baseURL}/master/departments/${dept._id}`, { method: 'DELETE', headers });
            }
        }

        // Add "Computer Applicants"
        let existingCA = depts.find(d => (d.name || '').includes('Computer Applicants'));
        let caId;
        if (!existingCA) {
            console.log('Adding "Computer Applicants" department...');
            const newCARes = await fetch(`${baseURL}/master/departments`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: 'Computer Applicants' })
            });
            const newCA = await newCARes.json();
            caId = newCA._id;
        } else {
            caId = existingCA._id;
        }

        // Add "Mca" Programme
        console.log('Fetching programmes...');
        const progsRes = await fetch(`${baseURL}/master/programmes`, { headers });
        const progs = await progsRes.json();
        const existingMCA = progs.find(p => (p.name || '').includes('Mca'));
        if (!existingMCA) {
            console.log('Adding "Mca" programme...');
            await fetch(`${baseURL}/master/programmes`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: 'Mca', department: caId })
            });
        }

        console.log('Data management complete.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

run();
