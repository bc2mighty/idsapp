if(process.env.NODE_ENV !== "production"){
    require("dotenv").config({path: __dirname + "/.env"})
}

const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const path = require("path")
const mongoose = require("mongoose")

const flash = require("connect-flash")
app.use(flash())

app.use(require("express-session")({
    name: "sid",
    secret:"The milk would do that",
    resave: false,
    saveUninitialized: false
}))

app.set("view engine","ejs")
app.set("views",__dirname + "/views")

app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: "10mb", extended: false}))

app.use(bodyParser.json({limit: "5mb"}))
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on("error",error => console.log("Error Connecting" + error))
db.on("open", () => console.log("Connected"))
//password: mighty_tech_4_ever
//username: 2mighty
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

app.use(function(req, res, next){
    res.locals.message = req.flash()
    // console.log(res.locals)
    next()
})

const indexRoute = require("./routes/index")
const hospitalRoute = require("./routes/hospital")
const lbRoute = require("./routes/lab_attendant")
const apiRoute = require("./api/api")

app.use("/", indexRoute)
app.use("/hospital", hospitalRoute)
app.use("/lab_attendant", lbRoute)
app.use("/api", apiRoute)

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started on port 3000!")
})
