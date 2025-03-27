import { Container } from "react-bootstrap"; 
import AboutUs from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import HeroSection from "./Hero";
import Navbar from "./Navbar";
import Services from "./Services";

const HomePage = () => {
    return (
      <>
        <Navbar />
        <Container fluid className="p-0 mt-5"> 
          <HeroSection />
          <Services />
          <AboutUs />
          <Contact />
          <Footer />
        </Container> 
      </>
    );
};

export default HomePage;
