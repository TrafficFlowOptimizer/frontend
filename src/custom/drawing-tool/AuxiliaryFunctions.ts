import { Connection, EEIPointType } from "../CrossroadInterface";
import { ButtonColors, Colors } from "../../styles/MainStyles";

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
	if (type === "ENTRANCE") {
		return ButtonColors.BLUE;
	} else if (type === "EXIT") {
		return ButtonColors.ORANGE;
	} else {
		return ButtonColors.GREEN;
	}
};

export const getConnectionName = (
	connections: Connection[],
	connectionIndex: number,
): string => {
	for (const con of connections) {
		if (connectionIndex === con.index) {
			return con.name;
		}
	}
	return ""; //Should never happen, but it would be cleaner to throw some kind of exception here
};

export const getNewId = (
	firstFreeId: number,
	setNewFreeId: (arg: number) => void,
): number => {
	const newId = firstFreeId;
	setNewFreeId(firstFreeId + 1);
	return newId;
};

export const getUserJWTToken = (): string => {
	const sessionData = sessionStorage.getItem("loggedUser");
	if (sessionData !== null) {
		return JSON.parse(sessionData).jwtToken;
	}
	return "";
};
