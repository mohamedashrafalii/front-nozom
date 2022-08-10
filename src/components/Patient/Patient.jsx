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
class Patient extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    patient:[],
    name:"",
    nationalNumber:null,
    militaryNumber:null,
    type:"",
    subPatient:null,
    subPatientName:"",
    rate:null,
    ticketPrice:null,
    types:[],
    subPatients:[],neededNumber:null,
    username:localStorage.getItem("username"),
    newPatient:{
        name:"",
        nationalNumber:null,
        militaryNumber:null,
        type:"",
        subPatient:null,
        subPatientName:"",
        rate:null,
        ticketPrice:null,neededNumber:null,
        typeOfType:"",
        username:localStorage.getItem("username"),
     
    },
    editPatientData: {
      id:"",
      name:"",
    nationalNumber:null,
    militaryNumber:null,
    type:"",
    subPatient:null,
    subPatientName:"",
    rate:null,
    ticketPrice:null,neededNumber:null,
    typeOfType:""
          },
    newPatientModal: false,
    editPatientModal:false,
    typeModal:false,
    militaryModal:false
  }

  toggleNewPatienttModal() {
    this.setState({
      newPatientModal: ! this.state.newPatientModal
    });
  }
  toggleTypeModal() {
    this.setState({
      typeModal: ! this.state.typeModal
    });
  }

  toggleMilitaryModal() {
    this.setState({
      militaryModal: ! this.state.militaryModal
    });
  }

  toggleEditPatientModal() {
    this.setState({
      editPatientModal: ! this.state.editPatientModal
    });
  }
  getPatients = async  ()=> {
    let {page,limit} = this.state
    const res = await axios.get(
      staticVariables.backendUrl+"/patient?limit="+limit+"&page="+page
      ,{headers: { authToken : localStorage.getItem("token") }}
      );
    this.setState({ patient: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };

  getSubPatients = async  ()=> {
    const res = await axios.get(
      staticVariables.backendUrl+"/subPatient"
      ,{headers: { authToken : localStorage.getItem("token") }}
      );
    this.setState({ subPatients: res.data.data });

  };

  getTypes = async  ()=> {
    
    const res = await axios.get(
      staticVariables.backendUrl+"/category"
      ,{headers: { authToken : localStorage.getItem("token") }}
      );
    this.setState({ types: res.data.data});

  };
  deletePatient=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/patient/delete/" + id
    ,{headers: { authToken : localStorage.getItem("token") }}
    )
    .then(() => {

     this.getPatients()
    })
    .catch(error=>{alert(error.message)});

  }

  addPatient=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/patient/add/",
    this.state.newPatient
    ,{headers: { authToken : localStorage.getItem("token") }}
  )
  .then((response) => {
   
    if(response.data.msg!=="Created successfully")
    return alert(response.data)
    let { patient } = this.state;
    this.getPatients()

    this.setState({ patient, newPatientModal: false, newPatient: {
        name:"",
        nationalNumber:null,
        militaryNumber:null,
        type:"",
        subPatient:null,
        subPatientName:"",
        rate:null,
        ticketPrice:null,neededNumber:null,
        typeOfType:"",
        username:localStorage.getItem("username")
      
  }}
    )
  })

  .catch(error => {
    alert(error.message)
  })

}

      updatePatient = async()=>{
        console.log(this.state.editPatientData.id)
      let {name,
      nationalNumber,
      militaryNumber,
      type,
      subPatient,
      subPatientName,
      rate,
      ticketPrice,neededNumber,
      typeOfType} = this.state.editPatientData;
      try{
         console.log(this.state.editPatientData)
         await axios.put(staticVariables.backendUrl+"/patient/" + this.state.editPatientData.id, {
            name,
            nationalNumber,
            militaryNumber,
            type,
            subPatient,
            subPatientName,
            rate,
            ticketPrice,neededNumber,
            typeOfType
      },
      {headers: { authToken : localStorage.getItem("token") }}
      )
      .then((response) =>
      {  
        if(response.data.msg!=="Target updated successfully")
    return alert(response.data)
          this.getPatients()
        this.setState({
          editPatientModal: false, editRequestData: { id: "",
          name:"",
          nationalNumber:null,
          militaryNumber:null,
          type:"",
          subPatient:null,
          subPatientName:"",
          rate:null,
          ticketPrice:null,neededNumber:null,
          typeOfType
      }})
      
      })}


     catch(error)
     {
     console.log(error)
      alert(   error)
     }
     }
    editPatient=async( id )=> {
      this.setState({
        editPatientData: { id }, editPatientModal: ! this.state.editPatientModal
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getPatients()})
     
     }
     handleTypeModal=()=>
     {
        this.toggleTypeModal()
        this.toggleMilitaryModal()
        
        
     }
     handleMilitaryModal=async()=>
     {
      if(this.state.newPatient.militaryNumber<0||isNaN(this.state.newPatient.militaryNumber))
        return alert(" رقم العسكرى يجب ان يكون ارقام موجبة")
        if(this.state.newPatient.type==="عائلات ضباط"||this.state.newPatient.type==="عائلات درجات")
       {let typeFam = this.state.newPatient.type==="عائلات ضباط"?"ضباط":"درجات"
        await axios.get(

            staticVariables.backendUrl+"/patient/militaryId/"+this.state.newPatient.militaryNumber+"?type="+typeFam
            ,{headers: { authToken : localStorage.getItem("token") }}
            ).then((response)=>{
              if(response.data.msg==="غير موجود")
              return alert("غير موجود")
                let { newPatient } = this.state;

   newPatient.subPatientName = response.data.data.name;
   newPatient.subPatient = response.data.data.type;
   console.log(newPatient)
   this.setState({ newPatient });
   this.toggleMilitaryModal()
          this.toggleNewPatienttModal()
         }
            )}
            else{
            this.toggleMilitaryModal()
          this.toggleNewPatienttModal()}
     }
     componentDidMount()
     {this.getPatients()
        this.getTypes()
        this.getSubPatients()
        // console.log(localStorage.getItem("token"))
    }
render=()=>{

  // if(localStorage.getItem("token"))
  // {
  let  patient = this.state.patient?this.state.patient.map((target) => {
 return (

         <tr key={target.id}>
             <td style={{color:"#000"}}>{target._id}</td>
           <td style={{color:"#000"}}>{target.name}</td>
           <td style={{color:"#000"}}>{target.militaryNumber}</td>
           <td style={{color:"#000"}}>{target.nationalNumber}</td>
           
           <td style={{color:"#000"}}>{target.type}</td>
           <td style={{color:"#000"}}>{target.typeOfType}</td>
           <td style={{color:"#000"}}>{target.rate}</td>
           <td style={{color:"#000"}}>{target.ticketPrice}</td>
           <td style={{color:"#000"}}>{target.neededNumber}</td>
           <td style={{color:"#000"}}>{target.subPatient}</td>
           <td style={{color:"#000"}}>{target.subPatientName}</td>
           <td style={{color:"#000"}}>{target.username}</td>
           <td style={{color:"#000"}}>
          {localStorage.getItem("type")==="admin" &&
          <div> <Button color="success" size="sm" className="mr-2" onClick={()=>this.editPatient(
         target["_id"])}>
       <EditIcon ></EditIcon></Button>
       <Button color="danger" size="sm" onClick={()=>this.deletePatient(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
       </div>
     
          }
          </td>


         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}>المريض</h1>
        <Button className="my-3" color="dark" onClick={this.toggleTypeModal.bind(this)}>أضافة</Button>


        <Modal isOpen={this.state.typeModal} toggle={this.toggleTypeModal.bind(this)}>
<ModalHeader toggle={this.toggleTypeModal.bind(this)}>ادخل نوع المريض</ModalHeader>
<ModalBody>




<FormGroup>
<Label for="type">النوع</Label>
<RadioGroup aria-label="type" name="type" value={this.state.newPatient.type} onChange={(e) => {
   let { newPatient } = this.state;

   newPatient.type = e.target.value;

   this.setState({ newPatient });
 }}>
   {this.state.types?this.state.types.map((type) => (
          <FormControlLabel value={type.type} control={<Radio />} label={type.type}/>
   
   )):<FormControlLabel  control={<Radio />} label=""/>
  }
          

</RadioGroup>
</FormGroup>


</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.handleTypeModal()}>اختيار</Button>
<Button color="secondary" onClick={this.toggleTypeModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.militaryModal} toggle={this.toggleMilitaryModal.bind(this)}>
<ModalHeader toggle={this.toggleMilitaryModal.bind(this)}>ادخل الرقم العسكرى</ModalHeader>
<ModalBody>

<FormGroup>
 <Label for="militaryNumber">الرقم العسكرى</Label>
 <Input id="militaryNumber" value={this.state.newPatient.militaryNumber} onChange={(e) => {
   let { newPatient } = this.state;

   newPatient.militaryNumber = e.target.value;

   this.setState({ newPatient });
 }} />
</FormGroup>

</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.handleMilitaryModal()}>التالى</Button>
<Button color="secondary" onClick={this.toggleMilitaryModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.newPatientModal} toggle={this.toggleNewPatienttModal.bind(this)}>
<ModalHeader toggle={this.toggleNewPatienttModal.bind(this)}>أضافة</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="name">الاسم</Label>
 <Input id="name" value={this.state.newPatient.name} onChange={(e) => {
   let { newPatient } = this.state;

   newPatient.name = e.target.value;

   this.setState({ newPatient });
 }} />
</FormGroup>

<FormGroup>
 <Label for="militaryNumber">الرقم العسكرى</Label>
 <Input id="militaryNumber" value={this.state.newPatient.militaryNumber} readOnly onChange={(e) => {
   let { newPatient } = this.state;

   newPatient.militaryNumber = e.target.value;

   this.setState({ newPatient });
 }} />
</FormGroup>

<FormGroup>
 <Label for="nationalNumber">الرقم القومى</Label>
 <Input id="nationalNumber" value={this.state.newPatient.nationalNumber} onChange={(e) => {
   let { newPatient } = this.state;

   newPatient.nationalNumber = e.target.value;

   this.setState({ newPatient });
 }} />
</FormGroup>

<FormGroup>
 <Label for="neededNumber">عدد الاصناف المطلوبة</Label>
 <Input id="neededNumber" value={this.state.newPatient.neededNumber} onChange={(e) => {
   let { newPatient } = this.state;

   newPatient.neededNumber = e.target.value;

   this.setState({ newPatient });
 }} />
</FormGroup>
{this.state.newPatient.type==="عائلات ضباط"||this.state.newPatient.type==="عائلات درجات"?
<FormGroup>
<Label for="typeOfType">المعول</Label>
<RadioGroup aria-label="typeOfType" name="typeOfType" value={this.state.newPatient.typeOfType} onChange={(e) => {
   let { newPatient } = this.state;

   newPatient.typeOfType = e.target.value;

   this.setState({ newPatient });
 }}>
   {this.state.types?this.state.subPatients.map((type) => (
          <FormControlLabel value={type.type} control={<Radio />} label={type.type}/>
   
   )):<></>
  }
</RadioGroup>
</FormGroup>:<></>}
</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addPatient()}>اضافة</Button>
<Button color="secondary" onClick={this.toggleNewPatienttModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.editPatientModal} toggle={this.toggleEditPatientModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditPatientModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

   <FormGroup>
 <Label for="name">الاسم</Label>
 <Input id="name" value={this.state.editPatientData.name} onChange={(e) => {
   let { editPatientData } = this.state;

   editPatientData.name = e.target.value;

   this.setState({ editPatientData });
 }} />
</FormGroup>

<FormGroup>
 <Label for="militaryNumber">الرقم العسكرى</Label>
 <Input id="militaryNumber" value={this.state.editPatientData.militaryNumber} onChange={(e) => {
   let { editPatientData } = this.state;

   editPatientData.militaryNumber = e.target.value;

   this.setState({ editPatientData });
 }} />
</FormGroup>

<FormGroup>
 <Label for="nationalNumber">الرقم القومى</Label>
 <Input id="nationalNumber" value={this.state.editPatientData.nationalNumber} onChange={(e) => {
   let { editPatientData } = this.state;

   editPatientData.nationalNumber = e.target.value;

   this.setState({ editPatientData });
 }} />
</FormGroup>
<FormGroup>
 <Label for="neededNumber">عدد الاصناف المطلوبة</Label>
 <Input id="neededNumber" value={this.state.newPatient.neededNumber} onChange={(e) => {
   let { editPatientData } = this.state;

   editPatientData.neededNumber = e.target.value;

   this.setState({ editPatientData });
 }} />
 </FormGroup>
<FormGroup>
<Label for="type">النوع</Label>
<RadioGroup aria-label="type" name="type" value={this.state.editPatientData.type} onChange={(e) => {
   let { editPatientData } = this.state;

   editPatientData.type = e.target.value;

   this.setState({ editPatientData });
 }}>
   {this.state.types?this.state.types.map((type) => (
          <FormControlLabel value={type.type} control={<Radio />} label={type.type}/>
          
   )):<FormControlLabel  control={<Radio />} label=""/>
   
  }
          
<FormGroup>
<Label for="typeOfType">المعول</Label>
<RadioGroup aria-label="typeOfType" name="typeOfType" value={this.state.editPatientData.typeOfType} onChange={(e) => {
   let { editPatientData } = this.state;

   editPatientData.typeOfType = e.target.value;

   this.setState({ editPatientData });
 }}>
   {this.state.types?this.state.subPatients.map((type) => (
          <FormControlLabel value={type.type} control={<Radio />} label={type.type}/>
   
   )):<FormControlLabel  control={<Radio />} label=""/>
  }
</RadioGroup>
</FormGroup>
</RadioGroup>
</FormGroup>


</ModalBody>
<ModalFooter>

    
     <Button color="primary" onClick={()=>this.updatePatient()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditPatientModal.bind(this)}>الغاء</Button>
   </ModalFooter>
 </Modal>

         <Table>
           <thead>
             <tr>
               <th style={{color:"#000"}}>رقم المريض</th>
               <th style={{color:"#000"}}>الاسم</th>
               <th style={{color:"#000"}}>الرقم العسكرى</th>
               <th style={{color:"#000"}}>الرقم القومى</th>
               <th style={{color:"#000"}}>النوع</th>
               <th style={{color:"#000"}}>المعول</th>
               <th style={{color:"#000"}}>سعر الصنف</th>
               <th style={{color:"#000"}}>سعر التذكرة</th>
               <th style={{color:"#000"}}>عدد الاصناف المطلوبة</th>
               <th style={{color:"#000"}}>العائل</th>
               <th style={{color:"#000"}}>اسم العائل</th>
               <th style={{color:"#000"}}>اسم المستخدم</th>
               {localStorage.getItem("type") === "admin" &&<th style={{color:"#000"}}>اجراءات</th>}
             </tr>
           </thead>
           <tbody>
             {patient}
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



export default Patient
