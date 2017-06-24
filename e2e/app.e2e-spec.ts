import { DeepSelectPage } from './app.po';

describe('deep-select App', () => {
  let page: DeepSelectPage;

  beforeEach(() => {
    page = new DeepSelectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
