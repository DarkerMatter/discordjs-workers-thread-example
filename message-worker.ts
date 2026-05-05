import { parentPort } from 'node:worker_threads';

if (!parentPort) throw new Error('Must run as a worker');

parentPort.on('message', (msg: { id: string; channelId: string; content: string }) => {
  if (msg.content.toLowerCase() === 'the great wall of china') {
    parentPort!.postMessage({
      messageId: msg.id,
      channelId: msg.channelId,
      delete: true,
      reply: 'Correct!',
    });
  }
});
