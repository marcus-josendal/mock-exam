import React from "react";

export class EditMenuItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuItem: null,
            dishName: '',
            ingredients: '',
            allergies: '',
            price: '',
            error: null,
        }
    }

    componentDidMount = () => {
        this.getDish()
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

    getDish = async () => {
        const url = "/api/cafeteriaMenu/" + this.props.match.params.id

        let response
        let payload
        try {
            response = await fetch(url)
            payload = await response.json()
        } catch (e) {
            alert("Something broke" + response.status)
        }
        if (response.status === 200) {
            this.setState({
                menuItem: payload,
                error: null
            })
        } else {
            this.setState({
                menuItem: null,
                error: "Issue with HTTP connection: status code " + response.status
            })
        }
    }


    updateDish = async (dishName, ingredients, allergies, price) => {
        const allergiesList = this.convertToArray(allergies)
        const ingredientsList = this.convertToArray(ingredients)
        const id = this.props.match.params.id

        if(dishName.length === 0 || ingredients.length === 0 || allergies.length === 0 || price.toString().length === 0) {
            alert("Fill in all fields please!")
            return false
        }

        const url = "/api/cafeteriaMenu/" + id
        const payload = { id, dishName, ingredientsList, allergiesList, price}
        let response

        try {
            response = await fetch(url, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            alert("Something went wrong")
            return false;
        }
        if(response.status === 204) {
            this.props.history.push("/")
            return true
        }
    }



    render() {
        if(this.state.error !== null){
            return(
                <div>
                    <p>Cannot edit book. {this.state.error}</p>
                </div>
            );
        }

        if(this.state.menuItem === null){
            return(<p>Loading...</p>)
        }

        return(
            <div>
                <p>Dish Name</p>
                <input className={"input-field"} type="text" placeholder={this.state.menuItem.dishName} value={this.state.dishName} onChange={value => this.updateDishName(value)}/>

                <p>List of Ingredients - separate each ingredient with a comma as shown in box below.</p>
                <textarea className="big-input" placeholder={this.state.menuItem.ingredients} value={this.state.ingredients} onChange={value => this.updateIngredients(value)}/>

                <p>List of Allergies - separate each ingredient with a comma as shown in box below.</p>
                <textarea  className="big-input" placeholder={this.state.menuItem.allergies} value={this.state.allergies} onChange={value => this.updateAllergies(value)}/>

                <p>Dish Price</p>
                <input className={"input-field"} type="text" placeholder={this.state.menuItem.price} value={this.state.price} onChange={value => this.updateDishPrice(value)}/>
                <button onClick={() => this.updateDish(
                    this.state.dishName,
                    this.state.ingredients,
                    this.state.allergies,
                    this.state.price,
                )}>Edit dish!</button>
            </div>
        )
    }
}

export default EditMenuItem;
