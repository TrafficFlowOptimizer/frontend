import React from "react";
import { LogOut } from "../additional/LogOut";
import { Link } from "react-router-dom";

export function CreateNewCrossing() {
	return (
		<div>
			<p>
				Here you will be able to create new crossing with a specific drawing
				tool
			</p>
			<button>
				<Link to="../../add-videos" relative="path">
					Save new crossing and proceed
				</Link>
			</button>
			<LogOut />
		</div>
	);
}
