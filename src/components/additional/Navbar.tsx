import React from "react";
import { useThemeContext } from "../../custom/ThemeContext";
import { useUserContext } from "../../custom/UserContext";
import { LogOut } from "./LogOut";
import { ToggleSwitch } from "./ToggleSwitch";
import logo from "../../assets/TFO_4_but_better.png";
import dm_logo from "../../assets/TFO_4_dark_mode_but_better.png";
import { NavbarContainer, NavbarLogo } from "../../styles/NavbarStyles";

export function Navbar() {
	const { theme } = useThemeContext();
	const { loggedUser } = useUserContext();
	return (
		<NavbarContainer>
			<NavbarLogo
				src={theme === "light" ? logo : dm_logo}
				alt="Traffic Flow Optimizer Logo"
			/>
			<h2>{loggedUser !== null ? loggedUser.username : "ADMIN"}</h2>
			<ToggleSwitch />
			<LogOut />
		</NavbarContainer>
	);
}
