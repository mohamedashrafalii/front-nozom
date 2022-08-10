import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import staticVariables from "../../statics.json"
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
class Department extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    department:[],
    type:"",
    
    newDepartment:{
     type:"",
     
    },
    editDepartmentData: {
      id:"",
      type:"",
          },
    newDepartmentModal: false,
    editDepartmentModal:false
  }

  toggleNewDepartmenttModal() {
    this.setState({
      newDepartmentModal: ! this.state.newDepartmentModal
    });
  }

  toggleEditDepartmentModal() {
    this.setState({
      editDepartmentModal: ! this.state.editDepartmentModal
    });
  }
  getDepartments = async  ()=> {
    let {page,limit} = this.state
    const res = await axios.get(
      staticVariables.backendUrl+"/department?limit="+limit+"&page="+page
      ,{headers: { authToken : localStorage.getItem("token") }}
      );
    this.setState({ department: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };
  deleteDepartment=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/department/delete/" + id
    ,{headers: { authToken : localStorage.getItem("token") }}
    )
    .then(() => {

     this.getDepartments()
    })
    .catch(error=>{alert(error.message)});

  }

  addDepartment=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/department/add/",
    this.state.newDepartment
    ,{headers: { authToken : localStorage.getItem("token") }}
  )
  .then((response) => {
    if(response.data.msg!=="Created successfully")
    return alert(response.data)
    let { department } = this.state;
    this.getDepartments()

    this.setState({ department, newDepartmentModal: false, newDepartment: {
      type:"",
      
  }}
    )
  })

  .catch(error => {
    alert(error.message)
  })

}

      updateDepartment = async()=>{
      let {type} = this.state.editDepartmentData;
      try{

         await axios.put(staticVariables.backendUrl+"/department/" + this.state.editDepartmentData.id, {

        type
      },
      {headers: { authToken : localStorage.getItem("token") }}
      )
      .then((response) =>
      {  
          this.getDepartments()
        this.setState({
          editDepartmentModal: false, editRequestData: { id: "",
        type:""
      }})
      
      })}


     catch(error)
     {
     
      alert(   error)
     }
     }
    editDepartment=async( id )=> {
      this.setState({
        editDepartmentData: { id }, editDepartmentModal: ! this.state.editDepartmentModal
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getDepartments()})
     
     }
     
     componentDidMount()
     {this.getDepartments()

    }
render=()=>{

  // if(localStorage.getItem("token"))
  // {
  let  department = this.state.department?this.state.department.map((target) => {
 return (

         <tr key={target.id}>
           <td style={{color:"#000"}}>{target.type}</td>

           <td style={{color:"#000"}}>
           <Button color="success" size="sm" className="mr-2" onClick={()=>this.editDepartment(
         target["_id"])}>
       <EditIcon ></EditIcon></Button>
       <Button color="danger" size="sm" onClick={()=>this.deleteDepartment(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
     </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}>قسم</h1>
        <Button className="my-3" color="dark" onClick={this.toggleNewDepartmenttModal.bind(this)}>اضافة قسم</Button>



<Modal isOpen={this.state.newDepartmentModal} toggle={this.toggleNewDepartmenttModal.bind(this)}>
<ModalHeader toggle={this.toggleNewDepartmenttModal.bind(this)}>اضافة</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="type">القسم</Label>
 <Input id="type" value={this.state.newDepartment.type} onChange={(e) => {
   let { newDepartment } = this.state;

   newDepartment.type = e.target.value;

   this.setState({ newDepartment });
 }} />
</FormGroup>



</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addDepartment()}>اضافة</Button>
<Button color="secondary" onClick={this.toggleNewDepartmenttModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.editDepartmentModal} toggle={this.toggleEditDepartmentModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditDepartmentModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

     <FormGroup>

        <Label for="type">القسم</Label>
       <Input id="type" value={this.state.editDepartmentData.type} onChange={(e) => {
         let { editDepartmentData } = this.state;

         editDepartmentData.type = e.target.value;

         this.setState({ editDepartmentData });
       }} />
     </FormGroup>


    
   </ModalBody>
   <ModalFooter>
     <Button color="primary" onClick={()=>this.updateDepartment()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditDepartmentModal.bind(this)}>الغاء</Button>
   </ModalFooter>
 </Modal>

         <Table>
           <thead>
             <tr>
               <th style={{color:"#000"}}>القسم</th>
               
               <th style={{color:"#000"}}>اجراءات</th>
             </tr>
           </thead>
           <tbody>
             {department}
             <Pagination count={this.state.length} page={this.state.page} value={this.state.page} onChange={(e,value)=>this.handlePageChange(e,value)} />
           </tbody>
         </Table>

         </div>

       </div>
     );
   }
  //  else {return  (
  //    <h>Not Authorized</h>
  //  )
  //  }
  }

// }



export default Department
