import { ButtonColors, Colors, PlaceholderSpan } from "../../styles/MainStyles";
import { AdaptedInputInformationMessage } from "../../styles/drawing-tool-styles/GeneralStyles";
import React from "react";

export type InputInformationSpanProps = {
	dataMessage: string;
	isInputValid: boolean;
	positiveColor: ButtonColors | Colors;
	negativeColor: ButtonColors | Colors;
};

export function InputInformationSpan(props: InputInformationSpanProps) {
	return props.dataMessage === "" ? (
		<PlaceholderSpan></PlaceholderSpan>
	) : (
		<>
			{!props.isInputValid ? (
				<AdaptedInputInformationMessage color={props.negativeColor}>
					{props.dataMessage}
				</AdaptedInputInformationMessage>
			) : (
				<AdaptedInputInformationMessage color={props.positiveColor}>
					{props.dataMessage}
				</AdaptedInputInformationMessage>
			)}
		</>
	);
}
