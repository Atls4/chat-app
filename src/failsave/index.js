import React from "react";
import ReactDOM from "react-dom";
import openSocket from "socket.io-client";

const socket = openSocket();
function myConnection(){
    socket.on('message', function(msg){
        console.log("From server:", msg);
        let data = {
            username: 'lol',
            message: msg
        }
        messageData.push(data);
    });
}
function MyList(props){
    const data = props.data;
    const listItems = data.map((number) => 
    <li>{number.username}: {number.message}</li>
);
    return (
        <ul>{listItems}</ul>
    );
}
const messageData = [{username: 'Viktor', message: 'Allo'},{username: 'Dog', message: 'Lol'}];
//Chat
class Username extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <button>
                <span>
                    <span>username</span>
                </span>
            </button>
        )
    }
}
// class Button extends React.Component();
class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state = {toggle: true}
        myConnection()
        this.handleclick = this.handleclick.bind(this);
    }
    handleclick(){
        this.setState(prevState =>({
            toggle : !prevState.toggle
        }));
    }
    render(){
        return(
            <div>
                <span/>
                <Username/>
                <span>: </span>
                <span>my message</span>
                
            </div>
        )
    }
};
const sendStuff = function(){
    let msg = 'hello';
    socket.emit('message', msg);
}
const Index = () => {
    return (<div> 
        <Chat/>
        <button onClick={sendStuff}>Send</button>
        <MyList data={messageData}/>
        </div>
    )
};
ReactDOM.render(<Index/>, document.getElementById("index"));