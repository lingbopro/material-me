import { useElement } from '../../core/element';
import '../ripple';
import template from './fab.html';
import style from './fab.css';
import { customElement } from 'lit/decorators.js';
import { html, LitElement } from 'lit';

const name = 'mm-fab';
// const props = {};

// export class Fab extends useElement({
//   template,
//   style,
//   props,
// }) {}

// Fab.define(name);

@customElement(name)
export class Fab extends LitElement {
  static styles = style;
  render() {
    return html`
      <slot name="start"></slot>
      <slot></slot>
      <slot name="end"></slot>
      <mm-ripple attached></mm-ripple>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [name]: Fab;
  }
}
