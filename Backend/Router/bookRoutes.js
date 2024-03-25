const express=require('express')
const verifyToken = require('../middleware/verifyToken')
const BOOK = require('../Schema/BOOK');
// const path = require('path')
// const multer = require('multer')
const router = express.Router()


router.post('/create', verifyToken, async (req, res) => {
    const userId = req.userId;
    const { title, author, category, isbn, edition,frontPage,backPage } = req.body;
    try {
        if (!title || !author || !isbn || !category || !edition || !frontPage || !backPage) {
            return res.status(400).json({ error: 'Incomplete book details.' });
        }
        const newBook = await BOOK.create({ title, author, isbn, category, owner: userId, edition, frontPage, backPage });
        const getNewBook = await newBook.populate("owner", "username email")
        res.status(201).json(getNewBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get all books which are available for exchange
router.get('/allBooks',verifyToken,async(req,resp)=>{
    try {
        const getAllBooks=await BOOK.find({isAvailable:true}).populate("owner","username email")
        resp.status(200).json(getAllBooks);
    } catch (error) {
        resp.status(500).json({message:error.message});
    }
})


//get single book by Id
router.get('/:bookId',verifyToken,async(req,resp)=>{
    const {bookId}=req.params
    try {
        const books = await BOOK.findOne({ isAvailable: true,_id:bookId }).populate('owner', 'username email');
        if(!books){
            return  resp.status(404).json({error:"No book Found"});  
        }
        resp.status(200).json(books);
    } catch (error) {
        resp.status(500).json({message:error.message});
    }
})


//request a book by Id
router.post('/request/:bookId', verifyToken, async (req, resp) => {
  const userId = req.userId;
  const { bookId } = req.params;

  try {
      if (!userId) {
          return resp.status(401).json({ error: "Unauthorized" });
      }

      const heldBook = await BOOK.findOne({ holder: userId });
      if (heldBook) {
          return resp.status(400).json({ error: "You cannot request another book while you hold one, return the book first." });
      }

      const book = await BOOK.findById(bookId);

      if (!book) {
          return resp.status(404).json({ error: 'Book not found.' });
      }

      if (String(book.owner) === String(userId)) {
          return resp.status(400).json({ error: 'You cannot request your own book.' });
      }

      if (String(book.requester) === String(userId)) {
          await BOOK.findOneAndUpdate(
              { _id: bookId },
              { requester: null },
              { new: true, runValidators: true }
          );
          return resp.status(200).json({ message: 'Request canceled successfully.' });
      }

      // Otherwise, send the request
      const updatedBook = await BOOK.findOneAndUpdate(
          { _id: bookId, isAvailable: true, holder: null },
          { requester: userId },
          { new: true, runValidators: true }
      ).populate("requester", "username email").populate("owner", "username email");

      if (!updatedBook) {
          return resp.status(404).json({ error: 'Book not available for request.' });
      }

      resp.status(200).json({ message: "Request has been sent", updatedBook });
  } catch (error) {
      console.log(error);
      resp.status(500).json({ error:"error while requesting" });
  }
});




//delete a book
router.delete('/:bookId', verifyToken, async (req, resp) => {
    try {
      const book = await BOOK.findByIdAndDelete(req.params.bookId);
      if (!book) {
        return resp.status(404).json({ error: 'Book not found' });
      }
      resp.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      resp.status(500).json({ error: 'Server error' });
    }
  });

  //view requests
  router.get('/view/requests', verifyToken, async (req, resp) => {
    const userId = req.userId;
    try {
      if (!userId) {
        return resp.status(401).json({ error: 'Un-authorized' });
      }
      const requests =await BOOK.find({ owner: userId, isApproved: false, requester: { $ne: null } }).populate("requester", "username email");
      if(!requests || requests.length === 0) {
        return resp.status(404).json({ error: 'No requests found' });
      }
      resp.status(200).json(requests);
    } catch (error) {
      console.error(error);
      resp.status(500).json({ error: 'Server error in viewing requests'});
    }
  });


  router.put('/approve/:bookId', verifyToken, async (req, resp) => {
    const userId = req.userId;
    const { bookId } = req.params;

    try {
        if (!userId) {
            return resp.status(401).json({ error: 'Un-authorized' });
        }
        
        const book = await BOOK.findById(bookId).populate("requester", "username email").populate("owner", "username email");
        if(!book){
            return resp.status(404).json({ error: 'Book not found' });
        }
        book.isApproved = true;
        book.holder = book.requester._id;
        book.requester = null;
        book.isAvailable = false;
        // console.log(book);
        await book.save();
        const updatedBook = await BOOK.findById(bookId).populate("requester", "username email").populate("owner", "username email").populate("holder", "username email");
        if(!updatedBook){
            return resp.status(404).json({ error: 'Book not found' });
        }
        resp.status(200).json({ message:`Book approved successfully , the holder of book is ${updatedBook.holder.username}`, updatedBook });
    } catch (error) {
      console.log(error);
        resp.status(500).json({ error: 'Server error while uploading book' });
    }
});

//return a book
router.post('/return/:bookId', verifyToken, async (req, resp) => {
    const userId = req.userId;
    const { bookId } = req.params;
    try {
        if (!userId) {
            return resp.status(401).json({ error: 'Un-authorized' });
        }
        const book = await BOOK.findById(bookId).populate("requester", "username email").populate("owner", "username email").populate("holder", "username email");
        
        if(!book){
            return resp.status(404).json({ error: 'Book not found' });
        }
        if(String(book.holder._id)!==String(userId)){
            return resp.status(400).json({ error: 'You are not the holder of this book' });
        }
        if(String(book.holder._id)===String(book.owner._id)){
          return resp.status(400).json({ error: 'You cannot return your own book' });
        }
      book.isApproved = false;
      book.holder = null;
      book.requester = null;
      book.isAvailable = true;
      
    //   // console.log(book);
      await book.save();
      const updatedBook = await BOOK.findById(bookId).populate("requester", "username email").populate("owner", "username email").populate("holder", "username email");
      resp.status(200).json({ message:`Book will be returned successfully`,updatedBook});

    } catch (error) {
      console.log(error);
      resp.status(500).json({ error: 'Server error while returning book' });
    }
})


router.get('/view/returned', verifyToken, async (req, resp) => {
    const userId = req.userId;
    try {
      if (!userId) {
        return resp.status(401).json({ error: 'Un-authorized' });
      }
      const returnedBooks =await BOOK.find({ owner: userId, isReturned: true }).populate("owner", "username email");
      if(!returnedBooks || returnedBooks.length === 0) {
        return resp.status(404).json({ error: 'No returned books found' });
      }
      resp.status(200).json(returnedBooks);
    } catch (error) {
      console.error(error);
      resp.status(500).json({ error: 'Server error in viewing returned books'});
    }
})


router.get('/my/holdings',verifyToken,async(req,resp)=>{
    const userId=req.userId
    try {
        if(!userId){
            return resp.status(404).json({message:"Un-authorized,log in first"})
        }
        const books=await BOOK.find({holder:userId}).populate("owner","username email")
        if(!books || books.length===0){
            return resp.status(404).json({message:"No books found"})
        }
        resp.status(200).json(books);  
    } catch (error) {
        resp.status(500).json({message:error.message})
    }
})


















module.exports=router