import React from "react";
import { LogOut } from "../additional/LogOut";
import { PositiveButton } from "../../styles/PositiveButton";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { Navbar } from "../additional/Navbar";

export function VideosList() {
	return (
		<>
			<Navbar />
			<div>
				<h3>Current Videos List</h3>
				<PositiveButton>
					<BaseButtonLink to="../add-videos" relative="path">
						Add new videos!
					</BaseButtonLink>
				</PositiveButton>
				<NeutralPositiveButton>
					<BaseButtonLink to="../results-choice" relative="path">
						Go to results choice panel
					</BaseButtonLink>
				</NeutralPositiveButton>
				<NeutralNegativeButton>
					<BaseButtonLink to="../crossroad-choice/list" relative="path">
						Go back to crossroads list
					</BaseButtonLink>
				</NeutralNegativeButton>
				<LogOut />
			</div>
		</>
	);
}
