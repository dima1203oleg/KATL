import { Queue, Worker, type JobsOptions, type Processor, type QueueOptions, type WorkerOptions } from 'bullmq';

export const QUEUE_NAMES = [
  'product-sync',
  'rfq-dispatch',
  'document-processing',
  'translations',
  'ai-background',
  'email',
  'notifications',
  'seo',
] as const;

export type PlatformQueueName = (typeof QUEUE_NAMES)[number];

function redisConnection() {
  const endpoint = process.env.REDIS_URL;
  if (!endpoint) throw new Error('REDIS_URL is required for durable jobs.');
  const parsed = new URL(endpoint);
  const secure = parsed.protocol === 'rediss:';
  return {
    host: parsed.hostname,
    port: Number(parsed.port || (secure ? 6380 : 6379)),
    username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    db: parsed.pathname.length > 1 ? Number(parsed.pathname.slice(1)) : 0,
    ...(secure ? { tls: {} } : {}),
    maxRetriesPerRequest: null,
  };
}

const queues = new Map<PlatformQueueName, Queue>();

export function getPlatformQueue(name: PlatformQueueName): Queue {
  let queue = queues.get(name);
  if (!queue) {
    const connection = redisConnection();
    const options: QueueOptions = {
      connection,
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: { count: 2000 },
        removeOnFail: false,
      },
    };
    queue = new Queue(name, options);
    queues.set(name, queue);
  }
  return queue;
}

export async function enqueuePlatformJob(
  name: PlatformQueueName,
  jobName: string,
  data: Record<string, unknown>,
  options: JobsOptions = {}
) {
  const job = await getPlatformQueue(name).add(jobName, data, options);
  return { id: String(job.id), name: job.name, queue: name };
}

export async function getPlatformQueueStats(name: PlatformQueueName) {
  const queue = getPlatformQueue(name);
  return { name, ...(await queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed', 'paused')) };
}

export function createPlatformWorker(
  name: PlatformQueueName,
  processor: Processor,
  options: Omit<WorkerOptions, 'connection'> = {}
) {
  return new Worker(name, processor, { ...options, connection: redisConnection() });
}

export async function closePlatformQueues() {
  await Promise.all([...queues.values()].map((queue) => queue.close()));
  queues.clear();
}
