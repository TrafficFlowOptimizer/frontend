import React, { useEffect, useState } from "react";
import meme1 from "../../assets/memes/meme_1.jpg";
import meme2 from "../../assets/memes/meme_2.png";
import meme3 from "../../assets/memes/meme_3.jpg";
import meme4 from "../../assets/memes/meme_4.png";
import meme5 from "../../assets/memes/meme_5.jpeg";
import meme6 from "../../assets/memes/meme_6.jpg";
import meme7 from "../../assets/memes/meme_7.jpg";
import meme8 from "../../assets/memes/meme_8.jpg";
import meme9 from "../../assets/memes/meme_9.webp";
import meme10 from "../../assets/memes/meme_10.gif";
import meme1_uc from "../../assets/memes/meme_uc_1.webp";
import meme2_uc from "../../assets/memes/meme_uc_2.gif";
import styled from "styled-components";

export function Memes() {
	const memes = [
		meme1,
		meme2,
		meme3,
		meme4,
		meme5,
		meme6,
		meme7,
		meme8,
		meme9,
		meme10,
		meme1_uc,
		meme2_uc,
	];
	const [image, setImage] = useState(meme1);

	useEffect(() => {
		const timer = setInterval(() => {
			setImage((prevImage) => {
				let i = Math.floor(Math.random() * memes.length);
				while (prevImage === memes[i]) {
					i = Math.floor(Math.random() * memes.length);
				}
				return memes[i];
			});
		}, 7000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div>
			<StyledMeme src={image} alt="meme" />
		</div>
	);
}

export const StyledMeme = styled.img`
	width: 30rem;
	height: 30rem;

	margin: 20px;
`;
