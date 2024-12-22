import { useElement } from '../../core/element';
import {
  defaultTheme,
  generateCSSKeys,
  overrideColorKeys,
} from '../../utils/theme';
import template from './page.html';
import style from './page.css';

const name = 'mm-page';
const props = {
  theme: 'auto' as 'auto' | 'light' | 'dark',
};

const themeStyle = /* css */ `
:host {
  ${generateCSSKeys(defaultTheme)}
}
@media (prefers-color-scheme: light) {
  :host {
    ${overrideColorKeys.light}
  }
}
@media (prefers-color-scheme: dark) {
  :host {
    ${overrideColorKeys.dark}
  }
}
:host([theme="light"]) {
  ${overrideColorKeys.light}
}
:host([theme="dark"]) {
  ${overrideColorKeys.dark}
}`;

export class Page extends useElement({
  template,
  style: [style, themeStyle],
  props,
}) {
  declare theme: typeof props.theme;
}

Page.define(name);
