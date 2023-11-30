import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink } from "../../styles/MainStyles";
import { NeutralNegativeButton } from "../../styles/NeutralButton";

export function ResultsAsSimulation() {
	const location = useLocation();
	const all = location.state ?? true;

	return (
		<>
			<Navbar />
			<div>
				<h3>Results as simulation</h3>
				<BaseButtonLink to="../results-choice" relative="path" state={all}>
					<NeutralNegativeButton>
						Go back to results choice panel
					</NeutralNegativeButton>
				</BaseButtonLink>
			</div>
		</>
	);
}
