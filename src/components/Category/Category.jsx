import React, { Component } from "react"
import axios from "axios"
import {  Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import staticVariables from "../../statics.json"
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
class Category extends Component {

  state={
    length:10,
    page:1,
    limit:10,
    category:[],
    type:"",
    
    newCategory:{
     type:"",
     
    },
    editCategoryData: {
      id:"",
      type:"",
          },
    newCategoryModal: false,
    editCategoryModal:false
  }

  toggleNewCategorytModal() {
    this.setState({
      newCategoryModal: ! this.state.newCategoryModal
    });
  }

  toggleEditCategoryModal() {
    this.setState({
      editCategoryModal: ! this.state.editCategoryModal
    });
  }
  getCategorys = async  ()=> {
    let {page,limit} = this.state
    const res = await axios.get(
      staticVariables.backendUrl+"/category?limit="+limit+"&page="+page
      ,{headers: { authToken : localStorage.getItem("token") }}
      );
    this.setState({ category: res.data.data ,length:Math.ceil(res.data.size/limit)});

  };
  deleteCategory=async(id)=> {

    await axios.delete(staticVariables.backendUrl+"/category/delete/" + id
    ,{headers: { authToken : localStorage.getItem("token") }}
    )
    .then(() => {

     this.getCategorys()
    })
    .catch(error=>{alert(error.message)});

  }

  addCategory=async()=>{
  await axios
  .post(
    staticVariables.backendUrl+"/category/add/",
    this.state.newCategory
    ,{headers: { authToken : localStorage.getItem("token") }}
  )
  .then((response) => {
    console.log(response.data)
    if(response.data.msg!=="Created successfully")
    return alert(response.data)
    let { category } = this.state;
    this.getCategorys()

    this.setState({ category, newCategoryModal: false, newCategory: {
      type:"",
      
  }}
    )
  })

  .catch(error => {
    alert(error.message)
  })

}

      updateCategory = async()=>{
      let {type} = this.state.editCategoryData;
      try{

         await axios.put(staticVariables.backendUrl+"/category/" + this.state.editCategoryData.id, {

        type
      },
      {headers: { authToken : localStorage.getItem("token") }}
      )
      .then((response) =>
      {  
          this.getCategorys()
        this.setState({
          editCategoryModal: false, editRequestData: { id: "",
        type:""
      }})
      
      })}


     catch(error)
     {
     
      alert(   error)
     }
     }
    editCategory=async( id )=> {
      this.setState({
        editCategoryData: { id }, editCategoryModal: ! this.state.editCategoryModal
      });

     }

     handlePageChange(e,value)
     {

      let { page } = this.state;

      page = value;
     
      this.setState({ page },()=>{this.getCategorys()})
     
     }
     
     componentDidMount()
     {this.getCategorys()

    }
render=()=>{

  // if(localStorage.getItem("token"))
  // {
  let  category = this.state.category?this.state.category.map((target) => {
 return (

         <tr key={target.id}>
          <td style={{color:"#000"}}>{target._id}</td>
           <td style={{color:"#000"}}>{target.type}</td>

           <td style={{color:"#000"}}>
           <Button color="success" size="sm" className="mr-2" onClick={()=>this.editCategory(
         target["_id"])}>
       <EditIcon ></EditIcon></Button>
       <Button color="danger" size="sm" onClick={()=>this.deleteCategory(target["_id"])}><DeleteForeverIcon></DeleteForeverIcon></Button>
     </td>



         </tr>
       )
     }):"";

     return (
<div> <div className="App container">

       <h1 style={{color:"#000"}}> النوع </h1>
        <Button className="my-3" color="dark" onClick={this.toggleNewCategorytModal.bind(this)}>أضافة</Button>



<Modal isOpen={this.state.newCategoryModal} toggle={this.toggleNewCategorytModal.bind(this)}>
<ModalHeader toggle={this.toggleNewCategorytModal.bind(this)}>أضافة النوع</ModalHeader>
<ModalBody>


<FormGroup>
 <Label for="type">النوع</Label>
 <Input id="type" value={this.state.newCategory.type} onChange={(e) => {
   let { newCategory } = this.state;

   newCategory.type = e.target.value;

   this.setState({ newCategory });
 }} />
</FormGroup>



</ModalBody>
<ModalFooter>

<Button color="primary" onClick={()=>this.addCategory()}>اضافة</Button>
<Button color="secondary" onClick={this.toggleNewCategorytModal.bind(this)}>الغاء</Button>
</ModalFooter>

</Modal>


<Modal isOpen={this.state.editCategoryModal} toggle={this.toggleEditCategoryModal.bind(this)}>
   <ModalHeader toggle={this.toggleEditCategoryModal.bind(this)}>تعديل</ModalHeader>
   <ModalBody>

 

     <FormGroup>

        <Label for="type">النوع</Label>
       <Input id="type" value={this.state.editCategoryData.type} onChange={(e) => {
         let { editCategoryData } = this.state;

         editCategoryData.type = e.target.value;

         this.setState({ editCategoryData });
       }} />
     </FormGroup>


    
   </ModalBody>
   <ModalFooter>
     <Button color="primary" onClick={()=>this.updateCategory()}>تعديل</Button>{" "}
     <Button color="secondary" onClick={this.toggleEditCategoryModal.bind(this)}>الغاء</Button>
   </ModalFooter>
 </Modal>

         <Table>
           <thead>
             <tr>
             <th style={{color:"#000"}}>ID</th>
               <th style={{color:"#000"}}>النوع</th>
               
               <th style={{color:"#000"}}>اجراءات</th>
             </tr>
           </thead>
           <tbody>
             {category}
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



export default Category
