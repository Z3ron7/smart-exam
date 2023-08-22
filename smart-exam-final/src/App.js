import Layout from './components/Layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Course from './pages/Course'
import Room from './pages/Room'
import Users from './pages/users/Users'

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/users' element={<Users />} />
                    <Route path='/room' element={<Room />} />
                    <Route path='/course' element={<Course />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
