import React, { useState } from "react";
import { ToggleContainer, AdaptedToggleLabel } from "../../styles/ToggleStyles";
import { ButtonColors, Colors } from "../../styles/MainTheme";
import styled from "styled-components";

export type TwoChoicesToggleProps = {
	handleOnChange: () => void;
	options: any[];
	name: string;
	labelMessage: string;
	colors?: (ButtonColors | Colors)[];
};

export function TwoChoicesToggle(props: TwoChoicesToggleProps) {
	const checkedHolder = props.options[0];
	const [chosen, setChosen] = useState(props.options[0]);

	return (
		<ToggleContainer>
			<LabelP>
				<strong>{props.labelMessage}</strong>
			</LabelP>
			<p>{props.options[1]}</p>
			<AdaptedToggleLabel
				htmlFor={props.name}
				checked={chosen !== checkedHolder}
				checkedColor={
					props.colors !== undefined ? props.colors[1] : ButtonColors.GREEN
				}
				uncheckedColor={
					props.colors !== undefined ? props.colors[0] : ButtonColors.ORANGE
				}
			>
				toggle me
				<input
					id={props.name}
					type="checkbox"
					checked={chosen !== checkedHolder}
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
			<p>{props.options[0]}</p>
		</ToggleContainer>
	);
}

const LabelP = styled.p`
	margin-right: 8px;
`;
