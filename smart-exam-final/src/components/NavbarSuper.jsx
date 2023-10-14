import React, {useState, Fragment} from "react";
import "./navbarSuper.scss";
import Toggle from "./ThemeToggle";
import { FaBell, FaCog } from "react-icons/fa";
import { Menu, Popover, Transition } from '@headlessui/react'
import { HiOutlineBell, HiOutlineSearch, HiOutlineChatAlt } from 'react-icons/hi'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'



const NavbarSuper = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const showProfile = () => {
    // alert("helloo")
    setOpen(!open);
  };

  const handleLogout = () => {
    // Clear the token from localStorage and redirect to the login page
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="navbar">
      {/* <div className="logo">
        <img src="logo.svg" alt="" />
        <span className="dark:text-white">Admin</span>
      </div> */}
      <div className="flex items-center mx-auto">
        <span className="text-xl font-medium whitespace-nowrap dark:text-white">
          Welcome
        </span>
      </div>

      <div className="flex justify-end pr-4">
        <Toggle />
      </div>
      <div className="icons">
        <div className="notification flex items-center gap-[25px] border-r-[1px] pr-[25px]">
        <Popover className="relative">
					{({ open }) => (
						<>
							<Popover.Button
								className={classNames(
									open && 'bg-transparent',
									'group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-slate-500 '
								)}
							>
								<HiOutlineBell fontSize={24} className="dark:text-white" />
                <span className="mr-2 mt-2 ">1</span>
							</Popover.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-200"
								enterFrom="opacity-0 translate-y-1"
								enterTo="opacity-100 translate-y-0"
								leave="transition ease-in duration-150"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-1"
							>
								<Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
									<div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
										<strong className="text-gray-700 font-medium">Notifications</strong>
										<div className="mt-2 py-1 text-sm">This is notification panel.</div>
									</div>
								</Popover.Panel>
							</Transition>
						</>
					)}
				</Popover>
          
        </div>
        <div
          className="flex items-center gap-[15px] relative"
          onClick={showProfile}
        >
          <p className="dark:text-white text-black font-medium">Renzo Rens</p>
          <div className=" user h-[50px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
            <img
              src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
              alt=""
            />
          </div>

          {open && (
            <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
              <p className="cursor-pointer hover:text-[blue] font-semibold">
                Profile
              </p>
              <p className="cursor-pointer hover:text-[blue] font-semibold">
                Settings
              </p>
              <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={handleLogout}>
                Log out
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarSuper;
