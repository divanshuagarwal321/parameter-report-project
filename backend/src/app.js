const express = require('express');
const cors = require('cors');
const { getParametersData } = require('./dataService');

const app = express();
app.use(cors());

app.get('/api/parameters', async (req, res) => {
  try {
    const data = await getParametersData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));