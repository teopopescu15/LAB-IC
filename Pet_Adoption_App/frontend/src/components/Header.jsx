import React from "react";
import Logo from '../assets/logo.jpeg'
export default function Header(){

    return(
<header>
    <h1>Welcome to Pet Adoption!</h1>
    <img src={Logo} alt="logo" className="logo"/>
</header>

    )
}