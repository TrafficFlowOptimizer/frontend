import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Connection,
	Crossroad,
	EEIPointType,
	ExitEntrancePoint,
} from "../../custom/CrossroadInterface";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider, Zoom } from "@mui/material";
import {
	getNewId,
	matchEEIPointTypeWithColor,
} from "../../custom/drawing-tool/AuxiliaryFunctions";
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
} from "../../styles/MainStyles";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
	TooltipButton,
	InstructionP,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { InputInformationSpan } from "../additional/InputInformationSpan";
import { useThemeContext } from "../../custom/ThemeContext";
import {
	BASIC_INFORMATION_ERROR_MESSAGES,
	TOOLTIP_ENTRANCE_DELAY,
	TOOLTIP_LEAVE_DELAY,
	tooltipTheme,
} from "../../custom/drawing-tool/AuxiliaryData";
import { ButtonSettings, ConnectionMarker } from "./ConnectionMarker";

export function Connections() {
	const location = useLocation();
	const navigate = useNavigate();
	const { theme } = useThemeContext();

	const crossroad: Crossroad = location.state.crossroad;
	const exitEntrancePoints: ExitEntrancePoint[] = location.state.entrancesAndExits;

	const [nameInput, setNameInput] = useState("");

	const [isInputValid, setInputValidity] = useState(false);
	const [dataMessage, setDataMessage] = useState("");
	const [point1ChoiceStatus, setPoint1ChoiceStatus] = useState("Source: None");
	const [point2ChoiceStatus, setPoint2ChoiceStatus] = useState("Target: None");

	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);

	const [chosenPoint1, setChosenPoint1] = useState<number | null>(null);
	const [chosenPoint2, setChosenPoint2] = useState<number | null>(null);
	const [connections, setConnections] = useState<Connection[]>([]);

	const [firstFreeId, setFirstFreeId] = useState(1);

	const [showConnectionsTooltips, setShowConnectionsTooltips] = useState(true);

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
				connections: connections.map((con, index) => ({
					...con,
					index: index + 1,
				})),
			},
		});
	};

	const onRemoveFromChosen = (whichOne: 1 | 2) => {
		if (whichOne === 1) {
			setChosenPoint1(null);
		} else {
			setChosenPoint2(null);
		}

		if (chosenPoint2 === null && chosenPoint1 === null) {
			setShowConnectionsTooltips(true);
		}
	};

	const onAddToChosen = (whichOne: 1 | 2, pointIndex: number) => {
		if (whichOne === 1) {
			setChosenPoint1(pointIndex);
		} else {
			setChosenPoint2(pointIndex);
		}
	};

	const getFreeChoicePoint = (pointType: EEIPointType) => {
		if (chosenPoint1 === null && pointType !== "EXIT") {
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
			name: { value: string };
		};

		if (target.name.value.length === 0) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.zero_length);
		} else if (checkForRepliedConnection()) {
			setInputValidity(false);
			setDataMessage("This connection has already been created");
		} else if (chosenPoint2 !== null && chosenPoint1 !== null) {
			setShowConnectionsTooltips(true);
			setConnections([
				...connections,
				{
					id: "",
					index: getNewId(firstFreeId, setFirstFreeId),
					name: target.name.value,
					trafficLightIds: [],
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
			setNameInput("");
		}
	};

	const checkForRepliedConnection = () => {
		for (const con of connections) {
			if (con.sourceId === chosenPoint1 && con.targetId === chosenPoint2) {
				return true;
			}
		}
		return false;
	};

	const removeConnection = (connectionIndex: number) => {
		setConnections(connections.filter((con) => con.index !== connectionIndex));
	};

	const getChooseButton = (pointIndex: number, pointType: EEIPointType) => {
		const pointNumber = getFreeChoicePoint(pointType);
		return (
			<TooltipButton
				color={ButtonColors.GREEN}
				yCord={0}
				xCord={0}
				onClick={() => {
					onAddToChosen(pointNumber, pointIndex);
					setShowConnectionsTooltips(false);
				}}
			>
				ADD AS {pointNumber === 1 ? "SOURCE" : "TARGET"}
			</TooltipButton>
		);
	};

	return (
		<ContainerDiv>
			<InstructionP>
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
			</InstructionP>
			<BorderedWorkaroundDiv>
				{connections.length > 0 &&
					connections.map((con) => {
						const entrancePoint = exitEntrancePoints.filter(
							(point) => point.index === con.sourceId,
						)[0];
						const exitPoint = exitEntrancePoints.filter(
							(point) => point.index === con.targetId,
						)[0];

						const buttonSettings: ButtonSettings = {
							onButtonClickAction: () => {
								removeConnection(con.index);
							},
							buttonText: "REMOVE CONNECTION",
							buttonColor: ButtonColors.RED,
						};

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
								withLightIds={false}
								withTooltip={showConnectionsTooltips}
								buttonSettings={buttonSettings}
							/>
						);
					})}
				{exitEntrancePoints.length > 0 && (
					<ThemeProvider theme={tooltipTheme}>
						{exitEntrancePoints.map((point, idx) => (
							<Tooltip
								key={idx}
								title={
									<React.Fragment>
										<BaseUl>
											<BaseLi>id: {point.index}</BaseLi>
											<BaseLi>type: {point.type}</BaseLi>
											<BaseLi>street: {point.name}</BaseLi>
											<BaseLi>
												capacity:{" "}
												{point.capacity === -1
													? "infinity"
													: point.capacity}
											</BaseLi>
										</BaseUl>
										<ButtonsDiv>
											{chosenPoint1 === point.index && (
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
											{chosenPoint2 === point.index && (
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
											{point.type !== "EXIT" &&
												point.type !== "INTERMEDIATE" &&
												chosenPoint1 === null &&
												getChooseButton(
													point.index,
													point.type,
												)}
											{point.type !== "ENTRANCE" &&
												point.type !== "INTERMEDIATE" &&
												chosenPoint2 === null &&
												getChooseButton(
													point.index,
													point.type,
												)}
											{point.type === "INTERMEDIATE" &&
												(chosenPoint1 === null ||
													chosenPoint2 === null) &&
												chosenPoint2 !== point.index &&
												chosenPoint1 !== point.index &&
												getChooseButton(
													point.index,
													point.type,
												)}
										</ButtonsDiv>
									</React.Fragment>
								}
								TransitionComponent={Zoom}
								enterDelay={TOOLTIP_ENTRANCE_DELAY}
								leaveDelay={TOOLTIP_LEAVE_DELAY}
								arrow
							>
								<EEIPointMarker
									key={idx}
									color={
										chosenPoint1 === point.index ||
										chosenPoint2 === point.index
											? Colors.PURPLE
											: matchEEIPointTypeWithColor(point.type)
									}
									yCord={point.yCord}
									xCord={point.xCord}
								></EEIPointMarker>
							</Tooltip>
						))}{" "}
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
