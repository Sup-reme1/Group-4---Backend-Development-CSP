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

    amount:{
        type: Number,
        required: true
    },
    
    category:{
        type:String,
        trim: true
    },

    createdAt:{
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Expense", ExpenseSchema)