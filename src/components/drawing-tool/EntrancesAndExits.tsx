import React from "react";
import { useLocation } from "react-router-dom";
import { Crossroad } from "../../custom/CrossroadInterface";

export function EntrancesAndExits() {
	const location = useLocation();
	const crossroad: Crossroad = location.state.crossroad;

	return (
		<div>
			<p>Entrances and exits</p>
			<p>Gained info:</p>
			<ul>
				<li>{crossroad.name}</li>
			</ul>
		</div>
	);
}
