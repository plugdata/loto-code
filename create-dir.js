const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'customer');
fs.mkdirSync(dir, { recursive: true });
console.log('Directory created:', dir);
