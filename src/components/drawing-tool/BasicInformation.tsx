import React from "react";
import { BaseButtonLink } from "../../styles/MainTheme";
import { PositiveButton } from "../../styles/PositiveButton";

export function BasicInformation() {
	return (
		<div>
			<p>basic information</p>
			<PositiveButton>
				<BaseButtonLink to="../../crossroad-list" relative="path">
					Save new crossroad and proceed
				</BaseButtonLink>
			</PositiveButton>
		</div>
	);
}
