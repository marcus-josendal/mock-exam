import React from "react";
import {Link} from 'react-router-dom'

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            pw: '',
            errorMsg: null
        }
    }

    render () {
        return(
            <div className={"sign-login-container"}>
                <h1 className={"headline"}>Log in with your username and password</h1>

                <h3 className={"align-left"}>Username: </h3>
                <input
                    className={"input-field"}
                    id={"username"}
                    type="text"
                    value={this.state.username}
                    onChange={value => this.updateUserName(value)}
                />

                <h3 className={"align-left"}>Password: </h3>
                <input
                    className={"input-field"}
                    id={"password"}
                    type="password"
                    value={this.state.pw}
                    onChange={value => this.updatePassword(value)}
                />

                <p> {this.state.errorMsg} </p>
               <button id={"loginbtn"} className={"standard-button"} onClick={this.logIn}>Login</button>
            </div>
        );
    }

    updateUserName (value) {
        this.setState({
            username: value.target.value
        })
    }

    updatePassword (value) {
        this.setState({
            pw: value.target.value
        })
    }

    logIn = async () => {
        const {username, pw} = this.state;

        const url = "/api/login";

        const payload = {userId: username, password: pw};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: "+ err});
            return;
        }


        if(response.status === 401){
            this.setState({errorMsg : "Wrong username or password"});
            return;
        }

        if(response.status !== 204){
            this.setState({errorMsg: "Error when connecting to server: status code "+ response.status});
            return;
        }

        this.setState({errorMsg: null});

        if(response.status === 204) {
            await this.props.fetchAndUpdateUserInfo()
            this.props.history.push('/');
        }
    };
}

export default Login;
