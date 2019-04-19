import {asyncCheckCondition, flushPromises, overrideFetch, stubFetch} from '../mytest-utils'

const React = require('react');
const {mount} = require('enzyme');
const {BrowserRouter} = require('react-router-dom');
const {MemoryRouter} = require('react-router-dom');

import Home from '../../src/client/views/home'
import {getMenu} from '../../src/server/db/cafeteria-menu'
const express = require('express');
import app from '../../src/server/app'

const notLogMsg = "You are not logged in"

test("Does component mount", async () => {
    const driver = mount(
        <BrowserRouter>
            <Home />
        </BrowserRouter>
    );

    const html = driver.html();
    expect(html.includes("Best Cafeteria")).toBe(true)
});

test("Test failed fetch", async () => {

    stubFetch(500, {}, null);

    const driver = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Home/>
        </MemoryRouter>
    );

    await flushPromises();

    const html = driver.html();

    expect(html).toMatch("Issue");
});

test("Test display 1 dish using stub", async () => {

    const dish = "Pizza";

    stubFetch(
        200,
        [{id:0, dish: dish, ingredients: ["Cheese"], allergies: ["Gluten"], price: 200}],
        (url) => url.endsWith("/api/cafeteriaMenu")
    );


    const driver = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Home/>
        </MemoryRouter>
    );

    await flushPromises();

    const html = driver.html();
    console.log(html)

    //here we just check it appears somewhere in the updated HTML
    expect(html).toMatch(dish);
});

test("Test display all dishes using SuperTest", async () => {

    overrideFetch(app);

    const driver = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Home/>
        </MemoryRouter>
    );

    //let's check if table is displayed within a certain amount of time

    const predicate = () => {
        //needed if changed HTML since component was mounted
        driver.update();
        const menu = driver.find('.menu-item');
        const menuDisplayed =  (menu.length >= 1);
        return menuDisplayed;
    };

    const menuDisplayed = await asyncCheckCondition(predicate, 3000, 500);
    expect(menuDisplayed).toBe(true);

    const menu = getMenu();
    const html = driver.html();

    for(let i = 0 ; i< menu.length; i++){
        expect(html).toMatch(menu[i].dish);
    }
});

test("Test not logged in", async () => {

    const userId = null;
    const updateLoggedInUser = () => {};

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Home userId={userId} updateLoggedInUser={updateLoggedInUser} />
        </MemoryRouter>
    );

    const html = driver.html();
    expect(html.includes(notLogMsg)).toEqual(false);
});

test("Test logged in", async () => {

    overrideFetch(app);

    const driver = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Home/>
        </MemoryRouter>
    );

    //let's check if table is displayed within a certain amount of time

    const predicate = () => {
        //needed if changed HTML since component was mounted
        driver.update();
        const menu = driver.find('.loggedIn');
        const menuDisplayed =  (menu.length >= 1);
        return menuDisplayed;
    };

    const menuDisplayed = await asyncCheckCondition(predicate, 3000, 500);
    expect(menuDisplayed).toBe(true);

    const menu = getMenu();
    const html = driver.html();
});


