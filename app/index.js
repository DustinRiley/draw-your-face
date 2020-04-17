import React from 'react';
import ReactDom from 'react-dom'
import Login from './components/Login'
import './index.css'


const usernames= ['Andy', 'Steve', 'Jim', 'Pam', 'Dwight']



class App extends React.Component{
    
    render(){
        return (<div className="container"> 
                <Login usernames={usernames} />
             </div>)
    }

}

ReactDom.render(
     <App />,
     document.getElementById('app')
 )