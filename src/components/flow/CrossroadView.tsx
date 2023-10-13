import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Collision,
	Connection,
	Crossroad,
	ExitEntrancePoint,
	OptimizationResults,
	TrafficLight,
} from "../../custom/CrossroadInterface";
import { Navbar } from "../additional/Navbar";
import { VideosList } from "./VideosList";
import { useLocation, useNavigate } from "react-router-dom";
import { PopUp } from "../additional/Modal/PopUp";
import { Backdrop } from "../additional/Modal/Backdrop";
import {
	BaseButtonLink,
	BaseLi,
	BaseUl,
	ButtonColors,
	Colors,
	PageHeader,
	ContainerDiv,
	ButtonsDiv,
	HorizontalDiv,
	ScrollableUl,
} from "../../styles/MainStyles";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { PositiveButton } from "../../styles/PositiveButton";
import { ButtonSettings, ConnectionMarker } from "../drawing-tool/ConnectionMarker";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider, Zoom } from "@mui/material";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { matchEEIPointTypeWithColor } from "../../custom/drawing-tool/AuxiliaryFunctions";
import {
	CROSSROAD_MODEL_TEMPLATE,
	tooltipTheme,
} from "../../custom/drawing-tool/AuxiliaryData";

export function CrossroadView() {
	const navigate = useNavigate();
	const location = useLocation();
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

	// useEffect(() => {
	// 	axios
	// 		.get<Crossroad[]>("/crossroad")
	// 		.then((response) => {
	// 			const crossingsData: Crossroad[] = response.data;
	// 			setCrossroad(
	// 				crossingsData.filter(
	// 					(crossroad) => crossroad.id === crossroadID,
	// 				)[0],
	// 			);
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 		});
	// }, []);

	useEffect(() => {
		const tmpCrossroad: Crossroad = JSON.parse(localStorage.getItem("crossroad")!); // tmp for overview development
		setCrossroad(tmpCrossroad);
	}, []); // useEffect here is deprecated

	const handleAddVideosButton = () => {
		if (crossroad !== null) {
			navigate("../../add-videos", {
				state: {
					crossroadId: crossroad.id,
					crossroadName: crossroad.name,
				},
			});
		}
	};

	const handleGoToResultsPanel = () => {
		if (crossroad !== null) {
			axios
				.get<OptimizationResults>(
					"/crossroad/" + crossroad.id + "/optimization/" + 1,
				)
				.then((response) => {
					const optimizationData: OptimizationResults = response.data;
					navigate("../../results-choice", {
						state: {
							results: optimizationData,
							crossroadName: crossroad.name,
							crossroadId: crossroad.id,
						},
					});
				})
				.catch((error) => {
					console.error(error);
				});
		} else {
			alert("Error when loading the crossroad!");
		}
	};

	const handleOptimizationOrder = () => {
		setShowLoadingModal(true);
	};

	return (
		<ContainerDiv>
			<Navbar />
			{showLoadingModal && crossroad !== null && (
				<>
					<PopUp
						textToDisplay={`Optimizing ${crossroad.name} crossroad.\nSit back and relax`}
						crossroadName={crossroad.name}
						crossroadId={crossroad.id}
					/>
					<Backdrop />
				</>
			)}
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
							return (
								<Tooltip
									key={point.index}
									title={
										<React.Fragment>
											<BaseUl>
												<BaseLi>id: {point.index}</BaseLi>
												<BaseLi>type: {point.type}</BaseLi>
												<BaseLi>street: {point.street}</BaseLi>
												<BaseLi>
													capacity:{" "}
													{point.capacity === -1
														? "infinity"
														: point.capacity}
												</BaseLi>
											</BaseUl>
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
			<HorizontalDiv>
				{trafficLights.length > 0 ? (
					<ScrollableUl height={40}>
						<BaseLi>
							<p>
								<strong>TrafficLights:</strong>
							</p>
						</BaseLi>
						{trafficLights.map((light) => (
							<BaseLi key={`${light.index}light`}>
								<p>
									<strong>Light name:</strong> {light.name}
								</p>
								<p>
									<strong>Type:</strong> {light.direction}
								</p>
							</BaseLi>
						))}
					</ScrollableUl>
				) : (
					<p>
						<strong>No traffic lights</strong>
					</p>
				)}
				{collisions.length > 0 ? (
					<ScrollableUl height={40}>
						<BaseLi>
							<p>
								<strong>Collisions:</strong>
							</p>
						</BaseLi>
						{collisions.map((col) => (
							<BaseLi key={col.id}>
								<p>
									<strong>name: </strong>
									{col.name}
								</p>
								<p>
									<strong>lights: </strong>
									{col.trafficLight1Id}&{col.trafficLight2Id}
								</p>
								<p>
									<strong>type: </strong>
									{col.type}
								</p>
							</BaseLi>
						))}
					</ScrollableUl>
				) : (
					<p>
						<strong>No collisions</strong>
					</p>
				)}
			</HorizontalDiv>
			<VideosList />
			<ButtonsDiv>
				<PositiveButton onClick={handleAddVideosButton}>
					Add new video for chosen crossroad
				</PositiveButton>
				<NeutralPositiveButton
					disabled={crossroadID === null}
					onClick={handleOptimizationOrder}
				>
					Order optimization and go to results choice panel
				</NeutralPositiveButton>
				<NeutralPositiveButton
					disabled={crossroadID === null}
					onClick={handleGoToResultsPanel}
				>
					Go to results choice panel
				</NeutralPositiveButton>
				<NeutralNegativeButton>
					<BaseButtonLink to="../../crossroad-list" relative="path">
						Go back to crossroads list
					</BaseButtonLink>
				</NeutralNegativeButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}
