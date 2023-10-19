import { createContext, useContext } from "react";

export type LoggedUser = {
	id: string;
	username: string;
	email: string;
	jwtToken: string;
};

export type LoggedUserContent = {
	loggedUser: LoggedUser | null;
	setLoggedUser: (u: LoggedUser) => void;
};

export const UserContext = createContext<LoggedUserContent>({
	loggedUser: null,
	setLoggedUser: (u: LoggedUser) => {
		console.log("current user ->", u.email);
	},
});

export const useUserContext = () => useContext(UserContext);
