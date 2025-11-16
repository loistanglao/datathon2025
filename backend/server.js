const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(cors());
app.use(express.json());

let colleges = [];

fs.createReadStream('./data/colleges.csv')
  .pipe(csv())
  .on('data', (row) => {
    colleges.push(row);
  })
  .on('end', () => {
    console.log('CSV file loaded successfully');
  });

// API route to get all colleges
app.get('/api/colleges', (req, res) => {
  res.json(colleges);
});

// Optional root route for testing
app.get('/', (req, res) => {
  res.send('Backend is running. Use /api/colleges to get data.');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
