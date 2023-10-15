import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RadioGroup } from "@headlessui/react";
import Select from 'react-select';

export default function Register() {
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    username: "", // Assuming username maps to email
    password: "",
    status: "student", // Set a default status
    gender: "",
    image: null, // Use null initially
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setValues({ ...values, image: file }); // Update the 'image' property with the File object
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (values.password !== passwordConfirmation) {
      console.error("Password and password confirmation do not match");
      return;
    }

    try {
      // Create a FormData object and append the image file
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("status", values.status);
      formData.append("gender", values.gender);
      formData.append("profileImage", values.image); // Append the File object

      console.log("FormData:", formData);

      const response = await axios.post("http://localhost:3001/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
        },
      });

      if (response.data.Status === "Success") {
        setRegistrationStatus("success");
        setTimeout(() => {
          navigate("/Log-in");
        }, 2000);
      } else {
        setRegistrationStatus("error");
      }
    } catch (err) {
      console.error(err); // Log the error
      setRegistrationStatus("error");
    }
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 170, // Adjust the width as needed
    }),
  };
  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      {registrationStatus === "success" && (
        <div
          className=" flex w-1/2 mx-auto rounded-lg bg-green-100 px-6 py-5 text-base text-green-500 justify-center items-center"
          role="alert"
        >
          Registration successful! Redirecting to login page...
        </div>
      )}
      {registrationStatus === "error" && (
        <div
          className="mb-4 rounded-lg bg-error-100 px-6 py-5 text-base text-red-500"
          role="alert"
        >
          Registration failed. Please try again.
        </div>
      )}
      <div className="flex flex-col pt-6 w-full items-center sm:justify-center sm:pt-0 bg-gray-50">
      <div className="items-center mx-auto justify-center">
          <a href="/">
            <h3 className="text-4xl font-bold text-purple-600">Logo</h3>
          </a>
        </div>
        <div className="w-1/2 px-6 py-4 mt-6 overflow-hidden items-center bg-white shadow-md sm:max-w-lg sm:rounded-lg">
      <form onSubmit={handleRegister} encType="multipart/form-data">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Name
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={e => setValues({ ...values, name: e.target.value })} // Update the name state
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Email
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="email"
                  name="username"
                  value={values.username} // Use values.username
                  onChange={e => setValues({ ...values, username: e.target.value })} // Update values.username
                  className="block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="flex items-start mt-4">
            <div className="flex flex-col items-start mr-9">
  <Select
    id="gender"
    name="gender"
    value={genderOptions.find((option) => option.value === values.gender)} // Set the value based on the 'value' property
    onChange={(selectedOption) => setValues({ ...values, gender: selectedOption.value })} // Update values.gender
    options={genderOptions}
    styles={customStyles}
    isSearchable
    placeholder="Select Gender"
  />
</div>

            <RadioGroup value={values.status} onChange={status => setValues({ ...values, status })}>
              <div className="flex items-start mt-3 mb-3">
                <RadioGroup.Label className="block text-sm font-medium text-gray-700">
                  Status:
                </RadioGroup.Label>
                <div className="flex items-center ml-4 space-x-4">
                  <RadioGroup.Option value="student">
                    {({ checked }) => (
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div
                          className={`w-5 h-5 border rounded-full ${
                            checked ? "bg-blue-500" : "bg-white border-gray-400"
                          } transition-colors`}
                        ></div>
                        <div
                          className={`text-sm ${
                            checked ? "text-blue-500" : "text-gray-800"
                          }`}
                        >
                          Student
                        </div>
                      </label>
                    )}
                  </RadioGroup.Option>
                  <RadioGroup.Option value="alumni">
                    {({ checked }) => (
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div
                          className={`w-5 h-5 border rounded-full ${
                            checked ? "bg-blue-500" : "bg-white border-gray-400"
                          } transition-colors`}
                        ></div>
                        <div
                          className={`text-sm ${
                            checked ? "text-blue-500" : "text-gray-800"
                          }`}
                        >
                          Alumni
                        </div>
                      </label>
                    )}
                  </RadioGroup.Option>
                </div>
              </div>
            </RadioGroup>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={e => setValues({ ...values, password: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Confirm Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <a href="/" className="text-xs text-purple-600 hover:underline">
              Forget Password?
            </a>
            <div className="flex items-center mt-4">
              <button
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                type="submit"
              >
                Register
              </button>
            </div>
            <div className="md:w-2/5 m-5 bg-white p-8">
        {/* Image upload UI */}
        <div className="mb-4 text-gray-700 text-lg">
          Upload Profile Picture
        </div>
        <div className="mb-8">
          <input
            type="file"
            accept="image/*"
            id="profileImage"
            name="profileImage"
            className="s"
            onChange={handleImageChange}
          />
          <label
            htmlFor="profileImage"
            className="w-32 h-32 rounded-full overflow-hidden cursor-pointer"
          >
            <img
              src={selectedImage || "default-profile-image.jpg"}
              alt="Profile Image"
              className="w-1/2 h-1/2 object-cover"
            />
          </label>
        </div>
        <div className="text-gray-700 text-sm">
          Click on the profile picture to upload your image.
        </div>
      </div>
          </form>
          <div className="mt-4 text-grey-600">
            Already have an account?{" "}
            <span>
              <Link to="/Log-in" className="text-purple-600 hover:underline">
                Log in
              </Link>
            </span>
          </div>
          <div className="flex items-center w-full my-4">
            <hr className="w-full" />
            <p className="px-3 ">OR</p>
            <hr className="w-full" />
          </div>
          <div className="my-6 space-y-2">
            <button
              aria-label="Login with Google"
              type="button"
              className="flex items-center justify-center w-full p-2 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 dark:border-gray-400 focus:ring-violet-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-5 h-5 fill-current"
              >
                <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
              </svg>
              <p>Login with Google</p>
            </button>
            <button
              aria-label="Login with GitHub"
              className="flex items-center justify-center w-full p-4 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 dark:border-gray-400 focus:ring-violet-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-5 h-5 fill-current"
              >
                <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
              </svg>
              <p>Login with GitHub</p>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
