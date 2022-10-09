import React, { Fragment,useState } from 'react';
import LockOpenIcon from "@material-ui/icons/LockOpen";
import "./updatePassword.css"
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../actions/userAction';
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { useEffect } from 'react';
import { clearErrors } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";

const UpdatePassword = (history) => {
    const dispatch= useDispatch();
    const alert = useAlert();

    const {loading,error,isUpdated} = useSelector((state)=>state.profile);

    const [oldPassword,setOldpassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("")

    const updatePasswordSubmit = (e) =>{
       e.preventDefault()
       const myForm = new FormData()
      myForm.set('oldPassword',oldPassword)
      myForm.set("newPassword",newPassword)
      myForm.set("confirmPassword",confirmPassword)
      dispatch(updatePassword(myForm))
    }
    useEffect(()=>{
 if (error){
    alert.error(error)
    dispatch(clearErrors())
 }
 if(isUpdated){
     alert.success("Password Updated Successfully")
     history.push("/account")
    }
    dispatch({
       type: UPDATE_PASSWORD_RESET
    })
},[dispatch,alert,error,history,isUpdated])

  return (
   <Fragment>
    {loading ? <Loader/> : (
         <Fragment>
         <MetaData title="Change Password"/>
         <div className='updatePasswordContainer'>
           <div className='updatePasswordBox'>
              <h2 className='updatePasswordHeading'>Update Password</h2>
              <form className='updatePasswordForm' onSubmit={updatePasswordSubmit}>
                 <div className='oldPassword'>
                     <VpnKeyIcon/>
                     <input type="password" placeholder='Old Password' required value={oldPassword}
                     onChange= {(e)=>{setOldpassword(e.target.value)}}/>
                 </div>
                 <div className='newPassword'>
                     <LockOpenIcon/>
                     <input type="password" placeholder='New Password' required value={newPassword}
                     onChange={(e)=>{setNewPassword(e.target.value)}}/>
                 </div>
                 <div className='confirmPassword'>
                  <LockIcon/>
                  <input type = "password" placeholder='Confirm Password' required value={confirmPassword}
                  onChange= {(e)=>{setConfirmPassword(e.target.value)}}/>
                 </div>
                 <input type="submit" value="Submit" className='updatePasswordBtn'/>
              </form>
           </div>
         </div>
     </Fragment>
    )}
   </Fragment>
  )
}

export default UpdatePassword
