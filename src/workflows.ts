import { proxyActivities } from '@temporalio/workflow';
import { createActivities } from './activities';

const { updatePriceStream, placeStopLossOrder } = proxyActivities<ReturnType<typeof createActivities>>({
  startToCloseTimeout: '1 minute',
});

export async function updatePriceStreamWorkflow(ticker: string, price: number): Promise<void> {
  await updatePriceStream(ticker, price);
}

export async function placeStopLossOrderWorkflow(name: string, price: number, quantity: number): Promise<void> {
  await placeStopLossOrder(name, price, quantity);
}
