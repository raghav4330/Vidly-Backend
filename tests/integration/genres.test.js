const request = require('supertest');
const mongoose = require('mongoose');
const {genreSchema, Genre} = require('../../modals/genre');
const { User } = require('../../modals/user');
let server;

describe('/api/genres', ()=>{
    beforeEach(()=>{ server = require('../../index'); });
    afterEach(async ()=>{ 
        await server.close();
        await Genre.remove({}); 
    });

    describe('GET /', ()=>{
        it('should return all genres',async ()=>{
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some( g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some( g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('Get /:id', ()=>{
        it('should return genre if valid id is passed',async ()=>{
           const genre = new Genre({name: 'genre1'});
           await genre.save(); 
           const res = await request(server).get('/api/genres/'+genre._id);
           
        expect(res.status).toBe(200);
        // expect(res.body).toMatchObject(genre);
        expect(res.body).toHaveProperty('name', genre.name)
        })

        it('should return 404 error if invalid id is passed',async ()=>{
            const res = await request(server).get('/api/genres/123');    
            
             expect(res.status).toBe(404);
         })

         it('should return 404 error genre with the id not found',async ()=>{
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/'+id);    
            
             expect(res.status).toBe(404);
         })
    })



    describe('POST /', ()=>{
        let token;
        let name;

        const exec = async ()=>{
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: name}); 
        }

        it('should return 401 error if user not logged in',async ()=>{
            token = '';
            name = 'genre1';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters',async ()=>{
             token = new User().generateAuthToken();
             name= '1234';
             const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters',async ()=>{
             token = new User().generateAuthToken();
             name = new Array(52).join('a'); // aaaa........aa  (total 51 lettered string) & it will look wierd if we write long 50 letter-string. so use this way;
             const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid',async ()=>{
            token = new User().generateAuthToken();
            name = 'genre1';
            const res = await exec();
            
            const genre = await Genre.find({genre:'genre1'}); // we are finding in this way because we know db is empty because clean in before and aftereach function. and no 2 genre will be there with same name
            expect(genre).not.toBeNull();
             
        });

        it('should return the genre if it is valid',async ()=>{
             token = new User().generateAuthToken();
             name = 'genre1';
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
             
        });
    })
})