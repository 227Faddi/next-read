import BooksDB from '../models/Book.js';

export default {
    getBooks: async (req,res)=>{
        try{
            const booksItems = await BooksDB.find({userId: req.user.id }).lean()
            res.render('books.ejs', { books: booksItems, user: req.user.userName})
        }catch(err){
            console.log(err)
        }
    },
    addBook: async (req, res)=>{
        try{
            req.body.userId = req.user.id;
            const existingBook = await BooksDB.findOne({ 
                title: req.body.title, 
                userId: req.user.id
            })
            if(existingBook){
                return res.status(400).json({ message: 'Book already exists.' });
            }
            await BooksDB.create(req.body)
            res.status(200).json({ message: 'Book Added' });
        } catch(err){
            console.error(err)
        }
    },
    updateStatus: async (req, res)=>{
        try{
            await BooksDB.findOneAndUpdate({_id: req.params.id},{
                status: req.body.status
            })
            res.redirect('/books')
        }catch(err){
            console.log(err)
        }
    },
    deleteBook: async (req, res)=>{
        try{
            await BooksDB.findByIdAndDelete(req.params.id)
            res.redirect('/books')
        } catch(err){
            console.error(err)
        }
    },
}