import { BaseEntity } from '#/utils';
import { Expose } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

export class ChannelEntity extends BaseEntity {
	@IsNotEmpty()
	@Length(3)
	name: string;

	ownerId: string;
	
	@Expose({ groups: ['owner', 'admin'] })
	streamKey: string;
}
