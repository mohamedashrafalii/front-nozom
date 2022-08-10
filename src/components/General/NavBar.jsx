import React from 'react'
import { Navbar, Nav, Form } from 'react-bootstrap'
import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import axios from "axios"
import staticVariables from "../../statics.json"
import Tooltip from '@mui/material/Tooltip';
export default class NavBar extends React.Component {
  constructor(props) {
    super(props)
    
  }

  componentDidMount() {
   
  }

  render() {
    // if (!this.state.loggedIn) {
    //   return (
    //     <div>
    //       <Navbar bg="dark" variant="dark">
           
            
    //         <Form inline style={{alignContent:"right"}} bg="dark" variant="dark">
    //           <Button href="/signIn" variant="outline-info">
    //             <AccountCircleIcon /> Sign In
    //           </Button>
    //         </Form>
    //       </Navbar>
    //       <ReactTooltip />
    //     </div>
    //   )
    // } else {
      return (
        <div>
          <Navbar bg="dark" variant="dark">
           
            <Nav className="mr-auto"/>
              
            
            <Form inline bg="dark" variant="dark">
              <div>
              {/* <Tooltip title="Dashboard">
                <IconButton
                  aria-label="delete"
                  onClick={() => (window.location.href = '/store/dashboard')}
                >
                
                  <DashboardIcon
                    style={{ color: 'white' }}
                    data-tip
                    data-for="dashboard"
                  />
                  
                </IconButton>
                </Tooltip> */}

                <Tooltip title="Logout">
                <IconButton aria-label="delete" onClick={async()=>{localStorage.removeItem("token")
localStorage.removeItem("type")
          await axios.get(staticVariables.backendUrl+"/auth/Logout")
                          window.location.href=staticVariables.frontUrl
              }}>
                  <ExitToAppIcon
                    style={{ color: 'white' }}
                    data-tip
                    data-for="logout"
                  />
                 
                </IconButton>
                </Tooltip>
              </div>
            </Form>
          </Navbar>
          
        </div>
      )
    }
  }
// }
