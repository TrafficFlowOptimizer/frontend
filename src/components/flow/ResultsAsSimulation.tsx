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
	EEIPointMarker,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import axios from "axios";
import { useUserContext } from "../../custom/UserContext";
import {
	EEIBorderMarker,
	SimulationNumbers,
	SimulationVersion,
	SimulationVersionLabel,
} from "../../styles/ResultsStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SimulationLightSymbol } from "../../custom/SimulationInterface";
import { lightsDirectionData } from "../../custom/drawing-tool/AuxiliaryData";
import { doc } from "prettier";

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

	const [lightsCurrent, setLightsCurrent] = useState(new Map());
	const [lightsPrevious, setLightsPrevious] = useState(new Map());
	const [carsCurrent, setCarsCurrent] = useState(new Map());
	const [carsPrevious, setCarsPrevious] = useState(new Map());

	const [leftCarsCurrent, setLeftCarsCurrent] = useState(new Map());
	const [leftCarsPrevious, setLeftCarsPrevious] = useState(new Map());
	const [connectionIdxToTargetMap, setConnectionIdxToTargetMap] = useState(new Map());

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
				setLightsCurrent(
					new Map(
						crossingsData.trafficLights.map((trafficLight) => [
							trafficLight.index,
							LightColors.YELLOW,
						]),
					),
				);
				setLightsPrevious(
					new Map(
						crossingsData.trafficLights.map((trafficLight) => [
							trafficLight.index,
							LightColors.YELLOW,
						]),
					),
				);
				setConnectionIdxToTargetMap(
					new Map(
						crossingsData.connections.map((connection) => [
							connection.index,
							getRoadForId(connection.targetId, crossingsData.roads),
						]),
					),
				);
				setCarsCurrent(
					new Map(crossingsData.roads.map((road) => [road.index, 0])),
				);
				setCarsPrevious(
					new Map(crossingsData.roads.map((road) => [road.index, 0])),
				);
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
				const joinedCarsCurrent: Map<number, number> = new Map<
					number,
					number
				>();
				const leftCars_Current: Map<number, number> = new Map<number, number>();
				const newCarsCurrent: Map<number, number> = new Map<number, number>();
				const joinedCarsPrevious: Map<number, number> = new Map<
					number,
					number
				>();
				const leftCars_Previous: Map<number, number> = new Map<
					number,
					number
				>();
				const newCarsPrevious: Map<number, number> = new Map<number, number>();

				console.log(timer);
				setTimer((timer + 1) % timeInterval);

				let newLights: Map<number, LightColors> = new Map<
					number,
					LightColors
				>();
				for (const trafficLight of trafficLights) {
					newLights.set(
						trafficLight.index,
						lightColors[lightsSeqCurr[trafficLight.index - 1][timer]],
					);
				}
				setLightsCurrent(newLights);
				newLights = new Map<number, LightColors>();
				for (const trafficLight of trafficLights) {
					newLights.set(
						trafficLight.index,
						lightColors[lightsSeqPrev[trafficLight.index - 1][timer]],
					);
				}
				setLightsPrevious(newLights);

				for (const exitEntrancePoint of exitEntrancePoints) {
					const connectionsIdxs = getConnectionsIdxsForRoadIdx(
						exitEntrancePoint.index,
					);
					if (connectionsIdxs.length == 0) {
						leftCars_Current.set(exitEntrancePoint.index, 0);
						leftCars_Previous.set(exitEntrancePoint.index, 0);
					} else {
						const connectionToGoIdxCurrent =
							getWhichConnectionToGo(connectionsIdxs);

						if (isConnectionOpen(connectionToGoIdxCurrent, lightsCurrent)) {
							leftCars_Current.set(exitEntrancePoint.index, 1);
							const target = connectionIdxToTargetMap.get(
								connectionToGoIdxCurrent,
							);
							if (target.type == "INTERMEDIATE") {
								joinedCarsCurrent.set(
									target.index,
									howManyCarsArrived(
										roadFlow.get(exitEntrancePoint.index)! / 60,
									),
								);
							}
						} else {
							leftCars_Current.set(exitEntrancePoint.index, 0);
						}
						const connectionToGoIdxPrevious =
							getWhichConnectionToGo(connectionsIdxs);

						if (
							isConnectionOpen(connectionToGoIdxPrevious, lightsPrevious)
						) {
							leftCars_Previous.set(exitEntrancePoint.index, 1);
							const target = connectionIdxToTargetMap.get(
								connectionToGoIdxPrevious,
							);
							if (target.type == "INTERMEDIATE") {
								joinedCarsPrevious.set(
									target.index,
									howManyCarsArrived(
										roadFlow.get(exitEntrancePoint.index)! / 60,
									),
								);
							}
						} else {
							leftCars_Previous.set(exitEntrancePoint.index, 0);
						}
					}
				}
				setLeftCarsCurrent(leftCars_Current);
				setLeftCarsPrevious(leftCars_Previous);

				for (const exitEntrancePoint of exitEntrancePoints) {
					if (exitEntrancePoint.type != "INTERMEDIATE") {
						joinedCarsCurrent.set(
							exitEntrancePoint.index,
							howManyCarsArrived(
								roadFlow.get(exitEntrancePoint.index)! / 60,
							),
							// howManyCarsArrived(0.05),
						); //TODO 60? how many ticks per minute?
						joinedCarsPrevious.set(
							exitEntrancePoint.index,
							howManyCarsArrived(
								roadFlow.get(exitEntrancePoint.index)! / 60,
							),
							// howManyCarsArrived(0.05),
						); //TODO 60? how many ticks per minute?
					} else {
						if (!joinedCarsCurrent.has(exitEntrancePoint.index)) {
							joinedCarsCurrent.set(exitEntrancePoint.index, 0);
						}
						if (!joinedCarsPrevious.has(exitEntrancePoint.index)) {
							joinedCarsPrevious.set(exitEntrancePoint.index, 0);
						}
					}
				}

				for (const exitEntrancePoint of exitEntrancePoints) {
					newCarsCurrent.set(
						exitEntrancePoint.index,
						leftCarsCurrent.get(exitEntrancePoint.index)! > 0
							? Math.max(
									0,
									carsCurrent.get(exitEntrancePoint.index)! -
										leftCarsCurrent.get(exitEntrancePoint.index)!,
							  )
							: Math.max(
									0,
									carsCurrent.get(exitEntrancePoint.index)! +
										joinedCarsCurrent.get(exitEntrancePoint.index)!,
							  ),
					);
					newCarsPrevious.set(
						exitEntrancePoint.index,
						leftCarsPrevious.get(exitEntrancePoint.index)! > 0
							? Math.max(
									0,
									carsPrevious.get(exitEntrancePoint.index)! -
										leftCarsPrevious.get(exitEntrancePoint.index)!,
							  )
							: Math.max(
									0,
									carsPrevious.get(exitEntrancePoint.index)! +
										joinedCarsPrevious.get(
											exitEntrancePoint.index,
										)!,
							  ),
					);
				}
				setCarsCurrent(newCarsCurrent);
				setCarsPrevious(newCarsPrevious);
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

	function getRoadForId(id: string, exitEntrancePoints: ExitEntrancePoint[]) {
		let road = null;
		for (const p of exitEntrancePoints) {
			if (p.id === id) {
				road = p;
				break;
			}
		}
		return road;
	}

	function getConnectionsIdxsForRoadIdx(index: number) {
		const connections: number[] = [];
		conRoad.forEach(function (value, key) {
			if (value == index) {
				connections.push(key);
			}
		});
		return connections;
	}

	function getWhichConnectionToGo(connectionsIdxs: number[]) {
		let chanceFloor = 0;
		let chanceCeil = 0;
		const randomNumber = Math.random();
		let chosenConnection = 0;

		for (const c of connectionsIdxs) {
			chanceCeil += conChances.get(c)!;
			if (chanceFloor < randomNumber && randomNumber <= chanceCeil) {
				chosenConnection = c;
				break;
			}
			chanceFloor += conChances.get(c)!;
		}
		return chosenConnection;
	}

	function isConnectionOpen(connection: number, lights: Map<number, LightColors>) {
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

	function restart() {
		setTimer(0);
		setRunning(false);
		setLightsCurrent(
			new Map(
				trafficLights.map((trafficLight) => [
					trafficLight.index,
					LightColors.YELLOW,
				]),
			),
		);
		setLightsPrevious(
			new Map(
				trafficLights.map((trafficLight) => [
					trafficLight.index,
					LightColors.YELLOW,
				]),
			),
		);
		setCarsCurrent(new Map(exitEntrancePoints.map((road) => [road.index, 0])));
		setCarsPrevious(new Map(exitEntrancePoints.map((road) => [road.index, 0])));
	}

	const ShowLight = (
		usedLights: TrafficLight[],
		lightsSeq: number[][],
		roadFlow: number,
		point: ExitEntrancePoint,
		cars: Map<number, number>,
		lights: Map<number, LightColors>,
		type: string,
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
						const usedLights: TrafficLight[] = roadsLights.get(
							point.index,
						)!;
						return ShowLight(
							usedLights,
							lightsSeqCurr,
							roadFlow.get(point.index)!,
							point,
							carsCurrent,
							lightsCurrent,
							"curr",
						);
					})}
				<CrossroadScreenshot
					src={crossroadImage}
					alt="Map screenshot"
				></CrossroadScreenshot>
				<SimulationVersionLabel>
					<SimulationVersion>
						Current lights' sequences simulation
					</SimulationVersion>
				</SimulationVersionLabel>
			</BorderedWorkaroundDiv>
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
						const usedLights: TrafficLight[] = roadsLights.get(
							point.index,
						)!;
						return ShowLight(
							usedLights,
							lightsSeqPrev,
							roadFlow.get(point.index)!,
							point,
							carsPrevious,
							lightsPrevious,
							"prev",
						);
					})}
				<SimulationVersionLabel>
					<SimulationVersion>
						Previous lights' sequences simulation
					</SimulationVersion>
				</SimulationVersionLabel>
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
				<StyledItemTd>
					<NeutralNegativeButton onClick={() => restart()}>
						Restart
					</NeutralNegativeButton>
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
