import { LitElement, property, customElement, html, query, PropertyValues } from 'lit-element';
import { fadeWith } from '../core/animations';

/**
 * Simple <iron-image> replace using <elara-spinner>
 *
 * @export
 * @class ElaraImage
 * @extends {LitElement}
 */
@customElement('elara-image')
export class ElaraImage extends LitElement {
    @property({type: String, reflect: true})
    public src: string;

    @property({type: String, reflect: true})
    public alt: string;

    @property({type: String, reflect: true})
    public placeholder = 'Loading';

    private _listener: (ev: Event) => void;   
    private _handle: number;

    @query('.elara-image') private _img!: HTMLImageElement;

    /**
     * Styling should be made by the user of <elara-image>
     *
     * @protected
     * @returns
     * @memberof ElaraImage
     */
    protected createRenderRoot(){
        return this;
    }

    /**
     * Done that way to avoid spinner seen twice on slow 3G
     *
     * @protected
     * @param {PropertyValues} _changedProperties
     * @memberof ElaraImage
     */
    protected update(_changedProperties: PropertyValues){
        super.update(_changedProperties);
        if(_changedProperties.has('src')){
            if(this._img){
                this._img.style.visibility = 'hidden';
            }

            this._handle = null;
            if(!this.querySelector('elara-spinner')){
                this._handle = setTimeout(() => {
                    const spinner = document.createElement('elara-spinner');
                    spinner.text = this.placeholder;
                    this.prepend(spinner);
                }, 300) as unknown as number;
            }
        }
    }

    public updated(){
        this._listener = this._previewLoadListener(this._handle);
        this._img.addEventListener('load', this._listener);
    }
    
    private _previewLoadListener(timeoutHandle: number) {
        return (ev: Event) => {
            const previewed = ev.target as HTMLImageElement;
            if(previewed.complete){
                const animation = fadeWith(300, true);
                requestAnimationFrame(() => {
                    this._img.style.visibility = null;
                    this._img.animate(animation.effect, animation.options);
                    this._img.removeEventListener('load', this._listener);
                    const spin = this.querySelector('elara-spinner');
                    if(spin){
                        this.removeChild(spin);
                    }
                    
                    this._listener = null;
                    if(timeoutHandle !== undefined){
                        clearTimeout(timeoutHandle);
                    }
                });
            }
        };
    }

	public render() {
        return html`<img class="elara-image" .src=${this.src} .alt="${this.alt}" />`;
    }
}

declare global {
	interface HTMLElementTagNameMap {
		'elara-image': ElaraImage;
	}
}