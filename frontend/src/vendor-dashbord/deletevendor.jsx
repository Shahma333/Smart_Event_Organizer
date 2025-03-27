import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../axios";
import toast from "react-hot-toast";

const DeleteVendor = () => {
    const { vendorId } = useParams(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (vendorId) {
            const handleDelete = async () => {
                try {
                    console.log("Vendor ID before deleting:", vendorId);
                    await api.delete(`/vendors/${vendorId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                    });
                    
                    toast.success("Vendor deleted successfully");
                    navigate("/vendors/get");  
                } catch (error) {
                    console.error("Error deleting vendor:", error);
                    toast.error("Failed to delete vendor");
                    navigate("/vendors/get");  
                }
            };
    
            handleDelete();
        }
    }, [vendorId, navigate]); 

    return (
        <div style={styles.container}>
            <h2>Deleting Vendor...</h2>
        </div>
    );
};


const styles = {
    container: {
        textAlign: "center",
        marginTop: "150px",
    },
};

export default DeleteVendor;
