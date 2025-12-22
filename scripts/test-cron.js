const https = require('https');

// Configuration
const CRON_SECRET = "88d7e18a10e7c9d9b2cc57647bd505aa4d708754a0c333c5df39a2bb358601dd";
// Default to production, but allow overriding via command line arg (e.g., http://localhost:3000)
const BASE_URL = process.argv[2] || "https://explorerxandeum.vercel.app";
const ENDPOINT = "/api/cron/collect-snapshot";

console.log(`\n🚀 Testing Cron Job...`);
console.log(`Target: ${BASE_URL}${ENDPOINT}`);
console.log(`Time: ${new Date().toISOString()}`);

const url = new URL(ENDPOINT, BASE_URL);

const options = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json'
    }
};

const req = (url.protocol === 'https:' ? require('https') : require('http')).request(url, options, (res) => {
    let data = '';

    console.log(`\nSTATUS: ${res.statusCode} ${res.statusMessage}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('\nRESPONSE DATA:');
            console.log(JSON.stringify(json, null, 2));

            if (res.statusCode >= 200 && res.statusCode < 300 && json.success) {
                console.log('\n✅ TEST PASSED: Cron job executed successfully!');
            } else {
                console.log('\n❌ TEST FAILED: Cron job returned error or failure status.');
            }
        } catch (e) {
            console.log('\nRESPONSE TEXT (Not JSON):');
            console.log(data);
            console.log('\n❌ TEST FAILED: Invalid JSON response.');
        }
    });
});

req.on('error', (e) => {
    console.error(`\n❌ REQUEST ERROR: ${e.message}`);
});

req.end();
