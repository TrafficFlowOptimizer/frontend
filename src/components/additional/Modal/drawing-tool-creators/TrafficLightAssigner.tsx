import React, { useState } from "react";
import { FirstStageTrafficLight } from "../../../../custom/CrossroadInterface";
import { ButtonsDiv } from "../../../../styles/MainTheme";
import { NegativeButton } from "../../../../styles/NegativeButton";
import { PositiveButton } from "../../../../styles/PositiveButton";
import styled from "styled-components";
import { StyledModal } from "../../../../styles/modal/ModalStyles";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material";

export type TrafficLightAssignerProps = {
	closeFunction: () => void;
	handleOnSave: (lightIds: string[]) => void;
	trafficLights: FirstStageTrafficLight[];
	connectionId: string;
};

export function TrafficLightAssigner(props: TrafficLightAssignerProps) {
	const theme = useTheme();
	const [chosenLights, setChosenLights] = useState<string[]>([]);

	const placeholder = "Select all lights for this connection";
	const replacementInfo = "New choices fully replace old ones";
	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const WIDTH = 400;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: WIDTH,
			},
		},
	};

	function getStyles(name: string, personName: readonly string[], theme: Theme) {
		return {
			fontWeight:
				personName.indexOf(name) === -1
					? theme.typography.fontWeightRegular
					: theme.typography.fontWeightMedium,
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
			<FormControl sx={{ m: 1, width: WIDTH, mt: 3 }}>
				<Select
					multiple
					displayEmpty
					value={chosenLights}
					onChange={handleChange}
					input={<OutlinedInput />}
					renderValue={(selected) => {
						if (selected.length === 0) {
							return <em>{placeholder}</em>;
						}

						return selected.join(", ");
					}}
					MenuProps={MenuProps}
					inputProps={{ "aria-label": "Without label" }}
				>
					<MenuItem disabled value="">
						<em>{replacementInfo}</em>
					</MenuItem>
					{props.trafficLights.map((light) => (
						<MenuItem
							key={light.light.id}
							value={light.light.id}
							style={getStyles(light.light.name, chosenLights, theme)}
						>
							<p>
								id: {light.light.id}; name: {light.light.name};
								direction: {light.light.direction}
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
