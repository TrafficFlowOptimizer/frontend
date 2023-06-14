import React from "react";
import { BaseButtonLink, PageHeader } from "../../styles/MainTheme";
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
				<PageHeader>Choose your course of action:</PageHeader>
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
