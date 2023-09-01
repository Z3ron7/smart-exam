import React from 'react'
import NavbarStudents from './NavbarStudents'
import SidebarStudents from './SidebarStudents'

const LayoutStudents = ({ children }) => {
    return (
        <>
            <div className='flex flex-auto h-full'>
                <SidebarStudents />
                <div className='grow'>
                    <NavbarStudents />
                    <div className='m-5'>{children}</div>
                </div>
            </div>
        </>
    )
}

export default LayoutStudents
