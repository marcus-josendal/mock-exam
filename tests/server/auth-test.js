const request = require('supertest');
const app = require('../../src/server/app');
const Users = require('../../src/server/db/users');


beforeEach(() => {Users.resetAllUsers();});

test("Test failed login", async () =>{

    const response = await request(app)
        .post('/api/login')
        .send({userId: 'foo', password: '123'});

    expect(response.statusCode).toBe(401);
});

test("Test sign up", async () =>{

    const response = await request(app)
        .post('/api/signup')
        .send({userId: 'foo', password: '123'});

    expect(response.statusCode).toBe(201);
});

test("Test fail sign up twice", async () =>{

    const payload = {userId: 'foo', password: '123'};

    let response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);

    //can't sign up twice with same userId
    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(400);
});

test("Test logged in when signing up", async () =>{

    const payload = {userId: 'foo', password: '123'};

    let response = await request(app)
        .get('/api/user');
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);
    const cookie = response.headers['set-cookie'];

    //now we should be able to get it
    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(payload.userId);
});

test("Test sign up, and then login", async () =>{

    const payload = {userId: 'foo', password: '123'};

    let response = await request(app)
        .get('/api/user');
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);


    response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    //now we should be able to get it
    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(payload.userId);
});

test("Test login with wrong password", async () =>{

    const userId = "foo";
    const password = "123";
    const payload = {userId, password};

    let response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);

    response = await request(app)
        .post('/api/login')
        .send({userId, password: "a wrong password"});
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
});

test("Test logout", async () =>{

    const payload = {userId: "foo", password: "123"};

    let response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);
    const cookie = response.headers['set-cookie'];

    //now we should be able to get it
    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);

    await  request(app)
        .post('/api/logout')
        .set('cookie', cookie)
        .send();

    //the cookie is no longer valid now after a logout
    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(401);
});

