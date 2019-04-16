import React from "react";
import ReactDOM from "react-dom";
import Home from './views/home'
import Login from './views/login'
import SignUp from './views/signup'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import AddMenuItem from "./views/add-menu-item";
import EditMenuItem from "./views/edit-menu-item";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    componentDidMount() {
        this.fetchAndUpdateUserInfo().then(() => {
            console.log(this.state.user)
        });
    }


    fetchAndUpdateUserInfo = async () => {

        const url = "/api/user";

        let response;

        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }

        if (response.status === 401) {
            //that is ok
            this.updateLoggedInUser(null);
            return;
        }

        if (response.status !== 200) {
            //TODO here could have some warning message in the page.
        } else {
            const payload = await response.json();
            this.updateLoggedInUser(payload);
        }
    };

    updateLoggedInUser = (user) => {
        this.setState({user: user});
    };


    notFound() {
        return (
            <div>
                <h2>NOT FOUND: 404</h2>
                <p>
                    ERROR: the page you requested in not available.
                </p>
            </div>
        );
    };

    render () {

        const id = this.state.user ? this.state.user.id : null;
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path="/"
                               render={props => <Home {...props}
                                                      userId={id}
                                                      user={this.state.user}
                                                      updateLoggedInUser={this.updateLoggedInUser}
                                                      fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                               />}/>
                        <Route exact path="/login"
                               render={props => <Login {...props}
                                                       fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route exact path="/signup"
                               render={props => <SignUp {...props}
                                                        fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route exact path="/add-menu-item" component={AddMenuItem}/>
                        <Route exact path="/edit-menu-item/:id" component={EditMenuItem}/>
                        <Route component={this.notFound}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"))
