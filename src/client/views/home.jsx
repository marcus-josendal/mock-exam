import React from "react";
import { Link, withRouter } from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menu: null,
            error: null
        }
    }

    componentDidMount = () => {
        this.getMenu()
        console.log(this.props.userId)
    }


    async getMenu() {

        const url = "/api/cafeteriaMenu"

        let response
        let payload

        try {
            response = await fetch(url)
            payload = await response.json();
        } catch (error) {
            this.setState({
                menu: null,
                error: "Error with retrieving the Menu"
            })
            return
        }

        if (response.status === 200) {
            this.setState({
                menu: payload,
                error: null
            });
        } else {
            this.setState({
                menu: null,
                error: "Issue with Http connection " + response.status
            })
        }
    }

    deleteMenuItem = async(id) => {
        const url = "api/cafeteriaMenu"

        let response

        try {
            response = await fetch(url, {method: "delete"})
        } catch (e) {
            alert("Delete operation failed: " + e);
            return false;
        }

        if (response.status !== 204) {
            alert("Delete operation failed: status code " + response.status);
            return false;
        }

        this.getMenu()

        return true;
    }

    doLogout = async () => {
        const url = "/api/logout";

        let response;

        try {
            response = await fetch(url, {method: "post"});
        } catch (err) {
            alert("Failed to connect to server: " + err);
            return;
        }

        if (response.status !== 204) {
            alert("Error when connecting to server: status code " + response.status);
            return;
        }

        this.props.updateLoggedInUser(null)
        this.props.history.push("/");
    }

    loggedIn(userId) {
        return (
            <div>
                <h3>Welcome { this.props.userId}</h3>
                <button onClick={this.doLogout}>Logout</button>
            </div>
        )
    }

    notLoggedIn() {
        return (
            <div>
                <h3>You are not logged in</h3>
                <Link className={"link"} to={"/signup"}> Link to sign-in page </Link>
                <br/>
                <Link className={"link"} to={"/login"}> Link to login page </Link>
            </div>
        )
    }


    render() {
        let menu
        let authContent
        if (this.state.error !== null) {
            menu = <p> There is something wrong with the server </p>
        } else if (this.state.menu === null || this.state.menu.length === 0) {
            menu = <p> There is no menu in the database </p>
        } else {
            menu = this.state.menu.map(menuItem => {
                return <div className={"menu-item"} key={menuItem.dish}>
                    <h2>{menuItem.dish}</h2>
                    <h4>Ingredients </h4>
                    <p>
                        {
                            menuItem.ingredients.map(ingredient => {
                                return ingredient + ", "
                            })
                        }
                    </p>
                    <h4>Allergies: </h4>
                    <p>
                        {
                            menuItem.ingredients.map(allergy => {
                                return allergy + ", "
                            })
                        }
                    </p>
                    <h4>Price: </h4>
                    <p>{menuItem.price}</p>
                    <button onClick={_ => this.deleteMenuItem(menuItem.id)}>Delete</button>
                    <button>Edit</button>
                </div>
            })
            const userId = this.props.userId
            if (!userId) {
                authContent = this.notLoggedIn()
            } else {
                authContent = this.loggedIn()
            }
        }
        return (
            <div className="home-container">
                <h1 className={"headline-login"}> Best Cafeteria in the world 5/7 </h1>
                {authContent}
                <br/>
                <h1 className={"headline-login"}> Weeks menu </h1>
                <div className={"menu-items-container"}>
                    {menu}
                </div>
            </div>
        )
    }
}
export default Home;

