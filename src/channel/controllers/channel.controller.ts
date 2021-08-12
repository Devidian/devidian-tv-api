import { UserAccountEntity } from '#/user-account';
import { EntityFactory, Environment, ExtendedLogger } from '#/utils';
import { RequestHandler, Response } from 'express';
import { channelService } from '../services/channel.service';
import { I18nPrefix } from '../enums/i18nPrefix';
import { HttpStatus } from '#/core/enums/HttpStatusCodes';
import { RtmpQuery } from '../dtos/rtmp-query.dto';
import { ChannelEntity } from '../entities/channel.entity';
import { NotifyAppType } from '../enums/notify-app-types';

/**
 * This controller is for /channel
 *
 * @class Controller
 */
class Controller {
	protected service = channelService;
	protected logger = new ExtendedLogger('ChannelController');

	public getOwned(): RequestHandler {
		return async (req, res) => {
			const user: UserAccountEntity = req.user as UserAccountEntity;

			const channelList = this.service.findAllByOwner(user.id);

			const response = (await channelList).map((v) => v.toPlain(['owner']));
			res.status(200).send(response).end();
		};
	}

	public update(): RequestHandler {
		return async (req, res) => {
			// const input = req.body;
		};
	}

	public create(): RequestHandler {
		return async (req, res) => {
			const input = req.body;
			const user: UserAccountEntity = req.user as UserAccountEntity;
			const nameCheck = await this.service.findByName(input.name);
			if (nameCheck) {
				return res
					.status(HttpStatus.BAD_REQUEST)
					.send({ error: 'ChannelName must be unique', i18n: `${I18nPrefix.ERROR}.NOT_UNIQUE` })
					.end();
			}
			const channel = await this.service.create(user, input.name);
			res.status(200).send(channel.toPlain(['owner']));
		};
	}

	protected async handleNotifyLive(res: Response, rtmpQuery: RtmpQuery) {
		const channel: ChannelEntity = await this.service.findByStreamKey(rtmpQuery.streamKey);
		if (!channel) {
			void this.logger.verbose(`Unknown <streamKey:${rtmpQuery.streamKey}`);
			return res.status(401).end();
		}
		res.status(200).end();
	}

	protected async handleNotifyPushRedirect(res: Response, rtmpQuery: RtmpQuery): Promise<void> {
		const channel: ChannelEntity = await this.service.findByStreamKey(rtmpQuery.streamKey);
		if (!channel) {
			return res.status(401).end();
		}

		const target = rtmpQuery.tcurl.searchParams.get('target');
		if (target == 'transcode') {
			// TODO transcoder_ip aus db holen
			const rHost = `rtmp://${Environment.getString('TRANSCODER_IP', '127.0.0.1')}:1935`;
			return (
				res
					// TODO set transcoder type programmatic
					.location(`${rHost}/${Environment.getString('TRANSCODER_TYPE', 'transcode169')}/` + channel.name)
					.status(303)
					.end()
			);
		}
		void this.logger.verbose(`redirect -> ${rtmpQuery.tcurl.searchParams.get('target')}`);
		res.status(200).end();
	}

	protected handleNotifyHlsPublish(res: Response, rtmpQuery: RtmpQuery) {
		// TODO get ip from database
		const validHLSPublisher = ['127.0.0.1'];
		if (validHLSPublisher.includes(rtmpQuery.addr)) {
			res.status(200).end();
		} else {
			void this.logger.warn(`handleNotifyHlsPublish -> invalid <ip: ${rtmpQuery.addr}>`);
			res.status(403).end();
		}
	}

	protected handleNotifyTranscodePublish(res: Response, rtmpQuery: RtmpQuery) {
		// TODO get ip from database
		const validTranscodePublisher = ['127.0.0.1'];
		if (validTranscodePublisher.includes(rtmpQuery.addr)) {
			res.status(200).end();
		} else {
			void this.logger.warn(`handleNotifyTranscodePublish -> invalid <ip: ${rtmpQuery.addr}>`);
			res.status(403).end();
		}
	}

	public notify(): RequestHandler {
		return async (req, res) => {
			const rtmpQuery: RtmpQuery = EntityFactory.create(RtmpQuery, req.query);

			if (rtmpQuery.call != 'publish') {
				void this.logger.verbose(`Unhandled rtmp query <call:${rtmpQuery.call}>`);
				return res.status(200).end();
			}

			switch (rtmpQuery.app) {
				case NotifyAppType.LIVE:
					return this.handleNotifyLive(res, rtmpQuery);
				case NotifyAppType.PUSH_REDIRECT:
					return this.handleNotifyPushRedirect(res, rtmpQuery);
				case NotifyAppType.HLS:
				case NotifyAppType.HLSLOW:
				case NotifyAppType.HLSP:
				case NotifyAppType.HLSPLOW:
					return this.handleNotifyHlsPublish(res, rtmpQuery);
				case NotifyAppType.TRANSCODE169:
				case NotifyAppType.TRANSCODE169LOW:
				case NotifyAppType.TRANSCODE916:
				case NotifyAppType.TRANSCODE916LOW:
					return this.handleNotifyTranscodePublish(res, rtmpQuery);

				default:
					void this.logger.verbose(`Unhandled rtmp query <app:${rtmpQuery.app}>`);
					break;
			}
			res.status(200).end();
		};
	}
}

export const channelController = new Controller();
