import React from "react";
import { useLocation } from "react-router-dom";
import { BaseButtonLink } from "../../styles/MainTheme";
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
					<h3>Choose your course of action:</h3>
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
