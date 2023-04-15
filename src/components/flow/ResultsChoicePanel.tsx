import React from "react";
import { LogOut } from "../additional/LogOut";
import { Link } from "react-router-dom";

export function ResultsChoicePanel() {
	return (
		<div>
			<h3>Choose your course of action:</h3>
			<form>
				{/*this shit doesn't work TODO: figure out why*/}
				<label>See current results</label>
				<input type="radio"></input>
				<label>Optimize with new data</label>
				<input type="radio"></input>
			</form>
			<button>
				<Link to="../results-numeric" relative="path">
					See results as numeric data
				</Link>
			</button>
			<button>
				<Link to="../results-simulation" relative="path">
					See results as a simulation
				</Link>
			</button>
			<button>
				<Link to="../crossing-choice" relative="path">
					Go back to crossing choice panel
				</Link>
			</button>
			<LogOut />
		</div>
	);
}
