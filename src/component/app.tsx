import { Chrome } from './container/chrome';
import { remote } from 'electron';
import { ElementList } from './container/element_list';
import { IconName, IconRegistry } from '../lsg/patterns/icons';
import Layout from '../lsg/patterns/layout';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import { PatternList } from './container/pattern_list';
import {PatternNavigation} from './container/pattern_navigation';
import { ProjectList } from './container/project_list';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Store } from '../store';
import styledComponents from 'styled-components';

const ElementPane = styledComponents.div`
	display: flex;
	flex-direction: column;
	flex-basis: 350px;
	border: 1px solid #ccc;
`;

const ProjectsPane = styledComponents.div`
	flex: 2 0 0px;
	border-bottom: 1px solid #ccc;
`;

const PatternsPane = styledComponents.div`
	flex: 3 0 0px;
`;

const PreviewPane = styledComponents.div`
	flex: 2 0 0px;
`;

interface AppProps {
	store: Store;
}

@observer
class App extends React.Component<AppProps> {
	public constructor(props: AppProps) {
		super(props);
	}

	public render(): JSX.Element {
		// Todo: project and page don't update on page change
		const project = this.props.store.getCurrentProject();
		const page = this.props.store.getCurrentPage();
		const title = `${project && project.getName()} - ${page && page.getName()}`;

		return (
			<Layout directionVertical>
				<Chrome title={title} />
				<Layout>
					<Layout directionVertical>
						<ProjectsPane>
							<ProjectList store={this.props.store} />
						</ProjectsPane>

						<PatternsPane>
							<PatternNavigation store={this.props.store} />
							<PatternList store={this.props.store} />
						</PatternsPane>
					</Layout>

					<PreviewPane
						dangerouslySetInnerHTML={{
							__html:
								'<webview style="height: 100%;" src="./preview.html" partition="electron" nodeintegration />'
						}}
					/>

					<ElementPane>
						<ElementList store={this.props.store} />
					</ElementPane>

					<IconRegistry names={IconName} />

				</Layout>
				<DevTools />
			</Layout>
		);
	}
}

const store = new Store();
store.openStyleguide('../stacked-example');
store.openPage('my-project', 'mypage');
store.setAppTitle(remote.getCurrentWindow().getTitle());

ReactDom.render(<App store={store} />, document.getElementById('app'));
