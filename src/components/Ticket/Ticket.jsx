import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import staticVariables from "../../statics.json"
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
class Ticket extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    ticket:[],
    type:"",
    price:0,
    newTicket:{
     type:"",
     price:0

    },
    editTicketData: {
      id:"",
      type:"",
      price:0
    },
    newTicketModal: false,
    editTicketModal:false
  }

  toggleNewTickettModal() {
    this.setState({
      newTicketModal: ! this.state.newTicketModal
    });
  }

  toggleEditTicketModal() {
    this.setState({
      editTicketModal: ! this.state.editTicketModal
    });
  }
  getTickets = async  ()=> {
    let {page,limit} = this.state
    const res = await axios.get(
      staticVariables.backendUrl+"/ticket?limit="+limit+"&page="+page
      // ,{headers: { authToken : this.props.value }}
      );
    this.setState({ ticket: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };
  deleteTicket=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/ticket/delete/" + id
    // ,{headers: { authToken : this.props.value }}
    )
    .then(() => {

     this.getTickets()
    })
    .catch(error=>{alert(error.message)});

  }

  addTicket=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/ticket/add/",
    this.state.newTicket
    // ,{headers: { authToken : this.props.value }}
  )
  .then((response) => {
    if(response.data.msg!=="Created successfully")
    return alert(response.data)
    let { ticket } = this.state;
    this.getTickets()

    this.setState({ ticket, newTicketModal: false, newTicket: {
      type:"",
      price:""
  }}
    )
  })

  .catch(error => {
    alert(error.message)
  })

}

      updateTicket = async()=>{
      let {type,price} = this.state.editTicketData;
      try{

         await axios.put(staticVariables.backendUrl+"/ticket/" + this.state.editTicketData.id, {

        type,price
      },
      // {headers: { authToken : this.props.value }}
      )
      .then((response) =>
      {  
          this.getTickets()
        this.setState({
          editTicketModal: false, editRequestData: { id: "",
        type:"",price:0}
        })})}


     catch(error)
     {
     
      alert(   error)
     }
     }
    editTicket=async( id )=> {
      this.setState({
        editTicketData: { id }, editTicketModal: ! this.state.editTicketModal
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getTickets()})
     
     }
     
     componentDidMount()
     {this.getTickets()

    }
render=()=>{

  // if(this.props.value)
  // {
  let  ticket = this.state.ticket?this.state.ticket.map((target) => {
 return (

         <tr key={target.id}>
           <td style={{color:"#000"}}>{target.type}</td>
           <td style={{color:"#000"}}>{target.price}</td>

           <td style={{color:"#000"}}>
           <Button color="success" size="sm" className="mr-2" onClick={()=>this.editTicket(
         target["_id"])}>
       <EditIcon ></EditIcon></Button>
       <Button color="danger" size="sm" onClick={()=>this.deleteTicket(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
     </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}>تذاكر</h1>
        <Button className="my-3" color="dark" onClick={this.toggleNewTickettModal.bind(this)}>اضافة تذكرة</Button>



<Modal isOpen={this.state.newTicketModal} toggle={this.toggleNewTickettModal.bind(this)}>
<ModalHeader toggle={this.toggleNewTickettModal.bind(this)}>أضافة تذكرة</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="type">نوع</Label>
 <Input id="type" value={this.state.newTicket.type} onChange={(e) => {
   let { newTicket } = this.state;

   newTicket.type = e.target.value;

   this.setState({ newTicket });
 }} />
</FormGroup>

<FormGroup>
 <Label for="price">سعر</Label>
 <Input id="price" value={this.state.newTicket.price} onChange={(e) => {
   let { newTicket } = this.state;

   newTicket.price = e.target.value;

   this.setState({ newTicket });
 }} />
</FormGroup>

</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addTicket()}>اضافة تذكرة</Button>
<Button color="secondary" onClick={this.toggleNewTickettModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.editTicketModal} toggle={this.toggleEditTicketModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditTicketModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

     <FormGroup>

        <Label for="type">نوع</Label>
       <Input id="type" value={this.state.editTicketData.type} onChange={(e) => {
         let { editTicketData } = this.state;

         editTicketData.type = e.target.value;

         this.setState({ editTicketData });
       }} />
     </FormGroup>

     <FormGroup>

<Label for="price">سعر</Label>
<Input id="price" value={this.state.editTicketData.price} onChange={(e) => {
 let { editTicketData } = this.state;

 editTicketData.price = e.target.value;

 this.setState({ editTicketData });
}} />
</FormGroup>

    
   </ModalBody>
   <ModalFooter>
     <Button color="primary" onClick={()=>this.updateTicket()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditTicketModal.bind(this)}>الغاء</Button>
   </ModalFooter>
 </Modal>

         <Table>
           <thead>
             <tr>
               <th style={{color:"#000"}}>نوع</th>
               <th style={{color:"#000"}}>سعر</th>
               <th style={{color:"#000"}}>اجراءات</th>
             </tr>
           </thead>
           <tbody>
             {ticket}
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



export default Ticket
