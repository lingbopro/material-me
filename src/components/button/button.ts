import { useElement } from '../../core/element';
import '../ripple';
import template from './button.html';
import style from './button.css';
import { customElement, property } from 'lit/decorators.js';
import { html, LitElement } from 'lit';

const name = 'mm-button';
// const props = {
//   type: 'filled' as
//     | 'elevated'
//     | 'filled'
//     | 'filled-tonal'
//     | 'outlined'
//     | 'text',
// };

// export class Button extends useElement({
//   template,
//   style,
//   props,
//   syncProps: ['type'],
// }) {}

// Button.define(name);

@customElement(name)
export class Button extends LitElement {
  @property({ reflect: true })
  type: 'elevated' | 'filled' | 'filled-tonal' | 'outlined' | 'text' = 'filled';

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
    [name]: Button;
  }
}
