const bcrypt = require('bcrypt');

async function testPasswordValidation() {
  const storedHash = '$2b$10$jGBX9.fULjkPfE6KJfGxpue8KlZwVnYmhZMqd1VDvATD0XRCKvKxy'; // Example hash
  const password = 'admin123';
  
  // This is just a test - let's hash the password fresh
  const freshHash = await bcrypt.hash(password, 10);
  console.log('Fresh hash:', freshHash);
  
  // Test if it matches
  const matches = await bcrypt.compare(password, freshHash);
  console.log('Fresh hash matches:', matches);
}

testPasswordValidation().catch(console.error);
