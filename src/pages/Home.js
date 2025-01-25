
import { Box } from "@mui/material";
import HomeHeader from "../components/HomeHeader";
import HomeProfileMap from "../components/HomeProfileMap";
import FooterComponent from "../components/FooterComponent";

const Home = () => {

  return (
    <>
     <Box sx={{ p: 2 }}>
     <HomeHeader></HomeHeader>
      <HomeProfileMap/>
      <FooterComponent/>
     </Box> 
      </>
  );
};

export default Home;
