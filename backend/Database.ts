import { DataSource, DataSourceOptions } from "typeorm";
import { join } from "path";

export const LiveChatDataSource: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [`${__dirname}/**/*.entity.{ts,js}`],
    subscribers: [`${__dirname}/**/*.subscriber.{ts,js}`],
    synchronize: false,
    migrationsTableName: 'migrations',
    migrations: [join(__dirname, 'src', 'core', 'database', 'migrations', '*.{ts,js}')],
    ssl: Number(process.env.SSL_ENABLED) === 1,
};

const LiveChatDatabase = new DataSource(LiveChatDataSource);

export default LiveChatDatabase;