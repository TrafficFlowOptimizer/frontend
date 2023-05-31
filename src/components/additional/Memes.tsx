import React, { useEffect, useState } from "react";
import meme0 from "../../assets/memes/changing_code.jpg";
import meme1 from "../../assets/memes/meme_1.jpg";
import meme2 from "../../assets/memes/meme_2.png";
import meme3 from "../../assets/memes/meme_3.jpg";
import meme4 from "../../assets/memes/meme_4.png";
import meme5 from "../../assets/memes/everybodystaycalm-staycalm.gif";
import styled from "styled-components";

export function Memes() {
	const memes = [meme0, meme1, meme2, meme3, meme4, meme5];
	const [image, setImage] = useState(meme0);

	useEffect(() => {
		const timer = setInterval(() => {
			setImage((prevImage) => {
				for (let i = 0; i < memes.length - 1; i++) {
					if (prevImage === memes[i]) return memes[i + 1];
				}
				return memes[0];
			});
		}, 4000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div>
			<StyledMeme src={image} alt="meme" />
		</div>
	);
}

export const StyledMeme = styled.img`
	width: 300px;
	height: 300px;

	margin: 20px;
`;
