export * from './entities/channel.entity';
export * from './services/channel.service';

import { channelApp } from './routers/channel.router';
import { APIController } from '#/core';

APIController.addRouter('/channel', channelApp);
