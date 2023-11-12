import React from "react";
import { BaseButtonLink, PageHeader } from "../../styles/MainStyles";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { Navbar } from "../additional/Navbar";
import { useLocation } from "react-router-dom";

export function ResultsChoicePanel() {
	const location = useLocation();
	const results = location.state ?? true;
	const crossroadId = location.state.crossroadId ?? true;

	return (
		<>
			<Navbar />
			<div>
				<PageHeader>Choose your course of action:</PageHeader>
				<NeutralPositiveButton>
					<BaseButtonLink
						to="../results-descriptive"
						relative="path"
						state={results}
					>
						See results as descriptive data
					</BaseButtonLink>
				</NeutralPositiveButton>
				<NeutralPositiveButton>
					<BaseButtonLink
						to="../results-simulation"
						relative="path"
						state={results}
					>
						See results as a simulation
					</BaseButtonLink>
				</NeutralPositiveButton>
				<NeutralNegativeButton>
					<BaseButtonLink
						to={`../crossroad-view/${crossroadId}`}
						relative="path"
						state={{ crossroadID: crossroadId }}
					>
						Go back to crossroad view
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
