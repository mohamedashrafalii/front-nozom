import React, { Component } from 'react'
import { Routes ,BrowserRouter, Route } from "react-router-dom";
import Dashboard from './components/Dashboard/Dashboard.jsx';
import SignIn from './components/SignIn/SignIn.jsx';
class App extends Component {
  state={
    // token:"",

    // username:""
  }

  // callbackFunction= (childData)=> {

  //   this.setState({token: childData.token,username:childData.username})
  //   localStorage.setItem('token',childData.token)
    


// }


//   UNSAFE_componentWillUpdate(nextProps,nextState)
// {
//   localStorage.setItem('token',nextState.token)
// }
// UNSAFE_componentWillMount()
// {
//   localStorage.getItem('token')&&this.setState({token:localStorage.getItem('token')})
// }

  render() {

    return (



<div>

   <BrowserRouter>
   <Routes>
   <Route exact path="/"  element={<SignIn 
  //  key="2" value={this.callbackFunction} 
   />} />
   <Route exact path="/main/admin"  element={<Dashboard/>} />
   <Route exact path="/main/user"  element={<Dashboard/>} />
   
   

   <Route element={<h1 style={{color:"red"}}>Can't find what you are looking for!</h1>}/>
   </Routes>
   </BrowserRouter>
</div>
    )

    }
}

export default App;
