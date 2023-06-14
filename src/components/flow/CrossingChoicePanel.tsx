import React from "react";
import { useLocation } from "react-router-dom";
import { BaseButtonLink, PageHeader } from "../../styles/MainTheme";
import { PositiveButton } from "../../styles/PositiveButton";
import { Navbar } from "../additional/Navbar";

export function CrossingChoicePanel() {
	const location = useLocation();
	const { ifNewUser } = location.state ?? true;

	return (
		<div>
			<Navbar />
			{!ifNewUser && (
				<div>
					<PageHeader>Choose your course of action:</PageHeader>
					<PositiveButton>
						<BaseButtonLink to="list">
							Choose from list of previously created crossings
						</BaseButtonLink>
					</PositiveButton>
				</div>
			)}
			<PositiveButton>
				<BaseButtonLink to="new">Create new crossing</BaseButtonLink>
			</PositiveButton>
		</div>
	);
}
