import React from "react";
import { Connection } from "../../custom/CrossroadInterface";
import { ThemeProvider, Zoom } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { tooltipTheme } from "../../custom/drawing-tool/AuxiliaryData";
import {
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	Colors,
} from "../../styles/MainStyles";
import {
	ConnectionLine,
	TooltipButton,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { ResponseConnection } from "../../custom/CrossRoadRestTypes";

export type ConnectionCoordinates = {
	entranceX: number;
	entranceY: number;
	exitX: number;
	exitY: number;
	connection: Connection | ResponseConnection;
	thickness: number;
	color: Colors | ButtonColors;
	withLightIds: boolean;
	withTooltip: boolean;
	buttonSettings?: ButtonSettings;
	eeiPointsIndexes?: number[];
	lightsIndexes?: string[];
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

	let joinedTrafficLightsIds = "None";
	if (props.connection.trafficLightIds.length > 0) {
		joinedTrafficLightsIds = props.connection.trafficLightIds.join(", ");
	}

	const connectionLine = (
		<ConnectionLine
			angle={angle}
			centerX={centerX}
			centerY={centerY}
			length={length}
			thickness={props.thickness}
			color={props.color}
		></ConnectionLine>
	);

	return props.withTooltip ? (
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
							<BaseLi>
								sourceId:{" "}
								{props.eeiPointsIndexes !== undefined &&
								props.eeiPointsIndexes.length == 2
									? props.eeiPointsIndexes[0]
									: props.connection.sourceId}
							</BaseLi>
							<BaseLi>
								targetId:{" "}
								{props.eeiPointsIndexes !== undefined &&
								props.eeiPointsIndexes.length == 2
									? props.eeiPointsIndexes[1]
									: props.connection.sourceId}
							</BaseLi>
							{props.withLightIds && (
								<BaseLi>
									lightsIDs:{" "}
									{props.lightsIndexes !== undefined
										? props.lightsIndexes.join(", ")
										: joinedTrafficLightsIds}
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
				{connectionLine}
			</Tooltip>
		</ThemeProvider>
	) : (
		connectionLine
	);
}
