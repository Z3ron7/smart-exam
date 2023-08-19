import Layout from './components/Layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Course from './pages/Course'
import Profile from './pages/Profile'
import Room from './pages/Room'
import Users from './pages/users/Users'

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/users' element={<Users />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/room' element={<Room />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
