import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import staticVariables from "../../statics.json"
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
class Rate extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    rate:[],
    type:"",
    price:0,
    newRate:{
     type:"",
     price:0

    },
    editRateData: {
      id:"",
      type:"",
      price:0
    },
    newRateModal: false,
    editRateModel:false
  }

  toggleNewRatetModal() {
    this.setState({
      newRateModal: ! this.state.newRateModal
    });
  }

  toggleEditRateModal() {
    this.setState({
      editRateModel: ! this.state.editRateModel
    });
  }
  getRates = async  ()=> {
    let {page,limit} = this.state
    const res = await axios.get(
      staticVariables.backendUrl+"/rate?limit="+limit+"&page="+page
      // ,{headers: { authToken : this.props.value }}
      );
    this.setState({ rate: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };
  deleteRate=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/rate/delete/" + id
    // ,{headers: { authToken : this.props.value }}
    )
    .then(() => {

     this.getRates()
    })
    .catch(error=>{alert(error.message)});

  }

  addRate=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/rate/add/",
    this.state.newRate
    // ,{headers: { authToken : this.props.value }}
  )
  .then((response) => {
    if(response.data.msg!=="Created successfully")
    return alert(response.data)
    let { rate } = this.state;
    this.getRates()

    this.setState({ rate, newRateModal: false, newRate: {
      type:"",
      price:""
  }}
    )
  })

  .catch(error => {
    alert(error.message)
  })

}

      updateRate = async()=>{
      let {type,price} = this.state.editRateData;
      try{

         await axios.put(staticVariables.backendUrl+"/rate/" + this.state.editRateData.id, {

        type,price
      },
      // {headers: { authToken : this.props.value }}
      )
      .then((response) =>
      {  
          this.getRates()
        this.setState({
          editRateModel: false, editRequestData: { id: "",
        type:"",price:0}
        })})}


     catch(error)
     {
     
      alert(   error)
     }
     }
    editRate=async( id )=> {
      this.setState({
        editRateData: { id }, editRateModel: ! this.state.editRateModel
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getRates()})
     
     }
     
     componentDidMount()
     {this.getRates()

    }
render=()=>{

  // if(this.props.value)
  // {
  let  rate = this.state.rate?this.state.rate.map((target) => {
 return (

         <tr key={target.id}>
           <td style={{color:"#000"}}>{target.type}</td>
           <td style={{color:"#000"}}>{target.price}</td>

           <td style={{color:"#000"}}>
           <Button color="success" size="sm" className="mr-2" onClick={()=>this.editRate(
         target["_id"])}>
       <EditIcon ></EditIcon></Button>
       <Button color="danger" size="sm" onClick={()=>this.deleteRate(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
     </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}>أسعار</h1>
        <Button className="my-3" color="dark" onClick={this.toggleNewRatetModal.bind(this)}>اضافة سعر</Button>



<Modal isOpen={this.state.newRateModal} toggle={this.toggleNewRatetModal.bind(this)}>
<ModalHeader toggle={this.toggleNewRatetModal.bind(this)}>اضافة سعر</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="type">نوع</Label>
 <Input id="type" value={this.state.newRate.type} onChange={(e) => {
   let { newRate } = this.state;

   newRate.type = e.target.value;

   this.setState({ newRate });
 }} />
</FormGroup>

<FormGroup>
 <Label for="price">سعر</Label>
 <Input id="price" value={this.state.newRate.price} onChange={(e) => {
   let { newRate } = this.state;

   newRate.price = e.target.value;

   this.setState({ newRate });
 }} />
</FormGroup>

</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addRate()}>اضافة</Button>
<Button color="secondary" onClick={this.toggleNewRatetModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.editRateModel} toggle={this.toggleEditRateModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditRateModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

     <FormGroup>

        <Label for="type">نوع</Label>
       <Input id="type" value={this.state.editRateData.type} onChange={(e) => {
         let { editRateData } = this.state;

         editRateData.type = e.target.value;

         this.setState({ editRateData });
       }} />
     </FormGroup>

     <FormGroup>

<Label for="price">سعر</Label>
<Input id="price" value={this.state.editRateData.price} onChange={(e) => {
 let { editRateData } = this.state;

 editRateData.price = e.target.value;

 this.setState({ editRateData });
}} />
</FormGroup>

    
   </ModalBody>
   <ModalFooter>
     <Button color="primary" onClick={()=>this.updateRate()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditRateModal.bind(this)}>الغاء</Button>
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
             {rate}
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



export default Rate
