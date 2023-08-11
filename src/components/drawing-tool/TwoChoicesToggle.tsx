import React, { useState } from "react";
import { ToggleContainer, AdaptedToggleLabel } from "../../styles/ToggleStyles";

export type TwoChoicesToggleProps = {
	handleOnChange: () => void;
	options: any[];
	name: string;
	labelMessage: string;
};

export function TwoChoicesToggle(props: TwoChoicesToggleProps) {
	const checkedHolder = props.options[0];
	const [chosen, setChosen] = useState(props.options[0]);

	return (
		<ToggleContainer>
			<p>{props.labelMessage} </p>
			<p>{props.options[1]}</p>
			<AdaptedToggleLabel htmlFor={props.name} checked={chosen !== checkedHolder}>
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
