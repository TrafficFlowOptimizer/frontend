import React, { useState } from "react";
import { Day, Hour } from "../../custom/OptimizationInterface";
import { HorizontalWrapper } from "../../styles/FileUploaderStyles";
import FormControl from "@mui/material/FormControl";
import {
	ChosenEm,
	SELECT_ITEM_HEIGHT,
	SELECT_ITEM_PADDING_TOP,
	SELECT_WIDTH,
	StyledEm,
} from "../../styles/drawing-tool-styles/MUISelectStyles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Colors } from "../../styles/MainStyles";
import MenuItem from "@mui/material/MenuItem";
import { useThemeContext } from "../../custom/ThemeContext";

export type TimeIntervalPickerProps = {
	setHour: (hour: Hour | undefined) => void;
	setDay: (day: Day | undefined) => void;
};

export function TimeIntervalPicker(props: TimeIntervalPickerProps) {
	const { theme } = useThemeContext();

	const hourPlaceholder = "Select hour when the video was recorded";
	const dayPlaceholder = "Select day when the video was recorded";

	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: SELECT_ITEM_HEIGHT * 4.5 + SELECT_ITEM_PADDING_TOP,
				width: "fit-content",
				backgroundColor:
					theme === "dark" ? Colors.PRIMARY_BLACK : Colors.PRIMARY_WHITE,
			},
		},
	};

	const [chosenHour, setChosenHour] = useState<Hour | undefined>(undefined);
	const [chosenDay, setChosenDay] = useState<Day | undefined>(undefined);

	const mappedHours = new Map<number, Hour>([
		[0, Hour.T0000],
		[1, Hour.T0100],
		[2, Hour.T0200],
		[3, Hour.T0300],
		[4, Hour.T0400],
		[5, Hour.T0500],
		[6, Hour.T0600],
		[7, Hour.T0700],
		[8, Hour.T0800],
		[9, Hour.T0900],
		[10, Hour.T1000],
		[11, Hour.T1100],
		[12, Hour.T1200],
		[13, Hour.T1300],
		[14, Hour.T1400],
		[15, Hour.T1500],
		[16, Hour.T1600],
		[17, Hour.T1700],
		[18, Hour.T1800],
		[19, Hour.T1900],
		[20, Hour.T2000],
		[21, Hour.T2100],
		[22, Hour.T2200],
		[23, Hour.T2300],
	]);

	function getStyles() {
		return {
			backgroundColor:
				theme === "dark" ? Colors.PRIMARY_BLACK : Colors.PRIMARY_WHITE,
			color: theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK,
		};
	}

	const handleHourChange = (event: SelectChangeEvent) => {
		const hour = parseInt(event.target.value.toString().split(":")[0]);
		setChosenHour(mappedHours.get(hour));
		props.setHour(mappedHours.get(hour));
	};

	const handleDayChange = (event: SelectChangeEvent) => {
		setChosenDay(event.target.value as Day);
		props.setDay(event.target.value as Day);
	};

	const hourOptions = [
		"00:00",
		"01:00",
		"02:00",
		"03:00",
		"04:00",
		"05:00",
		"06:00",
		"07:00",
		"08:00",
		"09:00",
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
		"18:00",
		"19:00",
		"20:00",
		"21:00",
		"22:00",
		"23:00",
	];

	const dayOptions = [
		Day.MONDAY,
		Day.TUESDAY,
		Day.WEDNESDAY,
		Day.THURSDAY,
		Day.FRIDAY,
		Day.SATURDAY,
		Day.SUNDAY,
	];

	const stringifyHour = (hour: Hour | undefined) => {
		if (hour === undefined) {
			return "";
		}
		const hourValue = hour.valueOf();
		if (hourValue < 10) {
			return `0${hourValue}:00`;
		}
		return `${hourValue}:00`;
	};

	return (
		<HorizontalWrapper>
			<FormControl sx={{ m: 1, width: SELECT_WIDTH, mt: 3 }}>
				<Select
					displayEmpty
					value={stringifyHour(chosenHour)}
					onChange={handleHourChange}
					input={<OutlinedInput />}
					renderValue={(selected) => {
						if (selected.length === 0) {
							return <StyledEm>{hourPlaceholder}</StyledEm>;
						}

						return <ChosenEm>{selected}</ChosenEm>;
					}}
					MenuProps={MenuProps}
					inputProps={{
						"aria-label": "Without label",
						"background-color": `${
							theme === "dark"
								? Colors.PRIMARY_BLACK
								: Colors.PRIMARY_WHITE
						}`,
					}}
				>
					<MenuItem disabled value="">
						<StyledEm>{hourPlaceholder}</StyledEm>
					</MenuItem>
					{hourOptions.map((hour, index) => (
						<MenuItem key={index} value={hour} style={getStyles()}>
							<p>{hour}</p>
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl sx={{ m: 1, width: SELECT_WIDTH, mt: 3 }}>
				<Select
					displayEmpty
					value={chosenDay === undefined ? "" : chosenDay}
					onChange={handleDayChange}
					input={<OutlinedInput />}
					renderValue={(selected) => {
						if (selected.length === 0) {
							return <StyledEm>{dayPlaceholder}</StyledEm>;
						}

						return <ChosenEm>{selected.toString()}</ChosenEm>;
					}}
					MenuProps={MenuProps}
					inputProps={{
						"aria-label": "Without label",
						"background-color": `${
							theme === "dark"
								? Colors.PRIMARY_BLACK
								: Colors.PRIMARY_WHITE
						}`,
					}}
				>
					<MenuItem disabled value="">
						<StyledEm>{dayPlaceholder}</StyledEm>
					</MenuItem>
					{dayOptions.map((day, index) => (
						<MenuItem key={index} value={day} style={getStyles()}>
							<p>{day}</p>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</HorizontalWrapper>
	);
}
