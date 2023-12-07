import React, { useEffect, useState } from "react";
import { OptimizationResults } from "../../custom/OptimizationInterface";
import { Navbar } from "../additional/Navbar";
import {
	CrossroadDescriptionResponse,
	ResponseCollision,
	ResponseConnection,
	ResponseCrossroad,
} from "../../custom/CrossRoadRestTypes";

import { useLocation } from "react-router-dom";
import {
	BaseButtonLink,
	Colors,
	ContainerDiv,
	LightColors,
	PageHeader,
} from "../../styles/MainStyles";
import {
	NeutralNegativeButton,
	NeutralPositiveButton,
} from "../../styles/NeutralButton";

import { ExitEntrancePoint, TrafficLight } from "../../custom/CrossroadInterface";
import { StyledItemTd } from "../../styles/CrossroadListStyles";
import { getUserJWTToken } from "../../custom/drawing-tool/AuxiliaryFunctions";
import { ConnectionMarker } from "../drawing-tool/ConnectionMarker";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIBorderMarker,
	EEIPointMarker,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import axios from "axios";
import { useUserContext } from "../../custom/UserContext";
import { SimulationNumbers } from "../../styles/ResultsStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SimulationLightSymbol } from "../../custom/SimulationInterface";
import { lightsDirectionData } from "../../custom/drawing-tool/AuxiliaryData";

export function ResultsAsSimulation() {
	const { loggedUser } = useUserContext();
	const location = useLocation();

	const crossroadName = location.state.crossroadName ?? null;
	const results: OptimizationResults = location.state.results ?? null;
	const crossroadId = location.state.crossroadId;
	const carFlows: number[] = location.state.car;

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

	const [running, setRunning] = useState(false);

	const [timer, setTimer] = useState(0);
	const timeInterval = 60;
	const timeDelta = 50;
	const lightColors = [LightColors.RED, LightColors.GREEN, LightColors.YELLOW];

	const [lights, setLights] = useState(new Map());
	const [cars, setCars] = useState(new Map());

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
				setLights(
					new Map(
						crossingsData.trafficLights.map((trafficLight) => [
							trafficLight.index,
							LightColors.YELLOW,
						]),
					),
				);
				setCars(new Map(crossingsData.roads.map((road) => [road.index, 0])));
			})
			.catch((error) => {
				console.error(error);
				setFailureMessage(
					`Request failed: ${error.code}!\nTry going back to crossroads-list and viewing the model again`,
				);
				setShowFailureAlert(true);
			});
	}, []);

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

	function convertObjectToMap(obj: any): Map<number, any> {
		const resultMap = new Map<number, any>();
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				resultMap.set(Number(key), obj[key]);
			}
		}
		return resultMap;
	}

	function howManyCarsArrived(flow: number) {
		let n = 0;
		while (flow > 0 && Math.random() < flow) {
			n += 1;
		}
		return n;
	}

	function getConnectionsIdsForRoadIdx(index: number) {
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
		let open = false;
		for (let i = 0; i < connectionLights.length; i++) {
			if (lights.get(connectionLights[i].index)! == LightColors.GREEN) {
				open = true;
			}
		}
		return open;
	}

	function getDistribution(length: number) {
		const distribution = [];
		let rightSide;
		let leftSide;
		if (length % 2 == 0) {
			rightSide = length / 2 - 0.5;
			leftSide = -rightSide;
		} else {
			rightSide = Math.floor(length / 2);
			leftSide = -rightSide;
		}
		for (let i = leftSide; i <= rightSide; i++) {
			distribution.push(i);
		}
		return distribution;
	}

	const ShowLight = (
		usedLights: TrafficLight[],
		lightsSeq: number[][],
		roadFlow: number,
		point: ExitEntrancePoint,
	) => {
		let idx = point.index * -1;
		let lightColor = LightColors.BLACK;
		const carNumber = cars.get(point.index)!;

		if (usedLights.length == 0) {
			return [
				<EEIPointMarker
					key={idx}
					color={lightColor}
					yCord={point.yCord}
					xCord={point.xCord}
				></EEIPointMarker>,
			];
		}

		const result = [
			<EEIBorderMarker
				key={idx}
				width={10 + 15 * usedLights.length}
				yCord={point.yCord}
				xCord={point.xCord - 7.5 * usedLights.length}
			>
				<SimulationNumbers>{carNumber}</SimulationNumbers>
			</EEIBorderMarker>,
		];
		const distribution = getDistribution(usedLights.length);
		for (let i = 0; i < usedLights.length; i++) {
			const light = usedLights[i];
			idx = light.index;
			lightColor = lights.get(usedLights[i].index)!;

			const horizontalShift = distribution[i] * 20;

			const simulationLightSymbol: SimulationLightSymbol =
				lightsDirectionData.get(light.direction)!;

			result.push(
				<FontAwesomeIcon
					icon={simulationLightSymbol.symbol}
					size={simulationLightSymbol.symbolSize}
					rotation={simulationLightSymbol.symbolRotation}
					style={{
						zIndex: 1,
						color: `${lightColor}`,
						position: "absolute",
						top: `${point.yCord + simulationLightSymbol.symbolTopShift}px`,
						left: `${
							point.xCord +
							horizontalShift +
							simulationLightSymbol.symbolLeftShift
						}px`,
					}}
				></FontAwesomeIcon>,
			);
		}
		return result;
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
								color={Colors.PRIMARY_GRAY}
								withLightIds={true}
								withTooltip={false}
							/>
						);
					})}
				{exitEntrancePoints.length > 0 &&
					exitEntrancePoints.map((point, idx) => {
						const usedLights = roadsLights.get(point.index)!;
						return ShowLight(
							usedLights,
							lightsSeqCurr,
							roadFlow.get(point.index)!,
							point,
						);
					})}
				<CrossroadScreenshot
					src={crossroadImage}
					alt="Map screenshot"
				></CrossroadScreenshot>
			</BorderedWorkaroundDiv>
			<tbody>
				<StyledItemTd>
					{!running ? (
						<NeutralNegativeButton
							onClick={() => setRunning((prev) => !prev)}
						>
							Resume
						</NeutralNegativeButton>
					) : (
						<NeutralPositiveButton
							onClick={() => setRunning((prev) => !prev)}
						>
							Pause
						</NeutralPositiveButton>
					)}
				</StyledItemTd>
			</tbody>

			<BaseButtonLink
				to="../results-choice"
				relative="path"
				state={location.state}
			>
				<NeutralNegativeButton>
					Go back to results choice panel
				</NeutralNegativeButton>
			</BaseButtonLink>
		</ContainerDiv>
	);
}
