import {asyncCheckCondition, overrideFetch} from '../mytest-utils'
const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
import AddMenuItem from '../../src/client/views/add-menu-item'
import app from '../../src/server/app'
const {createUser} = require('../../src/server/db/users')

function fillForm(driver, dishName, ingredients, allergies, price){
    const dishNameInput = driver.find("#addDishName");
    const ingredientInput = driver.find("#addIngredients").at(0);
    const allergiesInput = driver.find("#addAllergies").at(0);
    const priceInput = driver.find("#addPrice").at(0);
    const editBtn = driver.find("#addDish").at(0);

    dishNameInput.simulate('change', {target: {value: dishName}});
    ingredientInput.simulate('change', {target: {value: ingredients.join(", ")}});
    allergiesInput.simulate('change', {target: {value: allergies.join(", ")}});
    priceInput.simulate('change', {target: {value: price}});

    editBtn.simulate('click');
}

test("Test add dish", async () =>{

    overrideFetch(app);
    let page = null;
    const history = {push: (h) => {page=h}};
    const dishName = "Pizza"
    const ingredientList = ["Cheese", "Tomato"]
    const allergiesList = ["Lactose, Gluten"]
    const price = 200

    const driver = mount(
        <MemoryRouter initialEntries={["/add-menu-item/"]}>
            <AddMenuItem history={history} />
        </MemoryRouter>
    );

    await asyncCheckCondition(() => {
        return !driver.html().includes("Loading...")
    }, 2500, 20)

    driver.update()

    fillForm(driver, dishName, ingredientList, allergiesList, price);

    const redirected = await asyncCheckCondition(
        () => {return page === "/"},
        2000 ,200);

    expect(redirected).toEqual(true);
});
