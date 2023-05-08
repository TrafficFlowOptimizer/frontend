import React from "react";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink } from "../../styles/MainTheme";
import { PositiveButton } from "../../styles/PositiveButton";

export function CreateNewCrossing() {
	return (
		<>
			<Navbar />
			<div>
				<p>
					Here you will be able to create new crossing with a specific drawing
					tool
				</p>
				<PositiveButton>
					<BaseButtonLink to="../../add-videos" relative="path">
						Save new crossing and proceed
					</BaseButtonLink>
				</PositiveButton>
			</div>
		</>
	);
}
