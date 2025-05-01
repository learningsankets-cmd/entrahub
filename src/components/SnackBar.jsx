import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";

const Snackbar = ({ message, severity }) => {
  const [open, setOpen] = useState(false);

  // Handle Snackbar open
  const handleClick = () => {
    setOpen(true);
  };

  // Handle Snackbar close
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClick}>Open Snackbar</Button>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity} // Dynamic severity based on the prop
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message} {/* Dynamic message based on the prop */}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Snackbar;
