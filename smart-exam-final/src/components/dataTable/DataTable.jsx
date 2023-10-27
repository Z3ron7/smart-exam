import {
    DataGrid,
    GridColDef,
    GridToolbar,
  } from "@mui/x-data-grid";
  import "./dataTable.scss";
  import { Link } from "react-router-dom";
  import axios from "axios"; // Import Axios for making HTTP requests

const DataTable = (props) => {
  
  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          <Link to={`/users/${params.row.user_id}`}>
            <img src="/view.svg" alt="" />
          </Link>
          <div className="delete" onClick={() => props.handleDelete(params.row.user_id)}>
              <img src="/delete.svg" alt="" />
          </div>
        </div>
      );
    },
  };

    return (
      <div className="dataTable w-full border-2 border-indigo-700"> 
        <DataGrid
          className="dataGrid dark:bg-slate-900 flex-row-reverse dark:text-white"
          rows={props.rows}
          columns={[...props.columns, actionColumn]}
          getRowId={(row) => row.user_id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
        />
      </div>
    );
  };
  
  export default DataTable;
  