import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import staticVariables from "../../statics.json"
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
class RotbSaf extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    rotbSaf:[],
    type:"",
    
    newRotbSaf:{
     type:"",
     
    },
    editRotbSafData: {
      id:"",
      type:"",
          },
    newRotbSafModal: false,
    editRotbSafModal:false
  }

  toggleNewRotbSaftModal() {
    this.setState({
      newRotbSafModal: ! this.state.newRotbSafModal
    });
  }

  toggleEditRotbSafModal() {
    this.setState({
      editRotbSafModal: ! this.state.editRotbSafModal
    });
  }
  getRotbSafs = async  ()=> {
    let {page,limit} = this.state
    const res = await axios.get(
      staticVariables.backendUrl+"/rotbSaf?limit="+limit+"&page="+page
      // ,{headers: { authToken : this.props.value }}
      );
    this.setState({ rotbSaf: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };
  deleteRotbSaf=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/rotbSaf/delete/" + id
    // ,{headers: { authToken : this.props.value }}
    )
    .then(() => {

     this.getRotbSafs()
    })
    .catch(error=>{alert(error.message)});

  }

  addRotbSaf=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/rotbSaf/add/",
    this.state.newRotbSaf
    // ,{headers: { authToken : this.props.value }}
  )
  .then((response) => {
    if(response.data.msg!=="Created successfully")
    return alert(response.data)
    let { rotbSaf } = this.state;
    this.getRotbSafs()

    this.setState({ rotbSaf, newRotbSafModal: false, newRotbSaf: {
      type:"",
      
  }}
    )
  })

  .catch(error => {
    alert(error.message)
  })

}

      updateRotbSaf = async()=>{
      let {type} = this.state.editRotbSafData;
      try{

         await axios.put(staticVariables.backendUrl+"/rotbSaf/" + this.state.editRotbSafData.id, {

        type
      },
      // {headers: { authToken : this.props.value }}
      )
      .then((response) =>
      {  
          this.getRotbSafs()
        this.setState({
          editRotbSafModal: false, editRequestData: { id: "",
        type:""
      }})
      
      })}


     catch(error)
     {
     
      alert(   error)
     }
     }
    editRotbSaf=async( id )=> {
      this.setState({
        editRotbSafData: { id }, editRotbSafModal: ! this.state.editRotbSafModal
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getRotbSafs()})
     
     }
     
     componentDidMount()
     {this.getRotbSafs()

    }
render=()=>{

  // if(this.props.value)
  // {
  let  rotbSaf = this.state.rotbSaf?this.state.rotbSaf.map((target) => {
 return (

         <tr key={target.id}>
           <td style={{color:"#000"}}>{target.type}</td>

           <td style={{color:"#000"}}>
           <Button color="success" size="sm" className="mr-2" onClick={()=>this.editRotbSaf(
         target["_id"])}>
       <EditIcon ></EditIcon></Button>
       <Button color="danger" size="sm" onClick={()=>this.deleteRotbSaf(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
     </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}>رتبة</h1>
        <Button className="my-3" color="dark" onClick={this.toggleNewRotbSaftModal.bind(this)}>اضافة رتبة</Button>



<Modal isOpen={this.state.newRotbSafModal} toggle={this.toggleNewRotbSaftModal.bind(this)}>
<ModalHeader toggle={this.toggleNewRotbSaftModal.bind(this)}>اضافة رتبة</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="type">نوع الرتبة</Label>
 <Input id="type" value={this.state.newRotbSaf.type} onChange={(e) => {
   let { newRotbSaf } = this.state;

   newRotbSaf.type = e.target.value;

   this.setState({ newRotbSaf });
 }} />
</FormGroup>



</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addRotbSaf()}>اضافة</Button>
<Button color="secondary" onClick={this.toggleNewRotbSaftModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.editRotbSafModal} toggle={this.toggleEditRotbSafModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditRotbSafModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

     <FormGroup>

        <Label for="type">نوع الرتبة</Label>
       <Input id="type" value={this.state.editRotbSafData.type} onChange={(e) => {
         let { editRotbSafData } = this.state;

         editRotbSafData.type = e.target.value;

         this.setState({ editRotbSafData });
       }} />
     </FormGroup>


    
   </ModalBody>
   <ModalFooter>
     <Button color="primary" onClick={()=>this.updateRotbSaf()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditRotbSafModal.bind(this)}>الغاء</Button>
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
             {rotbSaf}
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



export default RotbSaf
