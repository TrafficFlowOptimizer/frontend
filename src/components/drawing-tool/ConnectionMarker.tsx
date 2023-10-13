import React from "react";
import {
	ConnectionLine,
	TooltipButton,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { Connection } from "../../custom/CrossroadInterface";
import {
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	Colors,
} from "../../styles/MainStyles";
import { ThemeProvider, Zoom } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { tooltipTheme } from "../../custom/drawing-tool/AuxiliaryData";

export type ConnectionCoordinates = {
	entranceX: number;
	entranceY: number;
	exitX: number;
	exitY: number;
	connection: Connection;
	thickness: number;
	color: Colors | ButtonColors;
	withLightIds: boolean;
	buttonSettings?: ButtonSettings;
};

export type ButtonSettings = {
	onButtonClickAction: () => void;
	buttonText: string;
	buttonColor: Colors | ButtonColors;
};

export function ConnectionMarker(props: ConnectionCoordinates) {
	const length = Math.sqrt(
		(props.exitX - props.entranceX) * (props.exitX - props.entranceX) +
			(props.exitY - props.entranceY) * (props.exitY - props.entranceY),
	);
	// center
	const centerX = (props.entranceX + props.exitX) / 2 - length / 2;
	const centerY = (props.entranceY + props.exitY) / 2 - props.thickness / 2;
	// angle
	const angle =
		Math.atan2(props.entranceY - props.exitY, props.entranceX - props.exitX) *
		(180 / Math.PI);

	return (
		<ThemeProvider theme={tooltipTheme}>
			<Tooltip
				PopperProps={{
					modifiers: [
						{
							name: "offset",
							options: {
								offset: [-length / 8, -length / 4],
							},
						},
					],
				}}
				title={
					<React.Fragment>
						<BaseUl>
							<BaseLi>id: {props.connection.index}</BaseLi>
							<BaseLi>name: {props.connection.name}</BaseLi>
							<BaseLi>sourceId: {props.connection.sourceId}</BaseLi>
							<BaseLi>targetId: {props.connection.targetId}</BaseLi>
							{props.withLightIds && (
								<BaseLi>
									lightsIDs:{" "}
									{props.connection.trafficLightIDs.length > 0
										? props.connection.trafficLightIDs.join(", ")
										: "None"}
								</BaseLi>
							)}
						</BaseUl>
						{props.buttonSettings && (
							<ButtonsDiv>
								<TooltipButton
									color={props.buttonSettings.buttonColor}
									xCord={0}
									yCord={0}
									onClick={props.buttonSettings.onButtonClickAction}
								>
									{props.buttonSettings.buttonText}
								</TooltipButton>
							</ButtonsDiv>
						)}
					</React.Fragment>
				}
				TransitionComponent={Zoom}
				enterDelay={75}
				leaveDelay={450}
				placement={"right-end"}
			>
				<ConnectionLine
					angle={angle}
					centerX={centerX}
					centerY={centerY}
					length={length}
					thickness={props.thickness}
					color={props.color}
				></ConnectionLine>
			</Tooltip>
		</ThemeProvider>
	);
}
