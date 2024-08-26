import BooksDB from '../models/Book.js';

export default {
    getDashboard: async (req,res)=>{
        try{
            const message = req.flash('message')
            res.render('dashboard.ejs', { user: req.user, message })
        }catch(err){
            console.log(err)
        }
    },
}    