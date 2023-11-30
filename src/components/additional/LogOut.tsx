import React from "react";
import { NegativeButton } from "../../styles/NegativeButton";
import { useNavigate } from "react-router-dom";

export function LogOut() {
	const navigate = useNavigate();

	const onLogOut = () => {
		sessionStorage.removeItem("loggedUser");
		navigate("/");
	};
	return <NegativeButton onClick={onLogOut}>Log out</NegativeButton>;
}
