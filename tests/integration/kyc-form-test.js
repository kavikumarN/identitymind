import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { fillInRequiredFields } from '../helpers/form-helpers';
import { acceptedCreateResponse } from '../helpers/fixtures';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | KYC form hooks', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{kyc-form}}`);

    assert.dom('legend').hasText('Submission Form');
    assert.dom('.kyc-field').exists({ count: 13 });
  });

  test('hooks are fired', async function(assert) {
    assert.expect(2);

    server.post('/identitymind-verifications', () => {
      return acceptedCreateResponse;
    });

    this.set('doSomething', () => {
      assert.ok(true, 'hook is called');
    });

    await render(hbs`{{kyc-form postSubmit=(action doSomething) willSaveModel=(action doSomething)}}`);

    await fillInRequiredFields();

    await click('button.submit');
  });

  test('hasErrors hook is fired', async function(assert) {
    assert.expect(1);

    this.set('doSomething', () => {
      assert.ok(true, 'hook is called');
    });

    await render(hbs`{{kyc-form hasErrors=(action doSomething)}}`);
    await click('button.submit');
  });
});
