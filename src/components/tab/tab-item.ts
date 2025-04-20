import { useElement } from '../../core/element';
import '../ripple';
import template from './tab-item.html';
import style from './tab-item.css';
import { Tab } from './tab';

const name = 'mm-tab-item';
const props = {
  value: '',
  selected: false,
};

export class TabItem extends useElement({
  template,
  style,
  props,
  syncProps: ['value', 'selected'],
  setup(shadowRoot) {
    const indicatorEl = shadowRoot.querySelector('.indicator') as HTMLElement;
    // 监听点击事件，触发选择事件
    this.addEventListener('click', () => {
      this.dispatchEvent(new Event('__select:select', { bubbles: true }));
    });
    return {
      expose: {
        indicatorEl,
      },
      propsSetter: {
        // 选中状态变化时，更新选择信息
        selected: () => {
          if (this.parentElement instanceof Tab) {
            this.dispatchEvent(
              new Event('__select:update-data', {
                bubbles: true,
              }),
            );
          }
        },
      },
    };
  },
}) {}

TabItem.define(name);
