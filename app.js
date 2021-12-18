const express = require('express');

const app = express();

app.get('/', (res, req) => {
  req.status(204).json({ holla: 'molla' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
