//we are seperately testing the authorization, because it is not a good idea to test auth for all end points(routes) test them again and again..so only one test for auth is enough for them like when no token there.

const request = require('supertest');
const {genreSchema, Genre} = require('../../modals/genre');
const { User } = require('../../modals/user');

describe('auth middleware', ()=>{

    beforeEach( ()=> { 
        server = require('../../index');
        token = new User().generateAuthToken();
    });
    afterEach( async ()=> {
        await server.close();
        await Genre.remove({});
    })
    let token;
    const exec = ()=> {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name: 'genre1'});
    }

    it('should return 401 error if no token provided',async ()=>{
        token = ''; /// we cannot assign token = null. because on server it is send as 'null' string.
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid',async ()=>{
        token = 'a'; 
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 status if token is invalid',async ()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });
});