import React from 'react';

import { FaChevronCircleUp, FaChevronCircleDown } from 'react-icons/fa'

const AccordionLayout = ({ title, children, index, activeIndex, setActiveIndex }) => {
    const handleSetIndex = () => {
      if (activeIndex === index) {
        setActiveIndex(null); // Close the accordion if it's already open
      } else {
        setActiveIndex(index); // Open the clicked accordion
      }
    };
  
    return (
      <>
          <div onClick={handleSetIndex} className='flex w-full justify-between p-2 mt-2 rounded dark:bg-slate-900 cursor-pointer'>
              <div className='flex'>
                  <div className='text-black dark:text-white w-full justify-between items-between font-bold'>{title}</div>
              </div>
              <div className="flex items-center justify-center">
              {activeIndex === index ? (
                <FaChevronCircleUp className="w-8 h-8 font-bold" />
                ) : (
                <FaChevronCircleDown className="w-8 h-8 font-bold" />
                )}
              </div>
          </div>
  
          {(activeIndex === index) && (
              <div className="shadow-3xl rounded-2xl shadow-cyan-500/50 p-4 mb-6">
                {children}
              </div>
          )}
      </>
    );
  };

export default AccordionLayout;