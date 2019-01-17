import * as T from '../types';
import { builtinPatternLibrary } from '../model';
import { AbstractMigration, MigrationItem } from './abstract-migration';
import { camelCase } from 'lodash';

export type ZeroOneMigrationInput = MigrationItem<T.VersionZeroSerializedProject>;
export type ZeroOneMigrationOutput = MigrationItem<T.VersionOneSerializedProject>;

export class ZeroOneMigration
	implements AbstractMigration<T.VersionZeroSerializedProject, T.VersionOneSerializedProject> {
	public readonly inputVersion = 0;
	public readonly outputVersion = 1;

	private replaceBuiltins(
		project: T.VersionZeroSerializedProject,
		oldBuiltin: T.SerializedPatternLibrary
	): void {
		oldBuiltin.patterns.forEach(oldPattern => {
			const newPattern = builtinPatternLibrary.getPatternByType(
				oldPattern.type as T.PatternType
			);

			if (!newPattern) {
				return;
			}

			oldPattern.slots.forEach(slot => {
				const newSlot = newPattern.getSlotByContextId(slot.contextId);

				if (!newSlot) {
					return;
				}

				project.elementContents.filter(c => c.slotId === slot.id).forEach(content => {
					content.slotId = newSlot.getId();
				});
			});

			project.elements.filter(e => e.patternId === oldPattern.id).forEach(e => {
				e.patternId = newPattern.getId();

				e.propertyValues = e.propertyValues
					.map(pv => {
						const oldProperty = oldBuiltin.patternProperties.find(p => p.id === pv[0]);

						if (!oldProperty) {
							return;
						}

						const newPatternProp = newPattern.getPropertyByContextId(
							camelCase(oldProperty.contextId)
						);

						if (!newPatternProp) {
							return;
						}

						return [newPatternProp.getId(), pv[1]];
					})
					.filter((pv): pv is [string, unknown] => typeof pv !== 'undefined');
			});
		});

		project.patternLibraries.splice(
			project.patternLibraries.indexOf(oldBuiltin),
			1,
			builtinPatternLibrary.toJSON()
		);
	}

	public async transform(item: ZeroOneMigrationInput): Promise<ZeroOneMigrationOutput> {
		const { project } = item;
		const oldBuiltin = project.patternLibraries.find(p => p.origin === 'built-in');

		if (
			oldBuiltin &&
			!project.patternLibraries.some(lib => lib.id === builtinPatternLibrary.getId())
		) {
			this.replaceBuiltins(project, oldBuiltin);
		}

		return {
			steps: item.steps,
			project: {
				...project,
				version: 1
			}
		};
	}
}
