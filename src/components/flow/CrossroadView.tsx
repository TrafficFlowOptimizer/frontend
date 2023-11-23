import React, { useEffect, useState } from "react";
import axios from "axios";
import { ExitEntrancePoint, TrafficLight } from "../../custom/CrossroadInterface";
import { Navbar } from "../additional/Navbar";
import { VideosList } from "./VideosList";
import { useLocation, useNavigate } from "react-router-dom";
import { OptimizationDeployer } from "../additional/Modal/OptimizationDeployer";
import { Backdrop } from "../additional/Modal/Backdrop";
import { ConnectionMarker } from "../drawing-tool/ConnectionMarker";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider, Zoom } from "@mui/material";
import {
	getUserJWTToken,
	matchEEIPointTypeWithColor,
} from "../../custom/drawing-tool/AuxiliaryFunctions";
import {
	TOOLTIP_ENTRANCE_DELAY,
	TOOLTIP_LEAVE_DELAY,
	tooltipTheme,
} from "../../custom/drawing-tool/AuxiliaryData";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import {
	BaseButtonLink,
	BaseLi,
	BaseUl,
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
import {
	CrossroadDescriptionResponse,
	ResponseCollision,
	ResponseConnection,
	ResponseCrossroad,
} from "../../custom/CrossRoadRestTypes";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useUserContext } from "../../custom/UserContext";

export function CrossroadView() {
	const { loggedUser } = useUserContext();
	const navigate = useNavigate();
	const location = useLocation();
	const crossroadID: string = location.state.crossroadID ?? true; //idea: just get crossroadID here and fetch it again (newest data and easier in routing)
	const [crossroad, setCrossroad] = useState<ResponseCrossroad | null>(null);
	const [showOptimizationDeploymentModal, setShowOptimizationDeploymentModal] =
		useState(false);

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
			.get<CrossroadDescriptionResponse>(`/crossroad/${crossroadID}`, {
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

				localStorage.setItem(
					"currConnections",
					JSON.stringify(crossingsData.connections),
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

	const handleAddVideosButton = () => {
		if (crossroad !== null) {
			navigate("../../add-videos", {
				state: {
					crossroad: crossroad,
					connections: connections,
				},
			});
		}
	};

	const handleGoToResultsPanel = () => {
		if (crossroad !== null) {
			navigate("../../results-choice", {
				state: {
					crossroadId: crossroad.id,
					crossroadName: crossroad.name,
					day: undefined,
					hour: undefined,
				},
			});
		} else {
			alert("Error when loading the crossroad!");
		}
	};

	const handleOptimizationOrder = () => {
		setShowOptimizationDeploymentModal(true);
	};

	const getElementsIndexBasedOnId = (
		elemId: string,
		elements: ExitEntrancePoint[] | ResponseConnection[],
	): number => {
		for (const elem of elements) {
			if (elem.id === elemId) {
				return elem.index;
			}
		}
		return -1;
	};

	return (
		<ContainerDiv>
			<Navbar />
			{showOptimizationDeploymentModal && crossroad !== null && (
				<>
					<OptimizationDeployer
						textToDisplay={`Optimizing ${crossroad.name} crossroad.\nSit back and relax`}
						crossroadName={crossroad.name}
						crossroadId={crossroad.id}
						onClose={() => {
							setShowOptimizationDeploymentModal(false);
						}}
					/>
					<Backdrop />
				</>
			)}
			{crossroad !== null ? (
				<>
					<PageHeader>{crossroad.name}</PageHeader>
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
										withTooltip={true}
										eeiPointsIndexes={[
											getElementsIndexBasedOnId(
												entrancePoint.id,
												exitEntrancePoints,
											),
											getElementsIndexBasedOnId(
												exitPoint.id,
												exitEntrancePoints,
											),
										]}
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
														<BaseLi>
															id: {point.index}
														</BaseLi>
														<BaseLi>
															type: {point.type}
														</BaseLi>
														<BaseLi>
															street: {point.name}
														</BaseLi>
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
											enterDelay={TOOLTIP_ENTRANCE_DELAY}
											leaveDelay={TOOLTIP_LEAVE_DELAY}
											arrow
										>
											<EEIPointMarker
												key={idx}
												color={matchEEIPointTypeWithColor(
													point.type,
												)}
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
											<strong>Light id:</strong> {light.index}
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
							<ThemeProvider theme={tooltipTheme}>
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
												<strong>connections: </strong>
												{getElementsIndexBasedOnId(
													col.connection1Id,
													connections,
												)}
												&
												{getElementsIndexBasedOnId(
													col.connection2Id,
													connections,
												)}
											</p>
											<p>
												<strong>
													Can lights be turned on at the same
													time:{" "}
												</strong>
												{col.bothLightsCanBeOn ? "Yes" : "No"}
											</p>
										</BaseLi>
									))}
								</ScrollableUl>
							</ThemeProvider>
						) : (
							<p>
								<strong>No collisions</strong>
							</p>
						)}
					</HorizontalDiv>
					<VideosList />
				</>
			) : (
				<Snackbar
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
					open={showFailureAlert}
				>
					<Alert variant="filled" severity="error">
						<strong>{failureMessage}</strong>
					</Alert>
				</Snackbar>
			)}
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
