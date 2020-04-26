import { html, customElement } from 'lit-element';

import Root from './core/strategies/Root';

import './atoms/spinner';

@customElement('elara-app')
export class ElaraApp extends Root {
	public static readonly is: string = 'elara-app';

	public get loadables(){
		return [];
	}

	public render() {
		return html`<div class="content-skeleton"><elara-spinner text="Idée en cours"></elara-spinner></div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'elara-app': ElaraApp;
	}
}