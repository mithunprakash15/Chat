const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/chat',{
    useNewUrlParser: true,
  useUnifiedTopology: true,
});



const User = mongoose.model('user', {
  emailId: String,
  username: String,
  password: String,
  messages: [
    {
      from: String,
      to: String,
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});




  module.exports = {
    mongoose,
    User,     
  }