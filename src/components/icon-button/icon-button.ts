import { useElement } from '../../core/element';
import '../ripple';
import template from './icon-button.html';
import style from './icon-button.css';

const name = 'mm-icon-button';
const props = {
  type: 'text' as 'filled' | 'filled-tonal' | 'outlined' | 'text',
};

export class IconButton extends useElement({
  template,
  style,
  props,
}) {}

IconButton.define(name);
