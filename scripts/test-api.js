const https = require('https');
const fs = require('fs');
const path = require('path');

const configPath = '/root/travel-agency/data/api-config.json';

let config = {};
if (fs.existsSync(configPath)) {
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('Config loaded: OK');
    console.log('  agencyId:', config.agencyId || '(empty)');
    console.log('  domainId:', config.domainId || '(empty)');
  } catch (e) {
    console.error('Config parse error:', e.message);
  }
} else {
  console.log('No api-config.json found — using defaults');
}

const agencyId = config.agencyId || '';
const domainId = config.domainId || '';

const params = new URLSearchParams({ fmt: 'json', lm: '1' });
if (agencyId) params.set('a', agencyId);
if (domainId) params.set('d', domainId);

const url = `https://crm.tat.ua/tf/tourscanner?${params.toString()}`;
console.log('\nTarget URL:', url);

const options = {
  timeout: 8000,
  headers: { 'User-Agent': 'TravelAgencyDiagnostic/1.0' }
};

const req = https.get(url, options, (res) => {
  const status = res.statusCode;
  let body = '';

  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('\nHTTP Status:', status);
    console.log('Response (first 500 chars):', body.substring(0, 500));

    if (status === 401 || body.includes('invalid') || body.includes('unauthorized') || body.includes('Unauthorized')) {
      console.log('\nSTATUS: API FAILED — REASON: Invalid token / unauthorized');
    } else if (status === 403) {
      console.log('\nSTATUS: API FAILED — REASON: Access forbidden');
    } else if (status >= 200 && status < 300) {
      console.log('\nSTATUS: API OK');
    } else {
      console.log(`\nSTATUS: API FAILED — REASON: HTTP ${status}`);
    }
  });
});

req.on('timeout', () => {
  req.destroy();
  console.log('\nSTATUS: API FAILED — REASON: Request timeout (>8s)');
  process.exit(1);
});

req.on('error', (err) => {
  if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
    console.log('\nSTATUS: API FAILED — REASON: DNS failure —', err.message);
  } else if (err.code === 'ECONNREFUSED') {
    console.log('\nSTATUS: API FAILED — REASON: Connection refused —', err.message);
  } else if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
    console.log('\nSTATUS: API FAILED — REASON: Network timeout —', err.message);
  } else {
    console.log('\nSTATUS: API FAILED — REASON: Network error —', err.message);
  }
  process.exit(1);
});
