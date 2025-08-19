import React from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const DataTable = ({ title, rows, columns, isLoading }) => {
    return (
        <div className="my-3 px-3 rounded-lg bg-gray-50">
           
            {/* Loader */}
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            ) : rows?.length > 0 ? (
                <Box className="bg-gray-50 p-3 rounded-lg" sx={{ height: 480, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        hideFooterPagination={true}
                        hideFooter={true}
                        getRowHeight={() => "auto"}
                        getEstimatedRowHeight={() => 100}
                        className="rounded-xl border-none"
                        disableRowSelectionOnClick
                    />
                </Box>
            ) : (
                <div className="flex justify-center h-[400px] py-12">No records found</div>
            )}
        </div>
    );
};

export default DataTable;
