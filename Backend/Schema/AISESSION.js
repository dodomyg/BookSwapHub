const mongoose = require('mongoose');
const { Schema } = mongoose;


const aiChatSessions = new Schema({
    userId:{ type:mongoose.Schema.Types.ObjectId, ref: 'USER', required: true },
    sessionId: { type: String, required: true, unique: true },
    messages: []
}, { timestamps: true });



module.exports = mongoose.model('AISESSION', aiChatSessions);


