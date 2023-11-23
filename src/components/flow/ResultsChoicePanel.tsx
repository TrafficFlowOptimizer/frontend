import React, { useState } from "react";
import axios from "axios";
import { Navbar } from "../additional/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { Day, Hour, OptimizationResults } from "../../custom/OptimizationInterface";
import { TimeIntervalPicker } from "../additional/TimeIntervalPicker";
import { WaitingPopUp } from "../additional/Modal/WaitingPopUp";
import { Backdrop } from "../additional/Modal/Backdrop";
import {
	BaseButtonLink,
	PageHeader,
	ButtonsDiv,
	ContainerDiv,
} from "../../styles/MainStyles";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { InfoP } from "../additional/Modal/OptimizationDeployer";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { getUserJWTToken } from "../../custom/drawing-tool/AuxiliaryFunctions";
import { useUserContext } from "../../custom/UserContext";

export function ResultsChoicePanel() {
	const { loggedUser } = useUserContext();
	const location = useLocation();
	const navigate = useNavigate();
	const crossroadId = location.state.crossroadId ?? undefined;
	const crossroadName = location.state.crossroadName ?? undefined;
	const initialHour = location.state.hour ?? undefined;
	const initialDay = location.state.day ?? undefined;
	const [chosenHour, setChosenHour] = useState<Hour | undefined>(initialHour);
	const [chosenDay, setChosenDay] = useState<Day | undefined>(initialDay);

	const [showWaitingModal, setShowWaitingModal] = useState(false);
	const [whereToNav, setWhereToNav] = useState("");

	const [showFailureAlert, setShowFailureAlert] = useState(false);
	const [failureMessage, setFailureMessage] = useState("");

	const handleResultsChoice = (type: "descriptive" | "simulation") => {
		if (type === "descriptive") {
			setWhereToNav("../results-descriptive");
		} else {
			setWhereToNav("../results-simulation");
		}

		setShowWaitingModal(true);

		axios
			.get<OptimizationResults>(`/optimization/result/${crossroadId}`, {
				params: {
					day: chosenDay === undefined ? " " : Day[chosenDay],
					hour: chosenHour === undefined ? " " : Hour[chosenHour],
				},
				headers: {
					Authorization: `Bearer ${
						loggedUser !== null ? loggedUser.jwtToken : getUserJWTToken()
					}`,
				},
			})
			.then((response) => {
				const results: OptimizationResults = response.data;
				navigate(whereToNav, {
					state: {
						crossroadId: crossroadId,
						crossroadName: crossroadName,
						results: { ...results },
					},
				});
			})
			.catch((error) => {
				console.error(error);
				setShowWaitingModal(false);
				setFailureMessage(`Error ${error.code}`);
				setShowFailureAlert(true);
			});
	};

	return (
		<ContainerDiv>
			<Navbar />
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showFailureAlert}
				autoHideDuration={1000}
			>
				<Alert variant="filled" severity="error">
					<strong>{failureMessage}</strong>
				</Alert>
			</Snackbar>
			{showWaitingModal && (
				<>
					<WaitingPopUp
						textToDisplay={"Obtaining optimization results..."}
						waitingTime={2}
						onClose={() => {
							setShowWaitingModal(false);
						}}
					/>
					<Backdrop />
				</>
			)}
			<PageHeader>See results for optimization of {crossroadName}</PageHeader>
			{(initialDay === undefined || initialHour === undefined) && (
				<div>
					<InfoP>Choose day and hour for results retrieval</InfoP>
					<TimeIntervalPicker setHour={setChosenHour} setDay={setChosenDay} />
				</div>
			)}
			<InfoP>Now choose your course of action:</InfoP>
			<ButtonsDiv>
				<NeutralPositiveButton
					onClick={() => {
						handleResultsChoice("descriptive");
					}}
					disabled={chosenHour === undefined || chosenDay === undefined}
				>
					See results as descriptive data
				</NeutralPositiveButton>
				<NeutralPositiveButton
					onClick={() => {
						handleResultsChoice("simulation");
					}}
					disabled={chosenHour === undefined || chosenDay === undefined}
				>
					See results as a simulation
				</NeutralPositiveButton>
				<NeutralNegativeButton>
					<BaseButtonLink
						to={`../crossroad-view/${crossroadId}`}
						relative="path"
						state={{ crossroadID: crossroadId }}
					>
						Go back to crossroad view
					</BaseButtonLink>
				</NeutralNegativeButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}
