import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './page.css';
import {
  defaultTheme,
  generateCSSKeys,
  overrideColorKeys,
} from '../../utils/theme';

// import { useElement } from '../../core/element';
// import template from './page.html';

// const name = 'mm-page';
// const props = {
//   theme: 'auto' as 'auto' | 'light' | 'dark',
// };

const themeStyle = css`
  :host {
    ${unsafeCSS(generateCSSKeys(defaultTheme))}
  }
  @media (prefers-color-scheme: light) {
    :host {
      ${unsafeCSS(overrideColorKeys.light)}
    }
  }
  @media (prefers-color-scheme: dark) {
    :host {
      ${unsafeCSS(overrideColorKeys.dark)}
    }
  }
  :host([theme='light']) {
    ${unsafeCSS(overrideColorKeys.light)}
  }
  :host([theme='dark']) {
    ${unsafeCSS(overrideColorKeys.dark)}
  }
`;

// export class Page extends useElement({
//   template,
//   style: [style, themeStyle],
//   props,
// }) {
//   declare theme: typeof props.theme;
// }

// Page.define(name);

const name = 'mm-page';

@customElement(name)
export class Page extends LitElement {
  @property({ reflect: true })
  theme: 'auto' | 'light' | 'dark' = 'auto';

  static styles = [style, themeStyle];
  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [name]: Page;
  }
}
