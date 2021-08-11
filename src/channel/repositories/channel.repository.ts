import { BaseRepository, DatabaseCollection, ExtendedLogger, MongoCollection } from '#/utils';
import { ChannelEntity } from '../entities/channel.entity';

class ChannelRepository extends BaseRepository<ChannelEntity> {
	@DatabaseCollection<ChannelEntity>('channel', ChannelEntity, false, [
		{ spec: { name: 1 }, options: { name: 'channelUniqueNameIndex', background: true, unique: true } },
	])
	protected collectionRef: MongoCollection<ChannelEntity>;
	protected logger = new ExtendedLogger(ChannelRepository.name);

	public findByName(name: string): ChannelEntity | PromiseLike<ChannelEntity> {
		return this.collectionRef.findItem({ name });
	}

	public findByOwnerId(id: string): Promise<ChannelEntity[]> {
		return this.collectionRef.findItems({ ownerId: id });
	}

	public findByStreamKey(streamKey: string): ChannelEntity | PromiseLike<ChannelEntity> {
		return this.collectionRef.findItem({ streamKey });
	}
}
export const channelRepository = new ChannelRepository();
