import React, { useContext } from "react";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { BaseButtonLink, BaseH1 } from "../../styles/MainStyles";
import logo from "../../assets/tfo_logos/TFO_4_but_better.png";
import dm_logo from "../../assets/tfo_logos/TFO_4_dark_mode_but_better.png";
import {
	WelcomePageContainer,
	WelcomePageLogo,
	WelcomePageOptions,
	OptionsPositionedLi,
} from "../../styles/WelcomePageStyles";
import { ToggleThemeSwitch } from "../additional/ToggleThemeSwitch";
import { ThemeContext } from "../../custom/ThemeContext";

export function Welcome() {
	const { theme } = useContext(ThemeContext);
	return (
		<WelcomePageContainer>
			<WelcomePageLogo
				src={theme === "light" ? logo : dm_logo}
				alt="Traffic Flow Optimizer Logo"
			/>
			<WelcomePageOptions>
				<OptionsPositionedLi row={1} column={2}>
					To start:
				</OptionsPositionedLi>
				<OptionsPositionedLi row={2} column={1}>
					<BaseButtonLink to="/login">
						<NeutralPositiveButton>Login</NeutralPositiveButton>
					</BaseButtonLink>
				</OptionsPositionedLi>
				<OptionsPositionedLi row={2} column={2}>
					or
				</OptionsPositionedLi>
				<OptionsPositionedLi row={2} column={3}>
					<BaseButtonLink to="/register">
						<NeutralPositiveButton>Register</NeutralPositiveButton>
					</BaseButtonLink>
				</OptionsPositionedLi>
				<OptionsPositionedLi row={3} column={2}>
					<ToggleThemeSwitch />
				</OptionsPositionedLi>
			</WelcomePageOptions>
		</WelcomePageContainer>
	);
}
