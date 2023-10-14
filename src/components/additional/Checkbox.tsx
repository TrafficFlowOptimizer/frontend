import React from "react";
import { ThemeProvider } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { tooltipTheme } from "../../custom/drawing-tool/AuxiliaryData";
import styled from "styled-components";
import { LightTheme } from "../../styles/MainStyles";

export type CheckboxProps = {
	label: string;
	description: string;
	withTooltip: boolean;
	disabled: boolean;
	isChecked: boolean;
	onChangeAction: (newValue: boolean) => void;
};

export function Checkbox(props: CheckboxProps) {
	return props.withTooltip ? (
		<CheckboxWrapper>
			<ThemeProvider theme={tooltipTheme}>
				<StyledCheckbox
					id="checkbox"
					type="checkbox"
					checked={props.isChecked}
					disabled={props.disabled}
					onChange={() => {
						props.onChangeAction(!props.isChecked);
					}}
				/>
				<Tooltip title={props.description} placement={"bottom"} arrow>
					<label htmlFor="checkbox">{props.label}</label>
				</Tooltip>
			</ThemeProvider>
		</CheckboxWrapper>
	) : (
		<CheckboxWrapper>
			<StyledCheckbox
				type="checkbox"
				checked={props.isChecked}
				disabled={props.disabled}
				onChange={() => {
					props.onChangeAction(!props.isChecked);
				}}
			/>
			<label htmlFor="checkbox">{props.label}</label>
		</CheckboxWrapper>
	);
}

const CheckboxWrapper = styled.div`
	margin: 15px;
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: space-between;
	align-items: center;
`;

const StyledCheckbox = styled.input`
	width: 1.5vw;
	height: 4vh;

	&:checked {
		background-color: #007a7e;
		position: relative;
	}

	&:disabled {
		cursor: not-allowed;
		border-color: ${LightTheme.secondary};
		background-color: ${LightTheme.secondary};
	}
`;
