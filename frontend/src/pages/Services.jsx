import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // ✅ Import Redux hook
import "../styles/services.css";
import birthday from "../assets/birthday.jpg";
import anniversary from "../assets/anniversary.jpg";
import camping from "../assets/camping.jpg";
import gamenight from "../assets/gamenight.jpg";
import party from "../assets/party.jpg";
import wedding from "../assets/wedding.jpg";

const services = [
  { id: 1, url: birthday, title: "Birthday Planning" },
  { id: 2, url: anniversary, title: "Anniversary Planning" },
  { id: 3, url: camping, title: "Camping Trip Planning" },
  { id: 4, url: gamenight, title: "Game Night Planning" },
  { id: 5, url: party, title: "Party Planning" },
  { id: 6, url: wedding, title: "Wedding Planning" },
];

const Services = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth); // ✅ Get user authentication info

  const handleServiceClick = (service) => {
    if (!token) {
      console.log("Token:", token);

        alert("Please log in to continue."); // Optional alert
        navigate("/login");
        return;
    }
    navigate("/events/create", { state: { eventName: service.title } });
};


  return (
    
    <section className="services">
      <h2>OUR MAIN SERVICES</h2>
      <div className="services-container">
        {services.map((item) => (
          <div
            className="service-card"
            key={item.id}
            onClick={() => handleServiceClick(item)}
            style={{ cursor: "pointer" }}
          >
            <h3>{item.title}</h3>
            <img src={item.url} alt={item.title} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
