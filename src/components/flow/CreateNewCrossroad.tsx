import React from "react";
import { Navbar } from "../additional/Navbar";
import { Outlet } from "react-router-dom";
import { ContainerDiv } from "../../styles/MainStyles";

export function CreateNewCrossroad() {
	return (
		<ContainerDiv>
			<Navbar />
			<Outlet />
		</ContainerDiv>
	);
}
