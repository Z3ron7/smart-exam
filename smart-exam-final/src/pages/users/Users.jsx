import React, { useState } from "react";
import Add from "../../components/add/Add";
import { userRows } from "../../data";
import DataTable from "../../components/dataTable/DataTable";
import "./users.scss";
import VerifyUser from '../SuperAdmin/VerifyUser'
// import { useQuery } from "@tanstack/react-query";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return React.createElement("img", {
        src: params.row.img || "/noavatar.png",
        alt: "",
      });
    },
  },
  {
    field: "firstName",
    type: "string",
    headerName: "First name",
    width: 150,
  },
  {
    field: "lastName",
    type: "string",
    headerName: "Last name",
    width: 150,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },
  {
    field: "phone",
    type: "string",
    headerName: "Phone",
    width: 150,
  },
];


const Users = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);

  const openModal = (question) => {
    setIsModalOpen(true);
    setQuestionToEdit(question);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuestionToEdit(null);
  };

  // TEST THE API

  // const { isLoading, data } = useQuery({
  //   queryKey: ["allusers"],
  //   queryFn: () =>
  //     fetch("http://localhost:8800/api/users").then(
  //       (res) => res.json()
  //     ),
  // });

  return (
    <div className="users">
      <div className="info">
        <h1 className="dark:text-white">Students</h1>
        <div className="flex justify-end">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          New Question
        </button>
      </div>
        {/* <button className="dark:text-white border-2 bg-blue-600 hover:bg-fuchsia-300" onClick={() => setOpen(true)}>Add New User</button> */}
      </div>
      <VerifyUser
        isOpen={isModalOpen}
        onClose={closeModal}
        questionToEdit={questionToEdit}
      />
      <DataTable slug="users" columns={columns} rows={userRows} />
      {/* TEST THE API */}

      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="users" columns={columns} rows={data} />
      )} */}
      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Users;
