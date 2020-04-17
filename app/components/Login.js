import React, {Component} from 'react'
import Draw from './Draw'



export default class Login extends Component {

    constructor(props){
        super(props)
        this.state={
            img: 'https://pdftron.s3.amazonaws.com/downloads/pl/illustration.png'
        }
        this.setUser = this.setUser.bind(this);
    }


    setUser(user){
        this.setState({
            currUser: user
        })
    }


    render(){

        if(!this.state.currUser){
            return(
                <ul>
                    {this.props.usernames.map((username)=>(
                        <li key={username}>
                           <button   onClick={()=>this.setUser(username)}> {username}</button>
                        </li>
                    ))}
                </ul>
            )
        }else{
            return(
                <Draw user={this.state.currUser} setUser={this.setUser} img={this.state.img} />
            )
        }
    }
}