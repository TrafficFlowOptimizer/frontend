import React from "react";
import { BaseButtonLink, CustomH1 } from "../../styles/MainTheme";
import { PositiveButton } from "../../styles/PositiveButton";
import { Navbar } from "../additional/Navbar";
import { useUserContext } from "../../custom/UserContext";

export function CrossroadChoicePanel() {
	const { loggedUser } = useUserContext();

	return (
		<div>
			<Navbar />
			{/*{loggedUser !== null && (*/}
			<div>
				<CustomH1>Choose your course of action:</CustomH1>
				<PositiveButton>
					<BaseButtonLink to="list">
						Choose from list of previously created crossroads
					</BaseButtonLink>
				</PositiveButton>
			</div>
			{/*)}*/}
			<PositiveButton>
				<BaseButtonLink to="new">Create new crossroad</BaseButtonLink>
			</PositiveButton>
		</div>
	);
}
