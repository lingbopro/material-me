/**
 * HTML 元素属性的可能类型
 */
type PropType = string | number | boolean | undefined;

/**
 * HTML 元素属性（类）
 */
type ElementProps = { [key: string]: PropType };

/**
 * 组件行为
 */
interface ComponentConfig<ComponentClass extends HTMLElement, Props extends ElementProps> {
  /** HTML模板字符串 */
  template: string;
  /** CSS 样式字符串 */
  style: string | string[];
  /** 属性列表 */
  props: Props;
  /** 属性监听列表 */
  syncProps?: string[];
  /** 初始化函数 */
  setup?: (this: ComponentClass & Props, shadowRoot: ShadowRoot) => SetupOptions;
}

/**
 * 初始化函数返回的配置项
 */
interface SetupOptions {
  /** 添加到文档回调 */
  onMount?: () => void;
  /** 从文档移除回调 */
  onUnmount?: () => void;
  /** 移动到新文档回调 */
  onAdopt?: () => void;
  /** 属性更改、添加、删除、替换回调 */
  onAttributeChanged?: (name: string, oldValue: PropType, newValue: PropType) => void;
  /** 暴露的方法 */
  expose?: { [key: string]: (...args: any[]) => any };
  /** 属性 setters */
  propsSetter?: { [name: string]: (props: any) => void };
}

/**
 * 为一个影子根附加样式表
 * @param shadowRoot 影子根对象
 * @param style 样式表的 CSS 文本
 */
function attachStylesheet(shadowRoot: ShadowRoot, style: string) {
  if (CSSStyleSheet) {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(style);
    shadowRoot.adoptedStyleSheets.push(stylesheet);
  } else {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    shadowRoot.insertBefore(styleEl, shadowRoot.firstChild);
  }
}

/**
 * 将一个属性的新值根据旧值转换成对应的类型
 * @param value 新值
 * @param old 旧值
 * @returns 转换后的结果
 */
export function parseType(value: unknown, old: PropType) {
  if (value === undefined) return old;
  if (typeof old === 'string') return String(value);
  if (typeof old === 'number') return Number(value);
  if (typeof old === 'boolean') {
    if (typeof value === 'boolean') return value;
    return value === 'true' ? true : false;
  }
  throw new TypeError('Not a valid prop type');
}

/**
 * 根据给定的配置创建一个自定义元素类，组件类应继承它
 * @param config 组件配置
 * @returns 应继承的自定义元素类
 */
export function useElement<ComponentClass extends HTMLElement, Props extends ElementProps>(
  config: ComponentConfig<ComponentClass, Props>
): {
  new (): ComponentClass & Props;
  /**
   * 注册自定义元素
   * @param name 元素名
   */
  readonly define: (name: string) => void;
} {
  let setupOptions: SetupOptions;
  let props: ElementProps;

  /**
   * 为此组件增加一个属性
   * @param name 属性名
   */
  const createProperty = (component: MaterialMeGeneratedComponent, name: string) => {
    Object.defineProperty(component, name, {
      get: () => {
        return props[name];
      },
      set: (value) => {
        const oldValue = props[name];
        const parsedValue = parseType(value, oldValue);
        if (parsedValue !== props[name]) {
          setupOptions.onAttributeChanged?.call(component, name, oldValue, parsedValue);
          props[name] = parsedValue;
          syncProperty(component, name);
          setupOptions.propsSetter?.[name]?.call(component, parsedValue);
        }
      },
      configurable: true,
    });
  };

  /**
   * 处理一个属性的更改同步
   * @param name 属性名
   */
  const syncProperty = (component: MaterialMeGeneratedComponent, name: string) => {
    if (config.syncProps?.includes(name)) {
      const lowerKey = name.toLowerCase();
      const attrValue = component.getAttribute(lowerKey);
      const valueStr = String(props[name]);

      if (props[name] === config.props[name] && attrValue !== null) {
        component.removeAttribute(lowerKey);
      } else if (props[name] !== config.props[name] && attrValue !== valueStr) {
        component.setAttribute(lowerKey, valueStr);
      }
    }
  };

  /**
   * 暴露属性
   */
  const exposeProperties = (component: MaterialMeGeneratedComponent) => {
    const exposeDescriptors = Object.getOwnPropertyDescriptors(setupOptions.expose ?? {});
    for (const key in exposeDescriptors) {
      const item = exposeDescriptors[key];
      const existing = Object.getOwnPropertyDescriptor(component, key);
      if (existing) {
        if (item.value) {
          existing.value = item.value;
        }
        if (item.get) {
          existing.get = item.get;
        }
        if (item.set) {
          existing.set = item.set;
        }
        Object.defineProperty(component, key, existing);
      } else {
        Object.defineProperty(component, key, item);
      }
    }
  };

  class MaterialMeGeneratedComponent extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = config.template;
      if (Array.isArray(config.style)) {
        for (const style of config.style) {
          attachStylesheet(shadowRoot, style);
        }
      } else {
        attachStylesheet(shadowRoot, config.style);
      }
      props = { ...config.props };
      setupOptions = config.setup?.call(this as unknown as ComponentClass & Props, shadowRoot) ?? {};
      const nonDefaultProps: string[] = [];
      exposeProperties(this);
      for (const name in props) {
        const oldProp = this.getAttribute(name);
        props[name] = oldProp ?? config.props[name];
        createProperty(this, name);
        if (props[name] !== config.props[name]) {
          nonDefaultProps.push(name);
        }
        if (oldProp === config.props[name]) {
          this.removeAttribute(name);
        }
      }
      for (const name of nonDefaultProps) {
        this[name] = props[name];
      }
    }

    static observedAttributes: string[] = [];
    connectedCallback() {
      setupOptions.onMount?.call(this);
    }
    disconnectedCallback() {
      setupOptions.onUnmount?.call(this);
    }
    adoptedCallback() {
      setupOptions.onAdopt?.call(this);
    }

    /**
     * 定义自定义元素
     */
    static define(name: string) {
      window.customElements.define(name, this);
    }
  }
  return MaterialMeGeneratedComponent as unknown as { new (): ComponentClass & Props; readonly define: (name: string) => void };
}
