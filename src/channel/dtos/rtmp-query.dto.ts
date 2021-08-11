import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { URL } from 'url';
import { NotifyAppType } from '../enums/notify-app-types';

export class RtmpQuery {
	call: string; // publish

	type: string; // live

	@IsEnum(NotifyAppType)
	app: NotifyAppType; // live/twitch/...

	flashver: string; //

	swfurl?: string; //

	@Transform(({ value }) => new URL(value))
	tcurl: URL; //

	addr: string; //

	clientid: string; //

	set name(value: string) {
		const [key, type] = value.split('::');
		this.streamKey = key;
		this.streamType = (type || 'live') as 'live' | 'test';
	}

	get name(): string {
		return [this.streamKey, this.streamType].join('::');
	}

	streamKey: string;
	streamType: 'live' | 'test';
}
