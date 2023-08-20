import React from "react";
import { RadioButton, RadioOption } from "./RadioButton";
import { GroupFieldset, GroupWrapper } from "../../styles/RadioButtonStyles";

export type RadioGroupProps = {
	groupLabel: string;
	options: RadioOption[];
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function RadioButtonsGroup({ groupLabel, options, onChange }: RadioGroupProps) {
	const renderOptions = () => {
		return options.map(({ id, text }: RadioOption, index) => {
			const shortenedOptionLabel = id.replace(/\s+/g, "");
			const optionId = `radio-option-${shortenedOptionLabel}`;

			return (
				<RadioButton
					value={id}
					label={id}
					key={optionId}
					id={optionId}
					name={groupLabel}
					defaultChecked={index === 0}
					onChange={onChange}
				/>
			);
		});
	};
	return (
		<GroupFieldset>
			<p>{groupLabel}</p>
			<GroupWrapper>{renderOptions()}</GroupWrapper>
		</GroupFieldset>
	);
}
