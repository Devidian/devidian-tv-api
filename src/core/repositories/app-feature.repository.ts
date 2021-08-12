import { BaseRepository, DatabaseCollection, ExtendedLogger, MongoCollection } from '#/utils';
import { AppFeatureEntity } from '../entities/app-feature.entity';

class AppFeatureRepository extends BaseRepository<AppFeatureEntity> {
	@DatabaseCollection<AppFeatureEntity>('features', AppFeatureEntity, false, [
		{ spec: { name: 1 }, options: { name: 'appFeatureName', background: true, unique: true } },
	])
	protected collectionRef: MongoCollection<AppFeatureEntity>;
	protected logger = new ExtendedLogger(AppFeatureRepository.name);

	public findByName(name: string): AppFeatureEntity | PromiseLike<AppFeatureEntity> {
		return this.collectionRef.findItem({ name });
	}
}
export const appFeatureRepository = new AppFeatureRepository();
