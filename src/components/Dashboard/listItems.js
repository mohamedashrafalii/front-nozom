import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@mui/material/Tooltip';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
const ActiveItemColor = '#353A40'
const DefaultItemColor = 'white'


export function MainListItems(props) {
  const sendDataToParentComponent = (data) => {
    props.parentCallback(data)
  }
  
  const userList = [
    {
      name: 'مريض',
        icon:(style,toolTipID)=> {
        return(
        <AccessibleForwardIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'مريض'
    } ,
    {
      name: 'اورنيك',
        icon:(style,toolTipID)=> {
        return(
        <MedicalServicesIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'اورنيك'
    } 
  
]
  const adminList = [
    {
      name: 'مريض',
        icon:(style,toolTipID)=> {
        return(
        <AccessibleForwardIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'مريض'
    } ,
    {
      name: 'اورنيك',
        icon:(style,toolTipID)=> {
        return(
        <MedicalServicesIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'اورنيك'
    } ,
    {
      name: 'المستخدمين',
        icon:(style,toolTipID)=> {
        return(
        <AccountCircleIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'المستخدمين'
    } ,
    {
      name: 'القسم',
        icon:(style,toolTipID)=> {
        return(
        <AccountBalanceIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'القسم'
    } ,
     {
      name: 'النوع',
        icon:(style,toolTipID)=> {
        return(
        <KeyboardDoubleArrowUpIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'النوع'
    } ,
    {
      name: 'العائل',
        icon:(style,toolTipID)=> {
        return(
        <EscalatorWarningIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'العائل'
    } ,
    {
      name: 'تقارير',
        icon:(style,toolTipID)=> {
        return(
        <AttachMoneyIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'تقارير'
    } 
  //   ,
  //   {
  //    name: 'رتب الضباط',
  //      icon:(style,toolTipID)=> {
  //      return(
  //      <StarIcon
  //        data-tip
  //        data-for={toolTipID}
  //        style={style}
  //      />)
  //      },
  //    toolTipID: 'رتب الضباط'
  //  },
  //  {
  //   name: 'رتب الصف',
  //     icon:(style,toolTipID)=> {
  //     return(
  //     <KeyboardDoubleArrowUpIcon
  //       data-tip
  //       data-for={toolTipID}
  //       style={style}
  //     />)
  //     },
  //   toolTipID: 'رتب الصف'
  // } 
]
let list = localStorage.getItem("type")==="admin"?adminList:userList
  const [activeItem, setActiveItem] = React.useState()
  return (
    <div>
      { list.map((item) => (
         <Tooltip title={item.name}>
        <ListItem
          button
          onClick={() => {
            setActiveItem(item.name)
            sendDataToParentComponent(item.name)
          }}
          style={activeItem === item.name
            ? { backgroundColor: ActiveItemColor,color: DefaultItemColor }
            : {}}
        >
          <ListItemIcon>
         
            {item.icon( activeItem === item.name
              ? { color: DefaultItemColor }
              : {},item.toolTipID)}
            
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
        </Tooltip>
      ))}
    </div>
  )
}


// export const secondaryListItems = (
//   <div>
//     <ListSubheader inset>Saved reports</ListSubheader>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItem>
//   </div>
// )



