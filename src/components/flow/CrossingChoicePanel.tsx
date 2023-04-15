import React from "react";
import { LogOut } from "../additional/LogOut";
import { Link, useLocation } from "react-router-dom";

export function CrossingChoicePanel() {
	const location = useLocation();
	const { ifNewUser } = location.state ?? true;

	return (
		<div>
			<h2>Welcome /USERNAME/</h2>
			{!ifNewUser && (
				<>
					<h3>Choose your course of action</h3>
					<button>
						<Link to="list">
							Choose from list of previously created crossings
						</Link>
					</button>
				</>
			)}
			<button>
				<Link to="new">Create new crossing</Link>
			</button>
			<LogOut />
		</div>
	);
}
