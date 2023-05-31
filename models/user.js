
const crypto = require('crypto');
const { createHmac, randomBytes } = crypto;

const { Schema , model} = require("mongoose");
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
   email: {
    type: String,
    unique: true,
   },

   salt: {
    type: String,
   // required: true,
   },

   password: {
    type: String,
    required: true,

   },

   profileImageURL: {
    type: String,
   default: "/images/default.jpg",
   },
   
   role: {
    type: String,
    enum: ["User","Admin"],
    default: "User",
   },
   

},
{ timestamps: true }
);


userSchema.pre("save", function(next) {
  const user = this;
 if(!user.isModified("password")) return;

 const salt = randomBytes(16).toString("hex");

 const hashedPassword = createHmac('sha256', salt)
   .update(user.password)
   .digest("hex");
   user.salt = salt;
   user.password = hashedPassword;
   next();
});


userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
 const user = await this.findOne( { email } );
   
 if(!user)
  throw new error('User not Found');

  const salt = user.salt;
  
  const hashedPassword = user.password;

  const userProvidedHash = createHmac('sha256', salt)
  .update(password)
  .digest("hex");

   if(hashedPassword !== userProvidedHash)
    throw new error('Incorrect Password');

    

  const token = createTokenForUser(user);
  return token;

};

const User = model('User', userSchema);


module.exports = User;