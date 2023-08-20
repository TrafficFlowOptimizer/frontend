import { EEIPointType } from "../CrossroadInterface";
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
