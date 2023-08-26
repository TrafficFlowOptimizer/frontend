import React, { useState } from "react";
import styled from "styled-components";
import { InputInformationSpan } from "../InputInformationSpan";
import { RadioButtonsGroup } from "../RadioButtonsGroup";
import { EEIPointType, ExitEntrancePoint } from "../../../custom/CrossroadInterface";
import { RadioOption } from "../RadioButton";
import { NegativeButton } from "../../../styles/NegativeButton";
import { PositiveButton } from "../../../styles/PositiveButton";
import { BASIC_INFORMATION_ERROR_MESSAGES } from "../../../custom/drawing-tool/AuxiliaryData";
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

export type ExitEntranceCreatorProps = {
	closeFunction: () => void;
	handleOnSave: (point: ExitEntrancePoint) => void;
	checkId: (id: string) => boolean;
	point: ExitEntrancePoint;
};

export function ExitEntranceCreator(props: ExitEntranceCreatorProps) {
	const [point, setPoint] = useState(props.point);
	const [isInputValid, setInputValidity] = useState(false);
	const [dataMessage, setDataMessage] = useState("");

	const onConfirm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		const target = event.target as typeof event.target & {
			id: { value: string };
			street: { value: string };
			capacity: { value: string };
		};

		const parsedCapacity = parseInt(target.capacity.value);

		if (
			target.id.value.length === 0 ||
			target.street.value.length === 0 ||
			target.capacity.value.length === 0
		) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.zero_length);
		} else if (
			Number.isNaN(parsedCapacity) &&
			target.capacity.value !== "infinity"
		) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.invalid_capacity);
		} else if (props.checkId(target.id.value)) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.used_id);
		} else {
			setPoint({
				...point,
				id: target.id.value,
				street: target.street.value,
				capacity: target.capacity.value === "infinity" ? -1 : parsedCapacity,
			});
			setInputValidity(true);
			setDataMessage("Inputs confirmed!");
		}
	};

	const crossroadTypeOptions: RadioOption[] = [
		{ id: "entrance", text: "entrance" },
		{ id: "exit", text: "exit" },
		{ id: "intermediate", text: "intermediate" },
	];

	const handleTypeSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPoint({
			...point,
			type: event.target.value as EEIPointType,
		});
	};

	const getPointType = () => {
		if (point.type === "entrance") {
			return 0;
		} else if (point.type === "exit") {
			return 1;
		} else {
			return 2;
		}
	};

	return (
		<EEModal>
			<p>
				<strong>Fill in the data</strong>
				<br />
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				In capacity type a positive integer or "infinity". Number is only
				relevant in case of intermediate points.
			</p>
			<BaseForm onSubmit={onConfirm}>
				<BaseUl>
					<BaseLi>
						<RadioButtonsGroup
							groupLabel="Type:"
							options={crossroadTypeOptions}
							onChange={handleTypeSelection}
							chosenValueIndex={getPointType()}
						/>
					</BaseLi>
					<BaseLi>
						<label htmlFor="id">ID:</label>
						<BaseInput
							id="id"
							type="text"
							defaultValue={point.id.toString()}
						/>
					</BaseLi>
					<BaseLi>
						<label htmlFor="street">Street:</label>
						<BaseInput
							id="street"
							type="text"
							defaultValue={point.street.toString()}
						/>
					</BaseLi>
					<BaseLi>
						<label htmlFor="capacity">Capacity:</label>
						<BaseInput
							id="capacity"
							type="text"
							defaultValue={
								point.capacity === -1
									? "infinity"
									: point.capacity.toString()
							}
						/>
					</BaseLi>
				</BaseUl>
				<NeutralPositiveButton type="submit">Confirm</NeutralPositiveButton>
				<InputInformationSpan
					dataMessage={dataMessage}
					isInputValid={isInputValid}
					positiveColor={ButtonColors.GREEN}
					negativeColor={ButtonColors.RED}
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
	width: 24vw;
	height: fit-content;
	left: calc(50% - 12vw);
	
	padding 20px 30px;
`;
