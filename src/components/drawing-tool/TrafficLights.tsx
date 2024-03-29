import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Connection,
	Crossroad,
	ExitEntrancePoint,
	FirstStageTrafficLight,
} from "../../custom/CrossroadInterface";
import {
	FIRST_STAGE_TRAFFIC_LIGHT_TEMPLATE,
	TOOLTIP_ENTRANCE_DELAY,
	tooltipTheme,
} from "../../custom/drawing-tool/AuxiliaryData";
import {
	getNewId,
	matchEEIPointTypeWithColor,
} from "../../custom/drawing-tool/AuxiliaryFunctions";
import { ButtonSettings, ConnectionMarker } from "./ConnectionMarker";
import { Backdrop } from "../additional/Modal/Backdrop";
import { TrafficLightCreator } from "../additional/Modal/drawing-tool-creators/TrafficLightCreator";
import { TrafficLightAssigner } from "../additional/Modal/drawing-tool-creators/TrafficLightAssigner";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider, Zoom } from "@mui/material";
import {
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	Colors,
	ContainerDiv,
	ScrollableUl,
} from "../../styles/MainStyles";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
	TooltipButton,
	InstructionP,
} from "../../styles/drawing-tool-styles/GeneralStyles";

export function TrafficLights() {
	const navigate = useNavigate();
	const location = useLocation();

	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);
	const [firstStageTrafficLights, setFirstStageTrafficLights] = useState<
		FirstStageTrafficLight[]
	>([]);
	const [lightsReady, setLightsReady] = useState(false);

	const [showLightCreator, setShowLightCreator] = useState(false);
	const [showLightAssigner, setShowLightAssigner] = useState(false);

	const [connectionToAssign, setConnectionToAssign] = useState(-1);
	const [templateLight, setTemplateLight] = useState(
		FIRST_STAGE_TRAFFIC_LIGHT_TEMPLATE,
	);
	const [firstFreeId, setFirstFreeId] = useState(1);

	const crossroad: Crossroad = location.state.crossroad;
	const exitEntrancePoints: ExitEntrancePoint[] = location.state.entrancesAndExits;
	const [connections, setConnections] = useState<Connection[]>(
		location.state.connections,
	);

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []); //This is a deprecated way to do this, should be addressed in the next refactor

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	const onNext = () => {
		navigate("../collisions", {
			state: {
				crossroad: crossroad,
				entrancesAndExits: exitEntrancePoints,
				connections: connections,
				trafficLights: firstStageTrafficLights.map((light) => ({
					...light.light,
				})),
			},
		});
	};

	const createTrafficLight = (eeiPointIndex: number) => {
		setShowLightCreator(true);
		setTemplateLight({
			light: {
				id: "",
				index: getNewId(firstFreeId, setFirstFreeId),
				direction: FIRST_STAGE_TRAFFIC_LIGHT_TEMPLATE.light.direction,
			},
			eeiPointIndex: eeiPointIndex,
		});
	};

	const onCloseCreator = (isFirstStage: boolean) => {
		if (isFirstStage) {
			setShowLightCreator(false);
			setTemplateLight(FIRST_STAGE_TRAFFIC_LIGHT_TEMPLATE);
		} else {
			setShowLightAssigner(false);
		}
	};

	const saveFirstStageTrafficLight = (light: FirstStageTrafficLight) => {
		setFirstStageTrafficLights([...firstStageTrafficLights, light]);
		setShowLightCreator(false);
	};

	const saveAssignAndFinalTrafficLight = (lightsIndexes: number[]): void => {
		const assignedConnection = connections.filter(
			(con) => con.index === connectionToAssign,
		)[0];

		assignedConnection.trafficLightIds = lightsIndexes;
		setConnections([
			...connections.filter((con) => con.index !== assignedConnection.index),
			assignedConnection,
		]);

		setShowLightAssigner(false);
	};

	const getAllLightAssignments = (lightIndex: number): string => {
		const allAssignments = connections.filter((con) =>
			con.trafficLightIds.includes(lightIndex),
		);
		if (allAssignments.length > 0) {
			return allAssignments.map((assignment) => assignment.index).join(", ");
		}

		return "None";
	};

	const onRemove = (lightIndex: number) => {
		setFirstStageTrafficLights(
			firstStageTrafficLights.filter((light) => light.light.index !== lightIndex),
		);
		setConnections(
			connections.map((con) => ({
				...con,
				trafficLightIds: con.trafficLightIds.filter(
					(ind) => ind !== lightIndex,
				),
			})),
		);
	};

	const onEdit = (light: FirstStageTrafficLight) => {
		setTemplateLight(light);
		setFirstStageTrafficLights(
			firstStageTrafficLights.filter(
				(firstStageLight) => light.light.index !== firstStageLight.light.index,
			),
		);
		setShowLightCreator(true);
	};

	return (
		<ContainerDiv>
			{showLightCreator && (
				<>
					<TrafficLightCreator
						closeFunction={() => {
							onCloseCreator(true);
						}}
						handleOnSave={saveFirstStageTrafficLight}
						trafficLight={templateLight}
					></TrafficLightCreator>
					<Backdrop />
				</>
			)}
			{showLightAssigner && (
				<>
					<TrafficLightAssigner
						closeFunction={() => {
							onCloseCreator(false);
						}}
						handleOnSave={saveAssignAndFinalTrafficLight}
						connectionId={connectionToAssign}
						trafficLights={firstStageTrafficLights.filter((light) => {
							const assignedConnectionSourceIndex = connections.filter(
								(con) => con.index === connectionToAssign,
							)[0].sourceId;

							return (
								light.eeiPointIndex === assignedConnectionSourceIndex
							);
						})}
					></TrafficLightAssigner>
					<Backdrop />
				</>
			)}
			<InstructionP>
				<strong>Traffic Lights</strong>
				<br />
				Please follow these steps:
				<br />
				1. Click on the map on a entrance/intermediate point that uses a traffic
				light you consider now
				<br />
				2. Create the light in modal creator
				<br />
				3. You can repeat points 1-2 as many times as you need. After you create
				{/* eslint-disable-next-line react/no-unescaped-entities */} all the
				lights press <strong>'Lights created - proceed'</strong> button
				<br />
				4. Then click on a connection and assign all traffic lights that use it.
				Repeat it until you mark all connections accordingly to your wish
			</InstructionP>
			<BorderedWorkaroundDiv>
				{connections.length > 0 &&
					connections.map((con) => {
						const entrancePoint = exitEntrancePoints.filter(
							(point) => point.index === con.sourceId,
						)[0];
						const exitPoint = exitEntrancePoints.filter(
							(point) => point.index === con.targetId,
						)[0];

						const buttonSettings: ButtonSettings = {
							onButtonClickAction: () => {
								setShowLightAssigner(true);
								setConnectionToAssign(con.index);
							},
							buttonText: "ASSIGN LIGHT",
							buttonColor: ButtonColors.BLUE,
						};

						return (
							<ConnectionMarker
								key={con.index}
								thickness={3}
								entranceX={entrancePoint.xCord}
								entranceY={entrancePoint.yCord}
								exitX={exitPoint.xCord}
								exitY={exitPoint.yCord}
								connection={con}
								color={Colors.BRIGHT_RED}
								withLightIds={lightsReady}
								withTooltip={lightsReady}
								buttonSettings={
									lightsReady ? buttonSettings : undefined
								}
							/>
						);
					})}
				{exitEntrancePoints.length > 0 && (
					<ThemeProvider theme={tooltipTheme}>
						{" "}
						{exitEntrancePoints.map((point, idx) => {
							const element = (
								<ButtonsDiv>
									<TooltipButton
										onClick={() => {
											createTrafficLight(point.index);
										}}
										color={ButtonColors.BLUE}
										xCord={0}
										yCord={0}
									>
										CREATE LIGHT
									</TooltipButton>
								</ButtonsDiv>
							);

							const eeiPoint = (
								<EEIPointMarker
									key={idx}
									color={matchEEIPointTypeWithColor(point.type)}
									yCord={point.yCord}
									xCord={point.xCord}
								></EEIPointMarker>
							);

							return lightsReady ? (
								eeiPoint
							) : (
								<Tooltip
									key={idx}
									title={
										<React.Fragment>
											<BaseUl>
												<BaseLi>id: {point.index}</BaseLi>
												<BaseLi>type: {point.type}</BaseLi>
												<BaseLi>street: {point.name}</BaseLi>
												{point.type === "INTERMEDIATE" && (
													<BaseLi>
														capacity:{" "}
														{point.capacity === -1
															? "infinity"
															: point.capacity}
													</BaseLi>
												)}
											</BaseUl>
											{!lightsReady &&
												(point.type === "ENTRANCE" ||
													point.type === "INTERMEDIATE") &&
												element}
										</React.Fragment>
									}
									TransitionComponent={Zoom}
									enterDelay={TOOLTIP_ENTRANCE_DELAY}
									leaveDelay={TOOLTIP_ENTRANCE_DELAY}
									arrow
								>
									{eeiPoint}
								</Tooltip>
							);
						})}{" "}
					</ThemeProvider>
				)}
				<CrossroadScreenshot
					src={
						crossroadImage === undefined
							? localStorage.getItem("crossroadMap")!
							: crossroadImage
					}
					alt="Map screenshot"
				></CrossroadScreenshot>
			</BorderedWorkaroundDiv>
			{firstStageTrafficLights.length > 0 && (
				<ScrollableUl height={25}>
					{firstStageTrafficLights.map((light) => (
						<BaseLi key={light.light.index}>
							<p>
								<strong>Light id:</strong> {light.light.index}
							</p>
							<p>
								<strong>At:</strong> {light.eeiPointIndex}
							</p>
							<p>
								<strong>Direction:</strong> {light.light.direction}
							</p>
							{!lightsReady ? (
								<NeutralPositiveButton
									onClick={() => {
										onEdit(light);
									}}
								>
									Edit
								</NeutralPositiveButton>
							) : (
								<p>
									<strong>Assigned to:</strong>
									{getAllLightAssignments(light.light.index)}
								</p>
							)}
							{!lightsReady && (
								<NegativeButton
									onClick={() => {
										onRemove(light.light.index);
									}}
								>
									Remove
								</NegativeButton>
							)}
						</BaseLi>
					))}
				</ScrollableUl>
			)}
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
				<PositiveButton disabled={!lightsReady} onClick={onNext}>
					Next
				</PositiveButton>
				{!lightsReady && (
					<NeutralPositiveButton
						onClick={() => {
							setFirstStageTrafficLights(
								firstStageTrafficLights.map((light, index) => ({
									...light,
									light: {
										...light.light,
										index: index + 1,
									},
								})),
							);
							setLightsReady(!lightsReady);
						}}
					>
						Lights created - proceed
					</NeutralPositiveButton>
				)}
			</ButtonsDiv>
		</ContainerDiv>
	);
}
