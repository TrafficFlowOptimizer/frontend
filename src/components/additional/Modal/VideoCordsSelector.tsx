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
import { Detection } from "../../../custom/OptimizationInterface";
import { alertShowtimeMS } from "../../../custom/loginFormsConstants";

export type VideoCordsSelectorProps = {
	videoId: string;
	connections: ResponseConnection[];
	imageBase: string;
	onClose: () => void;
};

export type RectanglePair = {
	first: number;
	second: number;
};

export type DetectionRectangle = {
	id: string;
	connectionId: string;
	lowerLeft: RectanglePair;
	upperRight: RectanglePair;
};

export const TEMPLATE_DETECTION_RECTANGLE: DetectionRectangle = {
	id: "0",
	connectionId: "",
	lowerLeft: { first: -1, second: -1 },
	upperRight: { first: -1, second: -1 },
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

		if (currentDetectionRectangle.lowerLeft.first === -1) {
			setCurrentDetectionRectangle((prev) => ({
				...prev,
				lowerLeft: {
					first: Math.round(localMousePos.x),
					second: Math.round(localMousePos.y),
				},
			}));

			setLowerLeftChoiceMessage(
				`lower left: [${Math.round(localMousePos.x)}, ${Math.round(
					localMousePos.y,
				)}]`,
			);
		} else if (currentDetectionRectangle.upperRight.first === -1) {
			setCurrentDetectionRectangle((prev) => ({
				...prev,
				upperRight: {
					first: Math.round(localMousePos.x),
					second: Math.round(localMousePos.y),
				},
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

	// const onFinish = () => {
	// 	axios
	// 		.post<Detection[]>(
	// 			`/videos/${props.videoId}/analysis`,
	// 			createdDetectionRectangles,
	// 			{
	// 				params: {
	// 					skipFrames: 10,
	// 				},
	// 				headers: {
	// 					Authorization: `Bearer ${
	// 						loggedUser !== null
	// 							? loggedUser.jwtToken
	// 							: getUserJWTToken()
	// 					}`,
	// 				},
	// 			},
	// 		)
	// 		.then((response) => {
	// 			console.log(response.data);
	// 			setShowSuccessAlert(true);
	// 			setTimeout(() => {
	// 				props.onClose();
	// 			}, 1000);
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 		});
	// };

	const onFinish = async () => {
		try {
			const response = await axios.post<Detection[]>(
				`/videos/${props.videoId}/analysis`,
				createdDetectionRectangles,
				{
					params: {
						skipFrames: 10,
					},
					headers: {
						Authorization: `Bearer ${
							loggedUser !== null
								? loggedUser.jwtToken
								: getUserJWTToken()
						}`,
					},
				},
			);
			alert(`Video ${props.videoId} was successfully analyzed!`);
			setShowSuccessAlert(true);
			setTimeout(() => {
				props.onClose();
			}, 1000);
		} catch (error) {
			alert(`Analysis of video ${props.videoId} failed with error ${error}!`);
		}
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
			3. Repeat points 1. and 2. until you&apos;ve covered all connections visible
			in the video&apos;s screenshot.
			<br />* After pressing <strong>&quot;Finish&quot;</strong> button the
			request will be serviced asynchronously.
			<br />
			You can leave the modal any time by pressing &quot;Abort&quot; without
			cancelling the analysis
		</CenteredInstructionP>
	);

	return (
		<SelectorModal>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showSuccessAlert}
				autoHideDuration={alertShowtimeMS}
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
									xCord={dr.lowerLeft.first}
									yCord={dr.lowerLeft.second}
									color={colors[idx % colors.length]}
								></EEIPointMarker>
								<EEIPointMarker
									xCord={dr.upperRight.first}
									yCord={dr.upperRight.second}
									color={colors[idx % colors.length]}
								></EEIPointMarker>
								<ConnectionMarker
									entranceX={dr.lowerLeft.first}
									entranceY={dr.lowerLeft.second}
									exitX={dr.lowerLeft.first}
									exitY={dr.upperRight.second}
									connection={props.connections[0]}
									thickness={3}
									color={colors[idx % colors.length]}
									withLightIds={false}
									withTooltip={false}
								/>
								<ConnectionMarker
									entranceX={dr.lowerLeft.first}
									entranceY={dr.lowerLeft.second}
									exitX={dr.upperRight.first}
									exitY={dr.lowerLeft.second}
									connection={props.connections[0]}
									thickness={3}
									color={colors[idx % colors.length]}
									withLightIds={false}
									withTooltip={false}
								/>
								<ConnectionMarker
									entranceX={dr.upperRight.first}
									entranceY={dr.upperRight.second}
									exitX={dr.lowerLeft.first}
									exitY={dr.upperRight.second}
									connection={props.connections[0]}
									thickness={3}
									color={colors[idx % colors.length]}
									withLightIds={false}
									withTooltip={false}
								/>
								<ConnectionMarker
									entranceX={dr.upperRight.first}
									entranceY={dr.upperRight.second}
									exitX={dr.upperRight.first}
									exitY={dr.lowerLeft.second}
									connection={props.connections[0]}
									thickness={3}
									color={colors[idx % colors.length]}
									withLightIds={false}
									withTooltip={false}
								/>
							</div>
						);
					})}
				{currentDetectionRectangle.lowerLeft.first !== -1 && (
					<EEIPointMarker
						xCord={currentDetectionRectangle.lowerLeft.first}
						yCord={currentDetectionRectangle.lowerLeft.second}
						color={Colors.PRIMARY_WHITE}
					></EEIPointMarker>
				)}
				{currentDetectionRectangle.upperRight.first !== -1 && (
					<EEIPointMarker
						xCord={currentDetectionRectangle.upperRight.first}
						yCord={currentDetectionRectangle.upperRight.second}
						color={Colors.PRIMARY_WHITE}
					></EEIPointMarker>
				)}
				<VideoScreenshot
					onMouseMove={handleMouseMove}
					src={props.imageBase}
					alt={"First frame of uploaded video"}
				/>
			</BorderedWorkaroundSelectorDiv>
			<FormControl
				sx={{
					m: 0,
					width: SELECT_WIDTH,
					mt: 2,
					border: `1px solid ${
						theme === "dark" ? Colors.PRIMARY_GRAY : "transparent"
					}`,
					borderRadius: "5px",
					backgroundColor: `${
						theme === "dark" ? Colors.PRIMARY_BLACK : Colors.PRIMARY_WHITE
					}`,
				}}
			>
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
