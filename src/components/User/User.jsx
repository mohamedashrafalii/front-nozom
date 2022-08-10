import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import "date-fns";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import staticVariables from '../../statics.json'
class User extends Component {

  state={
    firstTime:true,
    Users:[],
    Departments:[],
    user:
      {
        id:"", // react-beautiful-dnd unique key
      name:"",
      type:"",
      username:"",
      password:"",
      department:""
    },
    newUser:{
      name:"",
      type:"",
      username:"",
      password:"",
      department:""
    },
    newUserModal: false
  }

  toggleNewUserModal() {
    this.setState({
      newUserModal: ! this.state.newUserModal
    });
  }
    getUsers = async  ()=> {

    const res = await axios.get(
      staticVariables.backendUrl+"/users/",{headers: { authToken : localStorage.getItem("token") }}
      );
    this.setState({ Users: res.data.data });

  };

  getDepartments = async  ()=> {

    const res = await axios.get(
      staticVariables.backendUrl+"/department/",{headers: { authToken : localStorage.getItem("token") }}
      );
    this.setState({ Departments: res.data.data });

  };
  deleteUser=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/users/delete/" + id,{headers: { authToken : localStorage.getItem("token") }})
    .then((response) => {

     this.getUsers()
    })
    .catch(error=>{alert(error.message)})
    ;

  }

  addUser=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/users/addUser/",
    this.state.newUser,{headers: { authToken : localStorage.getItem("token") }}
  )
  .then((response) => {
    if(response.data.msg!=="Created successfully")
    alert(response.data)
    else{
    let { Users } = this.state;
    this.getUsers()

    this.setState({ Users, newUserModal: false, newUser: {

       name: "",
      type:"",
      username:"",
      password:"",
      department:""
  }}
    )}
      }
)

  .catch(error => {
    alert(error)
  })

}


     componentDidMount()
     {this.getUsers()
      this.getDepartments()
    }
componentDidUpdate()
{}
render=()=>{
  if(localStorage.getItem("token"))
  {
  let  Users = this.state.Users?this.state.Users.map((user) => {
 return (

         <tr key={user._id}>
          <td style={{color:"#000"}}>{user._id}</td>
           <td style={{color:"#000"}}>{user.name}</td>
           <td style={{color:"#000"}}>{user.type}</td>
           <td style={{color:"#000"}}>{user.department}</td>


           <td style={{color:"#000"}}>
       <Button color="danger" size="sm" onClick={()=>this.deleteUser(user["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
     </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}>المستخدمين</h1>
       <Button className="my-3" color="dark" onClick={this.toggleNewUserModal.bind(this)}>أضافة</Button>



<Modal isOpen={this.state.newUserModal} toggle={this.toggleNewUserModal.bind(this)}>
<ModalHeader toggle={this.toggleNewUserModal.bind(this)}>Add a new User</ModalHeader>
<ModalBody>





<FormGroup>
 <Label for="name">الاسم</Label>
 <Input  id="name" value={this.state.newUser.name} onChange={(e) => {
   let { newUser } = this.state;

   newUser.name = e.target.value;

   this.setState({ newUser });
 }} />
</FormGroup>

<FormGroup>
 <Label for="username">اسم المستخدم</Label>
 <Input id="username" value={this.state.newUser.username} onChange={(e) => {
   let { newUser } = this.state;

   newUser.username = e.target.value;

   this.setState({ newUser });
 }} />
</FormGroup>


<FormGroup>
<Label for="userType">النوع</Label>
<RadioGroup aria-label="type" name="type" value={this.state.newUser.type} onChange={(e) => {
   let { newUser } = this.state;

   newUser.type = e.target.value;

   this.setState({ newUser });
 }}>
          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
          <FormControlLabel value="user" control={<Radio />} label="User" />

</RadioGroup>
</FormGroup>

<FormGroup>
<Label for="department">القسم</Label>
<RadioGroup aria-label="department" name="department" value={this.state.newUser.department} onChange={(e) => {
   let { newUser } = this.state;

   newUser.department = e.target.value;

   this.setState({ newUser });
 }}>
          {
            this.state.Departments.map((department)=>(<FormControlLabel value={department.type} control={<Radio />} label={department.type} />))
            
          }
          
          

</RadioGroup>
</FormGroup>


<FormGroup>
 <Label for="password">Password</Label>
 <Input id="password" value={this.state.newUser.password} onChange={(e) => {
   let { newUser } = this.state;

   newUser.password = e.target.value;

   this.setState({ newUser });
 }} />
</FormGroup>


</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addUser()}>Add User</Button>
<Button color="secondary" onClick={this.toggleNewUserModal.bind(this)}>Cancel</Button>
</ModalFooter>

</Modal>



         <Table>
           <thead>
             <tr>
             <th style={{color:"#000"}}>ID</th>
               <th style={{color:"#000"}}>اسم</th>
               <th style={{color:"#000"}}>نوع</th>
               <th style={{color:"#000"}}>قسم</th>

               <th style={{color:"#000"}}>اجراءات</th>
             </tr>
           </thead>
           <tbody>
             {Users}
           </tbody>
         </Table>

         </div>

       </div>
     );
   }
   else {return  (
     <h>Not Authorized</h>
   )
   }
  }

}



export default User
