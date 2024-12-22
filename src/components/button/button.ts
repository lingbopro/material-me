import { useElement } from '../../core/element';
import '../ripple';
import template from './button.html';
import style from './button.css';

const name = 'mm-button';
const props = {
  type: 'filled' as
    | 'elevated'
    | 'filled'
    | 'filled-tonal'
    | 'outlined'
    | 'text',
};

export class Button extends useElement({
  template,
  style,
  props,
  syncProps: ['type'],
}) {}

Button.define(name);
