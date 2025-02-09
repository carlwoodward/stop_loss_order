import { TestWorkflowEnvironment } from '@temporalio/testing';
import { before, describe, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import { updatePriceStreamWorkflow } from '../workflows';
import { createActivities } from '../activities';
import assert from 'assert';

describe('Update price stream workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('successfully completes the Workflow', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities: createActivities(),
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
