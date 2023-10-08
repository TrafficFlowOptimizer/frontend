import { EEIPointType, TrafficLight } from "../CrossroadInterface";
import { ButtonColors, Colors } from "../../styles/MainTheme";

export const capitalizeFirstLetter = (str: string): string => {
	const splits = str
		.split(" ")
		.map((elem) => elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase());

	return splits.join(" ");
};

export const fakeCrossroadIdGetter = (): string => {
	return "1";
};

export const matchEEIPointTypeWithColor = (
	type: EEIPointType,
): ButtonColors | Colors => {
	if (type === "entrance") {
		return ButtonColors.BLUE;
	} else if (type === "exit") {
		return ButtonColors.ORANGE;
	} else {
		return ButtonColors.GREEN;
	}
};

export const getTrafficLightName = (
	lights: TrafficLight[],
	lightId: string,
): string => {
	for (const tl of lights) {
		if (tl.id === lightId) {
			return tl.name;
		}
	}
	return ""; //Should never happen, but it would be cleaner to throw some kind of exception here
};
