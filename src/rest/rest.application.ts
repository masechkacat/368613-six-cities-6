import { inject, injectable } from 'inversify';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { UserModel } from '../shared/modules/user/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient
  ) {}

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );
    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Connecting to the database…');
    await this.initDb();
    this.logger.info('Connected to the database.');

    const user = await UserModel.create({
      name: 'Maina',
      email: 'marina@example.com',
      avatarPath: 'http://example.com/avatar.jpg',
      userType: 'pro'
    });
    console.log(user);
  }
}
