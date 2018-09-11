import React from "react";
import ReactDOM from "react-dom";
import openSocket from "socket.io-client";

//Open socket
const socket = openSocket();
//------------------------------------------------------
//ChatMessageField--------------------------------------
//======================================================
class Message extends React.Component{
    constructor(props){
        super(props)

    }
    render(){
        return(
            
            <li className="user-message">
                    <span></span>
                    <a style={{color: this.props.chat.color}} className="userName">{this.props.chat.username}</a>
                    <span>: </span>
                    <span >{this.props.chat.message}</span>
            </li>
        )
    }
}
//I guess I dont need this anymore
class ScrollPopUp extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        
        return(
            <div>
            {
                 this.props.scrollUp ? <div>Allo</div>:<div></div>
            }
            </div>
        )
    }
}
//Message field stuff here
class Messagefield extends React.Component{
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            chats: [this.props.messages],
            scrollUp : false
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.counter !== prevProps.counter){
            if(!this.state.scrollUp){
                this.scrollToBot();
            }
        }
    }


    scrollToBot(){
        ReactDOM.findDOMNode(this.refs.chatStuff).scrollIntoView();
    }

    handleClick(){
        this.scrollToBot();        
        this.setState({scrollUp: false});
    }

    render(){

        return(
            <div className='flex-column'>
                <div style={{ 'overflow-y': 'scroll'}} onWheel={
                    event => {
                        if(event.nativeEvent.wheelDelta > 0){
                            console.log('scroll up')
                            this.setState({scrollUp: true});
                        } else {
                            console.log('scroll down');
                            
                        }
                    }
                }>
                    <ul className='chat-list'>
                    {
                    
                    this.props.messages.map((chat) => 
                            chat.username && <Message chat={chat} />
                        )

                    }
                    </ul>
                    <div style={{ float:"left", clear: "both" }}
                        ref='chatStuff'></div>
                </div>
                {/* <ScrollPopUp onClick = {this.handleClick} scrollUp = {this.state.scrollUp}/> */}
                <div onClick = {this.handleClick}>
                    {
                        this.state.scrollUp ? 
                            <div className="CenterContent">
                                <div>Show more messages</div>
                            </div>
                            :
                            <div></div>
                    }

                </div>
            </div>
        );
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
        this.state = {message: 'System', chat: ['Welcome to chat'], enterEvent: false, msgCounter: 0};

    }
    componentDidMount(){
        socket.on('message', (msg) => {
            let chatMsg = this.state.chat;
            let newMsg = msg;
            chatMsg.push(newMsg);
            this.setState(chatMsg);

            let counter = this.state.msgCounter;
            counter++;
            this.setState({msgCounter: counter});
        })
    }
    handleTextInputChange(msg){        
        this.setState({message: msg});
    }
    handleSendMessage(){

        socket.emit('message', this.state.message);
        //SWITCHEROO
        this.state.enterEvent?this.setState({enterEvent: false}):this.setState({enterEvent:true});
    }
    handleEnterPress(){
        socket.emit('message', this.state.message);
    }
    render(){
        return(
            <div className='flex-column'>
                <div className='flex-column'>
                    <Messagefield 
                    messages= {this.state.chat}
                    counter = {this.state.msgCounter}
                    />
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