/**
 * @file 选择器辅助类
 */

/**
 * 用于选择器的父元素，其某个插槽（`<slot>`）中包含若干个子元素
 * @see SelectChild
 */
export type SelectParent = {
  /** 选中的子元素的 value 属性值 */
  selectedValue?: string;
} & HTMLElement;

/**
 * 用于选择器的子元素，其父元素为 SelectParent
 *
 * - 子元素在被选择（点击）时应触发 `__select:select` 事件
 * - 子元素的选中状态变化（属性被更改）时应触发 `__select:update-data` 事件
 * @see SelectParent
 */
export type SelectChild = {
  /** 子元素的 value 属性值，用于定位 */
  value?: string;
  /** 是否被选中 */
  selected: boolean;
} & HTMLElement;

/**
 * 元素选择器辅助类
 *
 * 用于处理父元素和子元素之间的选择关系
 *
 * 子元素在选中状态变化时通知父元素，并更改其他子元素的选中状态
 *
 * @template Parent 父元素类型
 * @template Child 子元素类型
 */
export class SelectHelper<
  Parent extends SelectParent,
  Child extends SelectChild,
> extends EventTarget {
  parent: Parent;
  children: Child[] = [];

  selectedChild?: Child;
  selectValue?: string;

  /** 是否正在处理事件（防止事件重复触发） */
  private processing = false;

  constructor(options: {
    /** 父元素 */
    parent: Parent;
    /** 子元素类型 */
    childClass: new () => Child;
    /** 子元素列表（默认为空数组） */
    children?: Child[];
    /** 父元素中用于存放子元素的插槽（`<slot>`）元素 */
    slotEl: HTMLSlotElement;
  }) {
    super();

    this.parent = options.parent;
    this.children = options.children ?? [];

    // 子元素在被选择（点击）时会触发该事件
    this.parent.addEventListener('__select:select', (event: Event) => {
      event.stopPropagation();
      if (this.processing) {
        return;
      }
      this.processing = true;
      const child = event.target as Child;
      // 将选中的子元素置为该子元素
      this.selectChild(child);
      this.processing = false;
      this.dispatchEvent(new CustomEvent('select', { detail: child }));
      this.dispatchEvent(new CustomEvent('change', { detail: child }));
    });

    // 当子元素的选中状态变化（属性被更改）时会触发该事件
    // 子元素被点击时会间接触发该事件
    this.parent.addEventListener('__select:update-data', (event: Event) => {
      event.stopPropagation();
      if (this.processing) {
        return;
      }
      this.processing = true;
      const child = event.target as Child;
      if (child.selected) {
        // 如果子元素被选中，则将选中的子元素置为该子元素
        this.selectChild(child);
      } else {
        // 如果子元素被取消选中，则将选中的子元素置为 undefined
        this.selectedChild = undefined;
      }
      this.processing = false;
      this.dispatchEvent(new CustomEvent('change', { detail: child }));
    });

    // 监听插槽变化，更新子元素列表
    options.slotEl.addEventListener('slotchange', () => {
      this.processing = true;
      let selectedChild: Child | undefined = undefined;
      const assignedElements = options.slotEl.assignedElements();
      // 遍历插槽中的所有子元素
      this.children = assignedElements.filter((item) => {
        if (!(item instanceof options.childClass)) {
          return false;
        }
        // 如果 selectValue 非空，则根据 value 属性值选中子元素
        if (this.selectValue) {
          if (this.selectValue === item.value) {
            selectedChild = item;
          }
        } else {
          // 如果当前没有选中的子元素
          if (!selectedChild) {
            // 如果子元素被选中则将选中的子元素置为该子元素
            if (item.selected) {
              selectedChild = item;
            }
          }
        }
        return true;
      }) as Child[];
      this.dispatchEvent(
        new CustomEvent('slotchange', { detail: assignedElements }),
      );
      // 选中子元素
      if (selectedChild) {
        this.selectChild(selectedChild);
      } else {
        this.selectedChild = undefined;
      }
      this.processing = false;
      this.dispatchEvent(new CustomEvent('change', { detail: selectedChild }));
    });
  }

  /**
   * 选中子元素
   * @param child 子元素
   */
  selectChild(child: Child) {
    if (this.selectedChild === child) {
      return;
    }
    this.selectedChild = child;
    // 遍历子元素列表，将所有子元素设置为未选中状态，仅将被选中的子元素设置为选中状态
    this.children.forEach((current) => {
      if (current === child) {
        current.selected = true;
      } else {
        current.selected = false;
      }
    });
  }

  /**
   * 获取被选中的子元素的 value 属性值
   * @returns 被选中的子元素的 value 属性值
   */
  get value() {
    return this.selectedChild?.value ?? '';
  }
  /**
   * 设置被选中的 value 属性值
   *
   * 将根据给定的 value 属性值，选中子元素列表中 value 属性值与之相等的子元素
   * @param value 被选中的 value 属性值
   */
  set value(value: string) {
    this.selectValue = value;
    this.processing = true;
    const child = this.children.find((c) => c.value === value);
    if (child) {
      this.selectChild(child);
    }
    this.processing = false;
  }
  /**
   * 获取被选中的子元素在子元素列表中的索引，以 0 开始
   * @returns 被选中的子元素在子元素列表中的索引
   */
  get selectedIndex() {
    return this.children.indexOf(this.selectedChild!);
  }

  declare addEventListener: (
    type: 'select' | 'change' | 'slotchange',
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => void;
}
