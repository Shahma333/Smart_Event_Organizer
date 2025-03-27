import React from 'react';
import { useFormik } from "formik";
import * as Yup from "yup"; 
import { api } from '../axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setUser } from '../Redux/authSlice';
import "../styles/signup.css";  

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

  
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        confirm_password: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required"),
        role: Yup.string().required("Role is required") 
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirm_password: "",
            role: "user", 
        },
        validationSchema,  
        onSubmit: async (values) => {
            try {
                const { confirm_password, ...userData } = values; 
                const { data } = await api.post("/users/register", userData);

                
                localStorage.setItem("access_token", data.token);
                dispatch(setUser({ user: data.user, token: data.token }));

                toast.success("Account Created Successfully");

                if (data.user.role === "admin") {
                    navigate("/admin-dashboard");
                } else if (data.user.role === "coordinator") {
                    navigate("/coordinator-dashboard");
                } else {
                    navigate("/events");
                }
               
            } catch (err) {
                console.error("Signup Error:", err);
                toast.error(err.response?.data?.message || "Registration failed");
            }
        }
    });

    return (
        <div className='signup-container'>
            <form onSubmit={formik.handleSubmit} className='signup-form'>
                <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} className='signup-input' type="text" name='name' placeholder='Enter name' />
                {formik.touched.name && formik.errors.name && <p className="error-message">{formik.errors.name}</p>}

                <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} className='signup-input' type="text" name='username' placeholder='Enter username' />
                {formik.touched.username && formik.errors.username && <p className="error-message">{formik.errors.username}</p>}

                <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className='signup-input' type="email" name='email' placeholder='Enter email' />
                {formik.touched.email && formik.errors.email && <p className="error-message">{formik.errors.email}</p>}

                <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className='signup-input' type="password" name='password' placeholder='Enter password' />
                {formik.touched.password && formik.errors.password && <p className="error-message">{formik.errors.password}</p>}

                <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirm_password} className='signup-input' type="password" name='confirm_password' placeholder='Re-Enter password' />
                {formik.touched.confirm_password && formik.errors.confirm_password && <p className="error-message">{formik.errors.confirm_password}</p>}

             
                <select onChange={formik.handleChange} value={formik.values.role} className='signup-input' name='role'>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="coordinator">Coordinator</option>
                </select>
                {formik.touched.role && formik.errors.role && <p className="error-message">{formik.errors.role}</p>}

                <button className='signup-button' type='submit'>Create Account</button>
            </form>
        </div>
    );
};

export default Signup;
