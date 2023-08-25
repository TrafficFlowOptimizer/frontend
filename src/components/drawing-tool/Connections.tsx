import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Connection,
	Crossroad,
	ExitEntrancePoint,
} from "../../custom/CrossroadInterface";
import Tooltip from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import { matchEEIPointTypeWithColor } from "../../custom/drawing-tool/AuxiliaryFunctions";
import {
	BaseInput,
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	Colors,
	ContainerDiv,
	BaseForm,
	HorizontalBaseUl,
} from "../../styles/MainTheme";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
	TooltipButton,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { NeutralPositiveButton } from "../../styles/NeutralButton";

export function Connections() {
	const location = useLocation();
	const navigate = useNavigate();

	const crossroad: Crossroad = location.state.crossroad;
	const exitEntrancePoints: ExitEntrancePoint[] = location.state.entrancesAndExits;

	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);

	const [chosenPoint1, setChosenPoint1] = useState<string | null>(null);
	const [chosenPoint2, setChosenPoint2] = useState<string | null>(null);
	const [connections, setConnections] = useState<Connection[]>([]);

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []);

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	const onNext = () => {
		navigate("../traffic-lights", {
			state: {
				crossroad: crossroad,
				entrancesAndExits: exitEntrancePoints,
			},
		});
	};

	const onRemoveFromChosen = (whichOne: 1 | 2) => {
		if (whichOne === 1) {
			setChosenPoint1(null);
		} else {
			setChosenPoint2(null);
		}
	};

	const onAddToChosen = (whichOne: 1 | 2, pointId: string) => {
		if (whichOne === 1) {
			setChosenPoint1(pointId);
		} else {
			setChosenPoint2(pointId);
		}
	};

	const getFreeChoicePoint = () => {
		if (chosenPoint1 === null) {
			return 1;
		} else {
			return 2;
		}
	};

	const onConfirm = (event: React.SyntheticEvent) => {
		event.preventDefault();
		console.log("Confirmation");
	};

	const getChooseButton = (pointId: string) => {
		return (
			<TooltipButton
				color={ButtonColors.GREEN}
				yCord={0}
				xCord={0}
				onClick={() => {
					onAddToChosen(getFreeChoicePoint(), pointId);
				}}
			>
				ADD TO CONNECTION
			</TooltipButton>
		);
	};

	return (
		<ContainerDiv>
			<p>
				<strong>Connections</strong>
				<br />
				Please follow these steps:
				<br />
				1. Click on the map on two Exit/Entrance/Intermediate points to create a
				connection between them. The direction of the connection is decided by
				order in which you clicked the EEI points
				<br />
				2. Fill-in the name and id fields and save the connection
				<br />
				3. Repeat steps 1-2 for all connections you need
			</p>
			<BorderedWorkaroundDiv>
				{exitEntrancePoints.length > 0 &&
					exitEntrancePoints.map((point, idx) => (
						<Tooltip
							key={idx}
							title={
								<React.Fragment>
									<BaseUl>
										<BaseLi>id: {point.id}</BaseLi>
										<BaseLi>type: {point.type}</BaseLi>
										<BaseLi>street: {point.street}</BaseLi>
										<BaseLi>
											capacity:{" "}
											{point.capacity === -1
												? "infinity"
												: point.capacity}
										</BaseLi>
									</BaseUl>
									<ButtonsDiv>
										{chosenPoint1 === point.id && (
											<TooltipButton
												color={ButtonColors.RED}
												yCord={0}
												xCord={0}
												onClick={() => {
													onRemoveFromChosen(1);
												}}
											>
												REMOVE FROM CONNECTION
											</TooltipButton>
										)}
										{chosenPoint2 === point.id && (
											<TooltipButton
												color={ButtonColors.RED}
												yCord={0}
												xCord={0}
												onClick={() => {
													onRemoveFromChosen(2);
												}}
											>
												REMOVE FROM CONNECTION
											</TooltipButton>
										)}
										{chosenPoint1 !== point.id &&
											chosenPoint2 !== point.id &&
											getChooseButton(point.id)}
									</ButtonsDiv>
								</React.Fragment>
							}
							TransitionComponent={Zoom}
							enterDelay={75}
							leaveDelay={450}
							arrow
						>
							<EEIPointMarker
								key={idx}
								color={
									chosenPoint1 === point.id ||
									chosenPoint2 === point.id
										? Colors.PURPLE
										: matchEEIPointTypeWithColor(point.type)
								}
								yCord={point.yCord}
								xCord={point.xCord}
							></EEIPointMarker>
						</Tooltip>
					))}
				<CrossroadScreenshot
					src={
						crossroadImage === undefined
							? localStorage.getItem("crossroadMap")!
							: crossroadImage
					}
					alt="Map screenshot"
				></CrossroadScreenshot>
			</BorderedWorkaroundDiv>
			<div>INFORMATION ABOUT CONNECTIONS</div>
			<BaseForm onSubmit={onConfirm}>
				<HorizontalBaseUl>
					<BaseLi>
						<label htmlFor="id">ID:</label>
						<BaseInput
							id="id"
							type="text"
							disabled={chosenPoint1 === null || chosenPoint2 === null}
						/>
					</BaseLi>
					<BaseLi>
						<label htmlFor="name">Name:</label>
						<BaseInput
							id="name"
							type="text"
							disabled={chosenPoint1 === null || chosenPoint2 === null}
						/>
					</BaseLi>
				</HorizontalBaseUl>
				<NeutralPositiveButton
					type="submit"
					disabled={chosenPoint1 === null || chosenPoint2 === null}
				>
					Add connection
				</NeutralPositiveButton>
			</BaseForm>
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
				<PositiveButton onClick={onNext}>Next</PositiveButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}