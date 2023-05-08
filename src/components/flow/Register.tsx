import React, { useContext } from "react";
import { ToggleSwitch } from "../additional/ToggleSwitch";
import logo from "../../assets/TFO_4.png";
import {
	SigningContainer,
	SigningLi,
	SigningLogo,
	SigningUl,
} from "../../styles/SigningStyles";
import { PositiveButton } from "../../styles/PositiveButton";
import { BaseButtonLink } from "../../styles/MainTheme";
import { ThemeContext } from "../../custom/ThemeContext";
import dm_logo from "../../assets/TFO_4_dark_mode.png";

export function Register() {
	//might be good to create pop up about the successful creation of the account
	const { theme } = useContext(ThemeContext);
	return (
		<SigningContainer>
			<SigningLogo
				src={theme === "light" ? logo : dm_logo}
				alt="Traffic Flow Optimizer Logo"
			/>
			<h3>Sign up to be able to use our app!</h3>
			<form>
				<SigningUl>
					<SigningLi>
						<label>email:</label>
						<input type="email" placeholder="email" />
					</SigningLi>
					<SigningLi>
						<label>username:</label>
						<input type="text" placeholder="username" />
					</SigningLi>
					<SigningLi>
						<label>password:</label>
						<input type="password" />
					</SigningLi>
					<li>
						<label>repeat password:</label>
						<input type="password" />
					</li>
				</SigningUl>
			</form>
			<PositiveButton>
				<BaseButtonLink to="/crossing-choice" state={{ ifNewUser: true }}>
					Sign Up!
				</BaseButtonLink>
			</PositiveButton>
			<ToggleSwitch />
		</SigningContainer>
	);
}
