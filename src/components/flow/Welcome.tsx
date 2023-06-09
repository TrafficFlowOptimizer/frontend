import React, { useContext } from "react";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { BaseButtonLink, BaseH1 } from "../../styles/MainTheme";
import logo from "../../assets/TFO_4_but_better.png";
import dm_logo from "../../assets/TFO_4_dark_mode_but_better.png";
import {
	WelcomePageContainer,
	WelcomePageLogo,
	WelcomePageOptions,
	OptionsPositionedLi,
} from "../../styles/WelcomePageStyles";
import { ToggleSwitch } from "../additional/ToggleSwitch";
import { ThemeContext } from "../../custom/ThemeContext";

export function Welcome() {
	const { theme } = useContext(ThemeContext);
	return (
		<WelcomePageContainer>
			<BaseH1>Welcome to</BaseH1>
			<WelcomePageLogo
				src={theme === "light" ? logo : dm_logo}
				alt="Traffic Flow Optimizer Logo"
			/>
			<WelcomePageOptions>
				<OptionsPositionedLi row={1} column={2}>
					To start:
				</OptionsPositionedLi>
				<OptionsPositionedLi row={2} column={1}>
					<NeutralPositiveButton>
						<BaseButtonLink to="/login">Login</BaseButtonLink>
					</NeutralPositiveButton>
				</OptionsPositionedLi>
				<OptionsPositionedLi row={2} column={2}>
					or
				</OptionsPositionedLi>
				<OptionsPositionedLi row={2} column={3}>
					<NeutralPositiveButton>
						<BaseButtonLink to="/register">Register</BaseButtonLink>
					</NeutralPositiveButton>
				</OptionsPositionedLi>
				<OptionsPositionedLi row={3} column={2}>
					<ToggleSwitch />
				</OptionsPositionedLi>
			</WelcomePageOptions>
		</WelcomePageContainer>
	);
}
