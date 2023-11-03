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
import { Colors, DarkTheme, LightTheme } from "../../styles/MainStyles";
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

export type FileUploaderProps = {
	crossroadId: string;
	connections: ResponseConnection[];
};

export function FileUploader(props: FileUploaderProps) {
	const { theme } = useThemeContext();
	const { loggedUser } = useUserContext();
	const [chosenHour, setChosenHour] = useState<string>("");
	const [videoToUpload, setVideoToUpload] = useState<File | null>(null);
	const [uploadMessage, setUploadMessage] = useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	const [showCordsSelector, setShowCordsSelector] = useState(false);
	const [canReopenSelector, setCanReopenSelector] = useState(false);
	const [videoScreenshot, setVideoScreenshot] = useState("");

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

	const placeholder = "Select hour when the video was recorded";
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

	const handleHourChange = (event: SelectChangeEvent) => {
		setChosenHour(event.target.value);
	};

	const hourOptions = [
		"0:00 - 1:00",
		"1:00 - 2:00",
		"2:00 - 3:00",
		"3:00 - 4:00",
		"4:00 - 5:00",
		"5:00 - 6:00",
		"6:00 - 7:00",
		"7:00 - 8:00",
		"8:00 - 9:00",
		"9:00 - 10:00",
		"10:00 - 11:00",
		"11:00 - 12:00",
		"12:00 - 13:00",
		"13:00 - 14:00",
		"14:00 - 15:00",
		"15:00 - 16:00",
		"16:00 - 17:00",
		"17:00 - 18:00",
		"18:00 - 19:00",
		"19:00 - 20:00",
		"20:00 - 21:00",
		"21:00 - 22:00",
		"22:00 - 23:00",
		"23:00 - 0:00",
	];

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
			const uploadVideoData = new FormData();
			uploadVideoData.append("file", videoToUpload);
			uploadVideoData.append("crossroadId", props.crossroadId);
			uploadVideoData.append("timeIntervalId", chosenHour);

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

	return (
		<MainUploaderDiv>
			{showCordsSelector && (
				<>
					<VideoCordsSelector
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
					disabled={chosenHour === "" || videoToUpload === null}
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
			<FormControl sx={{ m: 1, width: SELECT_WIDTH, mt: 3 }}>
				<Select
					displayEmpty
					value={chosenHour}
					onChange={handleHourChange}
					input={<OutlinedInput />}
					renderValue={(selected) => {
						if (selected.length === 0) {
							return <StyledEm>{placeholder}</StyledEm>;
						}

						return <ChosenEm>{selected}</ChosenEm>;
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
						<StyledEm>{placeholder}</StyledEm>
					</MenuItem>
					{hourOptions.map((hour, index) => (
						<MenuItem key={index} value={hour} style={getStyles()}>
							<p>{hour}</p>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</MainUploaderDiv>
	);
}
