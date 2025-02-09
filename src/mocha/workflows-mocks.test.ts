import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after, before, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import { updatePriceStreamWorkflow } from '../workflows';
import assert from 'assert';

describe('Update price workflow with mocks', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('successfully completes the Workflow with a mocked Activity', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities: {
        updatePriceStream: async (_ticker: string, _price: number) => {
          await Promise.resolve();
        },
      },
    });

    const result = await worker.runUntil(
      client.workflow.execute(updatePriceStreamWorkflow, {
        args: ['TEST_AAPL', 100],
        workflowId: 'test',
        taskQueue,
      }),
    );
    assert.equal(result, undefined);
  });
});
