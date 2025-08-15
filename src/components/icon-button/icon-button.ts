// import { useElement } from '../../core/element';
import { customElement, property } from 'lit/decorators.js';
import '../ripple';
// import template from './icon-button.html';
import style from './icon-button.css';
import { html, LitElement } from 'lit';

const name = 'mm-icon-button';
// const props = {
//   type: 'text' as 'filled' | 'filled-tonal' | 'outlined' | 'text',
// };

// export class IconButton extends useElement({
//   template,
//   style,
//   props,
// }) {}

// IconButton.define(name);

@customElement(name)
export class IconButton extends LitElement {
  @property({ reflect: true })
  type: 'filled' | 'filled-tonal' | 'outlined' | 'text' = 'text';

  static styles = style;
  render() {
    return html`
      <slot></slot>
      <mm-ripple attached></mm-ripple>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [name]: IconButton;
  }
}
