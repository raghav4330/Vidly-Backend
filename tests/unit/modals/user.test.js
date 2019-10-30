const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const { User } = require('../../../modals/user');

describe('user.generateAuthToken', ()=>{
    it('should return valid JWT', ()=>{
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true};
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    })
}); 

//                  --  test.json --

// while testing , it isnt necassary that key should be defined in environet . 
// if while testing key ffrom environmen not found , then from here is picked