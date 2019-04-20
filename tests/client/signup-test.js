import {asyncCheckCondition, overrideFetch} from '../mytest-utils'
const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
import SignUp from '../../src/client/views/signup'
import app from '../../src/server/app'
const {createUser, getUser} = require('../../src/server/db/users')


function fillForm(driver, id, password, confirm){

    const userIdInput = driver.find("#signupUsername").at(0);
    const passwordInput = driver.find("#signupPassword").at(0);
    const signUpBtn = driver.find("#signupBtn").at(0);


    userIdInput.simulate('change', {target: {value: id}});
    passwordInput.simulate('change', {target: {value: password}});

    signUpBtn.simulate('click');
}

test("Create user", async () =>{

    const userId = "Foo";
    expect(getUser(userId)).toEqual(undefined);

    overrideFetch(app);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <SignUp fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} history={history} />
        </MemoryRouter>
    );

    const password = "123";

    fillForm(driver, userId, password);


    const redirected = await asyncCheckCondition(
        () => {return page === "/"},
        2000 ,200);

    expect(redirected).toEqual(true);

    expect(getUser(userId).id).toEqual(userId);
});

test("Fail if user already exists", async () =>{

    const userId = "Foo";
    const password = "123";
    createUser(userId, password);

    overrideFetch(app);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <SignUp fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} history={history} />
        </MemoryRouter>
    );

    fillForm(driver, userId, password);

    const failed = await asyncCheckCondition(
        () => {driver.update(); return driver.html().includes('The user already exists in our database')},
        2000 ,200);

    expect(failed).toEqual(true);
});


