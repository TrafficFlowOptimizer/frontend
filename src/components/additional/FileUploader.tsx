import React, { useState } from "react";
import axios from "axios";
import { useThemeContext } from "../../custom/ThemeContext";
import { useUserContext } from "../../custom/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VideoCordsSelector } from "./Modal/VideoCordsSelector";
import { Backdrop } from "./Modal/Backdrop";
import { ResponseConnection } from "../../custom/CrossRoadRestTypes";
import { getUserJWTToken } from "../../custom/drawing-tool/AuxiliaryFunctions";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { Colors, DarkTheme, LightTheme, BaseInput } from "../../styles/MainStyles";
import { PositiveButton } from "../../styles/PositiveButton";
import { CenteredInstructionP } from "../../styles/drawing-tool-styles/GeneralStyles";
import {
	FormGroupFiles,
	FormFileInput,
	UploaderForm,
	UploaderLabel,
	UploadButton,
	DragFileElement,
	MainUploaderDiv,
	VideoReadyMessage,
	HorizontalWrapper,
} from "../../styles/FileUploaderStyles";
import {
	ChosenEm,
	SELECT_ITEM_HEIGHT,
	SELECT_ITEM_PADDING_TOP,
	SELECT_WIDTH,
	StyledEm,
} from "../../styles/drawing-tool-styles/MUISelectStyles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import { ButtonsDiv } from "../../styles/MainStyles";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { ThemeProvider } from "@mui/material";
import { tooltipTheme } from "../../custom/drawing-tool/AuxiliaryData";
import Tooltip from "@mui/material/Tooltip";
import { FormsValidityInformation } from "./FormsValidityInformation";
import { Day, Hour } from "../../custom/OptimizationInterface";
import { TimeIntervalPicker } from "./TimeIntervalPicker";

export type FileUploaderProps = {
	crossroadId: string;
	connections: ResponseConnection[];
};

export function FileUploader(props: FileUploaderProps) {
	const { theme } = useThemeContext();
	const { loggedUser } = useUserContext();
	const [videoToUpload, setVideoToUpload] = useState<File | null>(null);
	const [uploadMessage, setUploadMessage] = useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	const timeDescription =
		"How much time is visualized on video in minutes\n" +
		"ex: if video is 5 mins long, but it displays events in x2 speed, then the inserted value should be 10";

	const [badRealTimeMessage, setBadRealTimeMessage] = useState("");
	const [videoRealTime, setVideoRealTime] = useState("");

	const [showCordsSelector, setShowCordsSelector] = useState(false);
	const [canReopenSelector, setCanReopenSelector] = useState(false);
	const [videoScreenshot, setVideoScreenshot] = useState("");
	const [videoId, setVideoId] = useState("");

	const [dragActive, setDragActive] = React.useState(false);
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

	const [chosenHour, setChosenHour] = useState<Hour | undefined>(undefined);
	const [chosenDay, setChosenDay] = useState<Day | undefined>(undefined);

	const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
			// at least one file has been selected so do something
			handleFiles(e.target.files);
		}
	};

	const handleFiles = (files: FileList) => {
		setVideoToUpload(files[0]);
	};

	const onUploadButtonClick = () => {
		if (inputRef.current === null) {
			alert("Error");
		} else {
			inputRef.current.click();
		}
	};

	const sendVideos = () => {
		if (videoToUpload !== null) {
			//TODO: adapt to endpoint changes
			const uploadVideoData = new FormData();
			uploadVideoData.append("file", videoToUpload);
			uploadVideoData.append("crossroadId", props.crossroadId);
			uploadVideoData.append(
				"timeIntervalId",
				chosenHour === undefined ? " " : chosenHour.toString(),
			);

			axios
				.post("/videos/upload", uploadVideoData, {
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${
							loggedUser !== null
								? loggedUser.jwtToken
								: getUserJWTToken()
						}`,
					},
				})
				.then(async (response) => {
					const result: string = response.data;
					setUploadMessage(result);
					setVideoToUpload(null);
					if (result.includes("uploaded successfully with id:")) {
						const videoId = result.split(": ")[2];

						setVideoId(videoId);

						const res = await fetch(`/videos/${videoId}/sample`, {
							method: "get",
							headers: new Headers({
								Authorization: `Bearer ${
									loggedUser !== null
										? loggedUser.jwtToken
										: getUserJWTToken()
								}`,
								"Content-Type": "image/jpeg",
							}),
						});
						const imageBlob = await res.blob();
						const imageObjectURL = URL.createObjectURL(imageBlob);

						setVideoScreenshot(imageObjectURL);
						setShowCordsSelector(true);
					}
				})
				.catch((error) => {
					console.error(error);
				});
		} else {
			alert("No videos to upload!");
		}
	};

	const changeRealTime = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(e.target.value);

		if (isNaN(newValue)) {
			setBadRealTimeMessage("Input value has to be a positive integer");
			setVideoRealTime("");
		} else if (newValue <= 0) {
			setBadRealTimeMessage("Input value has to be a positive integer");
			setVideoRealTime("");
		} else {
			setBadRealTimeMessage("");
			setVideoRealTime(newValue.toString());
		}
	};

	return (
		<MainUploaderDiv>
			{showCordsSelector && (
				<>
					<VideoCordsSelector
						videoId={videoId}
						connections={props.connections}
						imageBase={videoScreenshot}
						onClose={() => {
							setShowCordsSelector(false);
							setCanReopenSelector(true);
						}}
					/>
					<Backdrop />
				</>
			)}
			<UploaderForm onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
				<FormFileInput
					ref={inputRef}
					id="files"
					type="file"
					accept="video/*"
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
						{videoToUpload !== null && (
							<VideoReadyMessage>
								Ready: {videoToUpload.name}
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
			<ButtonsDiv>
				<PositiveButton
					disabled={
						chosenHour === undefined ||
						chosenDay === undefined ||
						videoToUpload === null ||
						videoRealTime.length === 0
					}
					onClick={sendVideos}
				>
					Send video to server
				</PositiveButton>
				<NeutralPositiveButton
					disabled={!canReopenSelector}
					onClick={() => {
						setShowCordsSelector(true);
					}}
				>
					Open Detection Rectangles Creator
				</NeutralPositiveButton>
			</ButtonsDiv>
			{uploadMessage != "" && (
				<CenteredInstructionP>{uploadMessage}</CenteredInstructionP>
			)}
			<TimeIntervalPicker setHour={setChosenHour} setDay={setChosenDay} />
			<HorizontalWrapper>
				<ThemeProvider theme={tooltipTheme}>
					<Tooltip title={timeDescription} placement={"bottom"} arrow>
						<label htmlFor="videoRealTime">Video real time:*</label>
					</Tooltip>
					<BaseInput
						id="videoRealTime"
						name="videoRealTime"
						type="text"
						value={videoRealTime}
						onChange={changeRealTime}
					/>
				</ThemeProvider>
			</HorizontalWrapper>
			<FormsValidityInformation
				isInputValid={badRealTimeMessage.length === 0}
				badInputMessage={badRealTimeMessage}
			/>
		</MainUploaderDiv>
	);
}
