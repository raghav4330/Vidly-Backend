const Joi = require('joi');
const mongoose  = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isGold: {type: Boolean, default: false},
    phone: {
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 15
    }
}) );

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(15).required()
    }
    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;