import React, { useEffect, useState } from "react";
import { useThemeContext } from "../../../custom/ThemeContext";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import styled from "styled-components";
import { ResponseConnection } from "../../../custom/CrossRoadRestTypes";
import {
	getNewId,
	getUserJWTToken,
} from "../../../custom/drawing-tool/AuxiliaryFunctions";
import {
	ChosenEm,
	SELECT_ITEM_HEIGHT,
	SELECT_ITEM_PADDING_TOP,
	SELECT_WIDTH,
	StyledEm,
} from "../../../styles/drawing-tool-styles/MUISelectStyles";
import { Colors, ButtonsDiv } from "../../../styles/MainStyles";
import {
	VideoScreenshot,
	BorderedWorkaroundSelectorDiv,
} from "../../../styles/FileUploaderStyles";
import { NegativeButton } from "../../../styles/NegativeButton";
import { PositiveButton } from "../../../styles/PositiveButton";
import {
	NeutralNegativeButton,
	NeutralPositiveButton,
} from "../../../styles/NeutralButton";
import { StyledModal } from "../../../styles/modal/ModalStyles";
import {
	CenteredInstructionP,
	EEIPointMarker,
} from "../../../styles/drawing-tool-styles/GeneralStyles";
import { EEIPointOffset } from "../../../custom/drawing-tool/AuxiliaryData";
import { InputInformationSpan } from "../InputInformationSpan";
import { ConnectionMarker } from "../../drawing-tool/ConnectionMarker";
import axios from "axios";
import { useUserContext } from "../../../custom/UserContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

export type VideoCordsSelectorProps = {
	videoId: string;
	connections: ResponseConnection[];
	imageBase: string;
	onClose: () => void;
};

export type DetectionRectangle = {
	id: string;
	connectionId: string;
	lowerLeft: number[];
	upperRight: number[];
};

export const TEMPLATE_DETECTION_RECTANGLE: DetectionRectangle = {
	id: "0",
	connectionId: "",
	lowerLeft: [-1, -1],
	upperRight: [-1, -1],
};

export function VideoCordsSelector(props: VideoCordsSelectorProps) {
	const { theme } = useThemeContext();
	const { loggedUser } = useUserContext();
	const muiTheme = useTheme();

	const [showSuccessAlert, setShowSuccessAlert] = useState(false);

	const [localMousePos, setLocalMousePos] = useState({ x: 0, y: 0 });

	const handleMouseMove = (event: any) => {
		const rect = event.target.getBoundingClientRect();
		const x = event.clientX - rect.left; //x position within the element.
		const y = event.clientY - rect.top; //y position within the element.

		setLocalMousePos({
			x: x - EEIPointOffset,
			y: y - EEIPointOffset,
		});
	};

	const onScreenshotClick = (event: React.SyntheticEvent) => {
		event.preventDefault();

		if (currentDetectionRectangle.lowerLeft[0] === -1) {
			setCurrentDetectionRectangle((prev) => ({
				...prev,
				lowerLeft: [Math.round(localMousePos.x), Math.round(localMousePos.y)],
			}));

			setLowerLeftChoiceMessage(
				`lower left: [${Math.round(localMousePos.x)}, ${Math.round(
					localMousePos.y,
				)}]`,
			);
		} else if (currentDetectionRectangle.upperRight[0] === -1) {
			setCurrentDetectionRectangle((prev) => ({
				...prev,
				upperRight: [Math.round(localMousePos.x), Math.round(localMousePos.y)],
			}));

			setUpperRightChoiceMessage(
				`upper right: [${Math.round(localMousePos.x)}, ${Math.round(
					localMousePos.y,
				)}]`,
			);
		}
	};

	const [firstFreeId, setFirstFreeId] = useState(1);

	const lowerLeftBase = "lower left coordinates: not chosen";
	const upperRightBase = "upper right coordinates: not chosen";
	const [lowerLeftChoiceMessage, setLowerLeftChoiceMessage] = useState(lowerLeftBase);
	const [upperRightChoiceMessage, setUpperRightChoiceMessage] =
		useState(upperRightBase);

	const [currentDetectionRectangle, setCurrentDetectionRectangle] =
		useState<DetectionRectangle>(TEMPLATE_DETECTION_RECTANGLE);

	const [unusedConnections, setUnusedConnections] = useState<ResponseConnection[]>(
		props.connections,
	);

	const [createdDetectionRectangles, setCreatedDetectionRectangles] = useState<
		DetectionRectangle[]
	>([]);

	const colors = [
		Colors.PURPLE,
		Colors.BRIGHT_RED,
		Colors.ORANGY_RED,
		Colors.ORANGE,
		Colors.ORANGY_YELLOW,
		Colors.YELLOW,
		Colors.TOXIC_GREEN,
		Colors.LIGHT_GREEN,
		Colors.GREEN,
		Colors.DEEP_GREEN,
		Colors.FOREST_GREEN,
	];

	const placeholder = "Select the connection id that new cords represent";
	const replacementInfo = "New choices fully replace old ones";
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

	function getStyles(inputTheme: Theme) {
		return {
			fontWeight: inputTheme.typography.fontWeightRegular,
			backgroundColor:
				theme === "dark" ? Colors.PRIMARY_BLACK : Colors.PRIMARY_WHITE,
			color: theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK,
		};
	}

	const handleChange = (
		event: SelectChangeEvent<typeof currentDetectionRectangle.connectionId>,
	) => {
		const {
			target: { value },
		} = event;
		setCurrentDetectionRectangle((prev) => ({
			...prev,
			connectionId: value,
		}));
	};

	const getConnectionNameFromId = (connectionId: string): string => {
		for (const con of props.connections) {
			if (con.id === connectionId) {
				return con.name;
			}
		}
		return "Error";
	};

	const getAllUnusedConnections = () => {
		return props.connections.filter((con) => {
			for (const dr of createdDetectionRectangles) {
				if (con.id === dr.connectionId) {
					return false;
				}
			}
			return true;
		});
	};

	const onNextDetectionRectangle = () => {
		setCreatedDetectionRectangles((prev) => [
			...prev,
			{
				...currentDetectionRectangle,
				id: getNewId(firstFreeId, setFirstFreeId).toString(),
			},
		]);

		setCurrentDetectionRectangle(TEMPLATE_DETECTION_RECTANGLE);
		setUpperRightChoiceMessage(upperRightBase);
		setLowerLeftChoiceMessage(lowerLeftBase);
	};

	useEffect(() => {
		setUnusedConnections(getAllUnusedConnections());
	}, [createdDetectionRectangles]);

	const resetCurrentRectangle = () => {
		setCurrentDetectionRectangle(TEMPLATE_DETECTION_RECTANGLE);

		setUpperRightChoiceMessage(upperRightBase);
		setLowerLeftChoiceMessage(lowerLeftBase);
	};

	const onFinish = () => {
		console.log(JSON.stringify(createdDetectionRectangles));
		const analyseVideoData = new FormData();
		analyseVideoData.append("skipFrames", "1");
		analyseVideoData.append(
			"detectionRectangles",
			JSON.stringify(createdDetectionRectangles),
		);

		axios
			.post<string>(`/videos/${props.videoId}/analysis`, analyseVideoData, {
				// params: {
				// 	skipFrames: 1,
				// 	detectionRectangles: createdDetectionRectangles,
				// },
				headers: {
					Authorization: `Bearer ${
						loggedUser !== null ? loggedUser.jwtToken : getUserJWTToken()
					}`,
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				console.log(response.data);
				setShowSuccessAlert(true);
				setTimeout(() => {
					props.onClose();
				}, 1000);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const instruction = (
		<CenteredInstructionP>
			<strong>Detection Rectangles Selector</strong>
			<br />
			1. Choose two points of the rectangle, its bottom left and upper right
			corners. Points should more or less determine the lane of the connection you
			are considering at the moment.
			<br />
			2. Then choose the connection that this particular rectangle will represent
			<br />
			{/* eslint-disable-next-line react/no-unescaped-entities */}
			3. Repeat points 1. and 2. until you've covered all connections visible in
			{/* eslint-disable-next-line react/no-unescaped-entities */}
			the video's screenshot.
		</CenteredInstructionP>
	);

	return (
		<SelectorModal>
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
					<strong>Video sent for analysis!</strong>
				</Alert>
			</Snackbar>
			{instruction}
			<BorderedWorkaroundSelectorDiv onClick={onScreenshotClick}>
				{createdDetectionRectangles.length > 0 &&
					createdDetectionRectangles.map((dr, idx) => {
						return (
							<div key={dr.id}>
								<EEIPointMarker
									xCord={dr.lowerLeft[0]}
									yCord={dr.lowerLeft[1]}
									color={colors[idx % colors.length]}
								></EEIPointMarker>
								<EEIPointMarker
									xCord={dr.upperRight[0]}
									yCord={dr.upperRight[1]}
									color={colors[idx % colors.length]}
								></EEIPointMarker>
								<ConnectionMarker
									entranceX={dr.lowerLeft[0]}
									entranceY={dr.lowerLeft[1]}
									exitX={dr.lowerLeft[0]}
									exitY={dr.upperRight[1]}
									connection={props.connections[0]}
									thickness={3}
									color={colors[idx % colors.length]}
									withLightIds={false}
									withTooltip={false}
								/>
								<ConnectionMarker
									entranceX={dr.lowerLeft[0]}
									entranceY={dr.lowerLeft[1]}
									exitX={dr.upperRight[0]}
									exitY={dr.lowerLeft[1]}
									connection={props.connections[0]}
									thickness={3}
									color={colors[idx % colors.length]}
									withLightIds={false}
									withTooltip={false}
								/>
								<ConnectionMarker
									entranceX={dr.upperRight[0]}
									entranceY={dr.upperRight[1]}
									exitX={dr.lowerLeft[0]}
									exitY={dr.upperRight[1]}
									connection={props.connections[0]}
									thickness={3}
									color={colors[idx % colors.length]}
									withLightIds={false}
									withTooltip={false}
								/>
								<ConnectionMarker
									entranceX={dr.upperRight[0]}
									entranceY={dr.upperRight[1]}
									exitX={dr.upperRight[0]}
									exitY={dr.lowerLeft[1]}
									connection={props.connections[0]}
									thickness={3}
									color={colors[idx % colors.length]}
									withLightIds={false}
									withTooltip={false}
								/>
							</div>
						);
					})}
				{currentDetectionRectangle.lowerLeft[0] !== -1 && (
					<EEIPointMarker
						xCord={currentDetectionRectangle.lowerLeft[0]}
						yCord={currentDetectionRectangle.lowerLeft[1]}
						color={Colors.PRIMARY_WHITE}
					></EEIPointMarker>
				)}
				{currentDetectionRectangle.upperRight[0] !== -1 && (
					<EEIPointMarker
						xCord={currentDetectionRectangle.upperRight[0]}
						yCord={currentDetectionRectangle.upperRight[1]}
						color={Colors.PRIMARY_WHITE}
					></EEIPointMarker>
				)}
				<VideoScreenshot
					onMouseMove={handleMouseMove}
					src={props.imageBase}
					alt={"First frame of uploaded video"}
				/>
			</BorderedWorkaroundSelectorDiv>
			<FormControl sx={{ m: 1, width: SELECT_WIDTH, mt: 3 }}>
				<Select
					displayEmpty
					value={currentDetectionRectangle.connectionId}
					onChange={handleChange}
					input={<OutlinedInput />}
					renderValue={(selected) => {
						if (selected.length === 0) {
							return <StyledEm>{placeholder}</StyledEm>;
						}

						return <ChosenEm>{getConnectionNameFromId(selected)}</ChosenEm>;
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
					{unusedConnections.map((con) => (
						<MenuItem
							key={con.index}
							value={con.id}
							style={getStyles(muiTheme)}
						>
							<p>
								id: {con.index}; name: {con.name}
							</p>
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<div>
				<InputInformationSpan
					dataMessage={lowerLeftChoiceMessage}
					isInputValid={true}
					positiveColor={
						theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
					}
					negativeColor={
						theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
					}
				/>
				<InputInformationSpan
					dataMessage={upperRightChoiceMessage}
					isInputValid={true}
					positiveColor={
						theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
					}
					negativeColor={
						theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK
					}
				/>
			</div>
			<ButtonsDiv>
				<NegativeButton onClick={props.onClose}>Abort</NegativeButton>
				<NeutralNegativeButton
					disabled={
						currentDetectionRectangle === TEMPLATE_DETECTION_RECTANGLE
					}
					onClick={resetCurrentRectangle}
				>
					Reset current rectangle
				</NeutralNegativeButton>
				<NeutralPositiveButton
					disabled={currentDetectionRectangle.connectionId === ""}
					onClick={onNextDetectionRectangle}
				>
					Next Detection Rectangle
				</NeutralPositiveButton>
				<PositiveButton
					disabled={createdDetectionRectangles.length === 0}
					onClick={onFinish}
				>
					Finish
				</PositiveButton>
			</ButtonsDiv>
		</SelectorModal>
	);
}

export const SelectorModal = styled(StyledModal)`
	width: 60vw;
	height: 80vh;
	left: calc(50% - 35vw);
	top: 5%;
	
	overflow: auto;
	
	padding 20px 70px;
`;
