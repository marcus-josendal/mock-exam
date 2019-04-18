import React from "react";
import {Link} from 'react-router-dom'


export class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            pw: '',
            errorMessage: null
        }
    }

    render () {
        return(
            <div className="sign-login-container">
                <h1 className={"headline"}>Sign in by creating a user</h1>

                <h3 className={"align-left"}>Username: </h3>
                <input
                    className={"input-field"}
                    type="text" value={this.state.username}
                    onChange={value => this.updateUserName(value)}/>

                <h3 className={"align-left"}>Password: </h3>
                <input
                    className={"input-field"}
                    type="password" value={this.state.pw}
                    onChange={value => this.updatePassword(value)}/>

                <button className={"standard-button"} onClick={this.signUp}>Create user</button>
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

    signUp = async () => {
        const {username, pw} = this.state

        const url = "/api/signup"

        const payload = {userId: username, password: pw}

        let response

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
        } catch (error) {
            this.setState({errorMessage: "Failed to connect to the server " + error})
        }

        if(response.status === 400) {
            this.setState({errorMessage: "Invalid username or password"})
        }

        if(response.status !== 201){
            this.setState({errorMsg: "Error when connecting to server: status code " + response.status});
        }

        this.setState({errorMsg: null})
        if(response.status === 201) {
            await this.props.fetchAndUpdateUserInfo()
            this.props.history.push("/")
        }
    }
}

export default SignUp;
