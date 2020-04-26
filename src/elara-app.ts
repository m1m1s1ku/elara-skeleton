import { html, customElement } from 'lit-element';

import Root from './core/strategies/Root';

import './atoms/spinner';

@customElement('elara-app')
export class ElaraApp extends Root {
	public static readonly is: string = 'elara-app';

	public get loadables(){
		return [
			// note: on every app part thus the only loadable
		];
	}

	public render() {
		return html`<elara-spinner text="Idée en cours"></elara-spinner>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'elara-app': ElaraApp;
	}
}