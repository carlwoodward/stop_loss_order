import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import { createActivities } from '../activities';
import assert from 'assert';

describe('all activities', async () => {
  describe('update price stream', async () => {
    it('updates price for security', async () => {
      const env = new MockActivityEnvironment();
      const ticker = 'TEST_AAPL';
      const price = 100;
      const result = await env.run(createActivities().updatePriceStream, ticker, price);
      assert.equal(result, undefined);
    });
  });

  describe('place stop loss order', async () => {
    it('creates the order', async () => {
      const env = new MockActivityEnvironment();
      const ticker = 'TEST_AAPL';
      const price = 100;
      const quantity = 1000;
      setTimeout(async () => await env.run(createActivities().updatePriceStream, ticker, price + 10), 2000);
      setTimeout(async () => await env.run(createActivities().updatePriceStream, ticker, price - 10), 3000);
      await env.run(createActivities().placeStopLossOrder, ticker, price, quantity);
    }).timeout(10_000);
  });
});
