import { Connection, Client } from '@temporalio/client';
import { updatePriceStreamWorkflow } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({
    connection,
  });

  const args = process.argv.slice(2);
  if (args.length !== 2) {
    throw new Error(`Ticker and value arguments required.`);
  }

  const ticker = args[0];
  const value = parseFloat(args[1]);

  const handle = await client.workflow.start(updatePriceStreamWorkflow, {
    taskQueue: 'stop-loss',
    args: [ticker, value],
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started updatePriceStreamWorkflow: ${handle.workflowId}`);
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
