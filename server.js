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
const allowedOrigins = ['http://127.0.0.1:5501', 'http://localhost:5501', 
    'https://ajibola-bello.github.io',
    'https://ajibola-bello.github.io//tax-app',
    'https://sup-reme1.github.io/tax-app',
    'https://sup-reme1.github.io',
]

app.use(cors({
    origin: function (origin, callback) { 
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); 
        } else {
            callback(new Error('Not allowed by CORS')); 
        } 
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


//  Removed session middleware 
// // Session middleware
// app.use(session({
//     name: "sid",
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,   
//     cookie: {
//         sameSite: 'none',  // Allow cross-origin requests
//         secure: true,      // Required for sameSite: 'none' in production (HTTPS)
//         httpOnly: true,     // Prevent client-side access for security
//         maxAge: 1000 * 60 * 60 * 24      // 1 day
//     }
// }));


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
