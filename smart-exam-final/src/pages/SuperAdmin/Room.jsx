import React from 'react';
import { FaRegCalendarMinus } from 'react-icons/fa';

const projects = [
  {
    title: "Project 1",
    category: "Web Development",
    url: "/projects/project-1",
    users: [
      { name: "User A", avatar: "user-a.jpg" },
      { name: "User B", avatar: "user-b.jpg" },
    ],
  },
  {
    title: "Project 2",
    category: "Mobile App",
    url: "/projects/project-2",
    users: [
      { name: "User C", avatar: "user-c.jpg" },
      { name: "User D", avatar: "user-d.jpg" },
    ],
  },
  {
    title: "Project 3",
    category: "Mobile App",
    url: "/projects/project-3",
    users: [
      { name: "User C", avatar: "user-c.jpg" },
      { name: "User D", avatar: "user-d.jpg" },
    ],
  },
  {
    title: "Project 4",
    category: "Mobile App",
    url: "/projects/project-3",
    users: [
      { name: "User C", avatar: "user-c.jpg" },
      { name: "User D", avatar: "user-d.jpg" },
    ],
  },
  {
    title: "Project 4",
    category: "Mobile App",
    url: "/projects/project-3",
    users: [
      { name: "User C", avatar: "user-c.jpg" },
      { name: "User D", avatar: "user-d.jpg" },
    ],
  },
  // Add more projects...
];

const Room = () => {
  return (
    <div>
      <header className="dark:bg-slate-800 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6 mb-2 border-[#4E73DF] border-2">
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-slate-900 items-center dark:text-white">Exam Room</h2>
    </div>
    <form className="group relative">
      <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
      </svg>
      <input className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" type="text" aria-label="Filter projects" placeholder="Filter projects..." />
    </form>
  </header>
    <div className='grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-4'>
      {projects.map((project, projectIndex) => (
        <div
          key={projectIndex}
          className='dark:bg-slate-800 border-2 h-[150px] rounded-[8px] bg-white border-l-[6px] border-[#4E73DF] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'
        >
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-600'>
            <FaRegCalendarMinus fontSize={28} color='' />
          </div>
          <div className='flex flex-col w-60'>
            <h2 className='text-[#B589DF] text-[11px] leading-[17px] px-[10px] font-bold'>
              {project.title}
            </h2>
            <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px] px-[10px] dark:text-white'>
              {project.category}
            </h1>
            <div className='flex items-center flex-nowrap mt-3 justify-end'> {/* Added flex-nowrap */}
            {project.users.map((user, userIndex) => (
              <img
                key={userIndex}
                src={user.avatar}
                alt={user.name}
                className='w-6 h-6 rounded-full bg-slate-100 ring-2 ring-white'
                loading='lazy'
              />
            ))}
          </div>
          </div>
          
        </div>
      ))}
      <li className="flex">
        <a href="/new" className="hover:border-blue-500 hover:border-solid dark:text-white hover:bg-indigo-700 hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3">
          <svg className="group-hover:text-blue-500 mb-1 text-slate-400" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
          </svg>
          Create Exam
        </a>
      </li>
    </div>
    </div>
  );
};

export default Room;
