/**
 * HTML 元素属性的可能类型
 */
type PropType = string | number | boolean | undefined;

/**
 * 组件行为
 */
interface ComponentConfig {
  /** HTML模板字符串 */
  template: string;
  /** CSS 样式字符串 */
  style: string | string[];
  /** 属性列表 */
  props: { [name: string]: string };
  /** 属性监听列表 */
  syncProps?: string[];
  /** 初始化函数 */
  setup?: (shadowRoot: ShadowRoot) => SetupOptions;
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
export function useElement<ComponentClass extends HTMLElement>(
  config: ComponentConfig
): {
  new (): ComponentClass;
  /**
   * 注册自定义元素
   * @param name 元素名
   */
  readonly define: (name: string) => void;
} {
  return class extends HTMLElement {
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
      this.props = { ...config.props };
      this.setupOptions = config.setup?.call(this, shadowRoot) ?? {};
      this.exposeProperties();
      for (const name in this.props) {
        this.props[name] = this.getAttribute(name) ?? config.props[name];
        this.createProperty(name);
      }
    }

    static observedAttributes: string[] = [];
    private setupOptions: SetupOptions;
    private props: { [key: string]: PropType };

    /**
     * 为此组件增加一个属性
     * @param name 属性名
     */
    private createProperty(name: string) {
      Object.defineProperty(this, name, {
        get: () => {
          return this.props[name];
        },
        set: (value) => {
          const oldValue = this.props[name];
          const parsedValue = parseType(value, oldValue);
          if (parsedValue !== this.props[name]) {
            this.setupOptions.onAttributeChanged?.call(this, name, oldValue, parsedValue);
            this.props[name] = parsedValue;
            this.syncProperty(name);
            this.setupOptions.propsSetter?.[name]?.call(this, parsedValue);
          }
        },
        configurable: true,
      });
    }

    /**
     * 处理一个属性的更改同步
     * @param name 属性名
     */
    private syncProperty(name: string) {
      if (config.syncProps?.includes(name)) {
        const lowerKey = name.toLowerCase();
        const attrValue = this.getAttribute(lowerKey);
        const valueStr = String(this.props[name]);

        if (this.props[name] === config.props[name] && attrValue !== null) {
          this.removeAttribute(lowerKey);
        } else if (this.props[name] !== config.props[name] && attrValue !== valueStr) {
          this.setAttribute(lowerKey, valueStr);
        }
      }
    }

    /**
     * 暴露属性
     */
    private exposeProperties() {
      const exposeDescriptors = Object.getOwnPropertyDescriptors(this.setupOptions.expose ?? {});
      for (const key in exposeDescriptors) {
        const item = exposeDescriptors[key];
        const existing = Object.getOwnPropertyDescriptor(this, key);
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
          Object.defineProperty(this, key, existing);
        } else {
          Object.defineProperty(this, key, item);
        }
      }
    }

    connectedCallback() {
      this.setupOptions.onMount?.call(this);
    }
    disconnectedCallback() {
      this.setupOptions.onUnmount?.call(this);
    }
    adoptedCallback() {
      this.setupOptions.onAdopt?.call(this);
    }

    /**
     * 定义自定义元素
     */
    static define(name: string) {
      window.customElements.define(name, this);
    }
  } as unknown as { new (): ComponentClass; readonly define: (name: string) => void };
}
