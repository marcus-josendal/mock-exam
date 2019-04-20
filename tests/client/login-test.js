import {asyncCheckCondition, overrideFetch} from '../mytest-utils'
const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
import Login from '../../src/client/views/login'
import app from '../../src/server/app'
const {createUser} = require('../../src/server/db/users')



function fillForm(driver, id, password){

    const userIdInput = driver.find("#username").at(0);
    const passwordInput = driver.find("#password").at(0);
    const loginBtn = driver.find("#loginbtn").at(0);

    userIdInput.simulate('change', {target: {value: id}});
    passwordInput.simulate('change', {target: {value: password}});

    loginBtn.simulate('click');
}

test("Should check for login to have error", async () => {
    overrideFetch(app);
    const driver = mount(
        <MemoryRouter>
            <Login />
        </MemoryRouter>);

    fillForm(driver, "foo", "123");

    const error = await asyncCheckCondition(
        () => {driver.update(); return driver.html().includes("Wrong username or password")},
        2000 ,200);

    expect(error).toEqual(true);
});

test("Test valid login", async () =>{

    const userId = "Foo";
    const password = "123";
    createUser(userId, password);

    overrideFetch(app);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <Login fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} history={history} />
        </MemoryRouter>
    );

    fillForm(driver, userId, password);

    const redirected = await asyncCheckCondition(
        () => {return page === "/"},
        2000 ,200);

    expect(redirected).toEqual(true);
});


