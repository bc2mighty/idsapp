const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const Joi = require('@hapi/joi')
const Hospital = require("../models/hospital")
const Doctor = require("../models/doctor")
const Patient = require("../models/patient")
const Lab_attendant = require("../models/lab_attendant")
const saltRounds = 10

const redirectLogin = (req, res, next) => {
    if(!req.session.hospitalLoggedIn){
        res.redirect("/hospital/login")
    }else{
        next()
    }
}

const redirectHome = (req, res, next) => {
    if(req.session.hospitalLoggedIn){
        res.redirect("/hospital/dashboard")
    }else{
        next()
    }
}

router.get("/dashboard", redirectLogin, async(req, res) => {
    res.render("hospital/dashboard")
})

//Doctors Module

router.get("/doctors", redirectLogin, async(req, res) => {

    try{
        const doctors = await Doctor.find({})
        res.render("hospital/doctors", {
          request: {}, error_message: '', doctors: doctors
        })
    }catch(e){
        console.log(e)
        res.send("Error On Doctors Page")
    }
})

router.get("/doctor/create", redirectLogin, async(req, res) => {
    res.render("hospital/create_doctor", {
        request: {}, error_message: ''
    })
})

router.post("/doctor/create", redirectLogin, async(req, res) => {
    var error_message = ''
    const schema = Joi.object({
        full_name: Joi.string().required(),
        email: Joi.string().email(),
        phone: Joi.string().pattern(/^[0-9]{11,32}$/),
        staff_id: Joi.string().required(),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{5,32}$/)
    })

    const {error, value} = schema.validate(req.body)

    if(error){
        switch(error.details[0].context.key){
            case 'full_name':
                error_message = 'Please Provide Full Name Of Doctor'
                res.render("hospital/create_doctor", {
                    request: req.body, error_message: error_message
                })
                break
            case 'email':
                error_message = 'Please Provide Email Address Of Doctor'
                res.render("hospital/create_doctor", {
                    request: req.body, error_message: error_message
                })
                break
            case 'phone':
                error_message = 'Please Provide Phone Number of Doctor'
                res.render("hospital/create_doctor", {
                    request: req.body, error_message: error_message
                })
                break
            case 'staff_id':
                error_message = 'Please Provide Staff ID of Doctor'
                res.render("hospital/create_doctor", {
                    request: req.body, error_message: error_message
                })
                break
            case 'password':
                error_message = 'Please Provide Password Of Doctor'
                res.render("hospital/create_doctor", {
                    request: req.body, error_message: error_message
                })
                break
            default:
                break;
        }
    }

    try{
        var salt = bcrypt.genSaltSync(saltRounds)
        var hash = bcrypt.hashSync(req.body.password, salt)
        req.body.password = hash
        req.body.hospitalId = req.session.hospitalId
        const doctor = await Doctor.create(req.body)
        req.flash('success', "Doctor Account Created Successfully!")
        res.redirect("/hospital/doctors")
    }catch(e){
        console.log(e)
        if(e.name === 'MongoError' && e.code === 11000){
            message = "Doctor Email Or Phone Or Staff ID Already Exists"
        }else{
            message = "Some Other Error(s) are there yo!"
        }
        res.render("hospital/create_doctor", {request: req.body, error_message: message})
    }
})

//Patient Module

router.get("/patients", redirectLogin, async(req, res) => {

    try{
        const patients = await Patient.find({})
        res.render("hospital/patients", {
          request: {}, error_message: '', patients: patients
        })
    }catch(e){
        console.log(e)
        res.send("Error On Patients Page")
    }
})

router.get("/patient/create", redirectLogin, async(req, res) => {
    res.render("hospital/create_patient", {
        request: {}, error_message: ''
    })
})

router.post("/patient/create", redirectLogin, async(req, res) => {
    var error_message = ''
    const schema = Joi.object({
        full_name: Joi.string().required(),
        email: Joi.string().email(),
        phone: Joi.string().pattern(/^[0-9]{11,32}$/),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{5,32}$/)
    })

    const {error, value} = schema.validate(req.body)

    if(error){
        switch(error.details[0].context.key){
            case 'full_name':
                error_message = 'Please Provide Full Name Of Patient'
                return res.render("hospital/create_patient", {
                    request: req.body, error_message: error_message
                })
                break
            case 'email':
                error_message = 'Please Provide Email Address Of Patient'
                return res.render("hospital/create_patient", {
                    request: req.body, error_message: error_message
                })
                break
            case 'phone':
                error_message = 'Please Provide Phone Number of Patient'
                return res.render("hospital/create_patient", {
                    request: req.body, error_message: error_message
                })
                break
            case 'password':
                error_message = 'Please Provide Password Of Patient'
                return res.render("hospital/create_patient", {
                    request: req.body, error_message: error_message
                })
                break
            default:
                break;
        }
    }

    try{
        var salt = bcrypt.genSaltSync(saltRounds)
        var hash = bcrypt.hashSync(req.body.password, salt)
        req.body.password = hash
        req.body.hospitalId = req.session.hospitalId
        const patient = await Patient.create(req.body)
        req.flash('success', "Patient Account Created Successfully!")
        res.redirect("/hospital/patients")
    }catch(e){
        console.log(e)
        if(e.name === 'MongoError' && e.code === 11000){
            message = "Patient Email Or Phone Already Exists"
        }else{
            message = "Some Other Error(s) are there yo!"
        }
        res.render("hospital/create_patient", {request: req.body, error_message: message})
    }
})

//Lab Attendant Module

router.get("/lab_attendants", redirectLogin, async(req, res) => {

    try{
        const lab_attendants = await Lab_attendant.find({})
        res.render("hospital/lab_attendants", {
          request: {}, error_message: '', lab_attendants: lab_attendants
        })
    }catch(e){
        console.log(e)
        res.send("Error On Lab Attendants Page")
    }
})

router.get("/lab_attendant/create", redirectLogin, async(req, res) => {
    res.render("hospital/create_lab_attendant", {
        request: {}, error_message: ''
    })
})

router.post("/lab_attendant/create", redirectLogin, async(req, res) => {
    var error_message = ''
    const schema = Joi.object({
        full_name: Joi.string().required(),
        email: Joi.string().email(),
        phone: Joi.string().pattern(/^[0-9]{11,32}$/),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{5,32}$/)
    })

    const {error, value} = schema.validate(req.body)

    if(error){
        switch(error.details[0].context.key){
            case 'full_name':
                error_message = 'Please Provide Full Name Of Lab Attendant'
                return res.render("hospital/create_lab_attendant", {
                    request: req.body, error_message: error_message
                })
                break
            case 'email':
                error_message = 'Please Provide Email Address Of Lab Attendant'
                return res.render("hospital/create_lab_attendant", {
                    request: req.body, error_message: error_message
                })
                break
            case 'phone':
                error_message = 'Please Provide Phone Number of Lab Attendant'
                return res.render("hospital/create_lab_attendant", {
                    request: req.body, error_message: error_message
                })
                break
            case 'password':
                error_message = 'Please Provide Password Of Lab Attendant'
                return res.render("hospital/create_lab_attendant", {
                    request: req.body, error_message: error_message
                })
                break
            default:
                break;
        }
    }

    try{
        var salt = bcrypt.genSaltSync(saltRounds)
        var hash = bcrypt.hashSync(req.body.password, salt)
        req.body.password = hash
        req.body.hospitalId = req.session.hospitalId
        const lab_attendant = await Lab_attendant.create(req.body)
        req.flash('success', "Lab Attendant Account Created Successfully!")
        res.redirect("/hospital/lab_attendants")
    }catch(e){
        console.log(e)
        if(e.name === 'MongoError' && e.code === 11000){
            message = "Lab Attendant Email Or Phone Already Exists"
        }else{
            message = "Some Other Error(s) are there yo!"
        }
        res.render("hospital/create_lab_attendant", {request: req.body, error_message: message})
    }
})

router.get("/login", redirectHome, async(req, res) => {
    res.render("hospital/login", {email: '', password: '', error_message: ''})
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
                error_message = 'Please Provide Email Of Hospital'
                res.render("hospital/login", {
                    name: req.body.name, email: req.body.email, password: req.body.password, error_message: error_message
                })
                break
            case 'password':
                error_message = 'Please Provide Password for Hospital'
                res.render("hospital/login", {
                    name: req.body.name, email: req.body.email, password: req.body.password, error_message: error_message
                })
                break
            default:
                break;
        }
    }

    try{
        console.log(req.body)
        const hospital = await Hospital.findOne({email: req.body.email}).exec()

        if(hospital != null){
            bcrypt.compare(req.body.password, hospital.password, (err, state) => {
                if(state == false){
                    res.render("hospital/login", {
                        name: req.body.name, email: req.body.email, password: req.body.password, error_message: 'Password is Incorrect'
                    })
                }else if(state == true){
                    // res.send("Details are very correct provided")
                    req.session.hospitalLoggedIn = true
                    req.session.hospitalId = hospital._id
                    req.flash('success', "Hospital Logged In Successfully")
                    res.redirect('/hospital/dashboard')
                }
            })
        }else{
            res.render("hospital/login", {
                name: req.body.name, email: req.body.email, password: req.body.password, error_message: "Hospital Not Found!"
            })
        }
    }catch(e){
        console.log(e)
        message = "Hospital Email Provided Not Found!"

        if(e.name === 'MongoError' && e.code === 11000){
            message = "Hospital Email Already Exists"
        }
        res.render("hospital/login", {name: req.body.name, email: req.body.email, password: req.body.password, error_message: message})
    }
})

router.get("/register", redirectHome, async(req, res) => {
    res.render("hospital/register", {email: '', password: '', name :'', error_message: ''})
})

router.post("/register", redirectHome, async(req, res) => {
    var error_message = ''
    const schema = Joi.object({
        name: Joi.string().min(8).max(100).required(),
        email: Joi.string().email(),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{5,32}$/)
    })

    const {error, value} = schema.validate(req.body)

    if(error){
        switch(error.details[0].context.key){
            case 'name':
                error_message = 'Please Provide Name Of Hospital'
                res.render("hospital/register", {
                    name: req.body.name, email: req.body.email, password: req.body.password, error_message: error_message
                })
                break
            case 'email':
                error_message = 'Please Provide Correct Email Of Hospital'
                res.render("hospital/register", {
                    name: req.body.name, email: req.body.email, password: req.body.password, error_message: error_message
                })
                break
            case 'password':
                error_message = 'Please Provide Password for Hospital'
                res.render("hospital/register", {
                    name: req.body.name, email: req.body.email, password: req.body.password, error_message: error_message
                })
                break
            default:
                break;
        }
    }

    try{
        var salt = bcrypt.genSaltSync(saltRounds)
        var hash = bcrypt.hashSync(req.body.password, salt)
        req.body.password = hash
        const hospital = await Hospital.create(req.body)
        req.flash('success', "Hospital Account Created Successfully!")
        res.redirect("/hospital/login")
    }catch(e){
        if(e.name === 'MongoError' && e.code === 11000){
            message = "Hospital Email Already Exists"
        }else{
            message = "Some Other Error(s) are there yo!"
        }
        console.log(e)
        console.log(message)
        res.render("hospital/register", {name: req.body.name, email: req.body.email, password: req.body.password, error_message: message})
    }
})

router.get("/logout", redirectLogin, async(req, res) => {
    req.session.destroy(err => {
        if(err){
            return res.redirect("/hospital/dashboard")
        }
        res.clearCookie("sid")
        return res.redirect("/hospital/login")
    })
})

module.exports = router;
