import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import staticVariables from "../../statics.json"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
import ReactToPrint from 'react-to-print';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './CSS.css'
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
class Ornek extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    ornek:[],
    patientNumber:null,
    patientName:null,
    needed:null,
    paid:null,
    remainder:null,
    ticketPrice:null,
    rate:null,
    total:null,
    time:null,
    
    
    newOrnek:{
        patientNumber:null,
        patientName:null,
        needed:null,
        paid:null,
        remainder:null,
        ticketPrice:null,
        rate:null,
        total:null,
        time:null,
        username:localStorage.getItem("username")
     
    },
    editOrnekData: {
        patientNumber:null,
        patientName:null,
        needed:null,
        paid:null,
        remainder:null,
        ticketPrice:null,
        rate:null,
        total:null
          },
    newOrnekModal: false,
    editOrnekModal: false,
    patientNumberModal: false,
    printModal:false

  }

  toggleNewOrnektModal() {
    this.setState({
      newOrnekModal: ! this.state.newOrnekModal
    });
  }
  togglePrintModal() {
    this.setState({
      printModal: ! this.state.printModal
    });
  }

  togglePatientNumberModal() {
    this.setState({
      patientNumberModal: ! this.state.patientNumberModal
    });
  }

  toggleEditOrnekModal() {
    this.setState({
      editOrnekModal: ! this.state.editOrnekModal
    });
  }
  getOrneks = async  ()=> {
    let {page,limit} = this.state
    let url="";
    const userId= localStorage.getItem("userId")
    if(localStorage.getItem("type")==="admin")
    url = staticVariables.backendUrl+"/ornek?limit="+limit+"&page="+page
    else
    url=staticVariables.backendUrl+"/ornek/userId?limit="+limit+"&page="+page+"&userId="+userId
    
    
    const res = await axios.get(
     url
      ,{headers: { authToken : localStorage.getItem("token") }}
      );
    this.setState({ ornek: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };
  deleteOrnek=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/ornek/delete/" + id
    ,{headers: { authToken : localStorage.getItem("token") }}
    )
    .then(() => {

     this.getOrneks()
    })
    .catch(error=>{alert(error.message)});

  }


  addOrnek=async()=>{
    let{newOrnek} = this.state

    var curDate = new Date();
                var curDateStr = curDate.getDate() +"/"+ (curDate.getMonth()+1) + "/" + curDate.getFullYear() +" " + curDate.getHours()+":"+curDate.getMinutes()+":"+curDate.getSeconds()
                newOrnek.time = curDateStr
    newOrnek.userId = localStorage.getItem("userId")
    if(this.state.newOrnek.paid<0||isNaN(this.state.newOrnek.paid))
        return alert(" المدفوع يجب ان يكون ارقام موجبة")
    this.setState({newOrnek},async()=>
   { 
    await axios
    .post(
      staticVariables.backendUrl+"/ornek/add/",
      this.state.newOrnek
      ,{headers: { authToken : localStorage.getItem("token") }}
    )
    .then((response) => {
     
      if(response.data.msg!=="Created successfully")
      return alert(response.data)
      this.setState({ newOrnekModal: false
        }
      )
      
      this.getOrneks()
      this.togglePrintModal()
    })
  })
  
    .catch(error => {
      alert(error.message)
    }
    
    )
  }
  // }
    // )

//   await axios
//   .post(
//     staticVariables.backendUrl+"/ornek/add/",
//     this.state.newPatient
//     ,{headers: { authToken : localStorage.getItem("token") }}
//   )
//   .then((response) => {
//     console.log(response)
//     if(response.data.msg!=="Created successfully")
//     return alert(response.data)
//     let { ornek } = this.state;
//     this.getOrneks()

//     this.setState({ ornek, newPatientModal: false, newOrnek: {
//       patientNumber:null,
//       patientName:null,
//       needed:null,
//       paid:null,
//       remainder:null,
//       ticketPrice:null,
//       rate:null,
//       total:null,
//       time:null,
//       username:localStorage.getItem("username")
        
      
//   }}

//     )
//     this.toggleNewOrnektModal()
//     this.togglePrintModal()
//   })

//   .catch(error => {
//     alert(error.message)
//   })


// }

      updateOrnek = async()=>{
      let {type} = this.state.editOrnekData;
      try{

         await axios.put(staticVariables.backendUrl+"/ornek/" + this.state.editOrnekData.id, 
      {headers: { authToken : localStorage.getItem("token") }}
      )
      .then((response) =>
      {  
        if(response.data.msg!=="Target updated successfully")
    return alert(response.data)
        this.getOrneks()
        this.setState({
          editOrnekModal: false, editRequestData: { id: "",
          patientNumber:null,
          patientName:null,
          needed:null,
          paid:null,
          remainder:null,
          ticketPrice:null,
          rate:null,
          total:null
      }})
      
      })}


     catch(error)
     {
     
      alert(   error)
     }
     }
    editOrnek=async( id )=> {
      this.setState({
        editOrnekData: { id }, editOrnekModal: ! this.state.editOrnekModal
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getOrneks()})
     
     }

     handlePatientNumber = async()=>{
        let {newOrnek} = this.state
        if(this.state.newOrnek.patientNumber<0||isNaN(this.state.newOrnek.patientNumber))
        return alert("رقم المريض يجب ان يكون ارقام موجبة")
        await axios.get(
            staticVariables.backendUrl+"/patient/"+this.state.newOrnek.patientNumber
            ,{headers: { authToken : localStorage.getItem("token") }}
            ).then((response)=>{
              if(response.data.msg==="غير موجود")
              return alert("غير موجود")
                newOrnek.patientName = response.data.data.name
                newOrnek.ticketPrice = response.data.data.ticketPrice
                newOrnek.rate = response.data.data.rate
                newOrnek.needed = response.data.data.neededNumber
               
            this.setState({newOrnek})
            this.togglePatientNumberModal()
            this.toggleNewOrnektModal()
            })
     }
     
     componentDidMount()
     {this.getOrneks()

    }
render=()=>{

  // if(localStorage.getItem("token"))
  // {
  let  ornek = this.state.ornek?this.state.ornek.map((target) => {
 return (

         <tr key={target.id}>
          <td style={{color:"#000"}}>{target._id}</td>
          <td style={{color:"#000"}}>{target.patientNumber}</td>
          <td style={{color:"#000"}}>{target.patientName}</td>
          <td style={{color:"#000"}}>{target.needed}</td>
          <td style={{color:"#000"}}>{target.paid}</td>
          <td style={{color:"#000"}}>{target.remainder}</td>
          <td style={{color:"#000"}}>{target.ticketPrice}</td>
          <td style={{color:"#000"}}>{target.rate}</td>
          <td style={{color:"#000"}}>{target.total}</td>
          <td style={{color:"#000"}}>{target.username}</td>
          <td style={{color:"#000"}}>{target.time}</td>
           <td style={{color:"#000"}}>
            {localStorage.getItem("type") === "admin" &&
            <div>
           {/* <Button color="success" size="sm" className="mr-2" onClick={()=>this.editOrnek(
         target["_id"])}>
       <EditIcon ></EditIcon></Button> */}
       <Button color="danger" size="sm" onClick={()=>this.deleteOrnek(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
       </div>}
       </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}> اورنيك </h1>
        <Button className="my-3" color="dark" onClick={this.togglePatientNumberModal.bind(this)}>أضافة</Button>


        

<Modal isOpen={this.state.patientNumberModal} toggle={this.togglePatientNumberModal.bind(this)}>
<ModalHeader toggle={this.togglePatientNumberModal.bind(this)}>أضافة اورنيك</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="patientNumber">رقم المريض</Label>
 <Input id="patientNumber" value={this.state.newOrnek.patientNumber} onChange={(e) => {
   let { newOrnek } = this.state;

   newOrnek.patientNumber = e.target.value;

   this.setState({ newOrnek });
 }} />
</FormGroup>



</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.handlePatientNumber()}>التالى</Button>
<Button color="secondary" onClick={this.togglePatientNumberModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>

<Modal isOpen={this.state.newOrnekModal} toggle={this.toggleNewOrnektModal.bind(this)}>
<ModalHeader toggle={this.toggleNewOrnektModal.bind(this)}>أضافة اورنيك</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="patientNumber">رقم المريض</Label>
 <Input id="patientNumber" value={this.state.newOrnek.patientNumber} readOnly onChange={(e) => {
   let { newOrnek } = this.state;

   newOrnek.patientNumber = e.target.value;

   this.setState({ newOrnek });
 }} />
</FormGroup>

<FormGroup>
 <Label for="patientName">اسم المريض</Label>
 <Input id="patientName" value={this.state.newOrnek.patientName} readOnly onChange={(e) => {
   let { newOrnek } = this.state;

   newOrnek.patientName = e.target.value;

   this.setState({ newOrnek });
 }} />
</FormGroup>

<FormGroup>
 <Label for="needed">عدد الاصناف المطلوبة</Label>
 <Input id="needed" value={this.state.newOrnek.needed} readOnly onChange={(e) => {
   let { newOrnek } = this.state;

   newOrnek.needed = e.target.value;

   this.setState({ newOrnek });
 }} />
</FormGroup>


<FormGroup>
 <Label for="paid">عدد الاصناف المدفوعة</Label>
 <Input id="paid" value={this.state.newOrnek.paid} onChange={(e) => {
   let { newOrnek } = this.state;

   newOrnek.paid = e.target.value;
   newOrnek.remainder = newOrnek.needed - newOrnek.paid
   newOrnek.total = newOrnek.paid * newOrnek.rate + newOrnek.ticketPrice
   this.setState({ newOrnek });
 }} />
</FormGroup>


<FormGroup>
 <Label for="remainder">المتبقى</Label>
 <Input id="remainder" value={this.state.newOrnek.remainder} readOnly onChange={(e) => {
   let { newOrnek } = this.state;

   newOrnek.remainder = e.target.value;

   this.setState({ newOrnek });
 }} />
</FormGroup>


<FormGroup>
 <Label for="ticketPrice">سعر التذكرة</Label>
 <Input id="ticketPrice" value={this.state.newOrnek.ticketPrice} readOnly onChange={(e) => {
   let { newOrnek } = this.state;

   newOrnek.ticketPrice = e.target.value;

   this.setState({ newOrnek });
 }} />
</FormGroup>

<FormGroup>
 <Label for="rate">سعر الصنف</Label>
 <Input id="rate" value={this.state.newOrnek.rate} readOnly onChange={(e) => {
   let { newOrnek } = this.state;

   newOrnek.rate = e.target.value;

   this.setState({ newOrnek });
 }} />
</FormGroup>

<FormGroup>
 <Label for="total">المجموع الكلى</Label>
 <Input id="total" value={this.state.newOrnek.total} readOnly onChange={(e) => {
   let { newOrnek } = this.state;

   newOrnek.total = e.target.value;

   this.setState({ newOrnek });
 }} />
</FormGroup>

</ModalBody>
<ModalFooter>


{/* <Button color="secondary" onClick={this.addOrnek()}>اضافة</Button> */}
<Button color="secondary" onClick={this.toggleNewOrnektModal.bind(this)}>الغاء</Button>
<Button color="secondary" onClick={this.addOrnek.bind(this)}>اضافة</Button>
</ModalFooter>

</Modal>

<Modal isOpen={this.state.printModal} toggle={this.togglePrintModal.bind(this)}>
<ModalHeader toggle={this.togglePrintModal.bind(this)}>طباعة</ModalHeader>
<ModalBody>


<ReactToPrint trigger={()=>
    {
        return <Button  color="primary" ><LocalPrintshopIcon></LocalPrintshopIcon> طباعة</Button>
    }
    }
    content = {()=>this.componentRef}
    documentTitle = ""
    onBeforePrint={()=>{
      // this.togglePrintModal()
        }
    }
    onAfterPrint={()=>{this.togglePrintModal()}}
    />



</ModalBody>
<ModalFooter>

<Button color="secondary" onClick={this.togglePrintModal.bind(this)}>اضافة بدون طباعة</Button>
</ModalFooter>

</Modal>



<Modal isOpen={this.state.editOrnekModal} toggle={this.toggleEditOrnekModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditOrnekModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

     <FormGroup>

        <Label for="type">النوع</Label>
       <Input id="type" value={this.state.editOrnekData.type} onChange={(e) => {
         let { editOrnekData } = this.state;

         editOrnekData.type = e.target.value;

         this.setState({ editOrnekData });
       }} />
     </FormGroup>


    
   </ModalBody>
   <ModalFooter>
     <Button color="primary" onClick={()=>this.updateOrnek()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditOrnekModal.bind(this)}>الغاء</Button>
   </ModalFooter>
 </Modal>
       

         <Table>
           <thead>
             <tr>
             <th style={{color:"#000"}}>ID</th>
               <th style={{color:"#000"}}>رقم المريض</th>
               <th style={{color:"#000"}}>اسم المريض</th>
               <th style={{color:"#000"}}>عدد الاصناف المطلوبة</th>
               <th style={{color:"#000"}}>عدد الاصناف المدفوعة</th>
               <th style={{color:"#000"}}>عدد الاصناف المتبقية</th>
               <th style={{color:"#000"}}>سعر التذكرة</th>
               <th style={{color:"#000"}}>سعر الصنف</th>
               <th style={{color:"#000"}}>المجموع</th>
               <th style={{color:"#000"}}>اسم المستخدم</th>
               <th style={{color:"#000"}}>التاريخ</th>
               {localStorage.getItem("type") === "admin" &&<th style={{color:"#000"}}>اجراءات</th>}
             </tr>
           </thead>
           <tbody>
             {ornek}
             <Pagination count={this.state.length} page={this.state.page} value={this.state.page} onChange={(e,value)=>this.handlePageChange(e,value)} />
           </tbody>
         </Table>
         {/* <div style={{display:'none'}}> */}
         <div ref={el => (this.componentRef = el)}>
       <Card 
       sx={{ width: 300 }}
       >
      <CardContent >
      
      <div class="float-container">

    <div class="float-child">
    <img src="/logo.jpg" width="60%"
        height="10%"></img>
    </div>
    
    <div class="float-child">
        
    <Typography variant="subtitle2" style = {{direction: "rtl",fontSize:"8x"}}>   
         المستشفى الجوى العام
        </Typography>
        <Typography variant="subtitle2" style = {{direction: "rtl",fontSize:"8x"}}>
          فرع نظم و المعلومات
        </Typography>
    </div>
    </div>

        <br></br><br></br><br></br>
        <div style={{paddingLeft:"17%"}}>
        <div class="p" >
            
        <u  > اورنيك علاج شهرى  
        <MedicalServicesIcon></MedicalServicesIcon>
        </u>
       
        </div>
        <br></br>
        </div>
        <div class="p2">
        <Typography style = {{direction: "rtl",fontSize:"14x"}} variant="body2">
          رقم المريض: {this.state.newOrnek.patientNumber}
        </Typography>
        <Typography  style = {{direction: "rtl",fontSize:"14x"}} variant="body2">
            
         اسم المريض: {this.state.newOrnek.patientName}
        </Typography>
        
        <Typography  style = {{direction: "rtl",fontSize:"14x"}} variant="body2">
          عدد الاصناف المدفوعة: {this.state.newOrnek.paid}
        </Typography>
        <Typography   variant="body2" style = {{direction: "rtl",fontSize:"14x"}}>
          سعر الصنف: {this.state.newOrnek.rate}
        </Typography>
        <Typography  style = {{direction: "rtl",fontSize:"14x"}}>
          سعر التذكرة: {this.state.newOrnek.ticketPrice}
        </Typography>
        <Typography  style = {{direction: "rtl",fontSize:"14x"}} variant="body2">
          الاجمالى: {this.state.newOrnek.total}
        </Typography>
        <Typography  style = {{direction: "rtl",fontSize:"14x"}} variant="body2">
           كاشير: {localStorage.getItem("username")}
        </Typography>
        <Typography  style = {{direction: "rtl",fontSize:"14x"}} variant="body2">
        تاريخ :  {this.state.newOrnek.time}
        </Typography>
        </div>
       <br></br>
        <div style={{textAlign:"center"}}>مع تمنياتنا بالشفاء العاجل</div>
      </CardContent>
      
    </Card>
    
         </div>
         </div></div>

    //    </div>
     );
   }
  //  else {return  (
  //    <h>Not Authorized</h>
  //  )
  //  }
  }

// }



export default Ornek
