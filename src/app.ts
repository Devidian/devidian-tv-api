'use strict';
import cluster, { Worker } from 'cluster';
import { Environment, UtilEnvVars, Logger, Loglevel } from './utils/without-mongo';
const logger = new Logger('app');

process.title = cluster.isPrimary ? 'Master' : `Worker${cluster.worker.id}`;
void logger.info(`Starting process`);
void logger.info(`Loglevel <${Loglevel[Environment.getNumber(UtilEnvVars.APP_LOG_LEVEL)]}>`);
void logger.debug(`Log to database <${Environment.getBoolean(UtilEnvVars.APP_LOG_DB)}>`);
void logger.debug(`Log to websocket <${Environment.getBoolean(UtilEnvVars.APP_LOG_WS)}>`);

function createWorker(code?: number, signal?: string): Worker {
	let c: Worker = null;
	if (c) {
		void logger.error(`Worker <${c.id}> exited with code: <${code}> and signal <${signal}>`);
		c.removeAllListeners();
		c.destroy();
	}
	c = cluster.fork();
	c.addListener('exit', createWorker);
	return c;
}

if (cluster.isPrimary) {
	createWorker();
} else {
	import('./app-worker')
		.then(({ initWorker }) => {
			return initWorker();
		})
		.catch((e) => {
			void logger.error(e.message);
		});
}
