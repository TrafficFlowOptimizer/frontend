import React from "react";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { PositiveButton } from "../../styles/PositiveButton";
import { NeutralNegativeButton } from "../../styles/NeutralButton";

export function ListOfCrossings() {
	return (
		<>
			<Navbar />
			<div>
				<p>
					here will be list off crossings that you will be able to choose from
				</p>
				<NeutralPositiveButton>
					<BaseButtonLink to="../../list-videos" relative="path">
						See video footage for chosen crossing
					</BaseButtonLink>
				</NeutralPositiveButton>
				<PositiveButton>
					<BaseButtonLink to="../../add-videos" relative="path">
						Add new video for chosen crossing
					</BaseButtonLink>
				</PositiveButton>
				<PositiveButton>
					<BaseButtonLink to="../new" relative="path">
						Create new crossing
					</BaseButtonLink>
				</PositiveButton>
				<NeutralNegativeButton>
					<BaseButtonLink to="../../results-choice" relative="path">
						Skip footage part and go to results choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
