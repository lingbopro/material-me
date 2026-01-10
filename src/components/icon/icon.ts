// import { useElement } from '../../core/element';
// import template from './icon.html';
import style from './icon.css';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

const name = 'mm-icon';
// const props = {};

// export class Icon extends useElement({
//   template,
//   style,
//   props,
// }) {}

// Icon.define(name);

@customElement(name)
export class Icon extends LitElement {
  static styles = style;
  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [name]: Icon;
  }
}
