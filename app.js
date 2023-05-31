require('dotenv').config()
const path = require("path");
const express = require("express");

const cookieParser = require('cookie-parser');

const mongoose = require("mongoose");

const Blog = require('./models/blog');

const userRoute = require("./routes/user");

const blogRoute = require("./routes/blog");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const app = express();

const PORT =  process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL)
  .then(console.log("MongoDB Connected"));

app.set("view engine","ejs");

app.set("views", path.resolve(__dirname, "views"));
app.use(express.urlencoded({extended: false}));


app.use(cookieParser());

app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve('./public')));

app.get("/", async (req,res) => {
  const allblogs = await Blog.find({});
   res.render("home",{
    user: req.user,
    blogs: allblogs,
   });
})

app.use("/user",userRoute);
app.use("/blog",blogRoute);


app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));


