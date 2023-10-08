import React, { useEffect, useState } from "react";
import {
	BaseForm,
	BaseInput,
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	Colors,
} from "../../styles/MainTheme";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Collision,
	CollisionType,
	Connection,
	Crossroad,
	ExitEntrancePoint,
	TrafficLight,
} from "../../custom/CrossroadInterface";
import {
	BorderedWorkaroundDiv,
	CrossroadScreenshot,
	EEIPointMarker,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { ButtonSettings, ConnectionMarker } from "./ConnectionMarker";
import Tooltip from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import {
	getTrafficLightName,
	matchEEIPointTypeWithColor,
} from "../../custom/drawing-tool/AuxiliaryFunctions";
import { InputInformationSpan } from "../additional/InputInformationSpan";
import { useThemeContext } from "../../custom/ThemeContext";
import { TwoChoicesToggle } from "../additional/TwoChoicesToggle";
import { Backdrop } from "../additional/Modal/Backdrop";
import { CollisionLightAssigner } from "../additional/Modal/drawing-tool-creators/CollisionLightAssigner";
import {
	BASIC_INFORMATION_ERROR_MESSAGES,
	HEAVY_COLLISION_DESCRIPTION,
	LIGHT_COLLISION_DESCRIPTION,
} from "../../custom/drawing-tool/AuxiliaryData";
import {
	NeutralNegativeButton,
	NeutralPositiveButton,
} from "../../styles/NeutralButton";
import { ContainerDiv } from "../../styles/MainTheme";
import { WaitingPopUp } from "../additional/Modal/WaitingPopUp";

export function Collisions() {
	const { theme } = useThemeContext();
	const navigate = useNavigate();
	const location = useLocation();

	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);
	const firstLightMark = "1st light:";
	const secondLightMark = "2nd light:";

	const crossroad: Crossroad = location.state.crossroad;
	const exitEntrancePoints: ExitEntrancePoint[] = location.state.entrancesAndExits;
	const connections: Connection[] = location.state.connections;
	const trafficLights: TrafficLight[] = location.state.trafficLights;

	const [collisions, setCollisions] = useState<Collision[]>([]);
	const [templateTrafficLights, setTemplateTrafficLights] = useState<TrafficLight[]>(
		[],
	);

	const [isInputValid, setInputValidity] = useState(false);
	const [dataMessage, setDataMessage] = useState("");
	const [showCollisionAssigner, setShowCollisionAssigner] = useState(false);
	const [showWaitingModal, setShowWaitingModal] = useState(false);

	const [light1ChoiceStatus, setLight1ChoiceStatus] = useState(
		`${firstLightMark} None`,
	);
	const [light2ChoiceStatus, setLight2ChoiceStatus] = useState(
		`${secondLightMark} None`,
	);
	const [chosenLight1, setChosenLight1] = useState<string | null>(null);
	const [chosenLight2, setChosenLight2] = useState<string | null>(null);

	const [firstFreeId, setFirstFreeId] = useState(1);

	const [nameInput, setNameInput] = useState("");
	const [collisionType, setCollisionType] = useState(CollisionType.HEAVY);

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []); //This is a deprecated way to do this, should be addressed in the next refactor

	const getNewId = () => {
		const newId = firstFreeId.toString();
		setFirstFreeId(firstFreeId + 1);
		return newId;
	};

	const checkForRepliedCollision = () => {
		for (const col of collisions) {
			if (
				(col.trafficLight1Id === chosenLight1 &&
					col.trafficLight2Id === chosenLight2) ||
				(col.trafficLight1Id === chosenLight2 &&
					col.trafficLight2Id === chosenLight1)
			) {
				return true;
			}
		}
		return false;
	};

	const onSave = () => {
		setCollisions(
			collisions.map((col, index) => ({ ...col, id: (index + 1).toString() })),
		);
		//TODO: save screenshot and Crossroad, EEIPoints, Connections, Lights, Collisions to DB (BE endpoint)

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
		} else if (chosenLight2 !== null && chosenLight1 !== null) {
			setCollisions([
				...collisions,
				{
					id: getNewId(),
					name: target.name.value,
					type: collisionType,
					trafficLight1Id: chosenLight1,
					trafficLight2Id: chosenLight2,
				},
			]);

			setLight1ChoiceStatus(`${firstLightMark} None`);
			setLight2ChoiceStatus(`${secondLightMark} None`);
			setInputValidity(true);
			setDataMessage("New collision added!");
			setChosenLight1(null);
			setChosenLight2(null);
			setNameInput("");
		}
	};

	const onResetCollision = () => {
		setChosenLight1(null);
		setChosenLight2(null);
		setLight1ChoiceStatus(`${firstLightMark} None`);
		setLight2ChoiceStatus(`${secondLightMark} None`);
	};

	const onCloseAssigner = () => {
		setShowCollisionAssigner(false);
	};

	const saveLightAssignment = (lightId: string) => {
		if (chosenLight1 === null) {
			setChosenLight1(lightId);
			setLight1ChoiceStatus(
				`${firstLightMark} id->${lightId}; name->${getTrafficLightName(
					trafficLights,
					lightId,
				)}`,
			);
		} else {
			setChosenLight2(lightId);
			setLight2ChoiceStatus(
				`${secondLightMark} id->${lightId}; name->${getTrafficLightName(
					trafficLights,
					lightId,
				)}`,
			);
		}
		setShowCollisionAssigner(false);
	};

	const onRemoveCollision = (collisionId: string) => {
		setCollisions(collisions.filter((col) => col.id !== collisionId));
	};

	return (
		<ContainerDiv>
			{showCollisionAssigner && (
				<>
					<CollisionLightAssigner
						closeFunction={onCloseAssigner}
						handleOnSave={saveLightAssignment}
						trafficLights={templateTrafficLights}
					/>
					<Backdrop />
				</>
			)}
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
			<p>
				<strong>Collisions</strong>
				<br />
				Please follow these steps:
				<br />
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				1. Hover on connection to choose one of it's lights for collision.
				Repeat this step twice for one collision.
				<br />
				2. When both lights are chosen fill the name input and choose collision
				type. If you made a mistake picking lights you can always reset your
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				choices with 'Reset collision' button
				<br />
				3. Repeat steps 1-2 until you have all collisions you wanted.
			</p>
			<BorderedWorkaroundDiv>
				{connections.length > 0 &&
					connections.map((con) => {
						const entrancePoint = exitEntrancePoints.filter(
							(point) => point.id === con.sourceId,
						)[0];
						const exitPoint = exitEntrancePoints.filter(
							(point) => point.id === con.targetId,
						)[0];

						const buttonSettings: ButtonSettings = {
							onButtonClickAction: () => {
								setTemplateTrafficLights(
									trafficLights.filter((tl) =>
										con.trafficLightIDs.includes(tl.id),
									),
								);
								setShowCollisionAssigner(true);
							},
							buttonText: `Choose ${
								chosenLight1 === null ? "1st" : "2nd"
							} light`,
							buttonColor: ButtonColors.BLUE,
						};

						return (
							<ConnectionMarker
								key={con.id}
								thickness={3}
								entranceX={entrancePoint.xCord}
								entranceY={entrancePoint.yCord}
								exitX={exitPoint.xCord}
								exitY={exitPoint.yCord}
								connection={con}
								color={Colors.BRIGHT_RED}
								withLightIds={true}
								buttonSettings={
									chosenLight1 === null || chosenLight2 === null
										? buttonSettings
										: undefined
								}
							/>
						);
					})}
				{exitEntrancePoints.length > 0 &&
					exitEntrancePoints.map((point, idx) => {
						return (
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
				dataMessage={light1ChoiceStatus}
				isInputValid={true}
				positiveColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
				negativeColor={
					theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
				}
			/>
			<InputInformationSpan
				dataMessage={light2ChoiceStatus}
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
							disabled={chosenLight1 === null || chosenLight2 === null}
						/>
					</BaseLi>
					<BaseLi>
						<TwoChoicesToggle
							handleOnChange={() => {
								if (collisionType === CollisionType.HEAVY) {
									setCollisionType(CollisionType.LIGHT);
								} else {
									setCollisionType(CollisionType.HEAVY);
								}
							}}
							options={[CollisionType.HEAVY, CollisionType.LIGHT]}
							name="typeChoice"
							labelMessage="Type:"
							optionsDescriptions={[
								HEAVY_COLLISION_DESCRIPTION,
								LIGHT_COLLISION_DESCRIPTION,
							]}
							disabled={chosenLight2 === null}
						/>
					</BaseLi>
				</BaseUl>
				<ButtonsDiv>
					<NeutralPositiveButton
						type="submit"
						disabled={chosenLight1 === null || chosenLight2 === null}
					>
						Add collision
					</NeutralPositiveButton>
					<NeutralNegativeButton
						onClick={onResetCollision}
						disabled={chosenLight1 === null && chosenLight2 === null}
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
							<NegativeButton onClick={() => onRemoveCollision(col.id)}>
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
