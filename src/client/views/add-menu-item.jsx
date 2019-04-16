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

    convertToArray(array) {
        return array.trim().split(",")
    }

    addDish = async (dishName, ingredients, allergies, price) => {
        const allergiesList = this.convertToArray(allergies)
        const ingredientsList = this.convertToArray(ingredients)

        if(dishName.length === 0 || ingredients.length === 0 || allergies.length === 0 || price.toString().length === 0) {
            alert("Fill in all fields please!")
            return false
        }

        const url = "/api/cafeteriaMenu"
        const payload = {dishName, ingredientsList, allergiesList, price}
        let response
        console.log(payload)


        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            alert("Something went wrong")
            return false;
        }

        if(response.status === 201) {
            this.props.history.push("/")
            return true
        }
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
                    this.state.ingredients,
                    this.state.allergies,
                    this.state.price,
                )}>Add dish!</button>
            </div>
        )
    }
}

export default AddMenuItem;

