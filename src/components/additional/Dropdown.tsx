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
import { DarkTheme, LightTheme } from "../../styles/MainTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export type DropdownProps = {
	placeholder: string;
	options: number[];
	isSearchable: boolean;
	onChange: (newValue: number) => void;
};

export function Dropdown(props: DropdownProps) {
	const { theme } = useThemeContext();
	const [showOptions, setShowOptions] = useState(false);
	const [selectedValue, setSelectedValue] = useState<number | null>(null);
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
		// e.stopPropagation();
		setShowOptions(!showOptions);
	};

	const onItemClick = (option: number) => {
		setSelectedValue(option);
		props.onChange(option);
	};

	const isSelected = (option: number) => {
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
			(option: number) =>
				option.toString().toLowerCase().indexOf(searchValue.toLowerCase()) ===
				0,
		);
	};

	const Icon = () => {
		return (
			<svg
				height="20"
				width="20"
				viewBox="0 0 20 20"
				style={{
					color: theme === "dark" ? LightTheme.primary : DarkTheme.primary,
				}}
			>
				<path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
			</svg>
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
						{getOptions().map((option) => (
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
