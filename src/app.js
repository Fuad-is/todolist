const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');
const sequelize = require('./db');
const Todo = require('./models/todo');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*',
}));

app.get('/', async (req, res) => {
    res.json({welcome:"Welcome to the TO DO LIST API"});
});

app.use(bodyParser.json());

// Routes
app.use('/api', todoRoutes);

// Sync database and start server
const PORT = 3000;
sequelize.sync({ force: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
