import React, { useEffect, useRef, useState } from "react";
import { useThemeContext } from "../../custom/ThemeContext";
import {
	StyledDropdownContainer,
	StyledDropdownInput,
	StyledDropdownMenu,
	StyledDropdownItem,
	StyledSearchBox,
	StyledSearchBoxInput,
	StyledDropdownSelectedValue,
} from "../../styles/DropdownStyles";
import { DarkTheme, LightTheme } from "../../styles/MainStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export type DropdownProps = {
	placeholder: string;
	options: (number | string)[];
	isSearchable: boolean;
	onChange: (newValue: number | string) => void;
};

export function Dropdown(props: DropdownProps) {
	const { theme } = useThemeContext();
	const [showOptions, setShowOptions] = useState(false);
	const [selectedValue, setSelectedValue] = useState<number | string | null>(null);
	const [searchValue, setSearchValue] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);
	const inputRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: any) => {
			if (inputRef.current && !inputRef.current.contains(e.target)) {
				setShowOptions(false);
			}
		};

		window.addEventListener("click", handler);
		return () => {
			window.removeEventListener("click", handler);
		};
	});

	useEffect(() => {
		setSearchValue("");
		if (showOptions && searchRef.current) {
			searchRef.current.focus();
		}
	}, [showOptions]);

	const handleIconClick = (e: any) => {
		setShowOptions(!showOptions);
	};

	const onItemClick = (option: number | string) => {
		setSelectedValue(option);
		props.onChange(option);
	};

	const isSelected = (option: number | string) => {
		return selectedValue !== null && selectedValue === option;
	};

	const onSearch = (event: any) => {
		if (event.target !== null) {
			setSearchValue(event.target.value);
		}
	};

	const getOptions = () => {
		if (!searchValue) {
			return props.options;
		}
		return props.options.filter(
			(option: string | number) =>
				option.toString().toLowerCase().indexOf(searchValue.toLowerCase()) ===
				0,
		);
	};

	const getDisplay = () => {
		if (selectedValue) {
			if (selectedValue === -1) {
				return "unlimited";
			}
			return selectedValue;
		}
		return props.placeholder;
	};

	return (
		<StyledDropdownContainer>
			<StyledDropdownInput
				ref={inputRef}
				onClick={(event) => handleIconClick(event)}
			>
				<StyledDropdownSelectedValue>
					{getDisplay()}
				</StyledDropdownSelectedValue>
				<div className="dropdown-tools">
					<div className="dropdown-tool">
						<FontAwesomeIcon
							icon={faCaretDown}
							style={{
								color:
									theme === "dark"
										? LightTheme.primary
										: DarkTheme.primary,
								margin: "3px",
							}}
						/>
					</div>
				</div>
				{showOptions && (
					<StyledDropdownMenu>
						{props.isSearchable && (
							<StyledSearchBox>
								<StyledSearchBoxInput
									onChange={onSearch}
									value={searchValue}
									ref={searchRef}
								/>
							</StyledSearchBox>
						)}
						{getOptions().map((option: number | string) => (
							<StyledDropdownItem
								onClick={() => onItemClick(option)}
								isSelected={isSelected(option)}
								key={option.valueOf()}
							>
								{option === -1 ? "unlimited" : option.toString()}
							</StyledDropdownItem>
						))}
					</StyledDropdownMenu>
				)}
			</StyledDropdownInput>
		</StyledDropdownContainer>
	);
}
