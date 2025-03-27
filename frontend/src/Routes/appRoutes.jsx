import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../Redux/authSlice";


import Navbar from "../pages/Navbar";
import HeroSection from "../pages/Hero";
import Services from "../pages/Services";
import About from "../pages/About";
import Contact from "../pages/Contact";

import ProtectedRoute from "./protectedRoute";
import EventOptions from "../event_dashbord/EventOptions";
import ViewEvents from "../event_dashbord/viewEvent";

import DeleteEvent from "../event_dashbord/deleteEvent";
import UpdateEvent from "../event_dashbord/updateEvent";

import TasksDashboard from "../tasks_dashboard/tasks_dashboard";
import VendorsDashboard from "../vendor-dashbord/vendor-dashboard";

import CreateTask from "../tasks_dashboard/createTask";
import UpdateTaskStatus from "../tasks_dashboard/updateTask";
import ViewTasks from "../tasks_dashboard/viewTasks";

import AddVendor from "../vendor-dashbord/addVendor";
import ViewVendors from "../vendor-dashbord/viewVendors";

import DeleteVendor from "../vendor-dashbord/deletevendor";
import UpdateVendor from "../vendor-dashbord/updateVendor";

import GuestManagement from "../pages/guestManagement";
import GuestList from "../pages/viewGuest";
import AddGuest from "../pages/addGuest";

import CoordinatorDashboard from "../dashboard/coordinator_dashboard";
import AdminDashboard from "../dashboard/admin_dashboard";
import UserDashboard from "../dashboard/user_dshboard";
import VendorTasks from "../vendor-dashbord/assignedTasks";
import Login from "../user_dashbord/Login";
import Signup from "../user_dashbord/Signup";


import Vendors from "../vendor-dashbord/vendorList";

import UserManagement from "../user_dashbord/userList";
import CoordinatorManagement from "../user_dashbord/coordinatorList";
import CreateEvent from "../event_dashbord/createEvent";

import UploadEventImage from "../event_dashbord/uploadImage";
import CompletedEvents from "../event_dashbord/completedEvents";
import EventDetails from "../event_dashbord/eventDetails";
import UpdateTask from "../tasks_dashboard/updateTask";
import Footer from "../pages/Footer";
import HomePage from "../pages/Homepage";
import AboutUs from "../pages/About";
import UpdateProfile from "../user_dashbord/updateProfile";
import AdminMessages from "../pages/messages";



const AppRoutes = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("access_token");

        if (storedUser && storedToken) {
            dispatch(setUser({ user: storedUser, token: storedToken }));
        }
    }, [dispatch]);

    return (
        <>
           <Navbar></Navbar>
          
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/hero" element={<HeroSection />} />
            <Route path="/contact" element={<Contact/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/update/profile" element={<UpdateProfile />} />

                
                <Route path="/events" element={<EventOptions />} />
                <Route path="/events/getevents" element={<ViewEvents />} />
                <Route path="/events/create" element={<ProtectedRoute allowedRoles={["user"]}><CreateEvent /></ProtectedRoute>}  />
                <Route path="/events/delete/:eventId" element={<ProtectedRoute allowedRoles={["user","admin"]}><DeleteEvent /></ProtectedRoute>} />
                <Route path="/events/update/:eventId" element={<ProtectedRoute allowedRoles={["user",]}><UpdateEvent /> </ProtectedRoute>} />
                <Route path="/events/completed-events" element={<CompletedEvents/>} />
                <Route path="/events/upload/:eventId" element={<UploadEventImage />} />
                <Route path="/event-details/:eventId" element={<EventDetails />} /> {/* ✅ Route for event details */}

                <Route path="/events/:eventId/guests" element={<GuestManagement />} />
                <Route path="/events/:eventId/guests/view" element={<GuestList />} />
                <Route path="/events/:eventId/guests/add" element={<AddGuest />} />

                <Route path="/coordinator-dashboard" element={<ProtectedRoute allowedRoles={["coordinator", "admin"]}><CoordinatorDashboard /></ProtectedRoute>} />
               
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/messages" element={<AdminMessages />} />

                <Route path="/usersList" element={<UserManagement />} />
                <Route path="/coordinatorsList" element={<CoordinatorManagement />} />
               
                <Route path="/vendorsList" element={<Vendors />} />


                <Route path="/user-dashboard" element={<UserDashboard />} />

                <Route path="/events/:eventId/tasks" element={<ProtectedRoute allowedRoles={["user", "coordinator","admin"]}><TasksDashboard /></ProtectedRoute>} />
                <Route path="/events/:eventId/tasks/create" element={<ProtectedRoute allowedRoles={["user"]}><CreateTask /></ProtectedRoute>} />
                <Route path="/events/:eventId/tasks/view" element={<ViewTasks />} />
                <Route path="/tasks/update/:taskId" element={<UpdateTask />} />


                <Route path="/vendors" element={<ProtectedRoute allowedRoles={["coordinator"]}><VendorsDashboard /></ProtectedRoute>} />
                <Route path="/vendors/add" element={<ProtectedRoute allowedRoles={["coordinator"]}><AddVendor /></ProtectedRoute>} />
                <Route path="/vendors/get" element={<ViewVendors  />}></Route>
                <Route path="/vendors/delete/:vendorId" element={<DeleteVendor />} />
                <Route path="/vendors/update/:vendorId" element={<ProtectedRoute allowedRoles={["coordinator","admin"]}><UpdateVendor /></ProtectedRoute>} />
                <Route path="/vendors/tasks/:vendorId" element={<VendorTasks />} />

             
            </Routes>

        </>
    );
};

export default AppRoutes;
