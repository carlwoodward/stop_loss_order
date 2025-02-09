import { Connection, Client } from '@temporalio/client';
import { placeStopLossOrderWorkflow } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({
    connection,
  });

  const args = process.argv.slice(2);
  if (args.length !== 3) {
    throw new Error(`Ticker, price and quantity arguments required.`);
  }

  const ticker = args[0];
  const price = parseFloat(args[1]);
  const quantity = parseFloat(args[2]);

  const handle = await client.workflow.start(placeStopLossOrderWorkflow, {
    taskQueue: 'stop-loss',
    args: [ticker, price, quantity],
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started placeStopLossOrderWorkflow: ${handle.workflowId}`);
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
