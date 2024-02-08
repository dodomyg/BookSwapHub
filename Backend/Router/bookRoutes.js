const express=require('express')
const verifyToken = require('../middleware/verifyToken')
const BOOK = require('../Schema/BOOK')
const router = express.Router()

//create a new book
router.post('/create',verifyToken,async(req,resp)=>{
    const userId = req.userId
    const {title,author,category,isbn,pic,edition}=req.body
    try {
        if (!title || !author  || !isbn || !category || !pic || !edition) {
            return resp.status(400).json({ error: 'Incomplete book details.' });
        }
        const newBook = await BOOK.create({title,author,isbn,category,pic,owner:userId,edition})
        const getNewBook = await newBook.populate("owner","-password")
        resp.status(201).json(getNewBook);
        
    } catch (error) {
        resp.status(500).json({message:error.message});
    }
})

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
        const books = await BOOK.findOne({ isAvailable: true,_id:bookId }).populate('owner', 'username');
        if(!books){
            return  resp.status(404).json({error:"No book Found"});  
        }
        resp.status(200).json(books);
    } catch (error) {
        resp.status(500).json({message:error.message});
    }
})

//request a book by Id
router.post('/request/:bookId',verifyToken,async(req,resp)=>{
    const userId=req.userId
    const {bookId}=req.params
    try {
        const updatedBook  = await BOOK.findOneAndUpdate({_id:bookId,isAvailable:true},{isAvailable:false,requester:userId},{new:true,runValidators:true}).populate("requester","username email")
        if (!updatedBook) {
            return resp.status(404).json({ error: 'Book not available for request.' });
        }
        resp.status(200).json({message:"Request has been sent",updatedBook});
    } catch (error) {
        resp.status(500).json({message:error.message});
    }
})

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

  //get all requests
  router.get('/books/requests', verifyToken, async (req, resp) => {
    try {
      const requests = await BOOK.find({ owner: req.userId, isAvailable: false })
        .populate('requester', 'username');
  if(requests.length===0){
    return resp.status(404).json({ error: 'No requests present' });
  }
      resp.status(200).json({message:`You have ${requests.length} request waiting`,requests});
    } catch (error) {
      console.error(error);
      resp.status(500).json({ error: 'Server error' });
    }
  });


  //approve a request of book by bookId
  router.put('/approve/:bookId',verifyToken,async(req,resp)=>{
    try {
        const updatedRequest = await BOOK.findOneAndUpdate({_id:req.params.bookId,owner:req.userId,isAvailable:false},{isApproved:true},{new:true,runValidators:true}).populate("requester","username email")
        if (!updatedRequest) {
            return resp.status(404).json({ error: 'Book request not found or not authorized.' });
          }
          resp.status(200).json({message:`Book has been successfully traded to ${updatedRequest.requester.username} , new owner of book is ${updatedRequest.requester.username}`,updatedRequest });
    } catch (error) {
        resp.status(500).json({ error: 'Server error' });
    }
  })















module.exports=router