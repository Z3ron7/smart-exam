import React from "react";
import "./navbar.scss";
import Toggle from './ThemeToggle'
import {FaBell, FaCog} from 'react-icons/fa'

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo.svg" alt="" />
        <span className="dark:text-white">Admin</span>
      </div>
      <div className='flex items-center mx-auto'>
          <span className='text-xl font-medium whitespace-nowrap dark:text-white'>
            Welcome
          </span>
        </div>

        <div className='flex justify-end pr-4'>
          <Toggle />
        </div>
      <div className="icons">
        <div className="notification">
          <FaBell className="dark:text-white"/>
          <span>1</span>
        </div>
        <div className="user">
          <img
            src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
          />
          <span className="dark:text-white">Neroz</span>
        </div>
        <FaCog className="dark:text-white"/>
      </div>
    </div>
  );
};

export default Navbar;