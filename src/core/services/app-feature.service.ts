import { EntityFactory, ExtendedLogger } from '#/utils';
import { AppFeatureEntity } from '../entities/app-feature.entity';
import { AppFeatureStatus } from '../enums/AppFeatureStatus';
import { appFeatureRepository } from '../repositories/app-feature.repository';

class AppFeatureService {
	protected logger = new ExtendedLogger(AppFeatureService.name);
	protected repo = appFeatureRepository;

	public findByName(name: string): AppFeatureEntity | PromiseLike<AppFeatureEntity> {
		return this.repo.findByName(name);
	}

	public async registerFeature(name: string, defaultValue: AppFeatureStatus): Promise<AppFeatureEntity> {
		let entity = await this.findByName(name);
		if (!entity) {
			entity = EntityFactory.create(AppFeatureEntity, { name, status: defaultValue });
			entity = await this.repo.save(entity);
		}
		return entity;
	}

	public async getFeatureStatus(name: string): Promise<AppFeatureStatus> {
		const entity = await this.findByName(name);
		return entity?.status || AppFeatureStatus.DEACTIVATED;
	}
}

export const appFeatureService = new AppFeatureService();
