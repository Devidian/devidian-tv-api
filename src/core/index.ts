import { Express } from 'express';
import { Server } from 'socket.io';
import { APIController } from './controllers/app-api.controller';
import { AppFeatureStatus } from './enums/AppFeatureStatus';
import { appFeatureRepository } from './repositories/app-feature.repository';
import { appFeatureService } from './services/app-feature.service';

export * from './controllers/app-websocket.controller';
export * from './errors';
export * from './guards/auth.guard';
export * from './router/auth.router';

const bootstrap = async (app: Express, ioServer: Server) => {
	APIController.init(app);

	void appFeatureService.registerFeature('steam-login', AppFeatureStatus.ACTIVATED);
};

export { appFeatureRepository, appFeatureService, APIController, bootstrap };
