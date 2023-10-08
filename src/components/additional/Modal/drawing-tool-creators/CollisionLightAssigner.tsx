import React, { useState } from "react";
import styled from "styled-components";
import { StyledModal } from "../../../../styles/modal/ModalStyles";
import { ButtonsDiv, Colors } from "../../../../styles/MainTheme";
import { NegativeButton } from "../../../../styles/NegativeButton";
import { PositiveButton } from "../../../../styles/PositiveButton";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
	ChosenEm,
	StyledEm,
} from "../../../../styles/drawing-tool-styles/MUISelectStyles";
import MenuItem from "@mui/material/MenuItem";
import { useThemeContext } from "../../../../custom/ThemeContext";
import { Theme, useTheme } from "@mui/material";
import { TrafficLight } from "../../../../custom/CrossroadInterface";

export type CollisionLightAssignerProps = {
	closeFunction: () => void;
	handleOnSave: (lightId: string) => void;
	trafficLights: TrafficLight[];
};

export function CollisionLightAssigner(props: CollisionLightAssignerProps) {
	const [chosenLight, setChosenLight] = useState<string>("");
	const { theme } = useThemeContext();

	const placeholder = "Select a light for the collision";
	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const WIDTH = 400;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
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

	const handleChange = (event: SelectChangeEvent) => {
		setChosenLight(event.target.value as string);
	};

	return (
		<CollisionLightAssignerModal>
			<p>
				<strong>Collision Light Assigner</strong>
			</p>
			<FormControl sx={{ m: 1, width: WIDTH, mt: 3 }}>
				<Select
					displayEmpty
					value={chosenLight}
					onChange={handleChange}
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
					{props.trafficLights.map((light) => (
						<MenuItem key={light.id} value={light.id} style={getStyles()}>
							<p>
								id: {light.id}; name: {light.name}; direction:{" "}
								{light.direction}
							</p>
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<ButtonsDiv>
				<NegativeButton onClick={props.closeFunction}>Close</NegativeButton>
				<PositiveButton
					disabled={chosenLight === ""}
					onClick={() => {
						props.handleOnSave(chosenLight);
					}}
				>
					Save
				</PositiveButton>
			</ButtonsDiv>
		</CollisionLightAssignerModal>
	);
}

const CollisionLightAssignerModal = styled(StyledModal)`
	width: fit-content;
	height: fit-content;
	left: calc(50% - 12vw);
	top: calc(50% - 18vh);
	
	padding 20px 70px;
`;
