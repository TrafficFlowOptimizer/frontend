import React from "react";
import { NegativeButton } from "../../styles/NegativeButton";
import { BaseButtonLink } from "../../styles/MainTheme";

export function LogOut() {
	return (
		<NegativeButton>
			<BaseButtonLink to="/">Log Out</BaseButtonLink>
		</NegativeButton>
	);
}
