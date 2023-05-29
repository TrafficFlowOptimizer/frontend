import React, { useContext, useState } from "react";
import { PositiveButton } from "../../styles/PositiveButton";
import { BaseForm, BaseInput } from "../../styles/MainTheme";
import { ToggleSwitch } from "../additional/ToggleSwitch";
import axios from "axios";
import logo from "../../assets/TFO_4.png";
import {
	SigningContainer,
	SigningLi,
	SigningLogo,
	SigningUl,
	InvalidInputMessage,
} from "../../styles/SigningStyles";
import { ThemeContext } from "../../custom/ThemeContext";
import dm_logo from "../../assets/TFO_4_dark_mode.png";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../custom/UserContext";

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

	const onEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
		const specialCharactersReg = /[-’/`~!#*$_%+=.,^&(){}[\]|;:”<>?\\]/g;
		const maximalUsernameLength = 64;

		const text = e.currentTarget.value;

		if (!specialCharactersReg.test(text)) {
			if (text.length <= maximalUsernameLength) {
				setIsUsernameValid(true);
				setUsernameMessage("");
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
		if (text.length <= 8) {
			setIsPasswordLongEnough(false);
			setPasswordMessage("The password is at least 8 characters long!");
		} else {
			setIsPasswordLongEnough(true);
			setPasswordMessage("");
		}
	};

	const logIn = (event: React.SyntheticEvent) => {
		console.log("Logging in!");
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
				navigate("/crossing-choice");
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
				<SigningUl>
					<SigningLi>
						<label>username:</label>
						<BaseInput
							name="nickname"
							type="text"
							placeholder="username"
							onChange={onEmailChange}
						/>
					</SigningLi>
					{!isUsernameValid && (
						<SigningLi>
							<InvalidInputMessage>{usernameMessage}</InvalidInputMessage>
						</SigningLi>
					)}
					<SigningLi>
						<label>password:</label>
						<BaseInput
							name="password"
							type="password"
							onChange={onPasswordChange}
						/>
					</SigningLi>
					{!isPasswordLongEnough && (
						<SigningLi>
							<InvalidInputMessage>{passwordMessage}</InvalidInputMessage>
						</SigningLi>
					)}
				</SigningUl>
				<PositiveButton
					type="submit"
					disabled={!isUsernameValid && !isPasswordLongEnough}
				>
					{/*<BaseButtonLink*/}
					{/*	to="/crossing-choice"*/}
					{/*	state={{ ifNewUser: false }}*/}
					{/*>*/}
					Log In!
					{/*</BaseButtonLink>*/}
				</PositiveButton>
				{badLoginMessage.length > 0 && (
					<InvalidInputMessage>{badLoginMessage}</InvalidInputMessage>
				)}
			</BaseForm>
			<ToggleSwitch />
		</SigningContainer>
	);
}
