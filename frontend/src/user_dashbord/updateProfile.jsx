import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../Redux/authSlice";
import { api } from "../axios";

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        username: user?.username || "",
        newPassword: "",
    });

    const [message, setMessage] = useState("");

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put("/users/profile/update", formData);
            dispatch(updateUser(response.data.user));
            setMessage("✅ Profile updated successfully!");
            setTimeout(() => navigate("/user-dashboard"), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || "❌ Something went wrong.");
        }
    };

    return (
        <div className="container" style={styles.container}>
            <div className="card shadow-lg p-4">
                <h2 className="mb-4 text-center text-primary">Update Profile</h2>

                {message && <div className="alert alert-info text-center">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            className="form-control"
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                        <small className="text-muted">Leave empty if you don’t want to change the password.</small>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Update Profile</button>
                </form>
            </div>
        </div>
    );
};


const styles = {
    container: {
        maxWidth: "500px",
        margin: "100px auto",
        padding: "20px",
    },
};

export default UpdateProfile;
