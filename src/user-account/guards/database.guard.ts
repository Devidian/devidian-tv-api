import express = require('express');
import { I18n } from '../enums/i18n';
import { userAccountRepository } from '../repositories/user-account.repository';

export const databaseGuard: express.RequestHandler = async (req, res, next) => {
	if (await userAccountRepository.isReady) {
		next();
	} else {
		res.status(500).send({ error: 'Database not ready', i18n: I18n.E_DB_NOT_READY }).end();
	}
};
