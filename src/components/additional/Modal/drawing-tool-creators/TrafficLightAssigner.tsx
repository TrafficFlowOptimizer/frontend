import React, { useState } from "react";
import { FirstStageTrafficLight } from "../../../../custom/CrossroadInterface";
import { ButtonsDiv, Colors } from "../../../../styles/MainStyles";
import { NegativeButton } from "../../../../styles/NegativeButton";
import { PositiveButton } from "../../../../styles/PositiveButton";
import styled from "styled-components";
import { StyledModal } from "../../../../styles/modal/ModalStyles";
import {
	StyledEm,
	ChosenEm,
} from "../../../../styles/drawing-tool-styles/MUISelectStyles";

import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material";
import { useThemeContext } from "../../../../custom/ThemeContext";
import {
	SELECT_ITEM_HEIGHT,
	SELECT_ITEM_PADDING_TOP,
	SELECT_WIDTH,
} from "../../../../styles/drawing-tool-styles/MUISelectStyles";

export type TrafficLightAssignerProps = {
	closeFunction: () => void;
	handleOnSave: (lightIds: string[]) => void;
	trafficLights: FirstStageTrafficLight[];
	connectionId: string;
};

export function TrafficLightAssigner(props: TrafficLightAssignerProps) {
	const { theme } = useThemeContext();
	const muiTheme = useTheme();
	const [chosenLights, setChosenLights] = useState<string[]>([]);

	const placeholder = "Select all lights for this connection";
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

	function getStyles(name: string, personName: readonly string[], inputTheme: Theme) {
		return {
			fontWeight:
				personName.indexOf(name) === -1
					? inputTheme.typography.fontWeightRegular
					: inputTheme.typography.fontWeightMedium,
			backgroundColor:
				theme === "dark" ? Colors.PRIMARY_BLACK : Colors.PRIMARY_WHITE,
			color: theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK,
		};
	}

	const handleChange = (event: SelectChangeEvent<typeof chosenLights>) => {
		const {
			target: { value },
		} = event;
		setChosenLights(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value,
		);
	};

	return (
		<TrafficLightsAssignerModal>
			<p>
				<strong>Traffic Light Assigner</strong>
			</p>
			<FormControl sx={{ m: 1, width: SELECT_WIDTH, mt: 3 }}>
				<Select
					multiple
					displayEmpty
					value={chosenLights}
					onChange={handleChange}
					input={<OutlinedInput />}
					renderValue={(selected) => {
						if (selected.length === 0) {
							return <StyledEm>{placeholder}</StyledEm>;
						}

						return <ChosenEm>{selected.join(", ")}</ChosenEm>;
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
					{props.trafficLights.map((light) => (
						<MenuItem
							key={light.light.index}
							value={light.light.index}
							style={getStyles(light.light.index, chosenLights, muiTheme)}
						>
							<p>
								id: {light.light.index}; direction:
								{light.light.direction}
							</p>
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<ButtonsDiv>
				<NegativeButton onClick={props.closeFunction}>Close</NegativeButton>
				<PositiveButton
					onClick={() => {
						props.handleOnSave(chosenLights);
					}}
					disabled={chosenLights.length === 0}
				>
					Save
				</PositiveButton>
			</ButtonsDiv>
		</TrafficLightsAssignerModal>
	);
}

const TrafficLightsAssignerModal = styled(StyledModal)`
	width: fit-content;
	height: fit-content;
	left: calc(50% - 12vw);
	top: calc(50% - 18vh);
	
	padding 20px 70px;
`;
