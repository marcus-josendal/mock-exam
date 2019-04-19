

let cafeteriaMenu = [
    {
        id: 0,
        dish: "Pepperoni Pizza",
        ingredients: [
            "Cheese",
            "Tomato Sauce",
            "Flour",
            "Milk",
            "Salt",
            "Pepperoni"
        ],
        allergies: [
            "Lactose",
            "Gluten"
        ],
        price: 200,
    },
    {
        id: 1,
        dish: "Lasagna",
        ingredients: [
            "Cheese",
            "Tomato Sauce",
            "Ground Beef",
            "Milk",
            "Salt",
            "Water"
        ],
        allergies: [
            "Lactose",
            "Gluten"
        ],
        price: 300,
    },
    {
        id: 2,
        dish: "Pasta",
        ingredients: [
            "Flour",
            "Water",
            "Salt",
        ],
        allergies: [
            "Gluten"
        ],
        price: 150,
    }
]

function getMenu() {
    return cafeteriaMenu
}

function getOneMenuItem (id) {

    let item = null
    cafeteriaMenu.map(menuItem => {
        if(menuItem.id.toString() === id) item = menuItem
    })
    return item
}

function addMenuItem(name, ingredients, allergies, price) {
    const item = {
        id: cafeteriaMenu.length,
        dish: name,
        ingredients: ingredients,
        allergies: allergies,
        price: price
    }

    cafeteriaMenu.push(item)
    return cafeteriaMenu.length - 1
}

function deleteMenuItem(id) {
    let newMenu = []
    let i = 0

    cafeteriaMenu.map(menuItem => {
        if(menuItem.id.toString() !== id){
            menuItem.id = i
            i++
            newMenu.push(menuItem)
        }
    })

    cafeteriaMenu = newMenu
    return true
}

function updateMenuItem(item) {


    cafeteriaMenu[item.id] = {
        id: item.id,
        dish: item.dishName,
        ingredients: item.ingredientsList,
        allergies: item.allergiesList,
        price: item.price
    }

    return true;
}


module.exports = { getMenu, deleteMenuItem, addMenuItem, getOneMenuItem, updateMenuItem }
