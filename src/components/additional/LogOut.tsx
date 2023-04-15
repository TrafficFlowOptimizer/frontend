import React from "react";
import { Link } from "react-router-dom";

export function LogOut() {
	return (
		<button>
			<Link to="/">LogOut</Link>
		</button>
	);
}
