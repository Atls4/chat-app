import React from "react";
import ReactDOM from "react-dom";
import openSocket from "socket.io-client";

//Open socket
const socket = openSocket();
//------------------------------------------------------
//ChatMessageField--------------------------------------
//======================================================

//BetterMessage
function BetterMessage(props){
    let messageList = props.messages;
    console.log('Message list', messageList, messageList[0].message);

    let listItems = messageList.map((item, index) => 
        
        <li className="user-message" key={item.username +'_' + index} betterKey={item.username +'_' + index}>
            <span>{
                item.badge !== false &&
                <a><img alt='Subscribr' src='https://static-cdn.jtvnw.net/badges/v1/8ca5c63e-70c2-420b-9920-491945e9c0c3/1'></img></a>
            }
            </span>
            <a style={{color: item.color}} className="userName">{item.username}</a>
            <span>: </span>
            <span >{item.message}</span>
            {console.log('AYY LMAO')}
        </li>
        
    );
    console.log('Alpha', listItems);
    return (
        <ul className='chat-list'>{listItems}</ul>
    )
}
//------------------------------------------------------
//ChatMessageField---Unused------------------------------
//======================================================
class Messagefield extends React.Component{
    constructor(props){
        super(props)
        this.state = {list: []};
    }
    componentDidUpdate(prevProps){
        console.log('b', this.props.messages);
        // if(this.props.messages !== prevProps.messages){
            let data = this.props.messages;
            console.log("data:" ,data.message);
            
            let listItems = data.map((items) => {
                <li>{items.message}</li>
            })
            this.setState({list: listItems});
            console.log('Received props', this.state.list, listItems);
        // }
        
    }
    render(){
        console.log('a',this.props.messages);

        return(
            <ul>{this.state.list}</ul>
        )
    }
}
//===================================================================
//Chat input class===================================================
//===================================================================
class Inputfield extends React.Component{
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

    }
    handleChange(e){
        this.props.onTextInputChange(e.target.value);
    }
    handleKeyDown(e){
        
        if(e.keyCode == 13){
            e.preventDefault();
            this.props.onEnterPress();
            this.refs.inText.value = '';
        }
    }
    componentDidUpdate(prevProps){
        console.log('Elozo: ',prevProps.enterEvent);
        if(prevProps.enterEvent !== this.props.enterEvent){
            this.refs.inText.value = '';
        }
    }
    render(){
        return(
            <div>
                <textarea id='input_text' ref='inText' placeholder="Write something!" onKeyDown={this.handleKeyDown} onChange={this.handleChange}/>
            </div>
        )
    }
}
//=================================================================
//Chat input control===============================================
//=================================================================
class Inputbuttons extends React.Component{
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.props.onSendMessage();
    }
    render(){
        return(
            <div className="inp-group">
                {/* Button group left  */}
                <div className="inp-group-left">
                    <div className="wrapper-settings">
                        <button className="reset-button">
                                <span className="icon-button font-10px">
                                    <i class="fas fa-cog fa-2x item-center"></i>
                                </span>
                        </button>
                    </div>
                    <div className="wrapper-nameList">
                        <button className="reset-button">
                                <span className="icon-button font-10px">
                                    <i class="fas fa-list-ul fa-2x item-center"></i>
                                </span>
                        </button>
                    </div>
                </div>
                {/* Button group right  */}
                <div className="inp-group-right">
                    <button onClick= {this.handleClick} className="inputBttn">
                        <span className="inputBttn-text">Send</span>
                    </button>
                </div>
    
            </div>
        )
    }
}
//========================================================
//Chat app class==========================================
//========================================================
class ChatApp extends React.Component{
    constructor(props){
        super(props)
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.handleEnterPress = this.handleEnterPress.bind(this);
        this.state = {message: 'System', chat: ['Welcome to chat'], enterEvent: false};

    }
    componentDidMount(){
        socket.on('message', (msg) => {
            let chatMsg = this.state.chat;
            let newMsg = msg
            chatMsg.push(newMsg);
            this.setState(chatMsg);
            console.log('From server: ' ,msg);
            console.log(this.state.chat)
        })
    }
    handleTextInputChange(msg){        
        this.setState({message: msg});
    }
    handleSendMessage(){

        socket.emit('message', this.state.message);
        console.log('Message sent to server: ', this.state.message);
        //SWITCHEROO
        this.state.enterEvent?this.setState({enterEvent: false}):this.setState({enterEvent:true});
    }
    handleEnterPress(){
        socket.emit('message', this.state.message);
        console.log('Message sent to server: ', this.state.message);
    }
    render(){
        return(
            <div className='flex-column'>
                <div className='flex-column'>
                    <BetterMessage messages= {this.state.chat}/>
                </div>
                <div className='input-group'>
                    <div>
                        <Inputfield
                        onTextInputChange = {this.handleTextInputChange}
                        onEnterPress = {this.handleEnterPress}
                        enterEvent = {this.state.enterEvent}
                        />
                    
                    </div>
                    <div>
                        <Inputbuttons
                        onSendMessage = {this.handleSendMessage}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
//Render app here
ReactDOM.render(<ChatApp/>, document.getElementById('index'));