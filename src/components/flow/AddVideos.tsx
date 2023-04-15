import React from "react";
import { LogOut } from "../additional/LogOut";
import { Link } from "react-router-dom";

export function AddVideos() {
	return (
		<div>
			<h3>
				Here will be a tool allowing user to put .mp4 or something like this
				footage of traffic
			</h3>
			<button>
				<Link to="../crossing-choice" relative="path">
					Go back to crossing choice panel
				</Link>
			</button>
			<button>
				<Link to="../results-choice" relative="path">
					Go to results choice panel
				</Link>
			</button>
			<LogOut />
		</div>
	);
}
