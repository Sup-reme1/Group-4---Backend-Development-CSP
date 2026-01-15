const mongoose = require("mongoose");
const ExpenseSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },

    title:{
        type:String,
        required: true,
        trim:true
    },

    description:{
        type:String,
        required: false,
    },

    amount:{
        type: Number,
        required: true
    },

    currency: {
        type: String,
        required: true,
        enum: ['NGN', 'USD', 'GBP', 'EUR'],
        default: 'NGN'
    },

    // Date Information
    dateReceived: {
        type: Date,
        required: [true, 'Date received is required'],
        index: true
    },
    
    category:{
        type:String,
        trim: true
    },

    // Receipt/Invoice
    receiptUrl: {
        type: String
    },

    createdAt:{
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Expense", ExpenseSchema)