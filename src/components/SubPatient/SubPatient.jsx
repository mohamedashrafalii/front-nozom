import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import staticVariables from "../../statics.json"
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
class SubPatient extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    subPatient:[],
    type:"",
    
    newSubPatient:{
     type:"",
     
    },
    editSubPatientData: {
      id:"",
      type:"",
          },
    newSubPatientModal: false,
    editSubPatientModal:false
  }

  toggleNewSubPatienttModal() {
    this.setState({
      newSubPatientModal: ! this.state.newSubPatientModal
    });
  }

  toggleEditSubPatientModal() {
    this.setState({
      editSubPatientModal: ! this.state.editSubPatientModal
    });
  }
  getSubPatients = async  ()=> {
    let {page,limit} = this.state
    const res = await axios.get(
      staticVariables.backendUrl+"/subPatient?limit="+limit+"&page="+page
      ,{headers: { authToken : localStorage.getItem("token") }}
      );
    this.setState({ subPatient: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };
  deleteSubPatient=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/subPatient/delete/" + id
    ,{headers: { authToken : localStorage.getItem("token") }}
    )
    .then(() => {

     this.getSubPatients()
    })
    .catch(error=>{alert(error.message)});

  }

  addSubPatient=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/subPatient/add/",
    this.state.newSubPatient
    ,{headers: { authToken : localStorage.getItem("token") }}
  )
  .then((response) => {
    if(response.data.msg!=="Created successfully")
    return alert(response.data)
    let { subPatient } = this.state;
    this.getSubPatients()

    this.setState({ subPatient, newSubPatientModal: false, newSubPatient: {
      type:"",
      
  }}
    )
  })

  .catch(error => {
    alert(error.message)
  })

}

      updateSubPatient = async()=>{
      let {type} = this.state.editSubPatientData;
      try{

         await axios.put(staticVariables.backendUrl+"/subPatient/" + this.state.editSubPatientData.id, {

        type
      },
      {headers: { authToken : localStorage.getItem("token") }}
      )
      .then((response) =>
      {  
          this.getSubPatients()
        this.setState({
          editSubPatientModal: false, editRequestData: { id: "",
        type:""
      }})
      
      })}


     catch(error)
     {
     
      alert(   error)
     }
     }
    editSubPatient=async( id )=> {
      this.setState({
        editSubPatientData: { id }, editSubPatientModal: ! this.state.editSubPatientModal
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getSubPatients()})
     
     }
     
     componentDidMount()
     {this.getSubPatients()

    }
render=()=>{

  // if(localStorage.getItem("token"))
  // {
  let  subPatient = this.state.subPatient?this.state.subPatient.map((target) => {
 return (

         <tr key={target.id}>
           <td style={{color:"#000"}}>{target.type}</td>

           <td style={{color:"#000"}}>
           <Button color="success" size="sm" className="mr-2" onClick={()=>this.editSubPatient(
         target["_id"])}>
       <EditIcon ></EditIcon></Button>
       <Button color="danger" size="sm" onClick={()=>this.deleteSubPatient(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
     </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}> العائل </h1>
        <Button className="my-3" color="dark" onClick={this.toggleNewSubPatienttModal.bind(this)}>أضافة</Button>



<Modal isOpen={this.state.newSubPatientModal} toggle={this.toggleNewSubPatienttModal.bind(this)}>
<ModalHeader toggle={this.toggleNewSubPatienttModal.bind(this)}>أضافة العائل</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="type">العائل</Label>
 <Input id="type" value={this.state.newSubPatient.type} onChange={(e) => {
   let { newSubPatient } = this.state;

   newSubPatient.type = e.target.value;

   this.setState({ newSubPatient });
 }} />
</FormGroup>



</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addSubPatient()}>اضافة</Button>
<Button color="secondary" onClick={this.toggleNewSubPatienttModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.editSubPatientModal} toggle={this.toggleEditSubPatientModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditSubPatientModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

     <FormGroup>

        <Label for="type">العائل</Label>
       <Input id="type" value={this.state.editSubPatientData.type} onChange={(e) => {
         let { editSubPatientData } = this.state;

         editSubPatientData.type = e.target.value;

         this.setState({ editSubPatientData });
       }} />
     </FormGroup>


    
   </ModalBody>
   <ModalFooter>
     <Button color="primary" onClick={()=>this.updateSubPatient()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditSubPatientModal.bind(this)}>الغاء</Button>
   </ModalFooter>
 </Modal>

         <Table>
           <thead>
             <tr>
               <th style={{color:"#000"}}>العائل</th>
               
               <th style={{color:"#000"}}>اجراءات</th>
             </tr>
           </thead>
           <tbody>
             {subPatient}
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



export default SubPatient
