import React, { useContext } from "react";
import { LogOut } from "./LogOut";
import { ToggleSwitch } from "./ToggleSwitch";
import styled from "styled-components";
import logo from "../../assets/TFO_4.png";
import dm_logo from "../../assets/TFO_4_dark_mode.png";
import { useThemeContext } from "../../custom/ThemeContext";
import { useUserContext } from "../../custom/UserContext";

export function Navbar() {
	const { theme } = useThemeContext();
	const { loggedUser } = useUserContext();
	return (
		<NavbarContainer>
			<NavbarLogo
				src={theme === "light" ? logo : dm_logo}
				alt="Traffic Flow Optimizer Logo"
			/>
			<h2>{loggedUser !== null ? loggedUser.username : "ERROR"}</h2>
			<ToggleSwitch />
			<LogOut />
		</NavbarContainer>
	);
}

const NavbarContainer = styled.div`
	background-color: ${(props) => props.theme.secondary};
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	align-items: center;
	gap: 1vw;
	padding: 1vh 2vw;
	margin: 1vh 2vw;
	border-radius: 25px;
`;

const NavbarLogo = styled.img`
	width: 8vw;
	height: 10.6h;
`;
