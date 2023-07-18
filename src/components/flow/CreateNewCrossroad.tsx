import React from "react";
import { Navbar } from "../additional/Navbar";
import { Outlet } from "react-router-dom";

export function CreateNewCrossroad() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}
