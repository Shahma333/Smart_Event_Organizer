import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/authSlice";
import { FaUser, FaBell } from "react-icons/fa"; // ✅ Import bell icon
import { GiHamburgerMenu } from "react-icons/gi";
import { Nav, NavDropdown, Badge } from "react-bootstrap";
import { Link as ScrollLink } from "react-scroll";
import { api } from "../axios";
import "../styles/navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
    const [show, setShow] = useState(false);
    const [messages, setMessages] = useState([]); // ✅ State for admin messages
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const token = localStorage.getItem("access_token");
    const navigate = useNavigate();
    const role = user?.role;
    const location = useLocation();
    const isHome = location.pathname === "/";

    useEffect(() => {
        if (role === "admin") {
            fetchMessages();
        }
    }, [role]);

    const fetchMessages = async () => {
        try {
            const response = await api.get("/messages/get", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getDashboardPath = () => {
        if (role === "admin") return "/admin-dashboard";
        if (role === "coordinator") return "/coordinator-dashboard";
        return "/user-dashboard";
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="Logo" className="navbar-logo" />
                <h1 className="navbar-title">Smart Event Organizer</h1>
            </div>

            <div className="hamburger" onClick={() => setShow(!show)}>
                <GiHamburgerMenu size={24} />
            </div>

           
            <ul className={show ? "nav-links showmenu" : "nav-links"}>
                <li><Link to="/">HOME</Link></li>
                <li>
                    {isHome ? (
                        <ScrollLink to="services" spy={true} smooth={true} duration={500} onClick={() => setShow(false)}>SERVICES</ScrollLink>
                    ) : (
                        <Link to="/services">SERVICES</Link>
                    )}
                </li>
                <li>
                    {isHome ? (
                        <ScrollLink to="about" spy={true} smooth={true} duration={500} onClick={() => setShow(false)}>ABOUT</ScrollLink>
                    ) : (
                        <Link to="/about">ABOUT</Link>
                    )}
                </li>
                <li>
                    {isHome ? (
                        <ScrollLink to="contact" spy={true} smooth={true} duration={500} onClick={() => setShow(false)}>CONTACT</ScrollLink>
                    ) : (
                        <Link to="/contact">CONTACT</Link>
                    )}
                </li>
                {user && token && (
                    <li><Link to={getDashboardPath()}>DASHBOARD</Link></li>
                )}
            </ul>

         
            <Nav className="navbar-right">
              
                {role === "admin" && (
                    <div className="notification-container" onClick={() => navigate("/messages")}>
                        <FaBell className="notification-icon" />
                        {messages.length > 0 && <Badge bg="danger" className="notification-badge">{messages.length}</Badge>}
                    </div>
                )}

             
                <NavDropdown title={<FaUser className="user-icon" />} id="user-dropdown" align="end">
                    {user && token ? (
                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                    ) : (
                        <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                    )}
                </NavDropdown>
            </Nav>
        </nav>
    );
}

export default Navbar;
