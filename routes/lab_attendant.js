const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const Joi = require('@hapi/joi')
const Hospital = require("../models/hospital")
const Doctor = require("../models/doctor")
const Patient = require("../models/patient")
const Lab_attendant = require("../models/lab_attendant")
const Sample = require("../models/sample")
const saltRounds = 10

const redirectLogin = (req, res, next) => {
    if(!req.session.lbLoggedIn){
        res.redirect("/lab_attendant/login")
    }else{
        next()
    }
}

const redirectHome = (req, res, next) => {
    if(req.session.lbLoggedIn){
        res.redirect("/lab_attendant/dashboard")
    }else{
        next()
    }
}

router.get("/dashboard", redirectLogin, async(req, res) => {
    res.render("lab_attendants/dashboard")
})

router.get("/samples", redirectLogin, async(req, res) => {
    try{
        const samples = await Sample.find({}).populate("patient doctor hospital lab_attendant")
        // console.log(samples)
        res.render("lab_attendants/samples", {
          request: {}, error_message: '', samples: samples
        })
    }catch(e){
        console.log(e)
        res.send("Error On Samples Page")
    }
})

router.get("/maps", redirectLogin, async(req, res) => {
    try{
        // const samples = await Sample.find({}).populate("patient doctor hospital lab_attendant")
        // console.log(samples)
        res.render("lab_attendants/maps", {
          request: {}, error_message: ''
        })
    }catch(e){
        console.log(e)
        res.send("Error On Samples Page")
    }
})

router.get("/sample/create", redirectLogin, async(req, res) => {
    try{
        const patients = await Patient.find({})
        const hospitals = await Hospital.find({})
        const doctors = await Doctor.find({})
        const lab_attendants = await Lab_attendant.find({})

        res.render("lab_attendants/create_sample", {
            request: {}, error_message: '',patients: patients,doctors: doctors,hospitals: hospitals,lab_attendants: lab_attendants
        })
    }catch(e){
        console.log(e)
        res.send("Error On Samples Page")
    }
})

router.post("/sample/create", redirectLogin, async(req, res) => {
    const patients = await Patient.find({})
    const hospitals = await Hospital.find({})
    const doctors = await Doctor.find({})
    const lab_attendants = await Lab_attendant.find({})
    const lab_attendant = await Lab_attendant.findOne({_id: req.session.lbId}).exec()

    // console.log(lab_attendant)

    var error_message = ''
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        doctor: Joi.string().required(),
        patient: Joi.string().required()
    })

    const {error, value} = schema.validate(req.body)

    if(error){
        switch(error.details[0].context.key){
            case 'title':
                error_message = 'Please Provide Title of Sample'
                res.render("lab_attendants/create_sample", {
                    request: req.body, error_message: error_message,patients: patients,doctors: doctors,hospitals: hospitals,lab_attendants: lab_attendants
                })
                break
            case 'description':
                error_message = 'Please Provide Sample Description'
                res.render("lab_attendants/create_sample", {
                    request: req.body, error_message: error_message,patients: patients,doctors: doctors,hospitals: hospitals,lab_attendants: lab_attendants
                })
                break
            case 'doctor':
                error_message = 'Please Select Doctor'
                res.render("lab_attendants/create_sample", {
                    request: req.body, error_message: error_message,patients: patients,doctors: doctors,hospitals: hospitals,lab_attendants: lab_attendants
                })
                break
            case 'patient':
                console.log(patients)
                error_message = 'Please Select Patient'
                res.render("lab_attendants/create_sample", {
                    request: req.body, error_message: error_message,patients: patients,doctors: doctors,hospitals: hospitals,lab_attendants: lab_attendants
                })
                break
            default:
                break;
        }
    }

    try{
        req.body.lab_attendant = lab_attendant._id
        req.body.hospital = lab_attendant.hospitalId
        const sample = await Sample.create(req.body)
        req.flash('success', "Samples Created Successfully!")
        res.redirect("/lab_attendant/samples")
    }catch(e){
        console.log(e)
        if(e.name === 'MongoError' && e.code === 11000){
            message = "Some Sample Values Already Exists"
        }else{
            message = "Some Other Error(s) are there yo!"
        }
        res.render("lab_attendants/create_sample", {request: req.body, error_message: message,patients: patients,doctors: doctors,hospitals: hospitals,lab_attendants: lab_attendants})
    }
})


router.get("/login", redirectHome, async(req, res) => {
    res.render("lab_attendants/login", {email: '', password: '', error_message: ''})
})

router.post("/login", redirectHome, async(req, res) => {
    var error_message = ''
    const schema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{5,32}$/)
    })

    const {error, value} = schema.validate(req.body)

    if(error){
        switch(error.details[0].context.key){
            case 'email':
                error_message = 'Please Provide Email Of Lab_attendant'
                res.render("lab_attendants/login", {
                    name: req.body.name, email: req.body.email, password: req.body.password, error_message: error_message
                })
                break
            case 'password':
                error_message = 'Please Provide Password for Lab_attendant'
                res.render("lab_attendants/login", {
                    name: req.body.name, email: req.body.email, password: req.body.password, error_message: error_message
                })
                break
            default:
                break;
        }
    }

    try{
        // console.log(req.body)
        const lab_attendant = await Lab_attendant.findOne({email: req.body.email}).exec()

        if(lab_attendant != null){
            bcrypt.compare(req.body.password, lab_attendant.password, (err, state) => {
                if(state == false){
                    res.render("lab_attendants/login", {
                        name: req.body.name, email: req.body.email, password: req.body.password, error_message: 'Password is Incorrect'
                    })
                }else if(state == true){
                    // res.send("Details are very correct provided")
                    req.session.lbLoggedIn = true
                    req.session.lbId = lab_attendant._id
                    req.flash('success', "Lab_attendant Logged In Successfully")
                    res.redirect('/lab_attendant/dashboard')
                }
            })
        }else{
            res.render("lab_attendants/login", {
                name: req.body.name, email: req.body.email, password: req.body.password, error_message: "Lab attendant Not Found!"
            })
        }
    }catch(e){
        console.log(e)
        message = "Lab_attendant Email Provided Not Found!"

        if(e.name === 'MongoError' && e.code === 11000){
            message = "Lab attendant Email Already Exists"
        }
        res.render("lab_attendants/login", {name: req.body.name, email: req.body.email, password: req.body.password, error_message: message})
    }
})

module.exports = router
