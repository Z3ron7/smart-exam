import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { AiFillPieChart } from 'react-icons/ai';
import { PiExamFill } from 'react-icons/pi';
import { RiFolderHistoryFill } from 'react-icons/ri';
import { SiGoogleclassroom } from 'react-icons/si';
import Logo from '../assets/images/logo.svg';
import HamburgerButton from './HamburgerMenuButton/HamburgerButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const SidebarStudents = () => {
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [viewResultOpen, setViewResultOpen] = useState(false);
  const location = useLocation();

  const Menus = [
    { title: 'Dashboard', path: '/student-dashboard', src: <AiFillPieChart /> },
    { title: 'Exam', path: '/exam', src: <PiExamFill /> },
    { title: 'View Result', path: '/result', src: <RiFolderHistoryFill />, subMenu: true },
    { title: 'Room', path: '/student-room', src: <SiGoogleclassroom /> },
    // { title: 'Signin', path: '/login', src: <SiFuturelearn />, gap: 'true' },
  ];
  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };
  return (
    <>
      <div
        className={`${
          open ? 'w-60' : 'w-fit'
        } hidden sm:block relative h-screen duration-300 bg-gray-100 border-r border-gray-200 dark:border-gray-600 pt-4 dark:bg-slate-900 `}
        style={{
          position: 'sticky',
          top: 0,
        }}
      >
        <BsArrowLeftCircle
          className={`${
            !open && 'rotate-180'
          } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-gray-800`}
          onClick={() => setOpen(!open)}
        />
        <Link to='/'>
          <div className={`flex ${open && 'gap-x-4'} items-center`}>
            <img src={Logo} alt='' className='pl-2' />
            {open && (
              <span className='text-xl font-medium whitespace-nowrap dark:text-white'>
                Smart Exam
              </span>
            )}
          </div>
        </Link>

        <ul className='pt-6'>
          {Menus.map((menu, index) => (
            <Link to={menu.path} key={index}>
              {menu.subMenu ? (
                <Accordion
                className='mt-2 text-base font-normal rounded-lg cursor-pointer bg-black
                hover:text-white dark:text-white hover:bg-indigo-700 dark:hover:bg-indigo-700
                transition-transform ease-in-out'
                  expanded={viewResultOpen}
                  onChange={() => setViewResultOpen(!viewResultOpen)}
                  animate={CUSTOM_ANIMATION}
                >
                  <AccordionSummary>
                    <span className='text-2xl ml-1 mr-6 py-1'>{menu.src}</span>
                    <span
                      className={`${
                        !open && 'hidden'
                      } origin-left duration-300`}
                    >
                      {menu.title}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* Add your sub-menu items here */}
                    <Link to='/sub-menu-item-1' className="block">Sub-Menu Item 1</Link>
                    <Link to='/sub-menu-item-2' className="block">Sub-Menu Item 2</Link>
                    {/* You can add more sub-menu items as needed */}
                  </AccordionDetails>
                </Accordion>
              ) : (
                <li
                  className={`
                    flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer
                    hover:text-white dark:text-white hover:bg-indigo-700 dark:hover-bg-indigo-700
                    transition-transform ease-in-out ${menu.gap ? 'mt-9' : 'mt-2'}
                    ${location.pathname === menu.path && 'bg-indigo-700 dark:bg-indigo-700 text-white transform scale-110'}
                  `}
                >
                  <span className='text-2xl mx-2 py-1'>{menu.src}</span>
                  <span className={`${
                    !open && 'hidden'
                  } origin-left duration-300 hover:block`}>
                    {menu.title}
                  </span>
                </li>
              )}
            </Link>
          ))}
        </ul>
      </div>
      {/* Mobile Menu */}
      <div className="pt-3">
        <HamburgerButton setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
      </div>
      <div className="sm:hidden">
        <div
          className={`${
            mobileMenu ? 'flex' : 'hidden'
          } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white  bg-gray-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
        >
          {Menus.map((menu, index) => (
            <Link to={menu.path} key={index} onClick={() => setMobileMenu(false)}>
              <span
                className={` ${
                  location.pathname === menu.path &&
                  'bg-gray-200 dark:bg-gray-700'
                } p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                {menu.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SidebarStudents;
