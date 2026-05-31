require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmaster';


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


app.use('/', authRoutes);
app.use('/', taskRoutes);


app.use((req, res) => {
  res.status(404).render('login', { 
    title: '404 - Not Found',
    error: 'The page you requested could not be found.' 
  });
});


console.log('Attempting to connect to MongoDB at:', MONGODB_URI);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(` TaskMaster Server is running!`);
      console.log(` http://localhost:${PORT}`);
      console.log(`========================================`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB Connection Error:', err.message);
    console.log('\n======================================================');
    console.log(' DATABASE CONNECTION ERROR WARNING:');
    console.log('Please ensure that:');
    console.log('1. MongoDB is installed and running on your local machine.');
    console.log('2. Or, set a valid "MONGODB_URI" in a ".env" file at the project root.');
    console.log('======================================================\n');
    
    
    app.listen(PORT, () => {
      console.log(`  Server started on port ${PORT} WITHOUT MongoDB connection.`);
      console.log(` http://localhost:${PORT}`);
    });
  });
