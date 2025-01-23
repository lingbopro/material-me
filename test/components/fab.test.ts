import { expect, fixture, html } from '@open-wc/testing';
import { waitBrowserEventLoop } from '../.helpers/utils';
import { Fab } from '../../dist/components/fab';

describe('FAB', () => {
  it('should be defined', async () => {
    const el = await fixture<Fab>(html`<mm-fab></mm-fab>`);
    expect(el).to.be.instanceOf(Fab);
  });

  it('should have shadow root and elements inside it', async () => {
    const el = await fixture<Fab>(html`<mm-fab></mm-fab>`);
    const shadowRoot = el.shadowRoot;
    expect(shadowRoot).to.be.instanceof(ShadowRoot);
    expect(shadowRoot?.querySelector('slot')).to.be.instanceOf(HTMLElement);
    expect(shadowRoot?.querySelector('mm-ripple')).to.be.instanceOf(
      HTMLElement,
    );
  });

  it('should handle click events', async () => {
    const el = await fixture<Fab>(
      html`<mm-fab
        onclick="this.clickCount = (this.clickCount ?? 0) + 1"
      ></mm-fab>`,
    );
    el.dispatchEvent(new Event('click'));
    await waitBrowserEventLoop();
    expect(el).to.have.property('clickCount', 1);
  });
});
