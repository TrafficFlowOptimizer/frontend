import { PlaceholderSpan } from "../../styles/MainTheme";
import {
	AdaptedInvalidInputMessage,
	ValidInputMessage,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import React from "react";

export type InputInformationSpanProps = {
	dataMessage: string;
	isInputValid: boolean;
};

export function InputInformationSpan(props: InputInformationSpanProps) {
	return props.dataMessage === "" ? (
		<PlaceholderSpan></PlaceholderSpan>
	) : (
		<>
			{!props.isInputValid ? (
				<AdaptedInvalidInputMessage>
					{props.dataMessage}
				</AdaptedInvalidInputMessage>
			) : (
				<ValidInputMessage>{props.dataMessage}</ValidInputMessage>
			)}
		</>
	);
}
