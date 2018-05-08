import { colors } from '../colors';
import { fonts } from '../fonts';
import * as React from 'react';
import { getSpace, SpaceSize } from '../space';
import styled from 'styled-components';

export interface PropertyLabelProps {
	label: string;
}

const StyledLabel = styled.span`
	display: inline-block;
	font-size: 12px;
	font-family: ${fonts().NORMAL_FONT};
	color: ${colors.grey50.toString()};
	width: 30%;
	padding: ${getSpace(SpaceSize.XS) + getSpace(SpaceSize.XXS)}px 0 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis
	user-select: none;
	cursor: default;
`;

export const PropertyLabel: React.StatelessComponent<PropertyLabelProps> = props => {
	const { label } = props;

	return <StyledLabel title={label}>{label}</StyledLabel>;
};

export default PropertyLabel;
