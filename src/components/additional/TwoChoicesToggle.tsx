import React, { useState } from "react";
import { ToggleContainer, AdaptedToggleLabel } from "../../styles/ToggleStyles";
import { ButtonColors, Colors } from "../../styles/MainTheme";
import Tooltip from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import styled from "styled-components";

export type TwoChoicesToggleProps = {
	handleOnChange: () => void;
	options: any[];
	name: string;
	labelMessage: string;
	disabled: boolean;
	colors?: (ButtonColors | Colors)[];
	optionsDescriptions?: string[];
};

export function TwoChoicesToggle(props: TwoChoicesToggleProps) {
	const checkedHolder = props.options[0];
	const [chosen, setChosen] = useState(props.options[0]);

	return (
		<ToggleContainer>
			<LabelP>{props.labelMessage}</LabelP>
			{props.optionsDescriptions ? (
				<Tooltip
					title={props.optionsDescriptions[1]}
					TransitionComponent={Zoom}
					enterDelay={75}
					leaveDelay={450}
					arrow
					placement={"left"}
				>
					<p>{props.options[1]}</p>
				</Tooltip>
			) : (
				<p>{props.options[1]}</p>
			)}
			<AdaptedToggleLabel
				htmlFor={props.name}
				checked={chosen !== checkedHolder}
				checkedColor={
					props.colors !== undefined ? props.colors[1] : ButtonColors.GREEN
				}
				uncheckedColor={
					props.colors !== undefined ? props.colors[0] : ButtonColors.ORANGE
				}
				disabled={props.disabled}
			>
				toggle me
				<input
					id={props.name}
					type="checkbox"
					checked={chosen !== checkedHolder}
					disabled={props.disabled}
					onChange={() => {
						if (chosen !== checkedHolder) {
							setChosen(checkedHolder);
						} else {
							setChosen(props.options[1]);
						}
						props.handleOnChange();
					}}
				/>
			</AdaptedToggleLabel>
			{props.optionsDescriptions ? (
				<Tooltip
					title={props.optionsDescriptions[0]}
					TransitionComponent={Zoom}
					enterDelay={75}
					leaveDelay={450}
					arrow
					placement={"right"}
				>
					<p>{props.options[0]}</p>
				</Tooltip>
			) : (
				<p>{props.options[0]}</p>
			)}
		</ToggleContainer>
	);
}

const LabelP = styled.p`
	margin-right: 8px;
`;
