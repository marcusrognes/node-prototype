import React, { useState } from 'react';
import styled, { css } from 'styled-components';
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
	width: 16px;
	float: right;
	${({ label }) =>
		label &&
		css`
			margin: 5px 10px 0 0;
		`}
`;

const StyledLabelMenuItem = styled.div`
	position: absolute;
	display: block;
    box-sizing: content-box;
	text-align: left;
	top: 0;
    bottom: 0;
	left: 0;
	width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    line-height: 24px;
    font-size: 1rem;
    box-sizing: border-box;
    font-weight: 400;
    padding-top: 17px;
    padding-bottom: 11px;
}
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
			<StyledLabelMenuItem>
				{Languages.nb.label} <Flag label src={Languages.nb.flagUrl} />
			</StyledLabelMenuItem>
			<Select
				open={open}
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				value={value}
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
