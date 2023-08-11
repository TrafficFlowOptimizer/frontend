import React, { useContext } from "react";
import { ToggleThemeSwitch } from "../additional/ToggleThemeSwitch";
import { ThemeContext } from "../../custom/ThemeContext";
import logo from "../../assets/TFO_4_but_better.png";
import dm_logo from "../../assets/TFO_4_dark_mode_but_better.png";
import { SigningContainer, SigningLogo } from "../../styles/SigningStyles";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	BaseButtonLink,
	BaseInput,
	BaseForm,
	RedirectionLink,
	BaseUl,
	BaseLi,
} from "../../styles/MainTheme";

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
			<BaseForm>
				<BaseUl>
					<BaseLi>
						<label>email:</label>
						<BaseInput type="email" placeholder="email" />
					</BaseLi>
					<BaseLi>
						<label>username:</label>
						<BaseInput type="text" placeholder="username" />
					</BaseLi>
					<BaseLi>
						<label>password:</label>
						<BaseInput type="password" />
					</BaseLi>
					<BaseLi>
						<label>repeat password:</label>
						<BaseInput type="password" />
					</BaseLi>
					<BaseLi>
						<RedirectionLink to="/login" relative="path">
							Already have an account? Log in.
						</RedirectionLink>
					</BaseLi>
				</BaseUl>
			</BaseForm>
			<PositiveButton>
				<BaseButtonLink to="/crossroad-list">Sign Up!</BaseButtonLink>
			</PositiveButton>
			<ToggleThemeSwitch />
		</SigningContainer>
	);
}
