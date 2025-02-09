import Redis from 'ioredis';
import { Context, heartbeat, log } from '@temporalio/activity';

const INITIAL_STREAM_EVENT_ID = '$';

//
// Read price changes from Price Stream.
//
// @param {string} ticker - name of security
// @param {string} prevId - value of last event id returned from stream
// @returns {[number[], string]} - number[] is the latest price changes
// if there hasn't been any change, string is the latest event id
//
async function streamRead(redis: Redis, ticker: string, prevId: string): Promise<[number[], string]> {
  const results = await redis.xread('BLOCK', 1000, 'STREAMS', ticker, prevId);
  if (results) {
    const [_key, messages] = results[0];
    const [id] = messages.at(-1) ?? [prevId];
    const priceChanges = messages.map((message) => {
      const [_id, [_field, price]] = message;
      return parseFloat(price);
    });
    return [priceChanges, id];
  } else {
    return [[], prevId];
  }
}

//
// Simulate selling securities.
//
// @param {string} ticker - name of security
// @param {string} quantity - number of securities to sell
//
function placeSellOrder(ticker: string, quantity: number) {
  log.info('**** PLACE SELL ORDER ****', { ticker, quantity });
}

export const createActivities = () => ({
  //
  // Update the price of a single security based on it's ticker.
  //
  // @param {string} ticker - name of security
  // @param {string} price - the current price of the security
  //
  async updatePriceStream(name: string, price: number): Promise<void> {
    const redis = new Redis();
    await redis.xadd(name, '*', 'price', price);
  },

  //
  // Setup a stop loss order which monitors the price of a given
  // security and places a sell order if the updated price drops below
  // the stop loss order price.
  //
  // @param {string} ticker - name of security
  // @param {string} price - the price to sell the security at
  // @param {string} quantity - number of securities to sell
  //
  async placeStopLossOrder(ticker: string, price: number, quantity: number): Promise<void> {
    let id = INITIAL_STREAM_EVENT_ID;
    const redis = new Redis();
    for (;;) {
      if (Context.current().cancellationSignal.aborted) {
        log.info('!!! CANCELLED !!!');
        break;
      }

      const [priceChanges, updId] = await streamRead(redis, ticker, id);

      heartbeat();
      id = updId;

      for (const priceChange of priceChanges) {
        if (priceChange < price) {
          placeSellOrder(ticker, quantity);
          return;
        }
      }
    }
  },
});
