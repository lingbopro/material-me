import { expect, fixture, html } from '@open-wc/testing';
import { randint, waitDelay, waitBrowserEventLoop } from '../.helpers/utils';
import { Ripple } from '../../dist/components/ripple';

describe('Ripple', () => {
  it('should be defined', async () => {
    const el = await fixture<Ripple>(html`<mm-ripple></mm-ripple>`);
    expect(el).to.be.instanceOf(Ripple);
  });

  it('should have shadow root and elements inside it', async () => {
    const el = await fixture<Ripple>(html`<mm-ripple></mm-ripple>`);
    const shadowRoot = el.shadowRoot;
    expect(shadowRoot).to.be.instanceof(ShadowRoot);
    expect(shadowRoot?.querySelector('.container')).to.be.instanceOf(
      HTMLElement,
    );
    expect(shadowRoot?.querySelector('.ripple-template')).to.be.instanceOf(
      HTMLElement,
    );
  });

  const checkRippleElementAmount = (el: Ripple, amount: number = 1) => {
    const shadowRoot = el.shadowRoot;
    expect(
      shadowRoot?.querySelectorAll('.container>.ripple').length,
    ).to.be.equal(amount);
  };
  it('should create a ripple element when clicking it', async () => {
    const el = await fixture<Ripple>(html`<mm-ripple></mm-ripple>`);
    const shadowRoot = el.shadowRoot;
    el.dispatchEvent(new Event('pointerdown')); // pointer down
    await waitBrowserEventLoop();
    checkRippleElementAmount(el, 1);
    expect(shadowRoot?.querySelector('.container>.ripple')).to.be.instanceOf(
      HTMLElement,
    );
    document.dispatchEvent(new Event('pointerup')); // pointer up
    await waitDelay(500);
    checkRippleElementAmount(el, 0);
  });
  it('should create a ripple element when clicking it in attached mode', async () => {
    const divEl = await fixture<HTMLDivElement>(
      html`<div><mm-ripple attached></mm-ripple></div>`,
    );
    const el = divEl.querySelector('mm-ripple') as Ripple;
    const shadowRoot = el.shadowRoot;
    divEl.dispatchEvent(new Event('pointerdown')); // pointer down
    await waitBrowserEventLoop();
    checkRippleElementAmount(el, 1);
    expect(shadowRoot?.querySelector('.container>.ripple')).to.be.instanceOf(
      HTMLElement,
    );
    document.dispatchEvent(new Event('pointerup')); // pointer up
    await waitDelay(500);
    checkRippleElementAmount(el, 0);
  });
  it('should create multiple ripple element when multiple clicking it', async () => {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < 10; i++) {
      const promise = async () => {
        const el = await fixture<Ripple>(html`<mm-ripple></mm-ripple>`);
        const times = randint(1, 10);
        for (let j = 0; j < times; j++) {
          el.dispatchEvent(new Event('pointerdown')); // pointer down
          await waitBrowserEventLoop();
          checkRippleElementAmount(el, j + 1);
          expect(
            el.shadowRoot?.querySelector('.container>.ripple:last-child'),
          ).to.be.instanceOf(HTMLElement);
          document.dispatchEvent(new Event('pointerup')); // pointer up
        }
        await waitDelay(500);
        checkRippleElementAmount(el, 0);
      };
      promises.push(promise());
    }
    await Promise.all(promises);
  });
});
