import express = require('express');
import { I18n } from '../enums/i18n';
import { channelRepository } from '../repositories/channel.repository';

export const databaseGuard: express.RequestHandler = async (req, res, next) => {
	if (await channelRepository.isReady) {
		next();
	} else {
		res.status(500).send({ error: 'Database not ready', i18n: I18n.E_DB_NOT_READY }).end();
	}
};
