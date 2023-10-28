import React from "react";
import { Navbar } from "../additional/Navbar";
import { useLocation } from "react-router-dom";
import { FileUploader } from "../additional/FileUploader";
import { BaseButtonLink, ButtonsDiv, ContainerDiv } from "../../styles/MainStyles";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { ResponseConnection, ResponseCrossroad } from "../../custom/CrossRoadRestTypes";

export function AddVideos() {
	const location = useLocation();
	const crossroad: ResponseCrossroad = location.state.crossroad ?? true;
	const connections: ResponseConnection[] = location.state.connections ?? true;

	//TODO: style this page as a whole later on

	return (
		<ContainerDiv>
			<Navbar />
			<div>
				<h3>Add videos for crossroad: {crossroad.name}</h3>
				<FileUploader crossroadId={crossroad.id} connections={connections} />
				<ButtonsDiv>
					<NeutralPositiveButton>
						<BaseButtonLink
							to={`../crossroad-view/${crossroad.id}`}
							relative="path"
							state={{ crossroadID: crossroad.id }}
						>
							Back to crossing view
						</BaseButtonLink>
					</NeutralPositiveButton>
				</ButtonsDiv>
			</div>
		</ContainerDiv>
	);
}
