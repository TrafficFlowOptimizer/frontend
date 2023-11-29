import React, { useEffect, useState } from "react";
import { OptimizationResults } from "../../custom/OptimizationInterface";
import { Navbar } from "../additional/Navbar";
import {
	CrossroadDescriptionResponse,
	ResponseCollision,
	ResponseConnection,
	ResponseCrossroad,
} from "../../custom/CrossRoadRestTypes";

import { useLocation, useNavigate } from "react-router-dom";
import {
	BaseButtonLink,
	BaseLi,
	BaseUl,
	ButtonsDiv,
	Colors,
	ContainerDiv,
	LightColors,
	PageHeader,
	SimulationNumbers,
} from "../../styles/MainStyles";
import {
	NeutralNegativeButton,
	NeutralPositiveButton,
} from "../../styles/NeutralButton";

import {
	Collision,
	Connection,
	Crossroad,
	ExitEntrancePoint,
	TrafficLight,
} from "../../custom/CrossroadInterface";
import { StyledItemTd } from "../../styles/CrossroadListStyles";
import {
	CustomHeader,
	CustomParagraph,
	LightResultsPanel,
	SimulationResultsLi,
	SimulationResultsPanel,
	SimulationResultsUl,
	SequenceContainer,
	SequenceIndex,
	SingleInfoPanel,
	StyledSequence,
} from "../../styles/SimulationResultsStyles";
import {
	getConnectionNameFromIndex,
	getUserJWTToken,
	matchEEIPointTypeWithColor,
} from "../../custom/drawing-tool/AuxiliaryFunctions";
import { ConnectionMarker } from "../drawing-tool/ConnectionMarker";
import { ThemeProvider, Zoom } from "@mui/material";
import {
	TOOLTIP_ENTRANCE_DELAY,
	TOOLTIP_LEAVE_DELAY,
	tooltipTheme,
} from "../../custom/drawing-tool/AuxiliaryData";
import Tooltip from "@mui/material/Tooltip";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import axios from "axios";
import { useUserContext } from "../../custom/UserContext";
import userEvent from "@testing-library/user-event";
import { randomInt } from "crypto";

export type pauseButtonState = "paused" | "running";

export function ResultsAsSimulation() {
	const { loggedUser } = useUserContext();
	const location = useLocation();

	const crossroadName = location.state.crossroadName ?? null;
	const results: OptimizationResults = location.state.results ?? null;
	const crossroadId = location.state.crossroadId;
	const carFlows: number[] = location.state.car;

	function convertObjectToMap(obj: any): Map<number, any> {
		const resultMap = new Map<number, any>();
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				resultMap.set(Number(key), obj[key]);
			}
		}
		return resultMap;
	}

	const lightsSeqPrev: number[][] = Object.values(results.lightsSequenceMapPrevious);
	const lightsSeqCurr: number[][] = Object.values(results.lightsSequenceMapCurrent);
	const conLights: Map<number, TrafficLight[]> = convertObjectToMap(
		results.connectionsLightsMap,
	);
	const roadsLights: Map<number, TrafficLight[]> = convertObjectToMap(
		results.roadsLightsMap,
	);
	const conFlow: Map<number, number> = convertObjectToMap(results.connectionsFlowMap);
	const conRoad: Map<number, number> = convertObjectToMap(results.connectionsRoadMap);
	const roadFlow: Map<number, number> = convertObjectToMap(results.roadsFlowMap);
	const conChances: Map<number, number> = convertObjectToMap(
		results.connectionChanceToPickMap,
	);

	const [crossroad, setCrossroad] = useState<ResponseCrossroad | null>(null);
	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);
	const [exitEntrancePoints, setExitEntrancePoints] = useState<ExitEntrancePoint[]>(
		[],
	);
	const [connections, setConnections] = useState<ResponseConnection[]>([]);
	const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([]);
	const [collisions, setCollisions] = useState<ResponseCollision[]>([]);

	const [showFailureAlert, setShowFailureAlert] = useState(false);
	const [failureMessage, setFailureMessage] = useState("");

	useEffect(() => {
		axios
			.get<CrossroadDescriptionResponse>(`/crossroad/${crossroadId}`, {
				headers: {
					Authorization: `Bearer ${
						loggedUser !== null ? loggedUser.jwtToken : getUserJWTToken()
					}`,
				},
			})
			.then((response) => {
				const crossingsData: CrossroadDescriptionResponse = response.data;
				setCrossroad(crossingsData.crossroad);
				setExitEntrancePoints(crossingsData.roads);
				setConnections(crossingsData.connections);
				setTrafficLights(crossingsData.trafficLights);
				setCollisions(crossingsData.collisions);
				setCrossroadImage(crossingsData.image);
			})
			.catch((error) => {
				console.error(error);
				setFailureMessage(
					`Request failed: ${error.code}!\nTry going back to crossroads-list and viewing the model again`,
				);
				setShowFailureAlert(true);
			});
	}, []);

	const getLightSequence = (lightIdx: number, lightsSeq: number[][]) => {
		const newIdx = lightIdx - 1;
		if (newIdx >= 0 && newIdx < lightsSeq.length) {
			return lightsSeq[newIdx];
		} else {
			return [];
		}
	};

	const [running, setRunning] = useState(false);

	const [timer, setTimer] = useState(0);
	const timeInterval = 60;
	const timeDelta = 200;
	const lightColors = [LightColors.RED, LightColors.GREEN, LightColors.YELLOW];
	const [lights, setLights] = useState<Map<number, LightColors>>(
		new Map([
			[1, LightColors.YELLOW],
			[2, LightColors.YELLOW],
			[3, LightColors.YELLOW],
			[4, LightColors.YELLOW],
		]),
	);

	const [cars, setCars] = useState<Map<number, number>>(
		new Map([
			[1, 0],
			[2, 0],
		]),
	);

	function howManyCarsArrived(flow: number) {
		let n = 0;
		while (flow > 0 && Math.random() < flow) {
			n += 1;
		}
		return n;
	}

	function getConnectionsIdsForRoadIdx(index: number) {
		// console.log("conRoad", conRoad);
		const connections: number[] = [];
		conRoad.forEach(function (value, key) {
			if (value == index) {
				connections.push(key);
			}
		});
		return connections;
	}

	function getWhichConnectionToGo(connectionsIds: number[]) {
		let chanceFloor = 0;
		let chanceCeil = 0;
		const randomNumber = Math.random();
		let chosenConnection = 0;
		// console.log("connectionsIds", connectionsIds);
		// console.log("randomNumber", randomNumber);
		// console.log("conChances", conChances);

		for (const c of connectionsIds) {
			chanceCeil += conChances.get(c)!;
			if (chanceFloor < randomNumber && randomNumber <= chanceCeil) {
				chosenConnection = c;
				break;
			}
			chanceFloor += conChances.get(c)!;
		}
		return chosenConnection;
	}

	function isConnectionOpen(connection: number) {
		const connectionLights = conLights.get(connection)!;
		// console.log("conLights", conLights);
		// console.log("connectionLights", connectionLights);
		// console.log("connection", connection);
		// console.log("lights", lights);
		let open = false;
		for (let i = 0; i < connectionLights.length; i++) {
			if (lights.get(connectionLights[i].index)! == LightColors.GREEN) {
				open = true;
			}
		}
		// console.log("open", open);
		return open;
	}

	useEffect(() => {
		if (running) {
			const lightsTimer = setInterval(function () {
				console.log(timer);
				setTimer((timer + 1) % timeInterval);

				const newLights: Map<number, LightColors> = new Map<
					number,
					LightColors
				>();
				for (const trafficLight of trafficLights) {
					newLights.set(
						trafficLight.index,
						lightColors[lightsSeqCurr[trafficLight.index - 1][timer]],
					);
				}
				setLights(newLights);

				const joinedCars: Map<number, number> = new Map<number, number>();
				for (const exitEntrancePoint of exitEntrancePoints) {
					joinedCars.set(
						exitEntrancePoint.index,
						howManyCarsArrived(roadFlow.get(exitEntrancePoint.index)! / 60),
					); //TODO 60? how many ticks per minute?
				}

				const leftCars: Map<number, number> = new Map<number, number>();
				for (const exitEntrancePoint of exitEntrancePoints) {
					const connectionsId = getConnectionsIdsForRoadIdx(
						exitEntrancePoint.index,
					);
					if (connectionsId.length == 0) {
						leftCars.set(exitEntrancePoint.index, 0);
					} else {
						const whichConToGo = getWhichConnectionToGo(connectionsId);
						if (isConnectionOpen(whichConToGo)) {
							leftCars.set(exitEntrancePoint.index, 1);
						} else {
							leftCars.set(exitEntrancePoint.index, 0);
						}
					}
				}

				// console.log(lights);
				// console.log(cars);
				// console.log(joinedCars);
				// console.log(leftCars);
				const newCars: Map<number, number> = new Map<number, number>();
				for (const exitEntrancePoint of exitEntrancePoints) {
					newCars.set(
						exitEntrancePoint.index,
						Math.max(
							0,
							cars.get(exitEntrancePoint.index)! +
								joinedCars.get(exitEntrancePoint.index)! -
								leftCars.get(exitEntrancePoint.index)!,
						),
					);
				}
				setCars(newCars);
			}, timeDelta);
			return () => clearInterval(lightsTimer);
		}
	}, [running, timer]);

	const ShowLight = (
		usedLights: TrafficLight[],
		lightsSeq: number[][],
		roadFlow: number,
		point: ExitEntrancePoint,
	) => {
		let idx = point.index * -1;
		let lightColor = LightColors.BLACK;
		const carNumber = cars.get(point.index)!;

		const result = [];

		for (let i = 0; i < usedLights.length; i++) {
			const light = usedLights[i];
			idx = light.index;
			lightColor = lights.get(usedLights[i].index)!;

			if (i == 0) {
				result.push(
					<div key={idx}>
						<EEIPointMarker
							key={idx}
							color={lightColor}
							yCord={point.yCord}
							xCord={point.xCord}
						>
							<SimulationNumbers>{carNumber}</SimulationNumbers>
						</EEIPointMarker>
					</div>,
				);
			} else {
				result.push(
					<div key={idx}>
						<EEIPointMarker
							key={idx}
							color={lightColor}
							yCord={point.yCord}
							xCord={point.xCord + 15 * i}
						></EEIPointMarker>
					</div>,
				);
			}
		}

		if (result.length == 0) {
			result.push(
				<div key={idx}>
					<EEIPointMarker
						key={idx}
						color={lightColor}
						yCord={point.yCord}
						xCord={point.xCord}
					>
						<SimulationNumbers>{}</SimulationNumbers>
					</EEIPointMarker>
				</div>,
			);
		}
		return result;
	};

	const handleChooseButton = (current_state: pauseButtonState) => {
		console.log(current_state, running);
		if (current_state === "paused") {
			setRunning(false);
		} else {
			setRunning(true);
		}
	};

	return (
		<ContainerDiv>
			<Navbar />
			<PageHeader>{crossroadName}</PageHeader>
			<BorderedWorkaroundDiv>
				{connections.length > 0 &&
					connections.map((con) => {
						const entrancePoint = exitEntrancePoints.filter(
							(point) => point.id === con.sourceId,
						)[0];
						const exitPoint = exitEntrancePoints.filter(
							(point) => point.id === con.targetId,
						)[0];

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
								withLightIds={true}
								withTooltip={false}
							/>
						);
					})}
				{exitEntrancePoints.length > 0 && (
					<ThemeProvider theme={tooltipTheme}>
						{exitEntrancePoints.map((point, idx) => {
							const usedLights = roadsLights.get(point.index)!;
							// console.log(usedLights);
							// const usedLights = [null, null];
							// console.log("for point\n", point, "\nlights\n", usedLights);
							return ShowLight(
								usedLights,
								lightsSeqCurr,
								roadFlow.get(point.index)!,
								point,
							);
						})}
					</ThemeProvider>
				)}
				<CrossroadScreenshot
					src={crossroadImage}
					alt="Map screenshot"
				></CrossroadScreenshot>
			</BorderedWorkaroundDiv>
			<tbody>
				<StyledItemTd>
					{!running ? (
						<NeutralNegativeButton
							onClick={() => handleChooseButton("running")}
						>
							Resume
						</NeutralNegativeButton>
					) : (
						<NeutralPositiveButton
							onClick={() => handleChooseButton("paused")}
						>
							Pause
						</NeutralPositiveButton>
					)}
				</StyledItemTd>
			</tbody>

			<NeutralNegativeButton>
				<BaseButtonLink
					to="../results-choice"
					relative="path"
					state={location.state}
				>
					Go back to results choice panel
				</BaseButtonLink>
			</NeutralNegativeButton>
		</ContainerDiv>
	);
}
