import React, { useContext, useState } from "react";
import axios from "axios";
import { ThemeContext } from "../../custom/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../custom/UserContext";
import { ToggleThemeSwitch } from "../additional/ToggleThemeSwitch";
import logo from "../../assets/TFO_4_but_better.png";
import dm_logo from "../../assets/TFO_4_dark_mode_but_better.png";
import { SigningContainer, SigningLogo } from "../../styles/SigningStyles";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	BaseForm,
	BaseInput,
	BaseLi,
	BaseUl,
	ButtonColors,
	InputInformationMessage,
	PlaceholderSpan,
	RedirectionLink,
} from "../../styles/MainStyles";

export type loginData = {
	nickname: string;
	password: string;
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
		const specialCharactersReg = /[-’/`~!#*$_%+=.,^&(){}[\]|;:”<>?\\]/g;
		const maximalUsernameLength = 64;

		const text = e.currentTarget.value;

		if (!specialCharactersReg.test(text)) {
			if (text.length <= maximalUsernameLength && text.length > 0) {
				setIsUsernameValid(true);
				setUsernameMessage("");
			} else if (text.length === 0) {
				setIsUsernameValid(false);
				setUsernameMessage("This field cannot be empty");
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
		const minimalPasswordLength = 8;
		const maximalPasswordLength = 64;

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
			nickname: { value: string };
			password: { value: string };
		};
		const loginData: loginData = {
			nickname: target.nickname.value,
			password: target.password.value,
		};

		axios
			.post<boolean>("/auth/login", loginData) // the type should be LoggedUser
			.then((response) => {
				//temp comment cause backend is not yet ready
				// const receivedData: LoggedUser = response.data;
				// setBadLoginMessage("");
				// setLoggedUser({
				// 	id: receivedData.id,
				// 	username: receivedData.username,
				// 	email: receivedData.email,
				// });

				setBadLoginMessage("");
				setLoggedUser({
					id: "1aaa",
					username: loginData.nickname,
					email: "jan.kowal@gmail.com",
				});
				navigate("/crossroad-list");
			})
			.catch((error) => {
				setBadLoginMessage("Invalid email/username or password!");
				console.error(error);
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
							name="nickname"
							type="text"
							placeholder="username"
							onChange={onUsernameChange}
						/>
					</BaseLi>
					{!isUsernameValid ? (
						<BaseLi>
							<InputInformationMessage color={ButtonColors.RED}>
								{usernameMessage}
							</InputInformationMessage>
						</BaseLi>
					) : (
						<BaseLi>
							<PlaceholderSpan></PlaceholderSpan>
						</BaseLi>
					)}
					<BaseLi>
						<label htmlFor="password">password:</label>
						<BaseInput
							id="password"
							name="password"
							type="password"
							onChange={onPasswordChange}
						/>
					</BaseLi>
					{!isPasswordLongEnough ? (
						<BaseLi>
							<InputInformationMessage color={ButtonColors.RED}>
								{passwordMessage}
							</InputInformationMessage>
						</BaseLi>
					) : (
						<BaseLi>
							<PlaceholderSpan></PlaceholderSpan>
						</BaseLi>
					)}
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
				{badLoginMessage.length > 0 ? (
					<InputInformationMessage color={ButtonColors.RED}>
						{badLoginMessage}
					</InputInformationMessage>
				) : (
					<PlaceholderSpan></PlaceholderSpan>
				)}
			</BaseForm>
			<ToggleThemeSwitch />
		</SigningContainer>
	);
}
