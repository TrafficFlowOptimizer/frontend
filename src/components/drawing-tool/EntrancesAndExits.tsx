import React from "react";
import { useLocation } from "react-router-dom";

export function EntrancesAndExits() {
	const location = useLocation();

	return (
		<div>
			<p>Entrances and exits</p>
			<p>Gained info:</p>
		</div>
	);
}
