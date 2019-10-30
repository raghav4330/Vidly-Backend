const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const {User} = require('../modals/user');

router.post('/', async (req, res)=>{
    try{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('user with this email not exist');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
    }
    catch(err) {
        console.log(err.message) ;
        res.status(500).send('Some error occured');
    }
});

function validate(req) {
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().required()
    }
    return Joi.validate(req, schema);
}
module.exports = router;