import { expect, fixture, html } from '@open-wc/testing';
import { Page } from '../../dist/components/page';

describe('Page', () => {
  it('should be defined', async () => {
    const el = await fixture<Page>(html`<mm-page></mm-page>`);
    expect(el).to.be.instanceOf(Page);
  });

  it('should have shadow root and elements inside it', async () => {
    const el = await fixture<Page>(html`<mm-page></mm-page>`);
    const shadowRoot = el.shadowRoot;
    expect(shadowRoot).to.be.instanceof(ShadowRoot);
    expect(shadowRoot?.querySelector('slot')).to.be.instanceOf(HTMLElement);
  });
});
