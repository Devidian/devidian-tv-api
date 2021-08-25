import { ItemNotFoundException } from '#/core';
import { UserAccountEntity } from '#/user-account';
import { EntityFactory, ExtendedLogger } from '#/utils';
import { createHash } from 'crypto';
import { ObjectId } from 'mongodb';
import { ChannelEntity } from '../entities/channel.entity';
import { channelRepository } from '../repositories/channel.repository';

class ChannelService {
	protected repo = channelRepository;
	protected logger = new ExtendedLogger(ChannelService.name);

	public getAll(): Promise<ChannelEntity[]> {
		return this.repo.getAll();
	}

	public findByStreamKey(streamKey: string): ChannelEntity | PromiseLike<ChannelEntity> {
		return this.repo.findByStreamKey(streamKey);
	}

	public findByName(name: string): ChannelEntity | PromiseLike<ChannelEntity> {
		return this.repo.findByName(name);
	}

	public findAllByOwner(id: string): Promise<ChannelEntity[]> {
		return this.repo.findByOwnerId(id);
	}

	public async regenerateStreamKeyForId(id: string): Promise<ChannelEntity> {
		const ch: ChannelEntity = await this.repo.findItemById(id);
		if (!ch) {
			throw new ItemNotFoundException(`Channel with <id:${id}> not found`);
		}
		ch.streamKey = this.generateStreamKey(ch);

		return this.repo.save(ch);
	}

	public create(user: UserAccountEntity, name: string): Promise<ChannelEntity> {
		const channel = EntityFactory.create(ChannelEntity, { name, ownerId: user.id });
		channel.streamKey = this.generateStreamKey(channel);

		return this.repo.save(channel);
	}

	private generateStreamKey(ch: ChannelEntity) {
		const hashData = `${ch.id}:${Date.now()}:${new ObjectId().toHexString()}`;
		return createHash('sha256').update(hashData).digest('hex');
	}
}

export const channelService = new ChannelService();
