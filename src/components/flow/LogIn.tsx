import React, { useContext } from "react";
import { PositiveButton } from "../../styles/PositiveButton";
import { BaseButtonLink } from "../../styles/MainTheme";
import { ToggleSwitch } from "../additional/ToggleSwitch";
import logo from "../../assets/TFO_4.png";
import {
	SigningContainer,
	SigningLi,
	SigningLogo,
	SigningUl,
} from "../../styles/SigningStyles";
import { ThemeContext } from "../../custom/ThemeContext";
import dm_logo from "../../assets/TFO_4_dark_mode.png";

export function LogIn() {
	const { theme } = useContext(ThemeContext);
	return (
		<SigningContainer>
			<SigningLogo
				src={theme === "light" ? logo : dm_logo}
				alt="Traffic Flow Optimizer Logo"
			/>
			<h3>Log in to process further</h3>
			<form>
				<SigningUl>
					<SigningLi>
						<label>email / username:</label>
						<input type="text" placeholder="username" />
					</SigningLi>
					<SigningLi>
						<label>password:</label>
						<input type="password" />
					</SigningLi>
				</SigningUl>
			</form>
			<PositiveButton>
				<BaseButtonLink to="/crossing-choice" state={{ ifNewUser: false }}>
					Log In!
				</BaseButtonLink>
			</PositiveButton>
			<ToggleSwitch />
		</SigningContainer>
	);
}
