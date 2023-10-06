import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Connection,
	Crossroad,
	ExitEntrancePoint,
	FirstStageTrafficLight,
} from "../../custom/CrossroadInterface";
import { FIRST_STAGE_TRAFFIC_LIGHT_TEMPLATE } from "../../custom/drawing-tool/AuxiliaryData";
import Tooltip from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import { matchEEIPointTypeWithColor } from "../../custom/drawing-tool/AuxiliaryFunctions";
import { ButtonSettings, ConnectionMarker } from "./ConnectionMarker";
import { Backdrop } from "../additional/Modal/Backdrop";
import { TrafficLightCreator } from "../additional/Modal/drawing-tool-creators/TrafficLightCreator";
import { TrafficLightAssigner } from "../additional/Modal/drawing-tool-creators/TrafficLightAssigner";
import {
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	ContainerDiv,
} from "../../styles/MainTheme";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
	TooltipButton,
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

	const [connectionToAssign, setConnectionToAssign] = useState("");
	const [templateLight, setTemplateLight] = useState(
		FIRST_STAGE_TRAFFIC_LIGHT_TEMPLATE,
	);
	const [firstFreeId, setFirstFreeId] = useState(1);

	const crossroad: Crossroad = location.state.crossroad;
	const exitEntrancePoints: ExitEntrancePoint[] = location.state.entrancesAndExits;
	const [connections, setConnections] = useState<Connection[]>(
		location.state.connections,
	);

	// TODO: modal for creating a traffic light

	// TODO: modal for choosing lights for connection

	// TODO: id assigning function (auto-increment and stuff)

	// TODO: edition and removal of lights

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
				trafficLights: firstStageTrafficLights.map((light, index) => ({
					...light.light,
					id: (index + 1).toString(),
				})),
			},
		});
	};

	const getNewId = () => {
		const newId = firstFreeId.toString();
		setFirstFreeId(firstFreeId + 1);
		return newId;
	};

	const createTrafficLight = (eeiPointId: string) => {
		setShowLightCreator(true);
		setTemplateLight({
			light: {
				id: getNewId(),
				name: FIRST_STAGE_TRAFFIC_LIGHT_TEMPLATE.light.name,
				direction: FIRST_STAGE_TRAFFIC_LIGHT_TEMPLATE.light.direction,
			},
			eeiPointId: eeiPointId,
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

	const saveAssignAndFinalTrafficLight = (lightsIds: string[]): void => {
		const assignedConnection = connections.filter(
			(con) => con.id === connectionToAssign,
		)[0];

		assignedConnection.trafficLightIDs = lightsIds;
		setConnections([
			...connections.filter((con) => con.id !== assignedConnection.id),
			assignedConnection,
		]);

		setShowLightAssigner(false);
	};

	const getAllLightAssignments = (lightId: string): string => {
		const allAssignments = connections.filter((con) =>
			con.trafficLightIDs.includes(lightId),
		);
		if (allAssignments.length > 0) {
			return allAssignments.map((assignment) => assignment.id).join(", ");
		}

		return "None";
	};

	const onRemove = (lightId: string) => {
		setFirstStageTrafficLights(
			firstStageTrafficLights.filter((light) => light.light.id !== lightId),
		);
		setConnections(
			connections.map((con) => ({
				...con,
				trafficLightIDs: con.trafficLightIDs.filter((id) => id !== lightId),
			})),
		);
	};

	const onEdit = (light: FirstStageTrafficLight) => {
		setTemplateLight(light);
		setFirstStageTrafficLights(
			firstStageTrafficLights.filter(
				(firstStageLight) => light.light.id !== firstStageLight.light.id,
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
							const assignedConnectionSourceId = connections.filter(
								(con) => con.id === connectionToAssign,
							)[0].sourceId;

							return light.eeiPointId === assignedConnectionSourceId;
						})}
					></TrafficLightAssigner>
					<Backdrop />
				</>
			)}
			<p>
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
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				all the lights press 'LIGHTS READY' button
				<br />
				4. Then click on a connection and assign all traffic lights that use it.
				Repeat it until you mark all connections accordingly to your wish
			</p>
			<BorderedWorkaroundDiv>
				{connections.length > 0 &&
					connections.map((con) => {
						const entrancePoint = exitEntrancePoints.filter(
							(point) => point.id === con.sourceId,
						)[0];
						const exitPoint = exitEntrancePoints.filter(
							(point) => point.id === con.targetId,
						)[0];

						const buttonSettings: ButtonSettings = {
							onButtonClickAction: () => {
								setShowLightAssigner(true);
								setConnectionToAssign(con.id);
							},
							buttonText: "ASSIGN LIGHT",
							buttonColor: ButtonColors.BLUE,
						};

						return (
							<ConnectionMarker
								key={con.id}
								thickness={3}
								entranceX={entrancePoint.xCord}
								entranceY={entrancePoint.yCord}
								exitX={exitPoint.xCord}
								exitY={exitPoint.yCord}
								connection={con}
								withLightIds={lightsReady}
								buttonSettings={
									lightsReady ? buttonSettings : undefined
								}
							/>
						);
					})}
				{exitEntrancePoints.length > 0 &&
					exitEntrancePoints.map((point, idx) => {
						const element = (
							<ButtonsDiv>
								<TooltipButton
									onClick={() => {
										createTrafficLight(point.id);
									}}
									color={ButtonColors.BLUE}
									xCord={0}
									yCord={0}
								>
									CREATE LIGHT
								</TooltipButton>
							</ButtonsDiv>
						);

						return (
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
										{!lightsReady &&
											(point.type === "entrance" ||
												point.type === "intermediate") &&
											element}
									</React.Fragment>
								}
								TransitionComponent={Zoom}
								enterDelay={75}
								leaveDelay={450}
								arrow
							>
								<EEIPointMarker
									key={idx}
									color={matchEEIPointTypeWithColor(point.type)}
									yCord={point.yCord}
									xCord={point.xCord}
								></EEIPointMarker>
							</Tooltip>
						);
					})}
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
				<BaseUl>
					{firstStageTrafficLights.map((light) => (
						<BaseLi key={light.light.id}>
							<p>
								<strong>Light name:</strong> {light.light.name}
							</p>
							<p>
								<strong>At:</strong> {light.eeiPointId}
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
									{getAllLightAssignments(light.light.id)}
								</p>
							)}
							{!lightsReady && (
								<NegativeButton
									onClick={() => {
										onRemove(light.light.id);
									}}
								>
									Remove
								</NegativeButton>
							)}
						</BaseLi>
					))}
				</BaseUl>
			)}
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
				<PositiveButton disabled={!lightsReady} onClick={onNext}>
					Next
				</PositiveButton>
				<NeutralPositiveButton
					onClick={() => {
						setLightsReady(!lightsReady);
					}}
				>
					{lightsReady ? "Back to lights creation" : "Lights created"}
				</NeutralPositiveButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}
