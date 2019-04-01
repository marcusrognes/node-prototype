import React, { useState } from 'react';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import NOFlag from 'client/assets/flags/NO.svg';
import GBFlag from 'client/assets/flags/GB.svg';

let languageSelectorId = 0;

export const Languages = {
	nb: {
		flagUrl: NOFlag,
		label: 'Norsk',
	},
	en: {
		flagUrl: GBFlag,
		label: 'English',
	},
};

const Flag = styled.img`
	width: 32px;
`;

export default function LanguageSelector({
	value,
	flagsOnly = false,
	name = 'language',
	label,
	onChange,
	...props
}) {
	languageSelectorId++;
	let [open, setOpen] = useState(false);

	return (
		<FormControl {...props} variant="filled">
			<Select
				open={open}
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				value={
					<MenuItem>
						{Languages.nb.label} <Flag src={Languages.nb.flagUrl} />
					</MenuItem>
				}
				onChange={(e, value) => {
					onChange(value.props.value);
				}}
				input={
					<OutlinedInput
						name={name}
						id={'language-selector-' + languageSelectorId}
					/>
				}
			>
				{Object.keys(Languages).map(key => (
					<MenuItem>
						{Languages[key].label}{' '}
						<Flag src={Languages[key].flagUrl} />
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export function SelectLanguage(props) {
	return <LanguageSelector {...props} value="" onChange={value => {}} />;
}
