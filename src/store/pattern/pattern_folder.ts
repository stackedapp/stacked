import * as fs from 'fs';
import * as path from 'path';
import Pattern from '.';
import Store from '..';

export default class PatternFolder {
	children: PatternFolder[];
	name: string;
	parent: PatternFolder;
	patterns: Pattern[];
	store: Store;

	constructor(store: Store, name: string, parent?: PatternFolder) {
		this.store = store;
		this.name = name;
		this.parent = parent;

		this.refresh();
	}

	getPath(): string {
		if (this.parent) {
			return path.join(this.parent.getPath(), this.name);
		} else {
			return path.join(this.store.styleGuidePath, 'lib', this.name);
		}
	}

	refresh(): void {
		this.patterns = [];
		this.children = [];

		const parentPath: string = this.getPath();
		fs.readdirSync(parentPath).forEach(childName => {
			const childPath = path.join(parentPath, childName);
			if (fs.lstatSync(childPath).isDirectory()) {
				if (fs.existsSync(path.join(childPath, 'index.d.ts'))
					&& fs.existsSync(path.join(childPath, 'index.js'))) {
					this.patterns.push(new Pattern(this.store, this, childName));
				} else {
					const childFolder: PatternFolder = new PatternFolder(this.store, childName, this);
					if (childFolder.patterns.length || childFolder.children.length) {
						this.children.push(childFolder);
					}
				}
			}
		});
	}
}
