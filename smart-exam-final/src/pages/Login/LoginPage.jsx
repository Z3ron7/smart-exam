import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function LoginPage() {
  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:3001/login', values, { withCredentials: true })
      .then((res) => {
        if (res.data.Status === 'Login Successful') {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.role);
          localStorage.setItem('user_id', res.data.user_id);
          const userRole = res.data.role;
  
          // Access the isVerified status from the response
          const isVerified = res.data.isVerified;
  
          if (userRole === 'Exam-taker') {
            if (isVerified) {
              // User is verified, redirect to the student dashboard
              navigate('/student-dashboard');
            } else {
              // User is not verified, redirect to the verification page
              navigate('/verification');
            }
          } else {
            // Handle different user roles as needed and redirect accordingly
            let dashboardURL = '/dashboard'; // Default URL
            if (userRole === 'Admin') {
              dashboardURL = '/dashboard';
            } else if (userRole === 'Super Admin') {
              dashboardURL = '/super-dashboard';
            }
            navigate(dashboardURL);
          }
  
          alert('Login successfully.');
        } else {
          setError('Login failed. Please check your credentials.');
        }
      })
      .catch((err) => {
        console.error(err.response);
        setError('An error occurred during login.');
      });
  };
  
  return (
    <>
    <div className="flex bg-white min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={(e) => setValues({ ...values, username: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <button
                  type="button" // Use a button for navigation
                  onClick={() => navigate('/forgot-password')} // Navigate to the forgot password page
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <div className="mt-2">
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default LoginPage