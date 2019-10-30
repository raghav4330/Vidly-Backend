const auth = require('../../../middleware/auth');
const {User} = require('../../../modals/user');
const  mongoose = require('mongoose');

describe('auth middleware', ()=>{
    it('should populate req.user with payload of jwt', ()=>{
        const user = {_id: mongoose.Types.ObjectId().toHexString(), isAdmin: true};
        const token = new User(user).generateAuthToken();
        req = {
            header: jest.fn().mockReturnValue(token)
        };
        res = {};
        next = jest.fn();
        auth(req, res, next);
        expect(req.user).toMatchObject(user);
    })
})