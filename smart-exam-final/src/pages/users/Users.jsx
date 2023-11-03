import React, { useState, useEffect } from "react";
import Add from "../../components/add/Add";
import DataTable from "../../components/dataTable/DataTable";
import "./users.scss";
import axios from "axios";

const columns = [
  { field: "user_id", headerName: "ID", width: 50 },
  {
    field: "image",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      const imageUrl = params.row.image || "/noavatar.png";
      return (
        <img
          src={imageUrl}
          alt=""
          style={{ width: 40, height: 40 }}
        />
      );
    },    
  },  
  {
    field: "name",
    type: "string",
    headerName: "Full name",
    width: 150,
  },
  {
    field: "gender",
    type: "string",
    headerName: "Gender",
    width: 150,
  },
  {
    field: "username",
    type: "string",
    headerName: "Email",
    width: 250,
  },
  {
    field: "status",
    type: "string",
    headerName: "Status",
    width: 150,
  },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]); // State to store fetched data
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch data from the backend
  const fetchData = () => {
    axios.get("http://localhost:3001/users/users")
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };

  const handleDelete = (user_id) => {
    axios.delete(`http://localhost:3001/users/users/${user_id}`)
      .then((response) => {
        if (response.status === 200) {
          // User deleted successfully
          console.log("User deleted successfully");

          // Refresh the data after a successful delete
          fetchData();
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data initially
  }, []);

  return (
    <div className="users">
      <div className="flex justify-center info">
        <h1 className="dark:text-white flex justify-center font-bold text-3xl">USER'S</h1>
        <div className="flex items-end marker:justify-end">
          
        </div>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="users" columns={columns} rows={data} handleDelete={handleDelete} />
      )}

      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Users;
