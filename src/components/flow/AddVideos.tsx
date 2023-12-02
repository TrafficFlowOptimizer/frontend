import React from "react";
import { Navbar } from "../additional/Navbar";
import { useLocation } from "react-router-dom";
import { FileUploader } from "../additional/FileUploader";
import { BaseButtonLink, ButtonsDiv, ContainerDiv } from "../../styles/MainStyles";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { CenteredInstructionP } from "../../styles/drawing-tool-styles/GeneralStyles";
import { AddVideosDiv } from "../../styles/FileUploaderStyles";
import { ResponseConnection, ResponseCrossroad } from "../../custom/CrossRoadRestTypes";

export function AddVideos() {
	const location = useLocation();
	const crossroad: ResponseCrossroad = location.state.crossroad ?? true;
	const connections: ResponseConnection[] = location.state.connections ?? true;

	//TODO: style this page as a whole later on

	const videoQualityMessage = (
		<CenteredInstructionP>
			Remember that the quality of analysis depends on the quality of a video.
			<br />
			{/* eslint-disable-next-line react/no-unescaped-entities */}
			It's on you to provide the recording with the correct angle and right
			illumination.
			<br />
			The best angle is from the side and slightly above the cars.
			<br />
			Thank you for your consideration!
		</CenteredInstructionP>
	);

	return (
		<ContainerDiv>
			<Navbar />
			<AddVideosDiv>
				<h3>Add videos for crossroad: {crossroad.name}</h3>
				{videoQualityMessage}
				<FileUploader crossroadId={crossroad.id} connections={connections} />
				<ButtonsDiv>
					<BaseButtonLink
						to={`../crossroad-view/${crossroad.id}`}
						relative="path"
						state={{ crossroadID: crossroad.id }}
					>
						<NeutralPositiveButton>
							Back to crossing view
						</NeutralPositiveButton>
					</BaseButtonLink>
				</ButtonsDiv>
			</AddVideosDiv>
		</ContainerDiv>
	);
}
