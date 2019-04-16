import React from "react";

export class AddMenuItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dishName: '',
            allergies: '',
            ingredients: '',
            price: '',
        }
    }

    updateDishName(value) {
        this.setState({
            dishName: value.target.value
        })
    }

    updateAllergies(value) {
        this.setState({
            allergies: value.target.value
        })
    }

    updateIngredients(value) {
        this.setState({
            ingredients: value.target.value
        })
    }

    updateDishPrice(value) {
        this.setState({
            price: value.target.value
        })
    }

    addDish = (dishName, allergies, ingredients, price) => {
        const allergiesList = convertToArray(allergies)
        const ingredientsList = convertToArray(ingredients)
    }



    render() {
        return(
            <div>
                <p>Dish Name</p>
                <input className={"input-field"} type="text" value={this.state.dishName} onChange={value => this.updateDishName(value)}/>

                <p> List of Allergies - separate each ingredient with a comma as shown in box below. </p>
                <textarea placeholder={"Lactose, Gluten, Mushroom"} className="big-input" value={this.state.allergies} onChange={value => this.updateAllergies(value)}/>

                <p>List of Ingredients - separate each ingredient with a comma as shown in box below.</p>
                <textarea placeholder={"Tomatoes, Beef, Cabbage"} className="big-input" value={this.state.ingredients} onChange={value => this.updateIngredients(value)}/>

                <p>Dish Price</p>
                <input className={"input-field"} type="text" value={this.state.price} onChange={value => this.updateDishPrice(value)}/>
                <button onClick={() => this.addDish(
                    this.state.dishName,
                    this.state.allergies,
                    this.state.ingredients,
                    this.state.price,
                )}>Add dish!</button>
            </div>
        )
    }
}

export default AddMenuItem;

