import React from "react";
import { BaseButtonLink } from "../../styles/MainTheme";
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
				<h3>Choose your course of action:</h3>
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
