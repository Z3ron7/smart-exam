import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [values, setValues] = useState({
    name: "",
    username: "",
    status: "",
    image: null,
  });
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/users/${user_id}`
        );
        setUserData(response.data);
        // Set the initial input field values based on userData
        setValues({
          name: response.data.name || "",
          username: response.data.username || "",
          status: response.data.status || "",
          image: null, // Reset the image field to null
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, [user_id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setValues({ ...values, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("status", values.status);
      if (values.image) {
        formData.append("image", values.image);
      }

      await axios.put(
        `http://localhost:3001/users/users/${user_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Fetch updated user data
      const response = await axios.get(
        `http://localhost:3001/users/users/${user_id}`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="flex flex-col w-full gap-44">
        <div className="flex items-center justify-center ">
            <div className=" w-1/2 text-lg dark:bg-slate-900 dark:shadow-slate-400 dark:border-0 shadow-black shadow-lg border ">
            <div className="">
            <div className="flex justify-center py-2">
            {userData && userData.image && (
              <img
                className="w-[150px] h-[150px] rounded-[20px]"
                src={selectedImage || userData.image}
                alt=""
              />
            )}
            </div>
            <div className="flex justify-center dark:text-white ml-10 mb-0 text-xs">
                <input
                  type="file"
                  accept="image/*"
                  id="profileImage"
                  name="profileImage"
                  onChange={handleImageChange}
                />
                </div>
            </div>
              <div className=" m-3">
                <label htmlFor="name" className="itemTitle dark:text-white font-medium">
                  Name:
                </label>
                <input
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                />
              </div>
              <div className="m-3">
                <label htmlFor="username" className="itemTitle dark:text-white font-medium">
                  Email:
                </label>
                <input
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  id="username"
                  name="username"
                  value={values.username}
                  onChange={(e) =>
                    setValues({ ...values, username: e.target.value })
                  }
                />
              </div>
              <div className="m-3">
                <label htmlFor="status" className="itemTitle dark:text-white font-medium">
                  Status:
                </label>
                <input
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  id="status"
                  name="status"
                  value={values.status}
                  onChange={(e) =>
                    setValues({ ...values, status: e.target.value })
                  }
                />
              </div>
              
              <div className="flex justify-center mb-3">
              <button
                onClick={handleUpdate}
                className="flex justify-center w-1/2 px-4 py-2 tracking-wide text-sm text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
              >
                Update Profile
              </button>
              </div>
            </div>
          </div>
        </div>
  );
};

export default Profile;
