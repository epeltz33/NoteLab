const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router');
const path = require('path');

const app = express();
const port = 3000;

// Log the directory paths to debug
const clientPath = path.join(__dirname, '../client');
console.log('Current directory:', __dirname);
console.log('Client directory path:', clientPath);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(clientPath));
app.use('/', router);

app.listen(port, () => {
  console.log(`NoteLab server running at http://localhost:${port}`);
});