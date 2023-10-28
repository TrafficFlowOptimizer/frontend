import React, { useState } from "react";
import { useThemeContext } from "../../../custom/ThemeContext";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import { ResponseConnection } from "../../../custom/CrossRoadRestTypes";
import {
	ChosenEm,
	SELECT_ITEM_HEIGHT,
	SELECT_ITEM_PADDING_TOP,
	SELECT_WIDTH,
	StyledEm,
} from "../../../styles/drawing-tool-styles/MUISelectStyles";
import { Colors } from "../../../styles/MainStyles";

export type VideoCordsSelectorProps = {
	connections: ResponseConnection[];
	setChosenConnectionIds: (connectionIds: string[]) => void;
};

export function VideoCordsSelector(props: VideoCordsSelectorProps) {
	const { theme } = useThemeContext();
	const muiTheme = useTheme();

	const [chosenConnectionIds, setChosenConnectionIds] = useState<string[]>([]);

	const placeholder =
		"Select the connection id for which you've created the coordinates";
	const replacementInfo = "New choices fully replace old ones";
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

	function getStyles(name: string, personName: readonly string[], inputTheme: Theme) {
		return {
			fontWeight:
				personName.indexOf(name) === -1
					? inputTheme.typography.fontWeightRegular
					: inputTheme.typography.fontWeightMedium,
			backgroundColor:
				theme === "dark" ? Colors.PRIMARY_BLACK : Colors.PRIMARY_WHITE,
			color: theme === "dark" ? Colors.PRIMARY_WHITE : Colors.PRIMARY_BLACK,
		};
	}

	const handleChange = (event: SelectChangeEvent<typeof chosenConnectionIds>) => {
		const {
			target: { value },
		} = event;
		props.setChosenConnectionIds(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value,
		);
		setChosenConnectionIds(typeof value === "string" ? value.split(",") : value);
	};

	return (
		<div>
			<p>Cords selector</p>
			<FormControl sx={{ m: 1, width: SELECT_WIDTH, mt: 3 }}>
				<Select
					multiple
					displayEmpty
					value={chosenConnectionIds}
					onChange={handleChange}
					input={<OutlinedInput />}
					renderValue={(selected) => {
						if (selected.length === 0) {
							return <StyledEm>{placeholder}</StyledEm>;
						}

						return <ChosenEm>{selected.join(", ")}</ChosenEm>;
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
						<StyledEm>{replacementInfo}</StyledEm>
					</MenuItem>
					{props.connections.map((con) => (
						<MenuItem
							key={con.index}
							value={con.id}
							style={getStyles(con.id, chosenConnectionIds, muiTheme)}
						>
							<p>
								id: {con.index}; name: {con.name}
							</p>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
