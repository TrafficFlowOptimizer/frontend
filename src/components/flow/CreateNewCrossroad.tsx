import React from "react";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink } from "../../styles/MainTheme";
import { PositiveButton } from "../../styles/PositiveButton";

export function CreateNewCrossroad() {
	return (
		<>
			<Navbar />
			<div>
				<p>
					Here you will be able to create new crossroad with a specific
					drawing tool
				</p>
				<PositiveButton>
					<BaseButtonLink to="../crossroad-list" relative="path">
						Save new crossroad and proceed
					</BaseButtonLink>
				</PositiveButton>
			</div>
		</>
	);
}
