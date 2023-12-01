import React, { useState } from "react";
import {
	FirstStageTrafficLight,
	TrafficLightDirection,
} from "../../../../custom/CrossroadInterface";
import { useThemeContext } from "../../../../custom/ThemeContext";
import { InputInformationSpan } from "../../InputInformationSpan";
import {
	BaseForm,
	ButtonColors,
	ButtonsDiv,
	Colors,
} from "../../../../styles/MainStyles";
import { NegativeButton } from "../../../../styles/NegativeButton";
import { PositiveButton } from "../../../../styles/PositiveButton";
import { NeutralPositiveButton } from "../../../../styles/NeutralButton";
import styled from "styled-components";
import { StyledModal } from "../../../../styles/modal/ModalStyles";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
	ChosenEm,
	SELECT_ITEM_HEIGHT,
	SELECT_ITEM_PADDING_TOP,
	SELECT_WIDTH,
	StyledEm,
} from "../../../../styles/drawing-tool-styles/MUISelectStyles";
import MenuItem from "@mui/material/MenuItem";

export type TrafficLightCreatorProps = {
	closeFunction: () => void;
	handleOnSave: (light: FirstStageTrafficLight) => void;
	trafficLight: FirstStageTrafficLight;
};

export function TrafficLightCreator(props: TrafficLightCreatorProps) {
	const { theme } = useThemeContext();

	const [light, setLight] = useState(props.trafficLight);
	const [chosenLightType, setChosenLightType] = useState<string>("");
	const [isInputValid, setInputValidity] = useState(false);
	const [dataMessage, setDataMessage] = useState("Confirm your choices");

	const placeholder = "Select light type";
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

	const handleChange = (event: SelectChangeEvent) => {
		setChosenLightType(event.target.value);
		setInputValidity(false);
		setDataMessage("Confirm your choices");
	};

	const onConfirm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		setLight({
			light: {
				index: light.light.index,
				id: light.light.id,
				direction: chosenLightType as TrafficLightDirection,
			},
			eeiPointIndex: light.eeiPointIndex,
		});
		setInputValidity(true);
		setDataMessage("Inputs confirmed!");
	};

	const lightDirectionOptions = [
		"ENTIRE",
		"FORWARD",
		"LEFT",
		"RIGHT",
		"ARROW_LEFT",
		"ARROW_RIGHT",
		"UTURN",
		"LEFT_RIGHT",
		"LEFT_FORWARD",
		"RIGHT_FORWARD",
		"UTURN_LEFT",
	];

	return (
		<TrafficLightsCreatorModal>
			<p>
				<strong>Traffic Light Creator</strong>
			</p>
			<BaseForm onSubmit={onConfirm}>
				<p>ID: {light.light.index}</p>
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
							theme === "dark"
								? Colors.PRIMARY_BLACK
								: Colors.PRIMARY_WHITE
						}`,
					}}
				>
					<Select
						displayEmpty
						value={chosenLightType}
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
						{lightDirectionOptions.map((light, index) => (
							<MenuItem key={index} value={light} style={getStyles()}>
								<p>{light}</p>
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<NeutralPositiveButton type="submit">Confirm</NeutralPositiveButton>
				<InputInformationSpan
					dataMessage={dataMessage}
					isInputValid={isInputValid}
					positiveColor={ButtonColors.GREEN}
					negativeColor={ButtonColors.RED}
				/>
			</BaseForm>
			<ButtonsDiv>
				<NegativeButton onClick={props.closeFunction}>Close</NegativeButton>
				<PositiveButton
					onClick={() => {
						props.handleOnSave(light);
					}}
					disabled={!isInputValid}
				>
					Save
				</PositiveButton>
			</ButtonsDiv>
		</TrafficLightsCreatorModal>
	);
}

const TrafficLightsCreatorModal = styled(StyledModal)`
	width: 25vw;
	height: fit-content;
	left: calc(50% - 15vw);
	top: calc(20% - 18vh);
	
	padding 20px 70px;
`;
