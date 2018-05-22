import * as React from 'react';

import { colors } from '../../lsg/patterns/colors';
import Copy from '../../lsg/patterns/copy';
import { Headline } from '../../lsg/patterns/headline';
import Space, { SpaceSize } from '../../lsg/patterns/space';
import { Store } from '../../store/store';
import styled from 'styled-components';

export const PageListPreview: React.StatelessComponent = props => {
	const project = Store.getInstance().getCurrentProject();
	if (!project) {
		return <>props.children</>;
	}
	const dateString = new Intl.DateTimeFormat().format(project.getLastChangedDate());
	return (
		<StyledPageListPreview>
			<Space size={[SpaceSize.XXL * 3]}>
				<Space size={[SpaceSize.S, SpaceSize.S, SpaceSize.XXXL]}>
					<Headline order={1} tagName="h1" textColor={colors.grey20}>
						{project.getName()}
					</Headline>
					<Copy textColor={colors.grey60}>
						Last change: {dateString} by {project.getLastChangedAuthor()}
					</Copy>
				</Space>
				{props.children}
			</Space>
		</StyledPageListPreview>
	);
};

const StyledPageListPreview = styled.div`
	box-sizing: border-box;
	overflow: auto;
	width: 100%;
	min-height: 100vh;
`;