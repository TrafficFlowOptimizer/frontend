import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Connection,
	Crossroad,
	ExitEntrancePoint,
} from "../../custom/CrossroadInterface";
import Tooltip from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import { matchEEIPointTypeWithColor } from "../../custom/drawing-tool/AuxiliaryFunctions";
import {
	BaseForm,
	BaseInput,
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	Colors,
	ContainerDiv,
	HorizontalBaseUl,
} from "../../styles/MainTheme";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
	TooltipButton,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { InputInformationSpan } from "../additional/InputInformationSpan";
import { useThemeContext } from "../../custom/ThemeContext";
import { BASIC_INFORMATION_ERROR_MESSAGES } from "../../custom/drawing-tool/AuxiliaryData";
import { ConnectionMarker } from "./ConnectionMarker";

export function Connections() {
	const location = useLocation();
	const navigate = useNavigate();
	const { theme } = useThemeContext();

	const crossroad: Crossroad = location.state.crossroad;
	const exitEntrancePoints: ExitEntrancePoint[] = location.state.entrancesAndExits;

	const [idInput, setIdInput] = useState("");
	const [nameInput, setNameInput] = useState("");

	const [isInputValid, setInputValidity] = useState(false);
	const [dataMessage, setDataMessage] = useState("");
	const [point1ChoiceStatus, setPoint1ChoiceStatus] = useState("Source: None");
	const [point2ChoiceStatus, setPoint2ChoiceStatus] = useState("Target: None");

	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);

	const [chosenPoint1, setChosenPoint1] = useState<string | null>(null);
	const [chosenPoint2, setChosenPoint2] = useState<string | null>(null);
	const [connections, setConnections] = useState<Connection[]>([]);

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []);

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	const onNext = () => {
		navigate("../traffic-lights", {
			state: {
				crossroad: crossroad,
				entrancesAndExits: exitEntrancePoints,
			},
		});
	};

	const onRemoveFromChosen = (whichOne: 1 | 2) => {
		if (whichOne === 1) {
			setChosenPoint1(null);
		} else {
			setChosenPoint2(null);
		}
	};

	const onAddToChosen = (whichOne: 1 | 2, pointId: string) => {
		if (whichOne === 1) {
			setChosenPoint1(pointId);
		} else {
			setChosenPoint2(pointId);
		}
	};

	const getFreeChoicePoint = (pointType: "exit" | "entrance" | "intermediate") => {
		if (chosenPoint1 === null && pointType !== "exit") {
			return 1;
		} else {
			return 2;
		}
	};

	useEffect(() => {
		if (chosenPoint1 !== null) {
			setPoint1ChoiceStatus(`Source: ${chosenPoint1}`);
		} else {
			setPoint1ChoiceStatus("Source: None");
		}
		if (chosenPoint2 !== null) {
			setPoint2ChoiceStatus(`Target: ${chosenPoint2}`);
		} else {
			setPoint2ChoiceStatus("Target: None");
		}
	}, [chosenPoint1, chosenPoint2]);

	const onConfirm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		const target = event.target as typeof event.target & {
			id: { value: string };
			name: { value: string };
		};

		if (target.id.value.length === 0 || target.name.value.length === 0) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.zero_length);
		} else if (checkId(target.id.value)) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.used_id);
		} else if (checkForRepliedConnection()) {
			setInputValidity(false);
			setDataMessage("This connection has already been created");
		} else if (chosenPoint2 !== null && chosenPoint1 !== null) {
			setConnections([
				...connections,
				{
					id: target.id.value,
					name: target.name.value,
					trafficLightIDs: [],
					sourceId: chosenPoint1,
					targetId: chosenPoint2,
				},
			]);

			setPoint1ChoiceStatus("Source: None");
			setPoint2ChoiceStatus("Target: None");
			setInputValidity(true);
			setDataMessage("New connection added!");
			setChosenPoint1(null);
			setChosenPoint2(null);
			setIdInput("");
			setNameInput("");
		}
	};

	const checkId = (id: string) => {
		for (const tempConnection of connections) {
			if (tempConnection.id === id) {
				return true;
			}
		}
		return false;
	};

	const checkForRepliedConnection = () => {
		for (const con of connections) {
			if (con.sourceId === chosenPoint1 && con.targetId === chosenPoint2) {
				return true;
			}
		}
		return false;
	};

	const removeConnection = (connectionId: string) => {
		setConnections(connections.filter((con) => con.id !== connectionId));
	};

	const getChooseButton = (
		pointId: string,
		pointType: "exit" | "entrance" | "intermediate",
	) => {
		const pointNumber = getFreeChoicePoint(pointType);
		return (
			<TooltipButton
				color={ButtonColors.GREEN}
				yCord={0}
				xCord={0}
				onClick={() => {
					onAddToChosen(pointNumber, pointId);
				}}
			>
				ADD AS {pointNumber === 1 ? "SOURCE" : "TARGET"}
			</TooltipButton>
		);
	};

	return (
		<ContainerDiv>
			<p>
				<strong>Connections</strong>
				<br />
				Please follow these steps:
				<br />
				1. Click on the map on two Exit/Entrance/Intermediate points to create a
				connection between them. <br />
				The direction of the connection is decided by order in which you clicked
				the EEI points
				<br />
				2. Fill-in the name and id fields and save the connection
				<br />
				3. Repeat steps 1-2 for all connections you need
			</p>
			<BorderedWorkaroundDiv>
				{/*TODO: tooltip for connections - positioning if possible*/}
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
								key={con.id}
								thickness={3}
								entranceX={entrancePoint.xCord}
								entranceY={entrancePoint.yCord}
								exitX={exitPoint.xCord}
								exitY={exitPoint.yCord}
								connection={con}
								removeConnection={() => {
									removeConnection(con.id);
								}}
							/>
						);
					})}
				{exitEntrancePoints.length > 0 &&
					exitEntrancePoints.map((point, idx) => (
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
									<ButtonsDiv>
										{chosenPoint1 === point.id && (
											<TooltipButton
												color={ButtonColors.RED}
												yCord={0}
												xCord={0}
												onClick={() => {
													onRemoveFromChosen(1);
												}}
											>
												REMOVE FROM CONNECTION
											</TooltipButton>
										)}
										{chosenPoint2 === point.id && (
											<TooltipButton
												color={ButtonColors.RED}
												yCord={0}
												xCord={0}
												onClick={() => {
													onRemoveFromChosen(2);
												}}
											>
												REMOVE FROM CONNECTION
											</TooltipButton>
										)}
										{point.type !== "exit" &&
											point.type !== "intermediate" &&
											chosenPoint1 === null &&
											getChooseButton(point.id, point.type)}
										{point.type !== "entrance" &&
											point.type !== "intermediate" &&
											chosenPoint2 === null &&
											getChooseButton(point.id, point.type)}
										{point.type === "intermediate" &&
											(chosenPoint1 === null ||
												chosenPoint2 === null) &&
											chosenPoint2 !== point.id &&
											chosenPoint1 !== point.id &&
											getChooseButton(point.id, point.type)}
										{/*{((chosenPoint1 == null &&*/}
										{/*	point.type !== "exit") ||*/}
										{/*	(chosenPoint2 == null &&*/}
										{/*		point.type !== "entrance")) &&*/}
										{/*	getChooseButton(point.id, point.type)}*/}
									</ButtonsDiv>
								</React.Fragment>
							}
							TransitionComponent={Zoom}
							enterDelay={75}
							leaveDelay={450}
							arrow
						>
							<EEIPointMarker
								key={idx}
								color={
									chosenPoint1 === point.id ||
									chosenPoint2 === point.id
										? Colors.PURPLE
										: matchEEIPointTypeWithColor(point.type)
								}
								yCord={point.yCord}
								xCord={point.xCord}
							></EEIPointMarker>
						</Tooltip>
					))}
				<CrossroadScreenshot
					src={
						crossroadImage === undefined
							? localStorage.getItem("crossroadMap")!
							: crossroadImage
					}
					alt="Map screenshot"
				></CrossroadScreenshot>
			</BorderedWorkaroundDiv>
			<InputInformationSpan
				dataMessage={point1ChoiceStatus}
				isInputValid={true}
				positiveColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
				negativeColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
			/>
			<InputInformationSpan
				dataMessage={point2ChoiceStatus}
				isInputValid={true}
				positiveColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
				negativeColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
			/>
			<BaseForm onSubmit={onConfirm}>
				<HorizontalBaseUl>
					<BaseLi>
						<label htmlFor="id">ID:</label>
						<BaseInput
							id="id"
							type="text"
							value={idInput}
							onChange={(e) => {
								setIdInput(e.target.value);
							}}
							disabled={chosenPoint1 === null || chosenPoint2 === null}
						/>
					</BaseLi>
					<BaseLi>
						<label htmlFor="name">Name:</label>
						<BaseInput
							id="name"
							type="text"
							value={nameInput}
							onChange={(e) => {
								setNameInput(e.target.value);
							}}
							disabled={chosenPoint1 === null || chosenPoint2 === null}
						/>
					</BaseLi>
				</HorizontalBaseUl>
				<NeutralPositiveButton
					type="submit"
					disabled={chosenPoint1 === null || chosenPoint2 === null}
				>
					Add connection
				</NeutralPositiveButton>
				<InputInformationSpan
					dataMessage={dataMessage}
					isInputValid={isInputValid}
					positiveColor={ButtonColors.GREEN}
					negativeColor={ButtonColors.RED}
				/>
			</BaseForm>
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
				<PositiveButton onClick={onNext}>Next</PositiveButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}
