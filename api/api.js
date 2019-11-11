const express = require("express")
const router = express.Router()
const Journey = require("../models/journey")

router.post("/sample/details/save", async(req, res) => {
    try {
        await Journey.create(req.body)
        res.json({status:1, message:"Endpoint Received Data", data: req.body})
    } catch (e) {
        console.log(e.errors.rotation)
        let error_message = []
        for(key in e.errors){
            error = {}
            console.log(key)
            error.key = e.errors[key].message
            error_message.push(error)
        }
        res.json({status:-1, message:"Error At Endpoint", data: req.body, error: error_message})
    }
})

module.exports = router;
