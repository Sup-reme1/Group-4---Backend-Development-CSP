require('dotenv').config();
const express = require('express');
const session = require('express-session');
// const methodOverride = require('method-override');
const path = require('path');

// Database connection
const connectDB = require('./config/db');
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(methodOverride('_method'));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // Enable when ready
    // store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Make session available in EJS templates
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});

// View engine
app.set('view engine', 'ejs');

// ROUTES
app.use('/api/user', require('./routes/user'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/calculateTax', require('./routes/taxApis')); 

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
