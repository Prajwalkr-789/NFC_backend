const mongoose = require("mongoose");
const crypto = require("crypto");

const tagSchema = new mongoose.Schema({
    tagId: { type: String, required: true, unique: true },
    privateKey: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Tag = mongoose.model("Tag", tagSchema);
  
  module.exports = Tag;




//   interface ->  userid 
//                 tagid

//                 random number generate - >  

//                 tag collection ->
//                 tag + random number

//                 random number -> encrypt(userid) -> encrypted 


//                 double encrypted data -> 
//                 decrypt(single encrypted data) - > public key

//                 tag id : encrypted userid

//                 tagid collection: find tagid 
//                 yes 
//                 const tag - findone(tagid)

//                 privatye key = tag.private key

//                 decrypt(encrypted data, private key) -> userid

//                 in user collection find the userid