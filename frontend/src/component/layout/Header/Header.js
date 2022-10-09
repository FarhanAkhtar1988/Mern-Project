import React from 'react';
import {ReactNavbar} from "overlay-navbar";
import {FaUserAlt, FaCartArrowDown} from "react-icons/fa";
import {MdSearch} from "react-icons/md";
import logo from "../../../images/logo.png";

const options = {
  burgerColorHover: "#eb4034",
  logo,
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#eb4034",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "2vmax",
  link1Color: "black",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end", 
  nav3justifyContent: "flex-start", 
  nav4justifyContent: "flex-start",
  link1ColorHover: "#eb4034", 
  link1Margin: "1vmax", 
  profileIconUrl: "/login", 
  profileIconColor: "black",
  searchIconColor: "black", 
  cartIconColor: "black", 
  profileIconColorHover: "#eb4034", 
  searchIconColorHover: "#eb4034", 
  cartIconColorHover: "#eb4034", 
  cartIconMargin: "1vmax", 
  // link1Family : "cursive",
  profileIconSize: "2vmax",
  searchIconSize : "2.2vmax"
}

const Header = () =>{
  return <ReactNavbar
  {...options}
  profileIcon = {true}
  ProfileIconElement = {FaUserAlt}
  searchIcon = {true}
  SearchIconElement = {MdSearch}
  cartIcon = {true}
  CartIconElement = {FaCartArrowDown}
  />
};

export default Header;
