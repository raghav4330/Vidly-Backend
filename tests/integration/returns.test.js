const mongoose = require('mongoose');
const { Rental } = require('../../modals/rental');
const { Movie } = require('../../modals/movie');
const { User } = require('../../modals/user');
const request = require('supertest');
const moment = require('moment');

describe('/api/returns', ()=>{
    let server;
    let rental;
    let customerId;
    let movieId;
    let token;

    beforeEach(async ()=>{
        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: 5
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();

        token = new User().generateAuthToken();  
    });

    afterEach(async ()=>{
       await server.close();
       await Rental.remove({});
       await Movie.remove({});
    });

    const exec = ()=>{
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId, movieId});
    }

    it('should return 401 if client not logged in', async ()=>{
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async ()=>{
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async ()=>{
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for this customer/movie combination', async ()=>{
        await Rental.remove({});
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async ()=>{
        rental.dayReturned = new Date();
        await rental.save();
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if valid request', async ()=>{
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the return date if input is valid', async ()=>{
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDB.dayReturned; // diff in milliseconds
        expect(diff).toBeGreaterThanOrEqual(0);
        expect(diff).toBeLessThan(10 * 1000); // taking 10 sec as worst case   
    });

    it('should calculate the rental fee if input is valid', async ()=>{
        rental.dayOut = moment().add(-7, 'days').toDate();
        await rental.save();
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        // expect(rentalInDB.rentalFee).toBeDefined();
        expect(rentalInDB.rentalFee).toBe(14); // to more specific for result . we set 2 as daily rental fee.
    });

    it('should increase movie stock if input is valid', async ()=>{
        const movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {name:'12345'},
            numberInStock: 10
        });
        await movie.save();

        const res = await exec();
        const movieInDB = await Movie.findById(movieId);
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return rental if input is valid', async ()=>{
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
       
        // expect(res.body).toMatchObject(rentalInDB); this will fail because dates returned from mongoose are of date type but those returned from response ae json formtted (in strings).
        // expect(res.body).MatchProperty('dayOut').. this will too repititive. as we will do this this for other 4 properties.
       
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
         'dayOut', 'dayReturned', 'movie', 'customer', 'rentalFee'   
        ]));
    });
})