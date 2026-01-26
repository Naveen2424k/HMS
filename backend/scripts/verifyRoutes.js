const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Admin Credentials (created in previous step)
const ADMIN_USER = {
    email: 'admin@hospital.com',
    password: 'admin123'
};

const testRoutes = async () => {
    console.log('🏥 Starting System Route Verification...\n');

    try {
        // 1. Authenticate
        console.log('🔐 1. Testing Authentication...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, ADMIN_USER);
        const token = loginRes.data.token;
        console.log('   ✅ Validated: Login successful');
        console.log('   ✅ Validated: Token generated\n');

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Test Doctor Routes
        console.log('👨‍⚕️ 2. Testing Doctor Routes...');
        try {
            const docRes = await axios.get(`${API_URL}/doctors`, config); // Public route usually, but checking connectivity
            console.log(`   ✅ Validated: GET /api/doctors (Status: ${docRes.status})`);
        } catch (err) {
            console.error(`   ❌ Failed: GET /api/doctors - ${err.message}`);
        }

        // 3. Test Patient Routes
        console.log('🤒 3. Testing Patient Routes...');
        try {
            const patRes = await axios.get(`${API_URL}/patients`, config);
            console.log(`   ✅ Validated: GET /api/patients (Status: ${patRes.status})`);
        } catch (err) {
            console.error(`   ❌ Failed: GET /api/patients - ${err.message}`);
        }

        // 4. Test Appointment Routes
        console.log('📅 4. Testing Appointment Routes...');
        try {
            const appRes = await axios.get(`${API_URL}/appointments`, config);
            console.log(`   ✅ Validated: GET /api/appointments (Status: ${appRes.status})`);
        } catch (err) {
            console.error(`   ❌ Failed: GET /api/appointments - ${err.message}`);
        }

        // 5. Test Billing Routes
        console.log('💰 5. Testing Billing Routes...');
        try {
            const billRes = await axios.get(`${API_URL}/billing`, config);
            console.log(`   ✅ Validated: GET /api/billing (Status: ${billRes.status})`);
        } catch (err) {
            console.error(`   ❌ Failed: GET /api/billing - ${err.message}`);
        }

        console.log('\n✨ Route Verification Complete.');

    } catch (error) {
        console.error('\n❌ CRITICAL: Login Failed. Cannot test protected routes.');
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

testRoutes();
