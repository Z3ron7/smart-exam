import React from 'react'

export const Result = () => {
  return (
    <div className='bg-gray-100 dark:bg-slate-600 dark:text-white'>
        <header className="dark:bg-slate-800 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Questions</h2>
          <div className="flex justify-end">
                <button className="bg-blue-500 hover:bg-blue-400 ease-out duration-300 ring-2 ring-purple-500 text-white px-4 py-2 rounded">New Question</button>
            </div>
        </div>
        <form className="group relative ">
          <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
          </svg>
          <input className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" type="text" aria-label="Filter projects" placeholder="Filter questions..." />
        </form>
      </header>
    </div>
  )
}
