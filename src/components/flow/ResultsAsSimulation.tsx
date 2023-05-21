import React from "react";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { Navbar } from "../additional/Navbar";

export function ResultsAsSimulation() {
	return (
		<>
			<Navbar />
			<div>
				<h3>Results as simulation</h3>
				<NeutralNegativeButton>
					<BaseButtonLink to="../crossing-choice" relative="path">
						Go back to crossing choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
