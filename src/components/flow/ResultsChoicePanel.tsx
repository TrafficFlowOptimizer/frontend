import React from "react";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { Navbar } from "../additional/Navbar";
import { useLocation } from "react-router-dom";

export function ResultsChoicePanel() {
	const location = useLocation();
	const results = location.state ?? true;
	return (
		<>
			<Navbar />
			<div>
				<h3>Choose your course of action:</h3>
				<NeutralPositiveButton>
					<BaseButtonLink
						to="../results-numeric"
						relative="path"
						state={results}
					>
						See results as numeric data
					</BaseButtonLink>
				</NeutralPositiveButton>
				<NeutralPositiveButton>
					<BaseButtonLink to="../results-simulation" relative="path">
						See results as a simulation
					</BaseButtonLink>
				</NeutralPositiveButton>
				<NeutralNegativeButton>
					<BaseButtonLink to="../crossroad-choice" relative="path">
						Go back to crossroad choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
