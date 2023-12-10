import React from "react";
import { useUserContext } from "../../custom/UserContext";
import { getUserJWTToken } from "../../custom/drawing-tool/AuxiliaryFunctions";
import { Outlet, Navigate } from "react-router-dom";

export function ProtectedRoutes() {
	const { loggedUser } = useUserContext();
	const userJWT = loggedUser !== null ? loggedUser.jwtToken : getUserJWTToken();

	return userJWT !== "" ? <Outlet /> : <Navigate to="/" />;
}
