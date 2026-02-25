const fs = require('fs');
const path = require('path');

const filePath = path.join('/root/travel-agency/data', 'config-test.json');

const testData = {
  testKey: 'hello-world',
  number: 42,
  nested: { valid: true, timestamp: Date.now() },
  array: [1, 2, 3]
};

try {
  // Write
  fs.writeFileSync(filePath, JSON.stringify(testData, null, 2), 'utf8');
  console.log('Write: OK');

  // Read back
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  console.log('Read: OK');

  // Validate
  let allMatch = true;
  if (parsed.testKey !== testData.testKey) { console.error('MISMATCH: testKey'); allMatch = false; }
  if (parsed.number !== testData.number)   { console.error('MISMATCH: number'); allMatch = false; }
  if (parsed.nested.valid !== testData.nested.valid) { console.error('MISMATCH: nested.valid'); allMatch = false; }
  if (JSON.stringify(parsed.array) !== JSON.stringify(testData.array)) { console.error('MISMATCH: array'); allMatch = false; }

  if (allMatch) {
    console.log('Validation: PASSED');
    console.log('STATUS: CONFIG WRITE OK');
  } else {
    console.log('STATUS: CONFIG WRITE FAILED — value mismatch');
    process.exit(1);
  }
} catch (err) {
  console.error('ERROR:', err.message);
  console.log('STATUS: CONFIG WRITE FAILED');
  process.exit(1);
}
