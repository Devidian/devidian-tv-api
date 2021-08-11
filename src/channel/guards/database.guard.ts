import express = require('express');
import { I18nPrefix } from '../enums/i18nPrefix';
import { channelRepository } from '../repositories/channel.repository';

export const databaseGuard: express.RequestHandler = async (req, res, next) => {
	if (await channelRepository.isReady) {
		next();
	} else {
		res
			.status(500)
			.send({ error: 'Database not ready', i18n: I18nPrefix.ERROR + '.DB.NOT_READY' })
			.end();
	}
};
