import { LitElement } from 'lit-element';

export default class Page extends LitElement {
    public get head(){
        return {
            title: null,
            description: null,
            type: null,
            image: null,
            slug: null
        };
    }

    createRenderRoot(){
        return this;
    }
}