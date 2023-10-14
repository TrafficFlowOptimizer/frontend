import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Collision,
	Connection,
	Crossroad,
	ExitEntrancePoint,
	TrafficLight,
} from "../../custom/CrossroadInterface";
import { ButtonSettings, ConnectionMarker } from "./ConnectionMarker";
import {
	getConnectionName,
	getNewId,
	matchEEIPointTypeWithColor,
} from "../../custom/drawing-tool/AuxiliaryFunctions";
import { InputInformationSpan } from "../additional/InputInformationSpan";
import { useThemeContext } from "../../custom/ThemeContext";
import { Backdrop } from "../additional/Modal/Backdrop";
import { WaitingPopUp } from "../additional/Modal/WaitingPopUp";
import { Checkbox } from "../additional/Checkbox";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import {
	BaseForm,
	BaseInput,
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	Colors,
} from "../../styles/MainStyles";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	BASIC_INFORMATION_ERROR_MESSAGES,
	LIGHTS_TURNED_ON_COLLISION_DESCRIPTION,
} from "../../custom/drawing-tool/AuxiliaryData";
import {
	NeutralNegativeButton,
	NeutralPositiveButton,
} from "../../styles/NeutralButton";
import { ContainerDiv } from "../../styles/MainStyles";
import { InstructionP } from "../../styles/drawing-tool-styles/GeneralStyles";

export function Collisions() {
	const { theme } = useThemeContext();
	const navigate = useNavigate();
	const location = useLocation();

	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);
	const firstConnectionMark = "1st connection:";
	const secondConnectionMark = "2nd connection:";

	const crossroad: Crossroad = location.state.crossroad;
	const exitEntrancePoints: ExitEntrancePoint[] = location.state.entrancesAndExits;
	const connections: Connection[] = location.state.connections;
	const trafficLights: TrafficLight[] = location.state.trafficLights;

	const [collisions, setCollisions] = useState<Collision[]>([]);

	const [isInputValid, setInputValidity] = useState(false);
	const [dataMessage, setDataMessage] = useState("");
	const [showWaitingModal, setShowWaitingModal] = useState(false);

	const [connection1ChoiceStatus, setConnection1ChoiceStatus] = useState(
		`${firstConnectionMark} None`,
	);
	const [connection2ChoiceStatus, setConnection2ChoiceStatus] = useState(
		`${secondConnectionMark} None`,
	);
	const [chosenConnection1, setChosenConnection1] = useState<string | null>(null);
	const [chosenConnection2, setChosenConnection2] = useState<string | null>(null);

	const [firstFreeId, setFirstFreeId] = useState(1);

	const [nameInput, setNameInput] = useState("");
	const [canBothLightsBeOn, setCanBothLightsBeOn] = useState(false);

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []); //This is a deprecated way to do this, should be addressed in the next refactor

	const checkForRepliedCollision = () => {
		for (const col of collisions) {
			if (
				(col.connection1Id === chosenConnection1 &&
					col.connection2Id === chosenConnection2) ||
				(col.connection1Id === chosenConnection2 &&
					col.connection2Id === chosenConnection1)
			) {
				return true;
			}
		}
		return false;
	};

	const onSave = () => {
		setCollisions(
			collisions.map((col, index) => ({ ...col, index: (index + 1).toString() })),
		);
		//TODO: save screenshot and Crossroad, EEIPoints, Connections, Lights, Collisions to DB (BE endpoint)
		crossroad.roadIds = exitEntrancePoints.map((eeiPoint) => eeiPoint.index);
		crossroad.connectionIds = connections.map((con) => con.index);
		crossroad.trafficLightIds = trafficLights.map((tl) => tl.index);
		crossroad.collisionsIds = collisions.map((col) => col.index);

		//TMP
		localStorage.setItem("crossroad", JSON.stringify(crossroad));
		localStorage.setItem("eeiPoints", JSON.stringify(exitEntrancePoints));
		localStorage.setItem("connections", JSON.stringify(connections));
		localStorage.setItem("trafficLights", JSON.stringify(trafficLights));
		localStorage.setItem("collisions", JSON.stringify(collisions));

		setShowWaitingModal(true);
	};

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	const onConfirm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		const target = event.target as typeof event.target & {
			name: { value: string };
		};

		if (target.name.value.length === 0) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.zero_length);
		} else if (checkForRepliedCollision()) {
			setInputValidity(false);
			setDataMessage("This collision has already been created");
		} else if (chosenConnection2 !== null && chosenConnection1 !== null) {
			setCollisions([
				...collisions,
				{
					id: "",
					index: getNewId(firstFreeId, setFirstFreeId),
					name: target.name.value,
					bothLightsCanBeOn: canBothLightsBeOn,
					connection1Id: chosenConnection1,
					connection2Id: chosenConnection2,
				},
			]);

			setConnection1ChoiceStatus(`${firstConnectionMark} None`);
			setConnection2ChoiceStatus(`${secondConnectionMark} None`);
			setInputValidity(true);
			setDataMessage("New collision added!");
			setChosenConnection1(null);
			setChosenConnection2(null);
			setNameInput("");
			setCanBothLightsBeOn(false);
		}
	};

	const onResetCollision = () => {
		setChosenConnection1(null);
		setChosenConnection2(null);
		setConnection1ChoiceStatus(`${firstConnectionMark} None`);
		setConnection2ChoiceStatus(`${secondConnectionMark} None`);
		setNameInput("");
		setDataMessage("Confirm your inputs!");
	};

	const saveConnectionAssignment = (connectionId: string) => {
		if (chosenConnection1 === null) {
			setChosenConnection1(connectionId);
			setConnection1ChoiceStatus(
				`${firstConnectionMark} id->${connectionId}; name->${getConnectionName(
					connections,
					connectionId,
				)}`,
			);
		} else {
			setChosenConnection2(connectionId);
			setConnection2ChoiceStatus(
				`${secondConnectionMark} id->${connectionId}; name->${getConnectionName(
					connections,
					connectionId,
				)}`,
			);
		}
	};

	const onRemoveCollision = (collisionIndex: string) => {
		setCollisions(collisions.filter((col) => col.index !== collisionIndex));
	};

	return (
		<ContainerDiv>
			{showWaitingModal && (
				<>
					<WaitingPopUp
						textToDisplay={"Saving new crossroad..."}
						waitingTime={2}
						whereToNavigate={"../../crossroad-list"}
					/>
					<Backdrop />
				</>
			)}
			<InstructionP>
				<strong>Collisions</strong>
				<br />
				Please follow these steps:
				<br />
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				1. Hover on connection to choose one of it for collision. Repeat this
				step twice for one collision.
				<br />
				2. When both connections are chosen fill the name input and choose if
				for those two their lights can be on at the same time (checkbox). If you
				made a mistake picking connections you can always reset your
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				choices with 'Reset collision' button
				<br />
				3. Repeat steps 1-2 until you have all collisions you wanted.
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
								saveConnectionAssignment(con.index);
							},
							buttonText: `Choose as ${
								chosenConnection1 === null ? "1st" : "2nd"
							} connection`,
							buttonColor: ButtonColors.BLUE,
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
								color={
									chosenConnection1 === con.index ||
									chosenConnection2 === con.index
										? Colors.PURPLE
										: Colors.BRIGHT_RED
								}
								withLightIds={true}
								withTooltip={true}
								buttonSettings={
									chosenConnection1 !== con.index &&
									chosenConnection2 !== con.index
										? buttonSettings
										: undefined
								}
							/>
						);
					})}
				{exitEntrancePoints.length > 0 &&
					exitEntrancePoints.map((point, idx) => {
						return (
							<EEIPointMarker
								key={idx}
								color={matchEEIPointTypeWithColor(point.type)}
								yCord={point.yCord}
								xCord={point.xCord}
							></EEIPointMarker>
						);
					})}
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
				dataMessage={connection1ChoiceStatus}
				isInputValid={true}
				positiveColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
				negativeColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
			/>
			<InputInformationSpan
				dataMessage={connection2ChoiceStatus}
				isInputValid={true}
				positiveColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
				negativeColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
			/>
			<BaseForm onSubmit={onConfirm}>
				<BaseUl>
					<BaseLi>
						<label htmlFor="name">Name:</label>
						<BaseInput
							id="name"
							type="text"
							value={nameInput}
							onChange={(e) => {
								setNameInput(e.target.value);
							}}
							disabled={
								chosenConnection1 === null || chosenConnection2 === null
							}
						/>
					</BaseLi>
					<BaseLi>
						<Checkbox
							label={"Lights can be turned on at the same time"}
							description={LIGHTS_TURNED_ON_COLLISION_DESCRIPTION}
							withTooltip={true}
							isChecked={canBothLightsBeOn}
							disabled={
								chosenConnection1 === null || chosenConnection2 === null
							}
							onChangeAction={setCanBothLightsBeOn}
						/>
					</BaseLi>
				</BaseUl>
				<ButtonsDiv>
					<NeutralPositiveButton
						type="submit"
						disabled={
							chosenConnection1 === null || chosenConnection2 === null
						}
					>
						Add collision
					</NeutralPositiveButton>
					<NeutralNegativeButton
						onClick={onResetCollision}
						disabled={
							chosenConnection1 === null && chosenConnection2 === null
						}
					>
						Reset collision
					</NeutralNegativeButton>
				</ButtonsDiv>
				<InputInformationSpan
					dataMessage={dataMessage}
					isInputValid={isInputValid}
					positiveColor={ButtonColors.GREEN}
					negativeColor={ButtonColors.RED}
				/>
			</BaseForm>
			{collisions.length > 0 && (
				<BaseUl>
					{collisions.map((col) => (
						<BaseLi key={col.index}>
							<p>
								<strong>name: </strong>
								{col.name}
							</p>
							<p>
								<strong>connections: </strong>
								{col.connection1Id}&{col.connection2Id}
							</p>
							<p>
								<strong>
									Can lights be turned on at the same time:{" "}
								</strong>
								{col.bothLightsCanBeOn ? "Yes" : "No"}
							</p>
							<NegativeButton
								onClick={() => onRemoveCollision(col.index)}
							>
								Remove
							</NegativeButton>
						</BaseLi>
					))}
				</BaseUl>
			)}
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
				<PositiveButton onClick={onSave}>Save & Proceed</PositiveButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}
