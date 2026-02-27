import fetch from 'node-fetch';

async function testApi() {
    try {
        const res = await fetch('http://127.0.0.1:3001/api/reports');
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}

testApi();
