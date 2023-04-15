import React from "react";
import { LogOut } from "../additional/LogOut";
import { Link } from "react-router-dom";

export function VideosList() {
	return (
		<div>
			<h3>Current Videos List</h3>
			<button>
				<Link to="../add-videos" relative="path">
					Add new videos!
				</Link>
			</button>
			<button>
				<Link to="../results-choice" relative="path">
					Go to results choice panel
				</Link>
			</button>
			<button>
				<Link to="../crossing-choice/list" relative="path">
					Go back to crossings list
				</Link>
			</button>
			<LogOut />
		</div>
	);
}
