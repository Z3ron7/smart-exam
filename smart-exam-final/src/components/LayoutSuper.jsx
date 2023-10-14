import React from 'react'
import Navbar from './NavbarSuper'
import Sidebar from './SidebarSuper'

const LayoutSuper = ({ children }) => {
    return (
        <>
            <div className='flex flex-auto h-full'>
                <Sidebar />
                <div className='grow'>
                    <Navbar />
                    <div className='m-5'>{children}</div>
                </div>
            </div>
        </>
    )
}

export default LayoutSuper
