export type RGB = [number, number, number];
export interface ColorOptions {
	alpha?: number;
	displayName: string;
	rgb: RGB;
}

export class Color {
	public readonly alpha: number = 1;
	public readonly displayName: string;
	public readonly rgb: RGB;

	public constructor(options: ColorOptions) {
		this.displayName = options.displayName;
		this.rgb = options.rgb;

		if (options.alpha) {
			this.alpha = Math.max(0, Math.min(1, options.alpha));
		}
	}

	public toString(format: 'rgb' | 'hex' = 'rgb', options?: { alpha?: number }): string {
		const hasAlpha = options && typeof options === 'object' && typeof options.alpha === 'number';
		const alpha = options && hasAlpha ? options.alpha : undefined;
		return !hasAlpha && format === 'hex' ? this.toHexString() : this.toRGBString(alpha);
	}

	public toRGBString(alpha?: number): string {
		const a = typeof alpha === 'number' ? alpha : this.alpha;
		return a === 1 ? `rgb(${this.rgb.join(', ')})` : `rgba(${this.rgb.join(', ')}, ${a})`;
	}

	public toHexString(): string {
		const [r, g, b] = this.rgb.map(d => this.hexDigit(d));

		return this.alpha === 1 ? `#${r}${g}${b}` : `#${r}${g}${b}${this.hexDigit(this.alpha * 255)}`;
	}

	protected hexDigit(d: number): string {
		const digit = Math.floor(d)
			.toString(16)
			.slice(-2);

		return digit.length === 2 ? digit : `0${digit}`;
	}
}

export const colors = {
	black: new Color({
		displayName: 'Black',
		rgb: [51, 51, 51]
	}),
	blue: new Color({
		displayName: 'Blue',
		rgb: [109, 158, 225]
	}),
	blueLight: new Color({
		displayName: 'Blue Light',
		rgb: [109, 158, 225]
	}),
	grey36: new Color({
		displayName: 'Grey 36',
		rgb: [92, 92, 92]
	}),
	grey50: new Color({
		displayName: 'Grey 50',
		rgb: [128, 128, 128]
	}),
	grey70: new Color({
		displayName: 'Grey 70',
		rgb: [179, 179, 179]
	}),
	grey90: new Color({
		displayName: 'Grey 90',
		rgb: [227, 227, 227]
	}),
	white: new Color({
		displayName: 'White',
		rgb: [255, 255, 255]
	})
};
