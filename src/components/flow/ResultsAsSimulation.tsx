import React from "react";
import { LogOut } from "../additional/LogOut";
import { Link } from "react-router-dom";

export function ResultsAsSimulation() {
	return (
		<div>
			<h3>Results as simulation</h3>
			<button>
				<Link to="../crossing-choice" relative="path">
					Go back to crossing choice panel
				</Link>
			</button>
			<LogOut />
		</div>
	);
}
