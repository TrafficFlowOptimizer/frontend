import React, { useEffect, useState } from "react";
import { OptimizationResults } from "../../custom/OptimizationInterface";
import { Navbar } from "../additional/Navbar";
import { ResponseConnection } from "../../custom/CrossRoadRestTypes";

import { useLocation, useNavigate } from "react-router-dom";
import {
	BaseButtonLink,
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
	initConnections,
	initExitEntrancePoints,
	initCrossroad,
	initLights,
	initCollisions,
} from "../../assets/InitData";
import { initImage } from "../../assets/InitImage";
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
import { getConnectionNameFromIndex } from "../../custom/drawing-tool/AuxiliaryFunctions";
// import { initImage } from "../../assets/crossroad.png";

export type pauseButtonState = "paused" | "running";

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

const timeDelta = 300;
const lights = [
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
		1, 1, 1,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1,
	],
	[
		1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0,
		0, 0, 0,
	],
];
const carSpawningChances = [25, 25, 25, 50, 50, 50, 50, 50, 50, 25];

localStorage.setItem("crossroad", JSON.stringify(initCrossroad));
localStorage.setItem("trafficLights", JSON.stringify(initLights));
localStorage.setItem("eeiPoints", JSON.stringify(initExitEntrancePoints));
localStorage.setItem("connections", JSON.stringify(initConnections));
localStorage.setItem("collisions", JSON.stringify(initCollisions));
localStorage.setItem("crossroadMap", initImage);
// localStorage.setItem("crossroadImage", initImage);
// localStorage.setItem('eeiPoints',JSON.stringify(initExitEntrancePoints));

export function ResultsAsSimulation() {
	const location = useLocation();

	const crossroadName = location.state.crossroadName ?? null;
	const results: OptimizationResults = location.state.results ?? null;
	const crossroadId = location.state.crossroadId ?? null;
	const carFlows: number[] = location.state.car;

	const conFlowRatioPrev = Object.values(results.connectionsFlowRatioMapPrevious);
	const conFlowRatioCurr = Object.values(results.connectionsFlowRatioMapCurrent);
	const lightsSeqPrev: number[][] = Object.values(results.lightsSequenceMapPrevious);
	const lightsSeqCurr: number[][] = Object.values(results.lightsSequenceMapCurrent);
	const conLights: TrafficLight[][] = Object.values(results.connectionsLightsMap);
	const connectionsIndexes = Array.from(
		Object.keys(results.connectionsFlowRatioMapCurrent),
	);

	const crossroadConnections: ResponseConnection[] = JSON.parse(
		localStorage.getItem("currConnections")!,
	);

	const getConnectionLight = (conIdx: string) => {
		const newIdx = parseInt(conIdx) - 1;
		if (newIdx >= 0 && newIdx < conLights.length) {
			return conLights[newIdx];
		} else {
			return [];
		}
	};

	const getLightSequence = (lightIdx: number, lightsSeq: number[][]) => {
		const newIdx = lightIdx - 1;
		if (newIdx >= 0 && newIdx < lightsSeq.length) {
			return lightsSeq[newIdx];
		} else {
			return [];
		}
	};

	const all = location.state ?? true;

	const navigate = useNavigate();
	const crossroadID: string = location.state.crossroadID ?? true; //idea: just get crossroadID here and fetch it again (newest data and easier in routing)
	const [crossroad, setCrossroad] = useState<Crossroad>(
		JSON.parse(localStorage.getItem("crossroad")!),
	);
	const [showLoadingModal, setShowLoadingModal] = useState(false);

	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);

	const exitEntrancePoints: ExitEntrancePoint[] = JSON.parse(
		localStorage.getItem("eeiPoints")!,
	);
	const connections: Connection[] = JSON.parse(localStorage.getItem("connections")!);
	const trafficLights: TrafficLight[] = JSON.parse(
		localStorage.getItem("trafficLights")!,
	);
	const collisions: Collision[] = JSON.parse(localStorage.getItem("collisions")!);

	const [running, setRunning] = useState(false);

	const LightColor = (lightSequence: number[]) => {
		const lights = [LightColors.RED, LightColors.GREEN, LightColors.YELLOW];
		const [count, setColor] = useState(0);
		useEffect(() => {
			if (!running) {
				return;
			}
			const interval = setInterval(() => {
				setColor((count) => (count + 1) % lightSequence.length);
			}, timeDelta);
			return () => clearInterval(interval);
		}, [running]);
		return lights[lightSequence[count]];
	};

	const CarNumber = (
		spawnChance: number,
		spawnAmount: number,
		goAmount: number,
		canGo: boolean,
	) => {
		const [count, setNumber] = useState(0);

		useEffect(() => {
			if (!running) {
				return;
			}
			const interval = setInterval(() => {
				const prob = getRandomInt(100) + 1;
				if (prob < spawnChance && canGo) {
					setNumber((count) => Math.max(0, count + spawnAmount - goAmount));
				} else if (prob < spawnChance && !canGo) {
					setNumber((count) => count + spawnAmount);
				} else if (prob >= spawnChance && canGo) {
					setNumber((count) => Math.max(0, count - goAmount));
				}
			}, timeDelta);
			return () => clearInterval(interval);
		}, [spawnChance, spawnAmount, goAmount, canGo, running]);
		return count;
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
			<PageHeader>{crossroad.name}</PageHeader>

			<SimulationResultsUl>
				{connectionsIndexes.length > 0 ? (
					connectionsIndexes.map((connectionIndex, index) => (
						<SimulationResultsLi key={`Visualization#${index}`}>
							<SimulationResultsPanel>
								<CustomHeader topMargin={15} leftMargin={0}>
									Connection:
								</CustomHeader>
								<CustomParagraph topMargin={15}>
									{getConnectionNameFromIndex(
										crossroadConnections,
										connectionIndex,
									)}
								</CustomParagraph>
								<CustomHeader topMargin={15} leftMargin={0}>
									Cars passed to arrived ratio:
								</CustomHeader>
								<CustomParagraph topMargin={15}>
									{conFlowRatioCurr[parseInt(connectionIndex) - 1]}
								</CustomParagraph>
								<CustomHeader topMargin={15} leftMargin={0}>
									Previous ratio:
								</CustomHeader>
								{/* prettier-ignore */}
								<CustomParagraph topMargin={15}>
									{conFlowRatioPrev.length ===
									0
										? "No previous results"
										: conFlowRatioPrev[parseInt(connectionIndex)-1]}
								</CustomParagraph>
							</SimulationResultsPanel>
							{getConnectionLight(connectionIndex).length > 0 ? (
								getConnectionLight(connectionIndex).map((light) => (
									<LightResultsPanel
										key={`Light#${light.index}/inCon${connectionIndex}`}
									>
										<SingleInfoPanel>
											<CustomHeader topMargin={5} leftMargin={5}>
												Light:
											</CustomHeader>
											<CustomParagraph topMargin={5}>
												#{light.index}
											</CustomParagraph>
											<CustomHeader topMargin={5} leftMargin={5}>
												Direction:
											</CustomHeader>
											<CustomParagraph topMargin={5}>
												{light.direction}
											</CustomParagraph>
											<CustomHeader topMargin={5} leftMargin={5}>
												Current light sequence:
											</CustomHeader>
										</SingleInfoPanel>
										<SingleInfoPanel>
											<SequenceContainer>
												{getLightSequence(
													light.index,
													lightsSeqCurr,
												).map((elem, index) => (
													<StyledSequence
														key={index}
														isGreen={elem === 1}
													>
														<SequenceIndex>
															{index + 1}
														</SequenceIndex>
													</StyledSequence>
												))}
											</SequenceContainer>
										</SingleInfoPanel>
										<CustomHeader topMargin={5} leftMargin={5}>
											Previous light sequence:
										</CustomHeader>
										<SingleInfoPanel>
											<SequenceContainer>
												{
													/* prettier-ignore */
													lightsSeqPrev.length ===
													0
														? "No previous results"
														: getLightSequence(
															light.index,
															lightsSeqPrev,
														).map((elem, index) => (
															<StyledSequence
																key={index}
																isGreen={elem === 1}
															>
																<SequenceIndex>
																	{index + 1}
																</SequenceIndex>
															</StyledSequence>
														))
												}
											</SequenceContainer>
										</SingleInfoPanel>
									</LightResultsPanel>
								))
							) : (
								<li>Lights are empty</li>
							)}
						</SimulationResultsLi>
					))
				) : (
					<li>Results are empty</li>
				)}
			</SimulationResultsUl>
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
