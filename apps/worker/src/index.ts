import dotenv from 'dotenv';

dotenv.config();

console.log('[@katl/worker] Initializing KATL Background Task Worker...');
console.log('[@katl/worker] Registered Queues: CATL_SYNC_QUEUE, RFQ_DISPATCH_QUEUE, REPORT_QUEUE');

export async function startWorker() {
  console.log('[@katl/worker] Polling queues via Redis...');
}

startWorker();
