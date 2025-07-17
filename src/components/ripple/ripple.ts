import { useElement } from '../../core/element';
import template from './ripple.html';
import style from './ripple.css';
import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

const name = 'mm-ripple';
// const props = {
//   attached: false,
// };

// export class Ripple extends useElement({
//   template,
//   style,
//   props,
//   syncProps: ['attached'],
//   setup(shadowRoot) {
//     const containerEl = shadowRoot.querySelector(
//       '.container',
//     ) as HTMLDivElement;
//     const rippleTemplateEl = shadowRoot.querySelector(
//       '.ripple-template',
//     ) as HTMLDivElement;

//     /** 父元素（用于吸附模式） */
//     const parent =
//       this.parentNode instanceof ShadowRoot
//         ? (this.parentNode.host as HTMLElement)
//         : (this.parentNode as HTMLElement);

//     /** 波纹点击开始 */
//     const rippleTouchStart = (event: MouseEvent, node?: HTMLElement) => {
//       if (!node) {
//         node = this;
//       }
//       // 计算位置
//       const { offsetWidth, offsetHeight } = node;
//       const { left, top } = node.getBoundingClientRect();
//       const { clientX, clientY } = event;
//       const realX = clientX - left;
//       const realY = clientY - top;
//       const halfHeight = offsetHeight / 2;
//       const halfWidth = offsetWidth / 2;
//       const edgeW = (Math.abs(halfHeight - realY) + halfHeight) * 2;
//       const edgeH = (Math.abs(halfWidth - realX) + halfWidth) * 2;
//       const size = Math.sqrt(edgeW * edgeW + edgeH * edgeH);

//       // 添加元素
//       const rippleEl = rippleTemplateEl.cloneNode() as HTMLDivElement;
//       rippleEl.classList.replace('ripple-template', 'ripple');
//       containerEl.appendChild(rippleEl);
//       // 动画关键帧
//       const standardKeyframesProp = {
//         opacity: 0.24,
//         width: `${size}px`,
//         height: `${size}px`,
//         left: `${realX}px`,
//         top: `${realY}px`,
//       };
//       const keyframes = [
//         {
//           ...standardKeyframesProp,
//           transform: `translate(-50%, -50%) scale(0)`,
//         },
//         {
//           ...standardKeyframesProp,
//           transform: `translate(-50%, -50%) scale(1)`,
//         },
//       ];
//       // 应用动画
//       const animation = rippleEl.animate(keyframes, {
//         duration: 800,
//         fill: 'forwards',
//         easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
//       });

//       // 点击结束处理方法
//       const touchEnd = () => {
//         // 淡出动画
//         const fadeOutAnimation = rippleEl.animate(
//           [{ opacity: 0.24 }, { opacity: 0 }],
//           {
//             duration: 400,
//             fill: 'forwards',
//           },
//         );
//         // 移除元素
//         fadeOutAnimation.addEventListener('finish', () => {
//           rippleEl.remove();
//         });
//       };
//       return { rippleEl, touchEnd };
//     };

//     // 鼠标悬停处理函数
//     const onMouseOver = () => {
//       containerEl.classList.add('hover');
//     };
//     const onMouseLeave = () => {
//       containerEl.classList.remove('hover');
//     };
//     // 点击开始事件
//     const onPointerDown = (event: MouseEvent) => {
//       const { touchEnd } = rippleTouchStart(event);
//       document.addEventListener('pointerup', touchEnd, { once: true });
//     };

//     /** 添加监听器 */
//     const addListeners = (node: HTMLElement) => {
//       node.addEventListener('mouseover', onMouseOver);
//       node.addEventListener('mouseleave', onMouseLeave);
//       node.addEventListener('pointerdown', onPointerDown);
//     };
//     const removeListeners = (node: HTMLElement) => {
//       node.removeEventListener('mouseover', onMouseOver);
//       node.removeEventListener('mouseleave', onMouseLeave);
//       node.removeEventListener('pointerdown', onPointerDown);
//     };
//     addListeners(this);
//     return {
//       onMount: () => {
//         if (this.attached && parent) {
//           addListeners(parent);
//         }
//       },
//       onUnmount: () => {
//         if (this.attached && parent) {
//           removeListeners(parent);
//         }
//       },
//       propsSetter: {
//         attached: (prop) => {
//           if (!this.isConnected) {
//             return;
//           }
//           const parent = this.parentElement;
//           if (prop) {
//             if (parent) addListeners(parent);
//           } else {
//             if (parent) removeListeners(parent);
//           }
//         },
//       },
//     };
//   },
// }) {}

// Ripple.define(name);

@customElement(name)
export class Ripple extends LitElement {
  @property({ reflect: true })
  attached: boolean = false;

  @state()
  protected hovered: boolean = false;

  protected containerRef: Ref<HTMLDivElement> = createRef();

  // 鼠标悬停处理函数
  protected handleMouseOver() {
    this.hovered = true;
  }
  protected handleMouseLeave() {
    this.hovered = false;
  }
  // 点击开始事件
  protected handlePointerDown(event: MouseEvent) {}

  /** 波纹点击开始 */
  protected touchStart(event: MouseEvent, node: HTMLElement = this) {
    // 计算位置
    const { offsetWidth, offsetHeight } = node;
    const { left, top } = node.getBoundingClientRect();
    const { clientX, clientY } = event;
    const realX = clientX - left;
    const realY = clientY - top;
    const halfHeight = offsetHeight / 2;
    const halfWidth = offsetWidth / 2;
    const edgeW = (Math.abs(halfHeight - realY) + halfHeight) * 2;
    const edgeH = (Math.abs(halfWidth - realX) + halfWidth) * 2;
    const size = Math.sqrt(edgeW * edgeW + edgeH * edgeH);

    // 添加元素
    const rippleEl = document.createElement('div');
    rippleEl.classList.add('ripple');
    rippleEl.style.width = rippleEl.style.height = `${size}px`;
    rippleEl.style.left = `${realX}px`;
    rippleEl.style.top = `${realY}px`;
    this.containerRef.value!.appendChild(rippleEl);
    //       const rippleEl = rippleTemplateEl.cloneNode() as HTMLDivElement;
    //       rippleEl.classList.replace('ripple-template', 'ripple');
    //       containerEl.appendChild(rippleEl);
    // 动画关键帧
    const standardKeyframesProp = {
      opacity: 0.24,
      width: `${size}px`,
      height: `${size}px`,
      left: `${realX}px`,
      top: `${realY}px`,
    };
    const keyframes = [
      {
        ...standardKeyframesProp,
        transform: `translate(-50%, -50%) scale(0)`,
      },
      {
        ...standardKeyframesProp,
        transform: `translate(-50%, -50%) scale(1)`,
      },
    ];
    // 应用动画
    const animation = rippleEl.animate(keyframes, {
      duration: 800,
      fill: 'forwards',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });

    // 点击结束处理方法
    const touchEnd = () => {
      // 淡出动画
      const fadeOutAnimation = rippleEl.animate(
        [{ opacity: 0.24 }, { opacity: 0 }],
        {
          duration: 400,
          fill: 'forwards',
        },
      );
      // 移除元素
      fadeOutAnimation.addEventListener('finish', () => {
        rippleEl.remove();
      });
    };

    document.addEventListener('pointerup', touchEnd, { once: true });
  }

  //#region 属性和监听器
  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('attached')) {
      this.handleAttachedUpdated();
    }
  }

  connectedCallback(): void {
    this.parent = (
      this.parentNode instanceof ShadowRoot
        ? this.parentNode.host
        : this.parentNode
    ) as HTMLElement;
    this.addListeners(this);
    super.connectedCallback();
  }
  disconnectedCallback() {
    if (this.attached && this.parent) {
      this.removeListeners(this.parent);
    }
    this.removeListeners(this);
    super.disconnectedCallback();
  }

  /** 父元素 */
  protected parent: HTMLElement | null = null;
  protected handleAttachedUpdated() {
    if (!this.isConnected) return;
    this.updateParentListeners();
  }
  protected updateParentListeners() {
    if (!this.isConnected) return;
    this.parent = this.getRootNode() as HTMLElement;
    if (this.attached) {
      this.addListeners(this.parent);
    } else {
      this.removeListeners(this.parent);
    }
  }
  /** 添加监听器 */
  protected addListeners(node: HTMLElement) {
    node.addEventListener('mouseover', this.handleMouseOver);
    node.addEventListener('mouseleave', this.handleMouseLeave);
    node.addEventListener('pointerdown', this.handlePointerDown);
  }
  /** 移除监听器 */
  protected removeListeners(node: HTMLElement) {
    node.removeEventListener('mouseover', this.handleMouseOver);
    node.removeEventListener('mouseleave', this.handleMouseLeave);
    node.removeEventListener('pointerdown', this.handlePointerDown);
  }
  //#endregion

  static styles = style;
  render() {
    return html`
      <slot></slot>
      <div
        ${ref(this.containerRef)}
        class="container ${classMap({
          hover: this.hovered,
        })}">
        <div class="ripple-template"></div>
      </div>
    `;
  }
}
