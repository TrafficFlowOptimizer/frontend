import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToggleThemeSwitch } from "../additional/ToggleThemeSwitch";
import { ThemeContext } from "../../custom/ThemeContext";
import { FormsValidityInformation } from "../additional/FormsValidityInformation";
import logo from "../../assets/tfo_logos/TFO_4_but_better.png";
import dm_logo from "../../assets/tfo_logos/TFO_4_dark_mode_but_better.png";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Snackbar from "@mui/material/Snackbar";
import { SigningContainer, SigningLogo } from "../../styles/SigningStyles";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	BaseInput,
	BaseForm,
	RedirectionLink,
	BaseUl,
	BaseLi,
} from "../../styles/MainStyles";
import {
	alertShowtimeMS,
	maximalPasswordLength,
	maximalUsernameLength,
	minimalPasswordLength,
	minimalUsernameLength,
	specialCharactersReg,
} from "../../custom/loginFormsConstants";

export type RegisterData = {
	id: string;
	username: string;
	email: string;
	password: string;
};

export function Register() {
	const { theme } = useContext(ThemeContext);
	const navigate = useNavigate();

	const [isUsernameValid, setIsUsernameValid] = useState(false);
	const [usernameMessage, setUsernameMessage] = useState(
		"This field cannot be empty",
	);

	const [isPasswordLongEnough, setIsPasswordLongEnough] = useState(false);
	const [passwordMessage, setPasswordMessage] = useState(
		"This field cannot be empty",
	);

	const [isEmailLongEnough, setIsEmailLongEnough] = useState(false);
	const [emailMessage, setEmailMessage] = useState("This field cannot be empty");
	const [badRegisterMessage, setBadRegisterMessage] = useState("");

	const [showSuccessAlert, setShowSuccessAlert] = useState(false);

	const signUpMessage = "Sign up to start using the app";

	const onRegister = (event: React.SyntheticEvent) => {
		event.preventDefault();

		const target = event.target as typeof event.target & {
			username: { value: string };
			password: { value: string };
			repeatPassword: { value: string };
			email: { value: string };
		};

		const registerData: RegisterData = {
			id: "",
			username: target.username.value,
			email: target.email.value,
			password: target.password.value,
		};

		if (target.repeatPassword.value !== target.password.value) {
			setBadRegisterMessage("Passwords are not identical!");
		} else {
			axios
				.post<boolean>("/auth/register", registerData)
				.then((response) => {
					const answer: boolean = response.data;

					if (answer) {
						setBadRegisterMessage("");
						setShowSuccessAlert(true);
						setTimeout(() => {
							navigate("/login");
						}, 1000);
					} else {
						setBadRegisterMessage("Invalid register data!");
					}
				})
				.catch((error) => {
					if (error.response.status === 409) {
						setBadRegisterMessage("Email or username already in use!");
					} else {
						setBadRegisterMessage(
							`Request failed with code ${error.response.status}`,
						);
					}
				});
		}
	};

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
			setPasswordMessage("The password must be least 8 characters long!");
		} else if (text.length > maximalPasswordLength) {
			setIsPasswordLongEnough(false);
			setPasswordMessage("The password must be most 64 characters long!");
		} else {
			setIsPasswordLongEnough(true);
			setPasswordMessage("");
		}
	};

	const onEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
		const text = e.currentTarget.value;

		if (text.length < minimalPasswordLength) {
			setIsEmailLongEnough(false);
			setEmailMessage("The email must be least 8 characters long!");
		} else {
			setIsEmailLongEnough(true);
			setEmailMessage("");
		}
	};

	return (
		<SigningContainer>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showSuccessAlert}
				autoHideDuration={alertShowtimeMS}
			>
				<Alert
					variant="filled"
					icon={<CheckIcon fontSize="inherit" />}
					severity="success"
				>
					<strong>Registered Successfully!</strong>
				</Alert>
			</Snackbar>
			<SigningLogo
				src={theme === "light" ? logo : dm_logo}
				alt="Traffic Flow Optimizer Logo"
			/>
			<h3>{signUpMessage}</h3>
			<BaseForm onSubmit={onRegister}>
				<BaseUl>
					<BaseLi>
						<label htmlFor="email">email:</label>
						<BaseInput
							id="email"
							name="email"
							type="email"
							placeholder="email"
							onChange={onEmailChange}
						/>
					</BaseLi>
					<FormsValidityInformation
						isInputValid={isEmailLongEnough}
						badInputMessage={emailMessage}
					/>
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
						<label htmlFor="repeatPassword">repeat password:</label>
						<BaseInput
							id="repeatPassword"
							name="repeatPassword"
							type="password"
						/>
					</BaseLi>
					<BaseLi>
						<RedirectionLink to="/login" relative="path">
							Already have an account? Log in.
						</RedirectionLink>
					</BaseLi>
				</BaseUl>
				<PositiveButton
					type="submit"
					disabled={!(isUsernameValid && isPasswordLongEnough)}
				>
					Sign Up!
				</PositiveButton>
				<FormsValidityInformation
					isInputValid={badRegisterMessage.length === 0}
					badInputMessage={badRegisterMessage}
				/>
			</BaseForm>
			<ToggleThemeSwitch />
		</SigningContainer>
	);
}
