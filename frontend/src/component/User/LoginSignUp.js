import React, { Fragment } from 'react';
import { useRef } from 'react';
import "./LoginSignUp.css";
import {Link} from 'react-router-dom';
import { useState } from 'react';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login,register } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { useEffect } from 'react';
import Loader from "../layout/Loader/Loader";
// import { Typography } from '@material-ui/core';
// import {GoogleLogin,GoogleLogout} from "react-google-login";
// import {gapi} from "gapi-script";





const LoginSignUp = ({history,location}) => {
const dispatch = useDispatch();
const alert = useAlert();

const {error,loading,isAuthenticated} = useSelector((state)=> state.user);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // const [showloginButton, setShowloginButton] = useState(true);
  // const [showlogoutButton, setShowlogoutButton] = useState(false);

  const [user, setUser] = useState({
    name:"",
    email:"",
    password:""
  })
  const [avatar, setAvatar] = useState();
  const [avatarPreview , setAvatarPreview] = useState("/profileResized1.png");
const {name ,email, password} = user;

const redirect = location.search ? location.search.split("=")[1] : "/account"
// google authentication process
// const clientId = "162288101528-nvjlm4b9f7jjhcvpvj0ua0srub5oli1k.apps.googleusercontent.com";
// const onLoginSuccess = (res) => {
//   console.log('Login Success:', res.profileObj);
//   setShowloginButton(false);
//   setShowlogoutButton(true);
// };

// const onLoginFailure = (res) => {
//   console.log('Login Failed:', res);
// };

// const onSignoutSuccess = () => {
//   alert.success("You have been logged out successfully");
//   console.log("Logout successfully")
//   setShowloginButton(true);
//   setShowlogoutButton(false);
// };
// yahan tak
useEffect(()=>{
 if(error){
  alert.error(error)
  dispatch(clearErrors())
 }
 if(isAuthenticated){
  history.push(redirect)
 }
//  function start () {
//   gapi.client.init({
//     clientId: clientId,
//     scope: ""
//   })
//  }
//  gapi.load("client:auth2",start)
},[dispatch,error,alert,isAuthenticated,history,redirect])
// var accessToken = gapi.auth.getToken().access_token;
// console.log(accessToken)
  const switchTabs = (e, tab) =>{
     if(tab === "login"){
      switherTab.current.classList.add("shiftToNeutral");
      switherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
     }
     if(tab === "register"){
      switherTab.current.classList.add("shiftToRight");
      switherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
     }
  }
   const loginSubmit = (e) => {
    e.preventDefault()
      dispatch(login(loginEmail,loginPassword))
   }
   const registerSubmit = (e) => {
    e.preventDefault();
    const myform = new FormData();
    myform.set("name" , name);
    myform.set("email" , email);
    myform.set("password" , password);
    myform.set("avatar" , avatar);
    dispatch(register(myform));
 }
 const registerDataChange = (e) => {
  if(e.target.name === "avatar") {
   const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2){
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  } else {
    setUser({...user , [e.target.name]: e.target.value});
  }
 }
  return (
    <Fragment>
      {loading ? <Loader/>:(
        <Fragment>
        <div className='LoginSignUpContainer'>
          <div className='LoginSignUpBox'>
            <div>
            <div className='login_signUp_toggle'>
              <p onClick={(e)=> switchTabs(e,"login")}>LOGIN</p>
              <p onClick={(e)=> switchTabs(e, "register")}>REGISTER</p>
            </div>
            <button ref={switherTab}></button>
            </div>
            <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
               <div className='loginEmail'>
                 <MailOutlineIcon/>
                 <input
                 type="email"
                 placeholder='Email'
                 required
                 value={loginEmail}
                 onChange={(e)=> setLoginEmail(e.target.value)}
                 />
               </div>
               <div className='loginPassword'>
                <LockOpenIcon/>
                <input
                type="password"
                placeholder='Password'
                required
                value={loginPassword}
                onChange={(e)=> setLoginPassword(e.target.value)}
                />
               </div>
               <Link to = "/password/forgot">Forget Password ?</Link>
               <input type="submit" value="Login" className='loginBtn'/>
               {/* <Typography>OR</Typography>
               <div className='googleBtn'>
            { showloginButton ?
                <GoogleLogin
                    clientId={clientId}
                    buttonText="Login"
                    onSuccess={onLoginSuccess}
                    onFailure={onLoginFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                /> : null}

            { showlogoutButton ?
                <GoogleLogout
                    clientId={clientId}
                    buttonText="Logout"
                    onLogoutSuccess={onSignoutSuccess}
                >
                </GoogleLogout> : null
            }
        </div> */}
               {/* <a href='/google'>Google</a> */}
               {/* <Link onClick={()=>dispatch(googleLogin())}> */}
                {/* <img src= {googleLoginImg} alt = "google" /> */}
               {/* </Link> */}
            </form>
            <form className='signUpForm' ref={registerTab} encType= "multipart/form-data" onSubmit={registerSubmit}>
                <div className='signUpName'>
                  <FaceIcon/>
                  <input
                 type="text"
                 placeholder='Name'
                 required
                 name='name'
                 value={name}
                 onChange={registerDataChange}
                 />
                </div>
                <div className='signUpEmail'>
                <MailOutlineIcon/>
                <input 
                type="email"
                placeholder='Email'
                required
                name='email'
                value={email}
                onChange = {registerDataChange}
                />
                </div>
                <div className='signUpPassword'>
                <LockOpenIcon/>
                <input
                type="password"
                placeholder='Password'
                required
                name='password'
                value={password}
                onChange={registerDataChange}
                />
               </div>
               <div id='registerImage'>
               <img src={avatarPreview} alt="Avatar Preview"/>
               <input
               type="file"
               name='avatar'
               accept='image/*'
               onChange={registerDataChange}
               />
               </div>
               <input
               type="submit"
               value="Register"
               className='signUpBtn'
               />
            </form>
           </div>
           </div>
      </Fragment>
      )}
    </Fragment>
  )
}

export default LoginSignUp
