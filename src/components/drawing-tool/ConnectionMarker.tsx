import React from "react";
import {
	ConnectionLine,
	TooltipButton,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { Connection } from "../../custom/CrossroadInterface";
import { BaseLi, BaseUl, ButtonColors, ButtonsDiv } from "../../styles/MainTheme";
import { Zoom } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

export type ConnectionCoordinates = {
	entranceX: number;
	entranceY: number;
	exitX: number;
	exitY: number;
	connection: Connection;
	thickness: number;
	removeConnection: () => void;
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
		<Tooltip
			title={
				<React.Fragment>
					<BaseUl>
						<BaseLi>id: {props.connection.id}</BaseLi>
						<BaseLi>name: {props.connection.name}</BaseLi>
						<BaseLi>sourceId: {props.connection.sourceId}</BaseLi>
						<BaseLi>targetId: {props.connection.targetId}</BaseLi>
					</BaseUl>
					<ButtonsDiv>
						<TooltipButton
							color={ButtonColors.RED}
							xCord={0}
							yCord={0}
							onClick={props.removeConnection}
						>
							REMOVE CONNECTION
						</TooltipButton>
					</ButtonsDiv>
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
			></ConnectionLine>
		</Tooltip>
	);
}
