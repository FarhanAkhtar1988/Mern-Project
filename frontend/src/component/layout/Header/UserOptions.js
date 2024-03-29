import React, { Fragment } from 'react';
import "./Header.css";
import {SpeedDial, SpeedDialAction} from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import { useState } from 'react';
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import {useHistory} from "react-router-dom";
import {useAlert} from "react-alert";
import {useDispatch,useSelector} from "react-redux";
import {logout} from "../../../actions/userAction";
import profilePng from '../../../images/profileResized1.png';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";



const UserOptions = ({user}) => {
  const {cartItems} = useSelector((state)=>state.cart);
  const [open, setOpen] = useState(false);
  // history aise bhi le sakte hai
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ShoppingCartIcon style={{color:cartItems.length > 0 ? "tomato": "unset"}}/>, name: `Cart(${cartItems.length})`, func: viewCart},
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser}
    ]
    if (user.role === "admin"){
      options.unshift({ icon: <DashboardIcon/>, name: "Dashboard", func: dashboard });
  }
  function dashboard() {
    history.push("admin/dashboard");
  }
  function orders() {
    history.push("/orders");
  }
  function account() {
    history.push("/account");
  }
  function logoutUser(){
    dispatch(logout())
    alert.success("Logout Successfully");
  }
  function viewCart(){
    history.push("/Cart")
  }
  return <Fragment>
        <Backdrop open={open} style={{zIndex:"10"}}/>
        <SpeedDial
          ariaLabel='SpeedDial tooltip example'
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          style={{zIndex:'11'}}
          open={open}
          direction="down"
          className='speedDial'
          icon={<img
          className='speedDialIcon'
          src={user.avatar.url ? user.avatar.url : profilePng }
          alt= "Profile"
          />}
        >
        {options.map((item)=>(
          <SpeedDialAction
          key= {item.name}
          icon={item.icon} 
          tooltipTitle={item.name} 
          onClick={item.func}
          tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
       </SpeedDial>
  </Fragment>
}

export default UserOptions
