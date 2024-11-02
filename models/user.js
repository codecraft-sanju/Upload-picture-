const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/testapp1");
const userSchema = new mongoose.Schema({
    image: String,
    email: String,
    name:String,

})


module.exports=mongoose.model('user', userSchema);