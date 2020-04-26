import { property, LitElement, query, TemplateResult } from 'lit-element';
import { load, Router, bootstrap } from '../elara';

/**
 * Abtract <*-app> component strategy
 *
 * @export
 * @abstract
 * @class Root
 * @extends {LitElement}
 */
export default abstract class Root extends LitElement {
	public router = Router();

	@property({reflect: true, type: String})
	public route: string;

	@query('#content')
	protected _content: HTMLDivElement;

	private _queries = {
		DARK: '(prefers-color-scheme: dark)',
		LIGHT: '(prefers-color-scheme: light)',
	};

	private _onHashChangeListener: () => void;

	public abstract get loadables(): string[];
	public abstract render(): TemplateResult;

	public get bootstrap(){
		return bootstrap(this.loadables, this);
	}

	/**
	 * Show a page and hide menu
	 *
	 * @param {string} route
	 * @returns {Promise<void>}
	 * @memberof Root
	 */
	public async show(route: string): Promise<void> {
		this.router.navigate(route);
	}

	public connectedCallback(){
		super.connectedCallback();

		if(window.matchMedia(this._queries.DARK).matches){
			document.body.classList.add('night');
		}

		if(window.matchMedia(this._queries.LIGHT).matches){
			document.body.classList.add('day');
		}

		this._onHashChangeListener = this._onHashChange.bind(this);
		window.addEventListener('hashchange', this._onHashChangeListener, { passive: true });
	}

	public disconnectedCallback(){
		super.disconnectedCallback();
		window.removeEventListener('hashchange', this._onHashChangeListener);
	}
	
	protected createRenderRoot(){
		return this;
	}

	/**
	 * Togglee dark|light (lightswitch)
	 *
	 * @returns
	 * @memberof Root
	 */
	public switchColors(){
		const day = document.body.classList.contains('day');
		const night = document.body.classList.contains('night');

		if(day){
			document.body.classList.remove('day');
			document.body.classList.add('night');
		}

		if(night){
			document.body.classList.remove('night');
			document.body.classList.add('day');
		}

		return {
			day,
			night
		};
	}

	public firstUpdated(){
		const hashEvent = new HashChangeEvent('hashchange', {
			newURL: location.hash,
			oldURL: null
		});

		this._onHashChange(hashEvent);
	}

	protected async _onHashChange(event: HashChangeEvent): Promise<void> {
		const route = this.router.hashChange(event);
		this.route = route;

		this._content.innerHTML = '';
		await this.load(route);
	}
		
	public async load(route: string): Promise<void> {
		this._content.scrollTop = 0;
		
		return load(route, this._content);
	}
}