import { expect, fixture, html } from '@open-wc/testing';
import { Icon } from '../../dist/components/icon';

describe('Icon', () => {
  it('should be defined', async () => {
    const el = await fixture<Icon>(html`<mm-icon></mm-icon>`);
    expect(el).to.be.instanceOf(Icon);
  });

  it('should have shadow root and elements inside it', async () => {
    const el = await fixture<Icon>(html`<mm-icon></mm-icon>`);
    const shadowRoot = el.shadowRoot;
    expect(shadowRoot).to.be.instanceof(ShadowRoot);
    expect(shadowRoot?.querySelector('slot')).to.be.instanceOf(HTMLElement);
  });
});
