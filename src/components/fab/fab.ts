import { useElement } from '../../core/element';
import '../ripple';
import template from './fab.html';
import style from './fab.css';

const name = 'mm-fab';
const props = {};

export class Fab extends useElement({
  template,
  style,
  props,
}) {}

Fab.define(name);
