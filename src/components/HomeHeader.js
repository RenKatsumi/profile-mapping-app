import React from "react";
import { Box, Typography } from "@mui/material";

const HomeHeader = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        background: "linear-gradient(135deg,rgb(94, 177, 250), #00f2fe)",
        color: "white",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          letterSpacing: "0.5px",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
        }}
      >
        Explore Profiles Across the Map!
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          fontStyle: "italic",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
        }}
      >
        Discover locations and details of profiles at a glance.
      </Typography>
    </Box>
  );
};

export default HomeHeader;
