require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 1. Added this line
const session = require('express-session');
const path = require('path');

// Database connection
const connectDB = require('./config/db');
connectDB();

// Initialize app
const app = express();

// 2. Added CORS configuration here
app.use(cors({
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501'],
    credentials: true
}));

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax',  // Allow cross-origin requests
        secure: false,      // Required for sameSite: 'none' in production (HTTPS)
        httpOnly: true,     // Prevent client-side access for security
        maxAge: 1000 * 60 * 60 * 24      // 1 day
    }
    // cookie: {
    //     sameSite: 'none',  // Allow cross-origin requests
    //     secure: true,      // Required for sameSite: 'none' in production (HTTPS)
    //     httpOnly: true,     // Prevent client-side access for security
    //     maxAge: 1000 * 60 * 60 * 24      // 1 day
    // }
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
