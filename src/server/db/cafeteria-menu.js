

cafeteriaMenu = [
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
    return this.cafeteriaMenu
}

function getOneMenu () {
    return null
}

module.exports = { getMenu, getOneMenu }
