import React from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";  
import { api } from '../axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { setUser } from '../Redux/authSlice';
import "../styles/login.css";
import Navbar from '../pages/Navbar';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema,  
        onSubmit: async (values) => {
            try {
                const { data } = await api.post("/users/login", values);
                localStorage.setItem("access_token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Store user details
                dispatch(setUser({ user: data.user, token: data.token }));
                toast.success("Logged In Successfully");
                  
                if (data.user.role === "admin") {
                    navigate("/admin-dashboard");
                } else if (data.user.role === "coordinator") {
                    navigate("/coordinator-dashboard");
                } else {
                    navigate("/user-dashboard");
                }
               

            } catch (err) {
                console.error("Login Error:", err);
                toast.error(err.response?.data?.message || "Invalid email or password");
            }
        }
    });

    return (
        <div>
            <Navbar></Navbar>
            <div className="login-container">
            <form onSubmit={formik.handleSubmit} className="login-form">
                <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}  
                    value={formik.values.email}
                    className="login-input"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                />
                {formik.touched.email && formik.errors.email ? (  
                    <p className="error-message">{formik.errors.email}</p>
                ) : null}

                <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className="login-input"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                />
                {formik.touched.password && formik.errors.password ? (
                    <p className="error-message">{formik.errors.password}</p>
                ) : null}

                <button className="login-button" type="submit">Login</button>

                <button
  type="button"
  className="Signup-button"
  onClick={() => navigate("/signup")}
>
  Don't have an account? Sign Up
</button>

            </form>
        </div>
        </div>
    );
};

export default Login;
