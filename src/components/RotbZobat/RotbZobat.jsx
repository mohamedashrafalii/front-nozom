import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import staticVariables from "../../statics.json"
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
class RotbZobat extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    rotbZobat:[],
    type:"",
    
    newRotbZobat:{
     type:"",
     
    },
    editRotbZobatData: {
      id:"",
      type:"",
          },
    newRotbZobatModal: false,
    editRotbZobatModal:false
  }

  toggleNewRotbZobattModal() {
    this.setState({
      newRotbZobatModal: ! this.state.newRotbZobatModal
    });
  }

  toggleEditRotbZobatModal() {
    this.setState({
      editRotbZobatModal: ! this.state.editRotbZobatModal
    });
  }
  getRotbZobats = async  ()=> {
    let {page,limit} = this.state
    const res = await axios.get(
      staticVariables.backendUrl+"/rotbZobat?limit="+limit+"&page="+page
      // ,{headers: { authToken : this.props.value }}
      );
    this.setState({ rotbZobat: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };
  deleteRotbZobat=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/rotbZobat/delete/" + id
    // ,{headers: { authToken : this.props.value }}
    )
    .then(() => {

     this.getRotbZobats()
    })
    .catch(error=>{alert(error.message)});

  }

  addRotbZobat=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/rotbZobat/add/",
    this.state.newRotbZobat
    // ,{headers: { authToken : this.props.value }}
  )
  .then((response) => {
    if(response.data.msg!=="Created successfully")
    return alert(response.data)
    let { rotbZobat } = this.state;
    this.getRotbZobats()

    this.setState({ rotbZobat, newRotbZobatModal: false, newRotbZobat: {
      type:"",
      
  }}
    )
  })

  .catch(error => {
    alert(error.message)
  })

}

      updateRotbZobat = async()=>{
      let {type} = this.state.editRotbZobatData;
      try{

         await axios.put(staticVariables.backendUrl+"/rotbZobat/" + this.state.editRotbZobatData.id, {

        type
      },
      // {headers: { authToken : this.props.value }}
      )
      .then((response) =>
      {  
          this.getRotbZobats()
        this.setState({
          editRotbZobatModal: false, editRequestData: { id: "",
        type:""
      }})
      
      })}


     catch(error)
     {
     
      alert(   error)
     }
     }
    editRotbZobat=async( id )=> {
      this.setState({
        editRotbZobatData: { id }, editRotbZobatModal: ! this.state.editRotbZobatModal
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getRotbZobats()})
     
     }
     
     componentDidMount()
     {this.getRotbZobats()

    }
render=()=>{

  // if(this.props.value)
  // {
  let  rotbZobat = this.state.rotbZobat?this.state.rotbZobat.map((target) => {
 return (

         <tr key={target.id}>
           <td style={{color:"#000"}}>{target.type}</td>

           <td style={{color:"#000"}}>
           <Button color="success" size="sm" className="mr-2" onClick={()=>this.editRotbZobat(
         target["_id"])}>
       <EditIcon ></EditIcon></Button>
       <Button color="danger" size="sm" onClick={()=>this.deleteRotbZobat(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
     </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}>رتبة</h1>
        <Button className="my-3" color="dark" onClick={this.toggleNewRotbZobattModal.bind(this)}>اضافة رتبة</Button>



<Modal isOpen={this.state.newRotbZobatModal} toggle={this.toggleNewRotbZobattModal.bind(this)}>
<ModalHeader toggle={this.toggleNewRotbZobattModal.bind(this)}>اضافة رتبة</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="type">نوع الرتبة</Label>
 <Input id="type" value={this.state.newRotbZobat.type} onChange={(e) => {
   let { newRotbZobat } = this.state;

   newRotbZobat.type = e.target.value;

   this.setState({ newRotbZobat });
 }} />
</FormGroup>



</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addRotbZobat()}>اضافة</Button>
<Button color="secondary" onClick={this.toggleNewRotbZobattModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.editRotbZobatModal} toggle={this.toggleEditRotbZobatModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditRotbZobatModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

     <FormGroup>

        <Label for="type">نوع الرتبة</Label>
       <Input id="type" value={this.state.editRotbZobatData.type} onChange={(e) => {
         let { editRotbZobatData } = this.state;

         editRotbZobatData.type = e.target.value;

         this.setState({ editRotbZobatData });
       }} />
     </FormGroup>


    
   </ModalBody>
   <ModalFooter>
     <Button color="primary" onClick={()=>this.updateRotbZobat()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditRotbZobatModal.bind(this)}>الغاء</Button>
   </ModalFooter>
 </Modal>

         <Table>
           <thead>
             <tr>
               <th style={{color:"#000"}}>نوع الرتبة</th>
               
               <th style={{color:"#000"}}>اجراءات</th>
             </tr>
           </thead>
           <tbody>
             {rotbZobat}
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



export default RotbZobat
