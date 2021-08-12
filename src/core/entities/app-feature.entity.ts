import { BaseEntity } from '#/utils';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { AppFeatureStatus } from '../enums/AppFeatureStatus';

export class AppFeatureEntity extends BaseEntity {
	@IsNotEmpty()
	@Length(3)
	name: string;

	@IsEnum(AppFeatureStatus)
	status: AppFeatureStatus;
}
