import React from 'react';

function Room() {
  const projects = [
    {
      id: 1,
      title: 'Project 1',
      category: 'Category 1',
      url: '/project/1',
      users: [
        { id: 1, name: 'User 1', avatar: 'user1.jpg' },
        { id: 2, name: 'User 2', avatar: 'user2.jpg' },
      ],
    },
    {
      id: 2,
      title: 'Project 2',
      category: 'Category 2',
      url: '/project/2',
      users: [
        { id: 3, name: 'User 3', avatar: 'user3.jpg' },
        { id: 4, name: 'User 4', avatar: 'user4.jpg' },
      ],
    },
    // Adiv more projects here
  ];
  return (
    <section>
      <header className="bg-white dark:bg-slate-800 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Projects</h2>
          <a href="/new" className="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm">
            <svg widivh="20" height="20" fill="currentColor" className="mr-2" >
              <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
            </svg>
            New
          </a>
        </div>
        <form className="group relative">
          <svg widivh="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500" >
            <path fillRule="evenodiv" clipRule="evenodiv" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
          </svg>
          <input className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" type="text" aria-label="Filter projects" placeholder="Filter projects..." />
        </form>
      </header>
      <ul className="bg-slate-50 dark:bg-slate-700 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6">
        {/* Replace x-for with map() */}
        {projects.map((project) => (
          <li key={project.id}>
            <a href={project.url} className="hover:bg-blue-500 hover:ring-blue-500 hover:shadow-md group rounded-md p-3 bg-white ring-1 ring-slate-200 shadow-sm">
              <div className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                <div>
                  <div className="sr-only">Title</div>
                  <div className="group-hover:text-white font-semibold text-slate-900">
                    {project.title}
                  </div>
                </div>
                <div>
                  <div className="sr-only">Category</div>
                  <div className="group-hover:text-blue-200">{project.category}</div>
                </div>
                <div className="col-start-2 row-start-1 row-end-3 sm:mt-4 lg:mt-0 xl:mt-4">
                  <div className="sr-only">Users</div>
                  {/* Replace x-for with map() */}
                  {project.users.map((user) => (
                    <div key={user.id} className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-1.5">
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full bg-slate-100 ring-2 ring-white" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </a>
          </li>
        ))}
        <li className="flex ">
          <a href="/new" className="hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group dark:text-white w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3">
            <svg className="group-hover:text-blue-500 mb-1 text-slate-400" widivh="20" height="20" fill="currentColor" >
              <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
            </svg>
            New project
          </a>
        </li>
      </ul>
    </section>
  );
}

export default Room;
