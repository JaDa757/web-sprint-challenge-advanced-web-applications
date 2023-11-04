// ✨ implement axiosWithAuth
import React from "react";
import { Navigate } from "react-router-dom";
/* eslint-disable react/prop-types */

const PrivateRoute =({ children }) => {
    const auth = localStorage.getItem('token');

    return (auth ? <>{children}</> : <Navigate to="/" />)
};

export default PrivateRoute;