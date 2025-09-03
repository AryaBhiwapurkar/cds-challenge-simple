require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const tasksRouter = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());

// Connect Mongo
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(err => console.error(err));

app.use('/tasks', tasksRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
