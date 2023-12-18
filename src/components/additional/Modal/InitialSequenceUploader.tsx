import React, { useState } from "react";
import axios from "axios";
import { useThemeContext } from "../../../custom/ThemeContext";
import { useUserContext } from "../../../custom/UserContext";
import { TimeIntervalPicker } from "../TimeIntervalPicker";
import { Day, Hour } from "../../../custom/OptimizationInterface";
import Snackbar from "@mui/material/Snackbar";
import { alertShowtimeMS } from "../../../custom/loginFormsConstants";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import {
	DragFileElement,
	FormFileInput,
	FormGroupFiles,
	UploadButton,
	UploaderForm,
	UploaderLabel,
	VideoReadyMessage,
} from "../../../styles/FileUploaderStyles";
import { ButtonsDiv, DarkTheme, LightTheme } from "../../../styles/MainStyles";
import { NegativeButton } from "../../../styles/NegativeButton";
import { PositiveButton } from "../../../styles/PositiveButton";
import { CenteredInstructionP } from "../../../styles/drawing-tool-styles/GeneralStyles";
import { getUserJWTToken } from "../../../custom/drawing-tool/AuxiliaryFunctions";
import { StyledModal } from "../../../styles/modal/ModalStyles";
import styled from "styled-components";
import { Checkbox } from "../Checkbox";
import { LIGHTS_TURNED_ON_COLLISION_DESCRIPTION } from "../../../custom/drawing-tool/AuxiliaryData";

export type InitialSequenceUploaderProps = {
	crossroadName: string;
	crossroadId: string;
	onClose: () => void;
};

export function InitialSequenceUploader(props: InitialSequenceUploaderProps) {
	const { theme } = useThemeContext();
	const { loggedUser } = useUserContext();

	const [csvToUpload, setCsvToUpload] = useState<File | null>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [dragActive, setDragActive] = React.useState(false);

	const [chosenHour, setChosenHour] = useState<Hour | undefined>(undefined);
	const [chosenDay, setChosenDay] = useState<Day | undefined>(undefined);

	const [showSuccessAlert, setShowSuccessAlert] = useState(false);
	const [showFailureAlert, setShowFailureAlert] = useState(false);
	const [failureMessage, setFailureMessage] = useState("");

	const [initialSequenceForAllIntervals, setInitialSequenceForAllIntervals] =
		useState(false);

	const handleDrag = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			// at least one file has been dropped so do something
			handleFiles(e.dataTransfer.files);
		}
	};

	const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
			// at least one file has been selected so do something
			handleFiles(e.target.files);
		}
	};

	const handleFiles = (files: FileList) => {
		setCsvToUpload(files[0]);
	};

	const onUploadButtonClick = () => {
		if (inputRef.current === null) {
			alert("Error");
		} else {
			inputRef.current.click();
		}
	};

	const sendInitialSequence = () => {
		if (csvToUpload !== null) {
			const uploadCsvData = new FormData();
			uploadCsvData.append("file", csvToUpload);
			uploadCsvData.append("crossroadId", props.crossroadId);
			if (!initialSequenceForAllIntervals) {
				uploadCsvData.append(
					"hour",
					chosenHour === undefined ? " " : Hour[chosenHour],
				);

				uploadCsvData.append(
					"day",
					chosenDay === undefined ? " " : Day[chosenDay],
				);
			}

			axios
				.post("/optimization/base", uploadCsvData, {
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${
							loggedUser !== null
								? loggedUser.jwtToken
								: getUserJWTToken()
						}`,
					},
				})
				.then(() => {
					setShowSuccessAlert(true);
					setTimeout(() => {
						props.onClose();
					}, alertShowtimeMS + 1000);
				})
				.catch((error) => {
					if (error.response.status >= 500) {
						setFailureMessage("Internal server error!");
					} else {
						setFailureMessage(`Error ${error.code}`);
					}
					setShowFailureAlert(true);
					setTimeout(() => {
						props.onClose();
					}, alertShowtimeMS);
				});
		} else {
			setFailureMessage("No file to upload");
			setShowFailureAlert(true);
		}
	};

	return (
		<StyledCSVUploader>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showSuccessAlert}
				autoHideDuration={alertShowtimeMS}
				onClose={() => {
					setShowSuccessAlert(false);
				}}
			>
				<Alert
					variant="filled"
					icon={<CheckIcon fontSize="inherit" />}
					severity="success"
				>
					<strong>First sequence successfully parsed!</strong>
				</Alert>
			</Snackbar>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showFailureAlert}
				autoHideDuration={alertShowtimeMS}
				onClose={() => {
					setShowFailureAlert(false);
				}}
			>
				<Alert variant="filled" severity="error">
					<strong>{failureMessage}</strong>
				</Alert>
			</Snackbar>
			<h3>Add initial light sequence for crossroad: {props.crossroadName}</h3>
			<CenteredInstructionP>
				1. The uploaded file should be of <strong>CSV</strong> type
				<br />
				2. It should only contain sequences od 60 numbers, 0s for red light or
				1s for green light. It is assumed that the order and the amount of such
				sequences resembles the lights of the crossroad.
				<br />
				3. If the sequences are the same all the time, you can mark it with the
				checkbox. In that case, you won&apos;t have to select specific day and
				hour
				<br />
				4. When file is ready press <strong>&apos;Upload&apos;</strong> button!
			</CenteredInstructionP>
			<UploaderForm onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
				<FormFileInput
					ref={inputRef}
					id="files"
					type="file"
					accept=".csv"
					multiple={false}
					onChange={handleChange}
				/>
				<UploaderLabel htmlFor="files" dragActive={dragActive}>
					<FormGroupFiles>
						<FontAwesomeIcon
							icon={faFileUpload}
							size="xl"
							style={{
								color:
									theme === "dark"
										? LightTheme.primary
										: DarkTheme.primary,
							}}
						/>
						<p>Drag and drop your file here or</p>
						{csvToUpload !== null && (
							<VideoReadyMessage>
								Ready: {csvToUpload.name}
							</VideoReadyMessage>
						)}
						<UploadButton onClick={onUploadButtonClick}>
							Upload a file
						</UploadButton>
					</FormGroupFiles>
				</UploaderLabel>
				{dragActive && (
					<DragFileElement
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
					></DragFileElement>
				)}
			</UploaderForm>
			<Checkbox
				label={"Sequence is initial for all time intervals"}
				description={
					"Choose if lights have the same sequence through all time periods"
				}
				withTooltip={true}
				isChecked={initialSequenceForAllIntervals}
				disabled={false}
				onChangeAction={setInitialSequenceForAllIntervals}
			/>
			<TimeIntervalPicker
				setHour={setChosenHour}
				setDay={setChosenDay}
				isDisabled={initialSequenceForAllIntervals}
				alternativeDayPlaceholder={"Select day of the sequences"}
				alternativeHourPlaceholder={"Select hour of the sequences"}
			/>
			<ButtonsDiv>
				<NegativeButton onClick={props.onClose}>Close</NegativeButton>
				<PositiveButton
					onClick={sendInitialSequence}
					disabled={
						(!initialSequenceForAllIntervals &&
							(chosenDay === undefined || chosenHour === undefined)) ||
						csvToUpload === null
					}
				>
					Upload
				</PositiveButton>
			</ButtonsDiv>
		</StyledCSVUploader>
	);
}

const StyledCSVUploader = styled(StyledModal)`
	top: 0%;
	padding: 15px;
	height: 90vh;
	overflow-y: auto;
`;
