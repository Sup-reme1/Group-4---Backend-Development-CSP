const express = require("express");
const router = express.Router();
const Expense = require("../models/Expenses");

// POST route
 router.post("/", async (req, res) => {
     try{
         const {userId, title, amount, category} = req.body;
         const expense = await 
         Expense.create({userId, title, amount, category});
         res.status (201).json(expense);
    }catch (error){
        res.status(400).json({error: error.message});
    }
});

//  GET single by ID
router.get("/:id", async(req, res) =>{
    try{
        const expense = await
        Expense.findById(req.params.id);
        if(!expense){
            return res.status(404).json({ success: false, message: 'Expense not found'});
        }
        res.status(200).json({success:true, data: expense});
    } catch (err){
        res.status(500).json({success : false, message:
            'Server error'
        });
    }
});

// To fix this route
// GET ALL for a user
router.get('/', async (req, res) => {
    try{
        const expenses = await Expense.find();
        res.status(200).json({success:true, data:expenses});
    }catch(err){
        res.status(500).json({success:false, message:'Server Error'});
    }
});

// /UPDATE an expense
router.put('/:id', async (req, res) =>{
    try{
        const expenseId = req.params.id;
        const updatedData = req.body
        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            updatedData,
            {new:true}
        );
        if(!updatedExpense){
            res.status(404).json({message: 'Expense not found'});
        }
        res.status(200).json(updatedExpense);
    }catch (err){
        console.error(err);
        res.status(500).json({message: 'Server error', error:err.message});
    }
});

// DELETE an expense by id
router.delete('/:id', async (req, res) => {
    try{
        const expenseId = req.params.id;
        const deletedExpense = await 
        Expense.findByIdAndDelete(expenseId);

        if(!deletedExpense){
            return res.status(404).json({message: 'Expense not found'});
        }
        res.status(200).json({message: 'Expense deleted successfully', data: deletedExpense});

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error', error: err.message});
    }
});
module.exports = router;