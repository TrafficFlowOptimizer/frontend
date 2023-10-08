import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../custom/UserContext";
import axios from "axios";
import { Crossroad, CrossroadType } from "../../custom/CrossroadInterface";
import {
	BASIC_INFORMATION_ERROR_MESSAGES,
	COUNTRIES,
	CROSSROAD_MODEL_TEMPLATE,
} from "../../custom/drawing-tool/AuxiliaryData";
import {
	capitalizeFirstLetter,
	fakeCrossroadIdGetter,
} from "../../custom/drawing-tool/AuxiliaryFunctions";
import { CitiesResponse } from "../../custom/drawing-tool/AuxiliaryTypes";
import { TwoChoicesToggle } from "../additional/TwoChoicesToggle";
import { InputInformationSpan } from "../additional/InputInformationSpan";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { PositiveButton } from "../../styles/PositiveButton";
import { NegativeButton } from "../../styles/NegativeButton";
import { CrossroadScreenshot } from "../../styles/drawing-tool-styles/GeneralStyles";
import {
	BaseForm,
	BaseInput,
	BaseLi,
	ButtonColors,
	ButtonsDiv,
	ContainerDiv,
	HorizontalBaseUl,
} from "../../styles/MainTheme";

export function BasicInformation() {
	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);
	const navigate = useNavigate();
	const { loggedUser } = useUserContext();

	const [isInputValid, setInputValidity] = useState(false);
	const [dataMessage, setDataMessage] = useState("");
	const [crossroad, setCrossroadData] = useState<Crossroad>({
		...CROSSROAD_MODEL_TEMPLATE,
		creatorId: loggedUser === null ? "1" : loggedUser.id,
	});

	const [visibilityType, setVisibilityType] = useState(CrossroadType.PRIVATE);

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []);

	const onNext = () => {
		navigate("../entrances-and-exits", {
			state: {
				crossroad: crossroad,
			},
		});
	};

	const onConfirm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		const target = event.target as typeof event.target & {
			name: { value: string };
			country: { value: string };
			city: { value: string };
			district: { value: string };
		};

		if (
			target.name.value.length === 0 ||
			target.country.value.length === 0 ||
			target.city.value.length === 0 ||
			target.district.value.length === 0
		) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.zero_length);
			return;
		}

		const potentialData = {
			name: target.name.value,
			country: capitalizeFirstLetter(target.country.value),
			city: capitalizeFirstLetter(target.city.value),
			district: capitalizeFirstLetter(target.district.value),
		};

		if (potentialData.country === "Usa") {
			potentialData.country = "United States";
		}

		if (!COUNTRIES.includes(potentialData.country)) {
			setInputValidity(false);
			setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.invalid_country);
			return;
		}

		axios
			.post<CitiesResponse>(
				"https://countriesnow.space/api/v0.1/countries/cities",
				{
					country: potentialData.country,
				},
			)
			.then((response) => {
				if (!response.data.data.includes(potentialData.city)) {
					setInputValidity(false);
					setDataMessage(BASIC_INFORMATION_ERROR_MESSAGES.invalid_city);
					return;
				} else {
					setCrossroadData({
						...crossroad,
						id: fakeCrossroadIdGetter(),
						name: potentialData.name,
						location: `${
							potentialData.country === "United States"
								? "USA"
								: potentialData.country
						}, ${potentialData.city}, ${potentialData.district}`,
						type: visibilityType,
					});

					setInputValidity(true);
					setDataMessage("Inputs confirmed!");
				}
			})
			.catch((error) => {
				setInputValidity(false);
				setDataMessage(`City validation error ${error}`);
				return;
			});
	};

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	return (
		<ContainerDiv>
			<CrossroadScreenshot
				src={
					crossroadImage === undefined
						? localStorage.getItem("crossroadMap")!
						: crossroadImage
				}
				alt="Map screenshot"
			/>
			<BaseForm onSubmit={onConfirm}>
				<p>
					<b>Basic information:</b>
				</p>
				<HorizontalBaseUl>
					<BaseLi>
						<label htmlFor="name">Name:</label>
						<BaseInput id="name" type="text" />
					</BaseLi>
					<BaseLi>
						<label htmlFor="country">Country:</label>
						<BaseInput id="country" type="text" />
					</BaseLi>
					<BaseLi>
						<label htmlFor="city">City:</label>
						<BaseInput id="city" type="text" />
					</BaseLi>
					<BaseLi>
						<label htmlFor="district">District:</label>
						<BaseInput id="district" type="text" />
					</BaseLi>
				</HorizontalBaseUl>
				<HorizontalBaseUl>
					<BaseLi>
						<TwoChoicesToggle
							handleOnChange={() => {
								if (visibilityType === CrossroadType.PRIVATE) {
									setVisibilityType(CrossroadType.PUBLIC);
								} else {
									setVisibilityType(CrossroadType.PRIVATE);
								}
							}}
							options={[CrossroadType.PRIVATE, CrossroadType.PUBLIC]}
							name="typeChoice"
							labelMessage="Type:"
							disabled={false}
						/>
					</BaseLi>
					<BaseLi>
						<NeutralPositiveButton type="submit">
							Confirm
						</NeutralPositiveButton>
					</BaseLi>
				</HorizontalBaseUl>
				<InputInformationSpan
					dataMessage={dataMessage}
					isInputValid={isInputValid}
					positiveColor={ButtonColors.GREEN}
					negativeColor={ButtonColors.RED}
				/>
			</BaseForm>
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
				<PositiveButton onClick={onNext} disabled={!isInputValid}>
					Next
				</PositiveButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}
