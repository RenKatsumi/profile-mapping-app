import React from "react";
import { TextField } from "@mui/material";

const AdminSearch = ({ onSearch }) => {
  return (
    <TextField
      label="Search profiles"
      variant="outlined"
      fullWidth
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default AdminSearch;
