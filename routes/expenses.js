const express = require("express");
const router = express.Router();
const Expense = require("../models/Expenses");

// Middleware to check if user is authenticated
function isAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  next();
}


// POST route
 router.post("/", isAuth, async (req, res) => {
    const userId = req.session.userId;
     try{
         const {title, amount, category} = req.body;
         const expense = await 
         Expense.create({userId, title, amount, category});
         res.status (201).json(expense);
    }catch (error){
        res.status(400).json({error: error.message});
    }
});

// GET ALL for a user
router.get('/', isAuth, async (req, res) => {
    try{
        const expenses = await Expense.find({userId: req.session.userId});
        res.status(200).json({success:true, data:expenses});
    }catch(err){
        res.status(500).json({success:false, message:'Server Error'});
    }
});

//  GET single by ID
router.get("/:id", isAuth, async(req, res) =>{
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

// /UPDATE an expense
router.put('/:id', isAuth, async (req, res) =>{
    try{
        const expenseId = req.params.id;
        const updatedData = req.body

        if (updatedData.userId) {
            delete updatedData.userId; // Prevent changing the userId
        }   
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
router.delete('/:id', isAuth, async (req, res) => {
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