import React from "react";
import { LogOut } from "../additional/LogOut";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { useLocation } from "react-router-dom";
import { FileUploader } from "../additional/FileUploader";

export function AddVideos() {
	const location = useLocation();
	const crossroadName: string = location.state.crossroadName ?? true;
	const crossroadId: string = location.state.crossroadId ?? true;

	//TODO: style this page as a whole later on

	return (
		<>
			<Navbar />
			<div>
				<h3>Add videos for crossroad: {crossroadName}</h3>
				<FileUploader crossroadId={crossroadId} />
				<NeutralNegativeButton>
					<BaseButtonLink to="../crossroad-choice" relative="path">
						Go back to crossing choice panel
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
