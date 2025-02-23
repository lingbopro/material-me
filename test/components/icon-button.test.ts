import { expect, fixture, html } from '@open-wc/testing';
import { waitBrowserEventLoop } from '../.helpers/utils';
import { IconButton } from '../../dist/components/icon-button';

describe('Icon Button', () => {
  it('should be defined', async () => {
    const el = await fixture<IconButton>(
      html`<mm-icon-button></mm-icon-button>`,
    );
    expect(el).to.be.instanceOf(IconButton);
  });

  it('should have shadow root and elements inside it', async () => {
    const el = await fixture<IconButton>(
      html`<mm-icon-button></mm-icon-button>`,
    );
    const shadowRoot = el.shadowRoot;
    expect(shadowRoot).to.be.instanceof(ShadowRoot);
    expect(shadowRoot?.querySelector('slot')).to.be.instanceOf(HTMLElement);
    expect(shadowRoot?.querySelector('mm-ripple')).to.be.instanceOf(
      HTMLElement,
    );
  });

  it('should handle click events', async () => {
    const el = await fixture<IconButton>(
      html`<mm-icon-button
        onclick="this.clickCount = (this.clickCount ?? 0) + 1"></mm-icon-button>`,
    );
    el.dispatchEvent(new Event('click'));
    await waitBrowserEventLoop();
    expect(el).to.have.property('clickCount', 1);
  });
});
