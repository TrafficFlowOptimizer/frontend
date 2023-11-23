import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Memes } from "../Memes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../../../custom/ThemeContext";
import { DarkTheme, LightTheme, ButtonsDiv, Colors } from "../../../styles/MainStyles";
import { PositiveButton } from "../../../styles/PositiveButton";
import { StyledModal, StyledMessageField } from "../../../styles/modal/ModalStyles";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { NegativeButton } from "../../../styles/NegativeButton";
import { Day, Hour } from "../../../custom/OptimizationInterface";
import { TimeIntervalPicker } from "../TimeIntervalPicker";
import FormControl from "@mui/material/FormControl";
import {
	ChosenEm,
	SELECT_ITEM_HEIGHT,
	SELECT_ITEM_PADDING_TOP,
	SELECT_WIDTH,
	StyledEm,
} from "../../../styles/drawing-tool-styles/MUISelectStyles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import styled from "styled-components";
import { getUserJWTToken } from "../../../custom/drawing-tool/AuxiliaryFunctions";
import { useUserContext } from "../../../custom/UserContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

export type OptimizationDeployerProps = {
	textToDisplay: string;
	crossroadName: string;
	crossroadId: string;
	onClose: () => void;
};

export function OptimizationDeployer(props: OptimizationDeployerProps) {
	const { theme } = useContext(ThemeContext);
	const { loggedUser } = useUserContext();
	const navigate = useNavigate();
	const [optimizationDeployed, setOptimizationDeployed] = useState(false);
	const [chosenTime, setChosenTime] = useState<number>(-2);
	const [chosenHour, setChosenHour] = useState<Hour | undefined>(undefined);
	const [chosenDay, setChosenDay] = useState<Day | undefined>(undefined);

	const [showSuccessAlert, setShowSuccessAlert] = useState(false);
	const [showFailureAlert, setShowFailureAlert] = useState(false);
	const [failureMessage, setFailureMessage] = useState("");

	const startOptimization = () => {
		setOptimizationDeployed(true);
		axios
			.post<string>(
				`/optimization/${props.crossroadId}`,
				{},
				{
					params: {
						optimizationTime: chosenTime,
						day: chosenDay === undefined ? " " : Day[chosenDay],
						hour: chosenHour === undefined ? " " : Hour[chosenHour],
					},
					headers: {
						Authorization: `Bearer ${
							loggedUser !== null
								? loggedUser.jwtToken
								: getUserJWTToken()
						}`,
					},
				},
			)
			.then(() => {
				setShowSuccessAlert(true);
				navigate("../../results-choice", {
					state: {
						crossroadId: props.crossroadId,
						crossroadName: props.crossroadName,
						day: chosenDay,
						hour: chosenHour,
					},
				});
			})
			.catch((error) => {
				console.error(error);
				setFailureMessage(`Error ${error.code}`);
				setShowFailureAlert(true);
				props.onClose();
			});
	};

	const placeholder = "Select time of optimization";
	const replacementInfo = "Time is presented in seconds";
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: SELECT_ITEM_HEIGHT * 4.5 + SELECT_ITEM_PADDING_TOP,
				width: "fit-content",
				backgroundColor:
					theme === "dark" ? Colors.PRIMARY_BLACK : Colors.PRIMARY_WHITE,
			},
		},
	};

	function getStyles() {
		return {
			backgroundColor:
				theme === "dark" ? Colors.PRIMARY_BLACK : Colors.PRIMARY_WHITE,
			color: theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK,
		};
	}

	const handleChange = (event: SelectChangeEvent<string | number>) => {
		const newValue = event.target.value;
		if (newValue === "infinity") {
			setChosenTime(-1);
		} else if (typeof newValue === "number") {
			setChosenTime(newValue);
		}
	};

	const optimizationTimeOptions = [1, 10, 20, 30, 60, 120, -1];

	return (
		<StyledModal>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showSuccessAlert}
				autoHideDuration={1000}
			>
				<Alert
					variant="filled"
					icon={<CheckIcon fontSize="inherit" />}
					severity="success"
				>
					<strong>Optimization Deployed!</strong>
				</Alert>
			</Snackbar>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showFailureAlert}
				autoHideDuration={1000}
			>
				<Alert variant="filled" severity="error">
					<strong>{failureMessage}</strong>
				</Alert>
			</Snackbar>
			{optimizationDeployed ? (
				<div>
					<FontAwesomeIcon
						icon={faCloud}
						beatFade
						size="xl"
						style={{
							color:
								theme === "dark"
									? LightTheme.primary
									: DarkTheme.primary,
						}}
					/>
					<StyledMessageField>{props.textToDisplay}</StyledMessageField>
					<Memes />
				</div>
			) : (
				<div>
					<StyledMessageField>
						Crossroad: {props.crossroadName}
					</StyledMessageField>
					<InfoP>Optimization Time:</InfoP>
					<FormControl sx={{ m: 1, width: SELECT_WIDTH, mt: 3 }}>
						<Select
							displayEmpty
							value={chosenTime === -1 ? "infinity" : chosenTime}
							onChange={handleChange}
							input={<OutlinedInput />}
							renderValue={(selected) => {
								if (selected === -2) {
									return <StyledEm>{placeholder}</StyledEm>;
								}

								return (
									<ChosenEm>
										{selected === -1 ? "infinity" : selected}
									</ChosenEm>
								);
							}}
							MenuProps={MenuProps}
							inputProps={{
								"aria-label": "Without label",
								"background-color": `${
									theme === "dark"
										? Colors.PRIMARY_BLACK
										: Colors.PRIMARY_WHITE
								}`,
							}}
						>
							<MenuItem disabled value="">
								<StyledEm>{replacementInfo}</StyledEm>
							</MenuItem>
							{optimizationTimeOptions.map((time, index) => (
								<MenuItem key={index} value={time} style={getStyles()}>
									<p>{time !== -1 ? time : "infinity"}</p>
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<InfoP>Hour and day to optimize:</InfoP>
					<TimeIntervalPicker setHour={setChosenHour} setDay={setChosenDay} />
					<ButtonsDiv>
						<NegativeButton
							disabled={optimizationDeployed}
							onClick={props.onClose}
						>
							Close
						</NegativeButton>
						<PositiveButton
							onClick={startOptimization}
							disabled={
								chosenTime === undefined ||
								chosenDay === undefined ||
								chosenHour === undefined
							}
						>
							Start optimization
						</PositiveButton>
					</ButtonsDiv>
				</div>
			)}
		</StyledModal>
	);
}

export const InfoP = styled.p`
	margin-bottom: 0px;
`;
