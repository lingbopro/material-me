import { useElement } from '../../core/element';
import { TabItem } from './tab-item';
import template from './tab.html';
import style from './tab.css';
import { SelectHelper } from '../../utils/select';

const name = 'mm-tab';
const props = {
  value: '',
};

export class Tab extends useElement({
  template,
  style,
  props,
  syncProps: ['value'],
  setup(shadowRoot) {
    const containerEl = shadowRoot.querySelector('.container') as HTMLElement;
    const slotEl = shadowRoot.querySelector('slot') as HTMLSlotElement;
    const selectHelper = new SelectHelper<HTMLElement, TabItem>({
      parent: this,
      childClass: TabItem,
      slotEl: slotEl,
    });
    let lastSelected: TabItem | undefined;
    selectHelper.addEventListener('change', () => {
      // 如果没有连接或没有选中的子元素，则将上一个选中的子元素置空
      if (!this.isConnected || !selectHelper.selectedChild) {
        lastSelected = undefined;
        return;
      }
      // 如果宽度不够，则将选中的子元素滚动到可视区域中心
      if (containerEl.scrollWidth > containerEl.clientWidth) {
        const { offsetLeft, offsetWidth } = selectHelper.selectedChild;
        const left = offsetLeft + offsetWidth / 2 - containerEl.clientWidth / 2;
        containerEl.scrollTo({ left, behavior: 'smooth' });
      }

      // 将新选中的子元素的 indicator 从上一个选中的子元素的 indicator 移动到新选中的子元素的 indicator
      if (lastSelected) {
        const lastIndicatorEl = lastSelected.indicatorEl;
        const indicatorEl = selectHelper.selectedChild.indicatorEl;
        const indicatorLeft = indicatorEl.getBoundingClientRect().left;
        const lastIndicatorLeft = lastIndicatorEl.getBoundingClientRect().left;
        indicatorEl.animate(
          [
            {
              transform: `translateX(${lastIndicatorLeft - indicatorLeft}px)`,
              width: `${lastIndicatorEl.offsetWidth}px`,
            },
            {
              transform: 'translateX(0px)',
              width: `${indicatorEl.offsetWidth}px`,
            },
          ],
          {
            fill: 'forwards',
            duration: 200,
            easing: 'ease-in-out',
          },
        );
      }

      // 记录上一个选中的子元素
      lastSelected = selectHelper.selectedChild ?? lastSelected;
    });
    return {
      expose: {
        get selectedIndex() {
          return selectHelper.selectedIndex;
        },
        get value() {
          return selectHelper.value;
        },
        get tabs() {
          return selectHelper.children;
        },
      },
      propsSetter: {
        value: (value) => {
          selectHelper.value = value;
        },
      },
    };
  },
}) {}

Tab.define(name);
