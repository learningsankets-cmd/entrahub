import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const ResourceTable = ({ requests }) => {
  return (
    <>
      <Typography
        variant="h4"
        className="text-center font-bold text-gray-800 mb-8"
      >
        My Requests
      </Typography>

      <TableContainer component={Paper} className="rounded-lg shadow-sm">
        <Table aria-label="resource table">
          <TableHead>
            <TableRow className="bg-gray-100">
              {["Request ID", "Resource Name", "Status", "Date Requested"].map(
                (head, i) => (
                  <TableCell
                    key={i}
                    className="text-gray-700 font-semibold text-sm sm:text-base py-3"
                  >
                    {head}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <TableCell className="text-sm sm:text-base py-2 text-gray-800">
                  {row.id}
                </TableCell>
                <TableCell className="text-sm sm:text-base py-2 text-gray-800">
                  {row.resourceName}
                </TableCell>
                <TableCell className="text-sm sm:text-base py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : row.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm sm:text-base py-2 text-gray-800">
                  {row.dateRequested}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ResourceTable;
