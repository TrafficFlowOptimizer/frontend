import React from "react";
import { LogOut } from "../additional/LogOut";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";

export function AddVideos() {
	return (
		<>
			<Navbar />
			<div>
				<h3>
					Here will be a tool allowing user to put .mp4 or something like this
					footage of traffic
				</h3>
				<NeutralNegativeButton>
					<BaseButtonLink to="../crossroad-choice" relative="path">
						Go back to crossroad choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
				<NeutralPositiveButton>
					<BaseButtonLink to="../results-choice" relative="path">
						Go to results choice panel
					</BaseButtonLink>
				</NeutralPositiveButton>
				<LogOut />
			</div>
		</>
	);
}
