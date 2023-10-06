import React, { useState } from "react";
import {
	FirstStageTrafficLight,
	TrafficLightType,
} from "../../../../custom/CrossroadInterface";
import {
	BaseForm,
	BaseInput,
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
} from "../../../../styles/MainTheme";
import { NegativeButton } from "../../../../styles/NegativeButton";
import { PositiveButton } from "../../../../styles/PositiveButton";
import { RadioButtonsGroup } from "../../RadioButtonsGroup";
import { NeutralPositiveButton } from "../../../../styles/NeutralButton";
import { InputInformationSpan } from "../../InputInformationSpan";
import { RadioOption } from "../../RadioButton";
import styled from "styled-components";
import { StyledModal } from "../../../../styles/modal/ModalStyles";
import { BASIC_INFORMATION_ERROR_MESSAGES } from "../../../../custom/drawing-tool/AuxiliaryData";

export type TrafficLightCreatorProps = {
	closeFunction: () => void;
	handleOnSave: (light: FirstStageTrafficLight) => void;
	trafficLight: FirstStageTrafficLight;
};

export function TrafficLightCreator(props: TrafficLightCreatorProps) {
	const [light, setLight] = useState(props.trafficLight);
	const [isInputValid, setInputValidity] = useState(false);
	const [dataMessage, setDataMessage] = useState("Confirm your choices");

	const directions = new Map<TrafficLightType, number>();
	directions.set(TrafficLightType.FORWARD, 0);
	directions.set(TrafficLightType.LEFT, 1);
	directions.set(TrafficLightType.RIGHT, 2);
	directions.set(TrafficLightType.ARROW, 3);
	directions.set(TrafficLightType.TURNING, 4);
	directions.set(TrafficLightType.LEFT_FORWARD, 5);
	directions.set(TrafficLightType.LEFT_RIGHT, 6);
	directions.set(TrafficLightType.LEFT_TURNING, 7);
	directions.set(TrafficLightType.RIGHT_FORWARD, 8);

	const onConfirm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		const target = event.target as typeof event.target & {
			name: { value: string };
		};

		if (target.name.value.length === 0) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.zero_length);
		}
		//maybe some other checks should be performed
		else {
			setLight({
				light: {
					id: light.light.id,
					name: target.name.value,
					direction: light.light.direction,
				},
				eeiPointId: light.eeiPointId,
			});
			setInputValidity(true);
			setDataMessage("Inputs confirmed!");
		}
	};

	const lightDirectionOptions: RadioOption[] = [
		{ id: "FORWARD", text: "FORWARD" },
		{ id: "LEFT", text: "LEFT" },
		{ id: "RIGHT", text: "RIGHT" },
		{ id: "ARROW", text: "ARROW" },
		{ id: "TURNING", text: "TURNING" },
		{ id: "LEFT_FORWARD", text: "LEFT_FORWARD" },
		{ id: "LEFT_RIGHT", text: "LEFT_RIGHT" },
		{ id: "LEFT_TURNING", text: "LEFT_TURNING" },
		{ id: "RIGHT_FORWARD", text: "RIGHT_FORWARD" },
	];

	const handleDirectionSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLight({
			light: {
				direction: event.target.value as TrafficLightType,
				id: light.light.id,
				name: light.light.name,
			},
			eeiPointId: light.eeiPointId,
		});
		setInputValidity(false);
		setDataMessage("Confirm your choices");
	};

	const getLightDirection = () => {
		return directions.get(light.light.direction)!;
	};

	return (
		<TrafficLightsCreatorModal>
			<p>
				<strong>Traffic Light Creator</strong>
			</p>
			<BaseForm onSubmit={onConfirm}>
				<BaseUl>
					<BaseLi>
						<p>ID: {light.light.id}</p>
					</BaseLi>
					<BaseLi>
						<label htmlFor="name">Name:</label>
						<BaseInput
							id="name"
							type="text"
							defaultValue={light.light.name}
						/>
					</BaseLi>
					<BaseLi>
						<RadioButtonsGroup
							groupLabel="Direction:"
							options={lightDirectionOptions}
							onChange={handleDirectionSelection}
							chosenValueIndex={getLightDirection()}
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
						props.handleOnSave(light);
					}}
					disabled={!isInputValid}
				>
					Save
				</PositiveButton>
			</ButtonsDiv>
		</TrafficLightsCreatorModal>
	);
}

const TrafficLightsCreatorModal = styled(StyledModal)`
	width: fit-content;
	height: fit-content;
	left: calc(50% - 12vw);
	top: calc(20% - 18vh);
	
	padding 20px 70px;
`;
