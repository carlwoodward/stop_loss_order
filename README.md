# Hello World

This is the default project that is scaffolded out when you run `npx @temporalio/create@latest ./myfolder`.

The [Hello World Tutorial](https://learn.temporal.io/getting_started/typescript/hello_world_in_typescript/) walks through the code in this sample.

### Running this sample

1. `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
1. `npm install` to install dependencies.
1. `npm run start.watch` to start the Worker.
1. In another shell, `npm run workflow` to run the Workflow Client.

The Workflow should return:

```bash
Hello, Temporal!
```

# Thinking

1. Create the pub sub stream.
2. Create a workflow that updates the price stream for the security, takes the ticker and the price as a float.
3. Create a workflow that accepts the ticker and the stop-loss price.
4. Create a signal for cancelling the order.
5. Create sell order activity that prints sold, unsubscribes and ends the workflow.
