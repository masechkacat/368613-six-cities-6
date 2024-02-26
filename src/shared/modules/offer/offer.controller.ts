import { BaseController, HttpMethod, ValidateObjectIdMiddleware, ValidateDtoMiddleware, DocumentExistsMiddleware } from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { OfferService } from './offer-service.interface.js';
import { ParamOfferId, UpdateOfferDto, CreateOfferDto, OffersListRdo, OfferRdo } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { RequestQuery } from '../../libs/rest/types/request-query.type.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/index.js';
import { UserService } from '../user/user-service.interface.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService

  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffersByUser
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffersByCity
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.edit,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/', method: HttpMethod.Get,
      handler: this.index
    });
  }

  public async show({ params, query }: Request<ParamOfferId, RequestQuery>, res: Response): Promise<void> {
    const { offerId } = params;
    const userId = query?.userId?.toString() ?? '';
    const offer = await this.offerService.getOfferById(offerId, userId);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async index({ query }: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offers = await this.offerService.getAllOffers(query.userId,query.city, query.limit);

    this.ok(res, offers.map((offer) => fillDTO(OffersListRdo, offer)));
  }

  public async getFavoriteOffersByUser({ query }: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offers = await this.offerService.getFavoriteOffersByUser(query.userId, query.city, query.limit);

    this.ok(res, offers.map((offer) => fillDTO(OffersListRdo, offer)));
  }

  public async create({ body }: Request<ParamOfferId, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.createOffer(body);
    const offer = await this.offerService.getOfferById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteOffer(offerId);
    await this.commentService.deleteByOfferId(offerId);
    await this.userService.removeFavoriteFromAllUsers(offerId);

    this.noContent(res, offer);
  }

  public async edit({ params, body }: Request<ParamOfferId, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = params;
    const updatedOffer = await this.offerService.editOffer(offerId, body);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async getPremiumOffersByCity({ query }: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offers = await this.offerService.getPremiumOffers(query.city, query.userId, query.limit);

    this.ok(res, offers.map((offer) => fillDTO(OffersListRdo, offer)));
  }

  public async getComments({ params, query }: Request<ParamOfferId, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId, query.limit);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
