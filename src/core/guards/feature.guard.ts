import { UserAccountEntity } from '#/user-account';
import { Environment } from '#/utils';
import { RequestHandler } from 'express';
import { AppFeatureStatus } from '../enums/AppFeatureStatus';
import { appFeatureService } from '../services/app-feature.service';

export function featureGuard(featureName: string): RequestHandler {
	return async (req, res, next) => {
		const user = req.user as UserAccountEntity;
		const status = await appFeatureService.getFeatureStatus(featureName);
		if (
			(status && status == AppFeatureStatus.ACTIVATED) ||
			(status == AppFeatureStatus.ADMINISTRATIVE && user.isAdmin) ||
			(status == AppFeatureStatus.TESTING && Environment.getString('NODE_ENV') !== 'production')
		) {
			return next();
		}
		// if (status == AppFeatureStatus.DEACTIVATED)
		else {
			return res
				.status(403)
				.send({ error: 'This feature is currently not available', i18n: 'API.FEATURE.DEACTIVATED' })
				.end();
		}
	};
}
