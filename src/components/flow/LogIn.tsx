import React, { useContext } from "react";
import { PositiveButton } from "../../styles/PositiveButton";
import { BaseForm } from "../../styles/MainTheme";
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
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../custom/UserContext";

export function LogIn() {
	const { theme } = useContext(ThemeContext);
	const { setLoggedUser } = useUserContext();
	const navigate = useNavigate();

	const logIn = (event: React.SyntheticEvent) => {
		console.log("Logging in!");
		event.preventDefault();

		const target = event.target as typeof event.target & {
			usernameOrEmail: { value: string };
			password: { value: string };
		};
		const email = target.usernameOrEmail.value; // typechecks!
		const password = target.password.value; // typechecks!

		//TODO: typechecks (but with onChange functions (?) and REST API inserted here

		console.log("email ->", email, "password->", password);
		console.log(email === "xd", password === "pipka");

		if (email === "xd" && password === "pipka") {
			navigate("/crossing-choice");
			setLoggedUser({ id: "1aaa", username: email, email: email }); //temp
		} else {
			alert("No such user!");
		}
	};
	return (
		<SigningContainer>
			<SigningLogo
				src={theme === "light" ? logo : dm_logo}
				alt="Traffic Flow Optimizer Logo"
			/>
			<h3>Log in to process further</h3>
			<BaseForm onSubmit={logIn}>
				<SigningUl>
					<SigningLi>
						<label>email / username:</label>
						<input
							name="usernameOrEmail"
							type="text"
							placeholder="username"
						/>
					</SigningLi>
					<SigningLi>
						<label>password:</label>
						<input name="password" type="password" />
					</SigningLi>
				</SigningUl>
				<PositiveButton type="submit">
					{/*<BaseButtonLink*/}
					{/*	to="/crossing-choice"*/}
					{/*	state={{ ifNewUser: false }}*/}
					{/*>*/}
					Log In!
					{/*</BaseButtonLink>*/}
				</PositiveButton>
			</BaseForm>
			<ToggleSwitch />
		</SigningContainer>
	);
}
