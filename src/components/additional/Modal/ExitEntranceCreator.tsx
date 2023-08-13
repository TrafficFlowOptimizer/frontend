import React, { useState } from "react";
import { NegativeButton } from "../../../styles/NegativeButton";
import { PositiveButton } from "../../../styles/PositiveButton";
import {
	BASIC_INFORMATION_ERROR_MESSAGES,
	EXITS_ENTRANCES_TEMPLATE,
} from "../../../custom/drawing-tool/AuxiliaryData";
import { StyledModal } from "../../../styles/modal/ModalStyles";
import {
	BaseForm,
	BaseInput,
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
} from "../../../styles/MainTheme";
import { NeutralPositiveButton } from "../../../styles/NeutralButton";
import { InputInformationSpan } from "../InputInformationSpan";
import { TwoChoicesToggle } from "../TwoChoicesToggle";
import { ExitEntrancePoint } from "../../../custom/CrossroadInterface";
import styled from "styled-components";

export type ExitEntranceCreatorProps = {
	closeFunction: () => void;
	handleOnSave: (point: ExitEntrancePoint) => void;
};

export function ExitEntranceCreator(props: ExitEntranceCreatorProps) {
	const [point, setPoint] = useState(EXITS_ENTRANCES_TEMPLATE);
	const [isInputValid, setInputValidity] = useState(false);
	const [dataMessage, setDataMessage] = useState("");

	const onConfirm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		const target = event.target as typeof event.target & {
			id: { value: string };
			street: { value: string };
		};

		if (target.id.value.length === 0 || target.street.value.length === 0) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.zero_length);
		} else {
			setPoint({ ...point, id: target.id.value, street: target.street.value });
			setInputValidity(true);
			setDataMessage("Inputs confirmed!");
		}
	};

	return (
		<EEModal>
			<p>
				<strong>Fill in the data</strong>
			</p>
			<BaseForm onSubmit={onConfirm}>
				<BaseUl>
					{/*TODO: Saving*/}
					<BaseLi>
						<TwoChoicesToggle
							handleOnChange={() => {
								if (point.type == "entrance") {
									setPoint({ ...point, type: "exit" });
								} else {
									setPoint({ ...point, type: "entrance" });
								}
							}}
							options={["exit", "entrance"]}
							name="pointTypeChoice"
							labelMessage="Type:"
							colors={[ButtonColors.ORANGE, ButtonColors.BLUE]}
						/>
					</BaseLi>
					<BaseLi>
						<label htmlFor="id">ID:</label>
						<BaseInput id="id" type="text" />
					</BaseLi>
					<BaseLi>
						<label htmlFor="street">Street:</label>
						<BaseInput id="street" type="text" />
					</BaseLi>
				</BaseUl>
				<NeutralPositiveButton type="submit">Confirm</NeutralPositiveButton>
				<InputInformationSpan
					dataMessage={dataMessage}
					isInputValid={isInputValid}
				/>
			</BaseForm>
			<ButtonsDiv>
				<NegativeButton onClick={props.closeFunction}>Close</NegativeButton>
				<PositiveButton
					onClick={() => {
						props.handleOnSave(point);
					}}
					disabled={!isInputValid}
				>
					Save
				</PositiveButton>
			</ButtonsDiv>
		</EEModal>
	);
}

const EEModal = styled(StyledModal)`
	width: 18vw;
	height: fit-content;
	left: calc(50% - 9vw);
	
	padding 20px 30px;
`;
