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
} from "../../styles/MainStyles";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
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

export const LightColor = (lightSequence: number[]) => {
	const lights = [LightColors.RED, LightColors.GREEN, LightColors.YELLOW];
	const [count, setColor] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setColor((count) => (count + 1) % lightSequence.length);
		}, timeDelta);
		return () => clearInterval(interval);
	}, []);
	return lights[lightSequence[count]];
};

export const CarNumber = (
	spawnChance: number,
	spawnAmount: number,
	goAmount: number,
	canGo: boolean,
) => {
	const [count, setNumber] = useState(0);

	useEffect(() => {
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
	}, [spawnChance, spawnAmount, goAmount, canGo]);
	return <h3>{count}</h3>;
};

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

const timeDelta = 100;
const lights = [
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1,
	],
];
const carSpawningChances = [25, 75];

export function ResultsAsSimulation() {
	const location = useLocation();
	const all = location.state ?? true;

	const navigate = useNavigate();
	const crossroadID: string = location.state.crossroadID ?? true; //idea: just get crossroadID here and fetch it again (newest data and easier in routing)
	const [crossroad, setCrossroad] = useState<Crossroad>(CROSSROAD_MODEL_TEMPLATE);
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
							/>
						);
					})}

				{exitEntrancePoints.length > 0 && (
					<ThemeProvider theme={tooltipTheme}>
						{exitEntrancePoints.map((point, idx) => {
							let color;
							let carNumber;
							if (point.type != "exit") {
								color = LightColor(lights[idx / 2]);
								carNumber = CarNumber(
									carSpawningChances[idx / 2],
									1,
									2,
									color != LightColors.RED,
								);
							} else {
								color = LightColors.BLACK;
								carNumber = <h1>{}</h1>;
							}

							return (
								<div key={idx}>
									<EEIPointMarker
										key={idx}
										color={color}
										yCord={point.yCord}
										xCord={point.xCord}
									>
										{carNumber}
									</EEIPointMarker>
								</div>
							);
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
