import React, { InputHTMLAttributes } from "react";

import { RadioButtonWrapper, Radio } from "../../styles/RadioButtonStyles";

export interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	id: string;
	error?: boolean;
}

export type RadioOption = {
	id: string;
	text: string;
};

export function RadioButton({ label, id, ...rest }: RadioButtonProps) {
	return (
		<RadioButtonWrapper>
			<Radio type="radio" id={id} {...rest} />
			<label htmlFor={id}>{label}</label>
		</RadioButtonWrapper>
	);
}
