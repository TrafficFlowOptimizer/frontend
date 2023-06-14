import React, { useState } from "react";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	FormGroupFiles,
	FormFileInput,
	UploaderForm,
	UploaderLabel,
	UploadButton,
	DragFileElement,
	MainUploaderDiv,
} from "../../styles/FileUploaderStyles";
import { Dropdown } from "./Dropdown";
import axios from "axios";
import { useUserContext } from "../../custom/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { DarkTheme, LightTheme } from "../../styles/MainTheme";
import { useThemeContext } from "../../custom/ThemeContext";

export type FileUploaderProps = {
	crossroadId: string;
};

export type VideoResponseMessage = {
	message: string;
};

export function FileUploader(props: FileUploaderProps) {
	const { theme } = useThemeContext();
	const { loggedUser } = useUserContext();
	const [chosenHour, setChosenHour] = useState<string | number | null>(null);
	const [videoToUpload, setVideoToUpload] = useState<File | null>(null);
	const [uploadMessage, setUploadMessage] = useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	const onChange = (newValue: number | string | null) => {
		setChosenHour(newValue);
	};
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

	const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
			// at least one file has been selected so do something
			handleFiles(e.target.files);
		}
	};

	const handleFiles = (files: FileList) => {
		console.log(files);
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
			axios
				.post("/videos/upload", uploadVideoData, {
					headers: { "Content-Type": "multipart/form-data" },
				})
				.then((response) => {
					const result: VideoResponseMessage = response.data;
					setUploadMessage(result.message);
					setVideoToUpload(null);
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
						{videoToUpload !== null && <p>Ready: {videoToUpload.name}</p>}
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
			<PositiveButton
				disabled={chosenHour === null || videoToUpload === null}
				onClick={sendVideos}
			>
				Send video to server
			</PositiveButton>
			{uploadMessage != "" && <p>{uploadMessage}</p>}
			<Dropdown
				placeholder="Select time of the video"
				options={[
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
				]}
				isSearchable={false}
				onChange={onChange}
			/>
		</MainUploaderDiv>
	);
}
