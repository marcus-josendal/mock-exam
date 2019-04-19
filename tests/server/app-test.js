const request = require('supertest');

const app = require('../../src/server/app');


test("Test get all", async () =>{

    const response = await request(app).get('/api/cafeteriaMenu');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
});

test("Test get one", async () =>{

    const response = await request(app).get('/api/cafeteriaMenu/1');

    expect(response.body.id).toBe(1)
    expect(response.statusCode).toBe(200);
});

test("Test get one not found", async () =>{

    const response = await request(app).get('/api/cafeteriaMenu/5');

    expect(response.statusCode).toBe(404);
});


test("Delete all dishes", async () =>{

    let responseAll = await request(app).get('/api/cafeteriaMenu');
    expect(responseAll.statusCode).toBe(200);

    const dishes = responseAll.body;
    expect(dishes.length).toBe(3);

    for(let i = 0; i < dishes.length; i++){

        const res = await request(app).delete('/api/cafeteriaMenu/'+ dishes[i].id);
        expect(res.statusCode).toBe(204);
    }

    responseAll = await request(app).get('/api/cafeteriaMenu');
    expect(responseAll.statusCode).toBe(200);
});

test("Test update dish", async () => {

    const dish = "Pizza"

    //Create a dish
    const resPost = await request(app)
        .post('/api/cafeteriaMenu')
        .send({dishName: dish, ingredientsList:["hello, hello"], allergiesList: ["hello, hello"], price: 100})
        .set('Content-Type', 'application/json');
    expect(resPost.statusCode).toBe(201);
    const location = resPost.header.location;

    //Get the dish back
    let resGet = await request(app).get(location);
    expect(resGet.statusCode).toBe(200);
    expect(resGet.body.dish).toBe(dish);

    const id = location.substring(location.lastIndexOf("/")+1, location.length);
    const modifiedTitle = "Another dish"

    const resPut = await request(app)
        .put(location)
        .send({id: id, dishName: modifiedTitle, ingredientsList:["hello, hello"], allergiesList: ["hello, hello"], price: 100})
        .set('Content-Type', 'application/json');
    expect(resPut.statusCode).toBe(204);

    resGet = await request(app).get(location);
    expect(resGet.statusCode).toBe(200);
    expect(resGet.body.dish).toBe(modifiedTitle);
})

test("Test create dish", async () => {

    let responseAll = await request(app).get('/api/cafeteriaMenu');
    const initialBodyLength = responseAll.body.length;

    const title = "hello";

    const resPost = await request(app)
        .post('/api/cafeteriaMenu')
        .send({dishName: "hello", ingredientsList:["hello, hello"], allergiesList: ["hello, hello"], price: 100})
        .set('Content-Type', 'application/json');

    expect(resPost.statusCode).toBe(201);
    const location = resPost.header.location;

    responseAll = await request(app).get('/api/cafeteriaMenu');
    expect(responseAll.body.length).toBe(initialBodyLength + 1);

    const resGet = await request(app).get(location);
    expect(resGet.statusCode).toBe(200);
    expect(resGet.body.dish).toBe(title);
});
