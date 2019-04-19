import * as React from 'react'
import {Link, withRouter} from 'react-router-dom';


export class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            text: "",
            messages: null
        }
    }

    componentDidMount() {


        this.socket = new WebSocket("ws://" + window.location.host)

        this.socket.onmessage = (event => {
            const msgList = JSON.parse(event.data);

            if (!Array.isArray(msgList)) return

            this.setState(
                prev => {
                    if(prev.messages === null) {
                        return { messages: msgList }
                    } else {
                        return { messages: [...prev.messages, ...msgList] };
                    }
                }
            )
        })
    }

    sendMsg = () => {

        console.log("hello")
        const payload = JSON.stringify({author: this.state.username, text: this.state.text})

        this.socket.send(payload)

        this.setState({
            text: ""
        })
    }

    updateUserName = (value) => {
        this.setState({
            username: value.target.value
        })
    }

    updateChatMessage (value) {
        this.setState({
            text: value.target.value
        })
    }

    render() {

        let messages = <div></div>;

        if(this.state.messages !== null){
            messages = <div>
                {this.state.messages.map(m =>
                    <p key={"msg_key_" + m.id}> {m.author + ": " + m.text}</p>
                )}
            </div>;
        }

        return(
            <div className={"chat-container"}>
                <h2>Talk with a chef!</h2>
                <p>Do you have any questions about the weeks menu? If you do this is the place to ask!</p>
                <input type="text"
                       className={"input-field"}
                       placeholder={this.state.username}
                       value={this.state.username}
                       onChange={this.updateUserName}/>

                <br/>

                <p>Your message:</p>
                <textarea
                    placeholder={"Your message .."}
                    className="big-input" value={this.state.ingredients}
                    onChange={value => this.updateChatMessage(value)}/>
                <button onClick={() => this.sendMsg()}>Send message!</button>
                {messages}
            </div>
        )
    }
}

export default withRouter(Chat)
