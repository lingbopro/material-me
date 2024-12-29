import { useElement } from '../../core/element';
import template from './icon.html';
import style from './icon.css';

const name = 'mm-icon';
const props = {};

export class Icon extends useElement({
  template,
  style,
  props,
}) {}

Icon.define(name);
