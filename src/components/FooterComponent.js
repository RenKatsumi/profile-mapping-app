import React from "react";
import { Box, Typography, Link } from "@mui/material";

const FooterComponent = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1976d2", // Blue theme
        color: "white",
        textAlign: "center",
        py: 3,
        mt: 4,
      }}
    >
      <Typography variant="h6" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Welcome to Map-Connect ! My app connects profiles with locations, helping
        you explore and learn more about individuals around the globe. 
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        I aim to make connections more intuitive, blending profiles and maps
        seamlessly. Have feedback? Feel free to reach out!
      </Typography>
      <Link
        href="#"
        underline="hover"
        sx={{ color: "white", display: "block", mt: 1 }}
      >
        Contact Me
      </Link>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        © {new Date().getFullYear()} Map-Connect. All rights reserved.
      </Typography>
    </Box>
  );
};

export default FooterComponent;
