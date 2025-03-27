import React from "react";
import "../styles/footer.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
       
        <div className="footer-brand">
          <h1>Smart Event Organizer</h1>
          <p>Making every event unforgettable.</p>
        </div>

       
        <div className="footer-newsletter">
          <h3>Subscribe to Our Newsletter</h3>
          <div className="newsletter-box">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
          <p>Get the latest updates on events and services.</p>
        </div>

       
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>
      </div>

 
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Smart Event Organizer. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
