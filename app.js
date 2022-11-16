// expernal imports
const expresss = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const path = require("path")
const cookieParser = require("cookie-parser")


// internal imports
const {notFoundHandler, errorHandler} = require("./middlewares/common/errorHandler")
const loginRouter = require("./router/loginRouter")
const usersRouter = require("./router/usersRouter")
const inboxRouter = require("./router/inboxRouter")



const app = expresss()
dotenv.config();

// database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {

})
.then(()=> console.log("db connect successful"))
.catch(e => console.log(e))

//request parser
app.use(expresss.json())
app.use(expresss.urlencoded({extended: true}))

// set view engine
app.set("view engine", 'ejs')

// set static folder
app.use(expresss.static(path.join(__dirname, "public")))

// parse cookies 
app.use(cookieParser(process.env.COOKIE_SECRET))


// routing setup
app.use('/', loginRouter)
app.use('/users', usersRouter)
app.use('/inbox', inboxRouter)

// 404 not found handler
app.use(notFoundHandler)

// common error handler
app.use(errorHandler)

// app listen
app.listen(process.env.PORT, ()=> {
    console.log(`app listing to port ${process.env.PORT}`);
})