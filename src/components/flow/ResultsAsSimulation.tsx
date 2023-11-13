import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../additional/Navbar";
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
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { ConnectionMarker } from "../drawing-tool/ConnectionMarker";
import { ThemeProvider } from "@mui/material";
import {
	CROSSROAD_MODEL_TEMPLATE,
	tooltipTheme,
} from "../../custom/drawing-tool/AuxiliaryData";
import { VideosList } from "./VideosList";
import {
	Collision,
	Connection,
	Crossroad,
	ExitEntrancePoint,
	TrafficLight,
} from "../../custom/CrossroadInterface";
import { StyledItemTd } from "../../styles/CrossroadListStyles";
import { tableCrossroadState } from "./ListOfCrossroads";
import {
	initConnections,
	initExitEntrancePoints,
	initCrossroad,
	initLights,
	initCollisions,
} from "../../assets/InitData";
import { initImage } from "../../assets/InitImage";
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
			<BorderedWorkaroundDiv>
				{connections.length > 0 &&
					connections.map((con) => {
						const entrancePoint = exitEntrancePoints.filter(
							// (point) => point.id === con.sourceId, <- final version, after BE changes
							(point) => point.index === con.sourceId,
						)[0];
						const exitPoint = exitEntrancePoints.filter(
							// (point) => point.id === con.targetId, <- final version, after BE changes
							(point) => point.index === con.targetId,
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
							if (point.type == "EXIT") {
								return (
									<div key={idx}>
										<EEIPointMarker
											key={idx}
											color={LightColors.BLACK}
											yCord={point.yCord}
											xCord={point.xCord}
										>
											<SimulationNumbers>{""}</SimulationNumbers>
										</EEIPointMarker>
									</div>
								);
							} else {
								const usedLightsIDs = new Set();
								console.log(point.index);
								for (const connection of connections) {
									console.log("connection: ", connection.index);
									if (connection.sourceId == point.index) {
										for (const trafficLightID of connection.trafficLightIds) {
											console.log(trafficLightID);
											usedLightsIDs.add(Number(trafficLightID));
										}
									}
								}
								console.log(usedLightsIDs);
								if (usedLightsIDs.size == 1) {
									const lightColor = LightColor(lights[idx]);
									const carNumber = CarNumber(
										carSpawningChances[idx],
										1,
										2,
										lightColor != LightColors.RED,
									);
									return (
										<div key={idx}>
											<EEIPointMarker
												key={idx}
												color={lightColor}
												yCord={point.yCord}
												xCord={point.xCord}
											>
												<SimulationNumbers>
													{carNumber}
												</SimulationNumbers>
											</EEIPointMarker>
										</div>
									);
								} else if (usedLightsIDs.size == 2) {
									const values = usedLightsIDs.values();
									let obj = values.next();
									const first = obj.value;
									obj = values.next();
									const second = obj.value;

									const lightColor1 = LightColor(lights[first]);
									const carNumber1 = CarNumber(
										carSpawningChances[first],
										1,
										2,
										lightColor1 != LightColors.RED,
									);
									const lightColor2 = LightColor(lights[second]);
									const carNumber2 = CarNumber(
										carSpawningChances[second],
										1,
										2,
										lightColor2 != LightColors.RED,
									);
									console.log(first, second);
									return (
										<div key={idx}>
											<EEIPointMarker
												key={idx}
												color={lightColor1}
												yCord={point.yCord}
												xCord={point.xCord}
											>
												<SimulationNumbers>
													{carNumber1 + carNumber2}
												</SimulationNumbers>
											</EEIPointMarker>
											<EEIPointMarker
												key={idx}
												color={lightColor2}
												yCord={point.yCord}
												xCord={point.xCord + 15}
											></EEIPointMarker>
										</div>
									);
								}
							}
						})}
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
