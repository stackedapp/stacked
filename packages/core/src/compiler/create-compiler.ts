import { compilerSafeName } from './compiler-safe-name';
import * as Path from 'path';
import * as QueryString from 'querystring';
import * as webpack from 'webpack';
import * as Fs from 'fs';
import * as resolve from 'resolve';

// memory-fs typings on @types are faulty
const MemoryFs = require('memory-fs');

export interface CompilerPattern {
	id: string;
	path: string;
}

export function createCompiler(
	patterns: CompilerPattern[],
	options: { id: string; cwd: string; infrastructure: boolean }
): webpack.Compiler {
	const entry: { [name: string]: string } = {};

	const components = patterns.reduce((acc, pattern) => {
		(acc as any)[compilerSafeName(pattern.id)] = `./${Path.relative(options.cwd, pattern.path)
			.split(Path.sep)
			.join('/')}`;
		return acc;
	}, {});

	const loaderPath = resolve.sync('meetalva-loader');

	entry[options.id] = `${loaderPath}?${QueryString.stringify({
		cwd: options.cwd,
		components: JSON.stringify(components)
	})}!`;

	const compiler = webpack({
		mode: 'development',
		context: options.cwd,
		entry,
		output: {
			filename: '[name].js',
			library: '[name]',
			libraryTarget: 'window',
			path: '/'
		}
	});

	compiler.outputFileSystem = new MemoryFs() as any;
	return compiler;
}
