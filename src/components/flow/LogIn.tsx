import React, { useContext, useState } from "react";
import axios from "axios";
import { ThemeContext } from "../../custom/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../custom/UserContext";
import { ToggleThemeSwitch } from "../additional/ToggleThemeSwitch";
import { FormsValidityInformation } from "../additional/FormsValidityInformation";
import logo from "../../assets/tfo_logos/TFO_4_but_better.png";
import dm_logo from "../../assets/tfo_logos/TFO_4_dark_mode_but_better.png";
import { SigningContainer, SigningLogo } from "../../styles/SigningStyles";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	BaseForm,
	BaseInput,
	BaseLi,
	BaseUl,
	RedirectionLink,
} from "../../styles/MainStyles";
import {
	maximalPasswordLength,
	maximalUsernameLength,
	minimalPasswordLength,
	minimalUsernameLength,
	specialCharactersReg,
} from "../../custom/loginFormsConstants";

export type loginData = {
	username: string;
	password: string;
};

export type LoginResponse = {
	id: string;
	token: string;
};

export function LogIn() {
	const { theme } = useContext(ThemeContext);
	const { setLoggedUser } = useUserContext();
	const navigate = useNavigate();
	const [isUsernameValid, setIsUsernameValid] = useState(false);
	const [usernameMessage, setUsernameMessage] = useState(
		"This field cannot be empty",
	);
	const [isPasswordLongEnough, setIsPasswordLongEnough] = useState(false);
	const [passwordMessage, setPasswordMessage] = useState(
		"This field cannot be empty",
	);
	const [badLoginMessage, setBadLoginMessage] = useState("");

	const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
		const text = e.currentTarget.value;

		if (!specialCharactersReg.test(text)) {
			if (
				text.length <= maximalUsernameLength &&
				text.length >= minimalUsernameLength
			) {
				setIsUsernameValid(true);
				setUsernameMessage("");
			} else if (text.length === 0) {
				setIsUsernameValid(false);
				setUsernameMessage("This field cannot be empty");
			} else if (text.length < minimalUsernameLength) {
				setIsUsernameValid(false);
				setUsernameMessage("This input is too short");
			} else {
				setIsUsernameValid(false);
				setUsernameMessage("The input is too long");
			}
		} else {
			setIsUsernameValid(false);
			setUsernameMessage("Input contains illegal characters");
		}
	};

	const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
		const text = e.currentTarget.value;

		if (text.length < minimalPasswordLength) {
			setIsPasswordLongEnough(false);
			setPasswordMessage("The password is at least 8 characters long!");
		} else if (text.length > maximalPasswordLength) {
			setIsPasswordLongEnough(false);
			setPasswordMessage("The password is at most 64 characters long!");
		} else {
			setIsPasswordLongEnough(true);
			setPasswordMessage("");
		}
	};

	const logIn = (event: React.SyntheticEvent) => {
		event.preventDefault();

		const target = event.target as typeof event.target & {
			username: { value: string };
			password: { value: string };
		};
		const loginData: loginData = {
			username: target.username.value,
			password: target.password.value,
		};

		axios
			.post<LoginResponse>("/auth/login", loginData) // the type should be LoggedUser
			.then((response) => {
				const responseData: LoginResponse = response.data;

				setBadLoginMessage("");
				setLoggedUser({
					id: responseData.id,
					username: loginData.username,
					email: "",
					jwtToken: responseData.token,
				});
				sessionStorage.setItem(
					"loggedUser",
					JSON.stringify({
						id: responseData.id,
						username: loginData.username,
						email: "",
						jwtToken: responseData.token,
					}),
				);
				navigate("/crossroad-list");
			})
			.catch((error) => {
				if (error.response.status === 404) {
					setBadLoginMessage("User doesn't exist! Sign up!");
				} else {
					setBadLoginMessage("Invalid email/username or password!");
				}
			});
	};
	return (
		<SigningContainer>
			<SigningLogo
				src={theme === "light" ? logo : dm_logo}
				alt="Traffic Flow Optimizer Logo"
			/>
			<h3>Log in to process further</h3>
			<BaseForm onSubmit={logIn}>
				<BaseUl>
					<BaseLi>
						<label htmlFor="username">username:</label>
						<BaseInput
							id="username"
							name="username"
							type="text"
							placeholder="username"
							onChange={onUsernameChange}
						/>
					</BaseLi>
					<FormsValidityInformation
						isInputValid={isUsernameValid}
						badInputMessage={usernameMessage}
					/>
					<BaseLi>
						<label htmlFor="password">password:</label>
						<BaseInput
							id="password"
							name="password"
							type="password"
							onChange={onPasswordChange}
						/>
					</BaseLi>
					<FormsValidityInformation
						isInputValid={isPasswordLongEnough}
						badInputMessage={passwordMessage}
					/>
					<BaseLi>
						<RedirectionLink to="/register" relative="path">
							Don`t have an account? Register now.
						</RedirectionLink>
					</BaseLi>
				</BaseUl>
				<PositiveButton
					type="submit"
					disabled={!isUsernameValid || !isPasswordLongEnough}
				>
					Log In!
				</PositiveButton>
				<FormsValidityInformation
					isInputValid={badLoginMessage.length === 0}
					badInputMessage={badLoginMessage}
				/>
			</BaseForm>
			<ToggleThemeSwitch />
		</SigningContainer>
	);
}
