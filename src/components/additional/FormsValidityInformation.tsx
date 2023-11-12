import React from "react";
import {
	BaseLi,
	ButtonColors,
	InputInformationMessage,
	PlaceholderSpan,
} from "../../styles/MainStyles";

export type FormsValidityInformationProps = {
	isInputValid: boolean;
	badInputMessage: string;
};

export function FormsValidityInformation(props: FormsValidityInformationProps) {
	return !props.isInputValid ? (
		<BaseLi>
			<InputInformationMessage color={ButtonColors.RED}>
				{props.badInputMessage}
			</InputInformationMessage>
		</BaseLi>
	) : (
		<BaseLi>
			<PlaceholderSpan></PlaceholderSpan>
		</BaseLi>
	);
}
