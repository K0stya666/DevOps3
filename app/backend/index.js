const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// ??????????? ?????????
const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});