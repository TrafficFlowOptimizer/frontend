import React, { useEffect } from "react";
import { useThemeContext } from "../../custom/ThemeContext";
import { useUserContext } from "../../custom/UserContext";
import { LogOut } from "./LogOut";
import { ToggleThemeSwitch } from "./ToggleThemeSwitch";
import logo from "../../assets/tfo_logos/TFO_4_but_better.png";
import dm_logo from "../../assets/tfo_logos/TFO_4_dark_mode_but_better.png";
import { NavbarContainer, NavbarLogo, InsideDiv } from "../../styles/NavbarStyles";

export function Navbar() {
	const { theme } = useThemeContext();
	const { loggedUser, setLoggedUser } = useUserContext();

	useEffect(() => {
		if (loggedUser === null) {
			const userSessionStorageData = sessionStorage.getItem("loggedUser");

			if (userSessionStorageData !== null) {
				setLoggedUser(JSON.parse(userSessionStorageData));
			}
		}
	}, []);

	return (
		<NavbarContainer>
			<InsideDiv>
				<NavbarLogo
					src={theme === "light" ? logo : dm_logo}
					alt="Traffic Flow Optimizer Logo"
				/>
				<h2>{loggedUser !== null ? loggedUser.username : "ADMIN"}</h2>
			</InsideDiv>
			<InsideDiv>
				<ToggleThemeSwitch />
				<LogOut />
			</InsideDiv>
		</NavbarContainer>
	);
}
