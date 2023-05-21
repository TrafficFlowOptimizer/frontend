import React from "react";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { Navbar } from "../additional/Navbar";

export function ResultsAsNumeric() {
	return (
		<>
			<Navbar />
			<div>
				<h3>Results as numeric</h3>
				<NeutralNegativeButton>
					<BaseButtonLink to="../crossing-choice" relative="path">
						Go back to crossing choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
