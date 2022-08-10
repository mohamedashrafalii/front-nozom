import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import staticVariables from "../../statics.json"
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
class Services extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    service:[],
    nameAr:"",
    nameEn:"",
    price:0,
    state:true,
    newService:{
        nameAr:"",
        nameEn:"",
        price:0,
        state:true,

    },
    editServiceData: {
      id:"",
      nameAr:"",
      nameEn:"",
      
      price:0,
      
      state:true
    },
    newServiceModal: false,
    editServiceModal:false
  }

  toggleNewServicetModal() {
    this.setState({
      newServiceModal: ! this.state.newServiceModal
    });
  }

  toggleEditServiceModal() {
    this.setState({
      editServiceModal: ! this.state.editServiceModal
    });
  }
  getServices = async  ()=> {
    let {page,limit} = this.state
    const res = await axios.get(
      staticVariables.backendUrl+"/service?limit="+limit+"&page="+page
      // ,{headers: { authToken : this.props.value }}
      );
    this.setState({ service: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };
  deleteService=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/service/delete/" + id
    // ,{headers: { authToken : this.props.value }}
    )
    .then(() => {

     this.getServices()
    })
    .catch(error=>{alert(error.message)});

  }

  addService=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/service/add/",
    this.state.newService
    // ,{headers: { authToken : this.props.value }}
  )
  .then((response) => {

    if(response.data.msg!=="Created successfully")
    return alert(response.data)
    let { service } = this.state;
    this.getServices()

    this.setState({ service, newServiceModal: false, newService: {
        nameAr:"",
        nameEn:"",
        
        price:0,
        
        state:true
  }}
    )
  })

  .catch(error => {
    alert(error.message)
  })

}

      updateService = async()=>{
      let {nameAr,
      nameEn,
      
      price,
      
      state} = this.state.editServiceData;
      try{

         await axios.put(staticVariables.backendUrl+"/service/" + this.state.editServiceData.id, {
            nameAr,
            nameEn,
            
            price,
            
            state
      },
      // {headers: { authToken : this.props.value }}
      )
      .then((response) =>
      {  
          this.getServices()
        this.setState({
          editServiceModal: false, editRequestData: { id: "",
          nameAr:"",
          nameEn:"",
          
          price:0,
          
          state:true}
        })})}


     catch(error)
     {
     
      alert(   error)
     }
     }
    editService=async( id )=> {
      this.setState({
        editServiceData: { id }, editServiceModal: ! this.state.editServiceModal
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getServices()})
     
     }
     
     componentDidMount()
     {this.getServices()

    }
render=()=>{

  // if(this.props.value)
  // {
  let  service = this.state.service?this.state.service.map((target) => {
 return (

         <tr key={target.id}>
           <td style={{color:"#000"}}>{target.nameAr}</td>
           <td style={{color:"#000"}}>{target.nameEn}</td>
           <td style={{color:"#000"}}>{target.price}</td>
           <td style={{color:"#000"}}>{target.state?"فعال":"غير فعال"}</td>

           <td style={{color:"#000"}}>
           <Button color="success" size="sm" className="mr-2" onClick={()=>this.editService(
         target["_id"])}>
       <EditIcon ></EditIcon></Button>
       <Button color="danger" size="sm" onClick={()=>this.deleteService(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
     </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}>خدمة</h1>
        <Button className="my-3" color="dark" onClick={this.toggleNewServicetModal.bind(this)}>اضافة خدمة</Button>



<Modal isOpen={this.state.newServiceModal} toggle={this.toggleNewServicetModal.bind(this)}>
<ModalHeader toggle={this.toggleNewServicetModal.bind(this)}>أضافة خدمة</ModalHeader>
<ModalBody>


<FormGroup>

<Label for="nameAr">اسم الخدمة عربى</Label>
<Input id="nameAr" value={this.state.newService.nameAr} onChange={(e) => {
 let { newService } = this.state;

 newService.nameAr = e.target.value;

 this.setState({ newService });
}} />
</FormGroup>

<FormGroup>

<Label for="nameEn">اسم الخدمة انجليزى</Label>
<Input id="nameEn" value={this.state.newService.nameEn} onChange={(e) => {
 let { newService } = this.state;

 newService.nameEn = e.target.value;

 this.setState({ newService });
}} />
</FormGroup>

<FormGroup>

<Label for="price">سعر</Label>
<Input id="price" value={this.state.newService.price} onChange={(e) => {
let { newService } = this.state;

newService.price = e.target.value;

this.setState({ newService });
}} />
</FormGroup>

<FormGroup>
<Label for="state">حالة</Label>
<RadioGroup
aria-labelledby="demo-radio-buttons-group-label"
defaultValue="true"
name="radio-buttons-group"
value={this.state.newService.state}
onChange={(e) => {
  let { newService } = this.state;
  
  newService.state = e.target.value;
  this.setState({ newService });


  }} 
>
<FormControlLabel value="true" control={<Radio />} label="فعالة" />
<FormControlLabel value="false" control={<Radio />} label="غير فعالة" />
</RadioGroup>
</FormGroup>

</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addService()}>اضافة خدمة</Button>
<Button color="secondary" onClick={this.toggleNewServicetModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.editServiceModal} toggle={this.toggleEditServiceModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditServiceModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

     <FormGroup>

        <Label for="nameAr">اسم الخدمة عربى</Label>
       <Input id="nameAr" value={this.state.editServiceData.nameAr} onChange={(e) => {
         let { editServiceData } = this.state;

         editServiceData.nameAr = e.target.value;

         this.setState({ editServiceData });
       }} />
     </FormGroup>

     <FormGroup>

        <Label for="nameEn">اسم الخدمة انجليزى</Label>
       <Input id="nameEn" value={this.state.editServiceData.nameEn} onChange={(e) => {
         let { editServiceData } = this.state;

         editServiceData.nameEn = e.target.value;

         this.setState({ editServiceData });
       }} />
     </FormGroup>

     <FormGroup>

<Label for="price">سعر</Label>
<Input id="price" value={this.state.editServiceData.price} onChange={(e) => {
 let { editServiceData } = this.price;

 editServiceData.price = e.target.value;

 this.setState({ editServiceData });
}} />
</FormGroup>

<FormGroup>
<Label for="state">حالة</Label>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="true"
    name="radio-buttons-group"
    value={this.state.editServiceData.state}
    onChange={(e) => {
      let { editServiceData } = this.state;
     
      editServiceData.state = e.target.value;
      
      this.setState({ editServiceData });
     }} 
  >
    <FormControlLabel value="true"  control={<Radio />} label="فعالة" />
    <FormControlLabel value="false" control={<Radio />} label="غير فعالة" />
  </RadioGroup>
</FormGroup>
    
   </ModalBody>
   <ModalFooter>
     <Button color="primary" onClick={()=>this.updateService()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditServiceModal.bind(this)}>الغاء</Button>
   </ModalFooter>
 </Modal>

         <Table>
           <thead>
             <tr>
               <th style={{color:"#000"}}>اسم الخدمة عربى</th>
               <th style={{color:"#000"}}>اسم الخدمة انجليزى</th>
               <th style={{color:"#000"}}>السعر</th>
               <th style={{color:"#000"}}>الحالة</th>
               <th style={{color:"#000"}}>اجراءات</th>
             </tr>
           </thead>
           <tbody>
             {service}
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



export default Services
