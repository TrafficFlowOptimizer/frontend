import React from "react";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { Navbar } from "../additional/Navbar";

export function ResultsChoicePanel() {
	return (
		<>
			<Navbar />
			<div>
				<h3>Choose your course of action:</h3>
				<form>
					{/*this shit doesn't work TODO: figure out why*/}
					<label>See current results</label>
					<input type="radio"></input>
					<label>Optimize with new data</label>
					<input type="radio"></input>
				</form>
				<NeutralPositiveButton>
					<BaseButtonLink to="../results-numeric" relative="path">
						See results as numeric data
					</BaseButtonLink>
				</NeutralPositiveButton>
				<NeutralPositiveButton>
					<BaseButtonLink to="../results-simulation" relative="path">
						See results as a simulation
					</BaseButtonLink>
				</NeutralPositiveButton>
				<NeutralNegativeButton>
					<BaseButtonLink to="../crossing-choice" relative="path">
						Go back to crossing choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
