import React from "react";
import { Navbar } from "../additional/Navbar";
import { useLocation } from "react-router-dom";
import { FileUploader } from "../additional/FileUploader";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralPositiveButton } from "../../styles/NeutralButton";

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
				<NeutralPositiveButton>
					<BaseButtonLink
						to={`../crossroad-view/${crossroadId}`}
						relative="path"
						state={{ crossroadID: crossroadId }}
					>
						Back to crossing view
					</BaseButtonLink>
				</NeutralPositiveButton>
			</div>
		</>
	);
}
