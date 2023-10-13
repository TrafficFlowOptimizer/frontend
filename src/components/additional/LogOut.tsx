import React from "react";
import { NegativeButton } from "../../styles/NegativeButton";
import { BaseButtonLink } from "../../styles/MainStyles";

export function LogOut() {
	return (
		<NegativeButton>
			<BaseButtonLink to="/">Log out</BaseButtonLink>
		</NegativeButton>
	);
}
