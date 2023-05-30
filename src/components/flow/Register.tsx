import React, { useContext } from "react";
import { ToggleSwitch } from "../additional/ToggleSwitch";
import logo from "../../assets/TFO_4_but_better.png";
import dm_logo from "../../assets/TFO_4_dark_mode_but_better.png";
import {
	SigningContainer,
	SigningLi,
	SigningLogo,
	SigningUl,
} from "../../styles/SigningStyles";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	BaseButtonLink,
	BaseInput,
	BaseForm,
	RedirectionLink,
} from "../../styles/MainTheme";
import { ThemeContext } from "../../custom/ThemeContext";

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
				<SigningUl>
					<SigningLi>
						<label>email:</label>
						<BaseInput type="email" placeholder="email" />
					</SigningLi>
					<SigningLi>
						<label>username:</label>
						<BaseInput type="text" placeholder="username" />
					</SigningLi>
					<SigningLi>
						<label>password:</label>
						<BaseInput type="password" />
					</SigningLi>
					<SigningLi>
						<label>repeat password:</label>
						<BaseInput type="password" />
					</SigningLi>
					<SigningLi>
						<RedirectionLink to="/login" relative="path">
							Already have an account? Log in.
						</RedirectionLink>
					</SigningLi>
				</SigningUl>
			</BaseForm>
			<PositiveButton>
				<BaseButtonLink to="/crossroad-choice" state={{ ifNewUser: true }}>
					Sign Up!
				</BaseButtonLink>
			</PositiveButton>
			<ToggleSwitch />
		</SigningContainer>
	);
}
