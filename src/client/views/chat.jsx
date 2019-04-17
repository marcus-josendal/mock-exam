import * as React from 'react'


export class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.props.user.id,
            text: "",
            messages: null
        }
    }

    componentDidMount() {

        //Creates a new websocket connection
        this.socket = new WebSocket("ws://" + window.location.host)

        this.socket.onmessage = (event => {
            const msgList = JSON.parse(event.data);

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
        const payload = JSON.stringify({username: this.state.username, text: this.state.text})

        this.socket.send(payload)

        this.setState({
            text: ""
        })
    }

    updateUserName (value) {
        this.setState({
            username: value.target.value
        })
    }

    render() {
        return(
            <div className={"chat-container"}>
                <h2>Talk with a chef!</h2>
                <p>Do you have any questions about the weeks menu? If you do this is the place to ask!</p>
                <input type="text"
                       className={"input-field"}
                       value={this.state.name}
                       onChange={this.updateUserName}/>

                <br/>

                <p>Your message:</p>
                <textarea
                    placeholder={"Tomatoes, Beef, Cabbage"}
                    className="big-input" value={this.state.ingredients}
                    onChange={value => this.updateIngredients(value)}/>

            </div>
        )
    }

}
