import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { User } from '../src/models/user.model';
import { Passage } from '../src/models/passage.model';
import { Item } from '../src/models/item.model';
import * as fs from 'fs';
import * as path from 'path';

const dbName = process.env.DB_NAME || 'sat_db';
const dbUser = process.env.DB_USERNAME || 'root';
const dbPass = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 3306;
const dbDialect = (process.env.DB_DIALECT as any) || 'mysql';

const modelsDir = path.join(__dirname, '../src/models');
const modelFiles = fs.readdirSync(modelsDir).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));
const models: any[] = [];
for (const file of modelFiles) {
  const mod = require(path.join(modelsDir, file));
  for (const k of Object.keys(mod)) {
    const val = mod[k];
    if (typeof val === 'function') models.push(val);
  }
}

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect as any,
  models,
  logging: false,
});

(async function seed() {
  try {
    await sequelize.sync();
    console.log('Database synced');

    const password = bcrypt.hashSync('secret', 10);
    const user = await User.create({ email: 'user@example.com', username: 'user1', password } as any);
    const user2 = await User.create({ email: 'other@example.com', username: 'user2', password: bcrypt.hashSync('secret2', 10) } as any);

    const passage = await Passage.create({ title: 'Sample passage', content: 'Lorem ipsum dolor sit amet', genre: 'general', wordCount: 100 } as any);

    const items: Item[] = [];
    for (let i = 1; i <= 5; i++) {
      const it = await Item.create({
        stem: `Sample stem ${i}`,
        choices: [{ text: 'A' }, { text: 'B' }, { text: 'C' }, { text: 'D' }],
        answerIdx: 0,
        solution: 'Answer is A',
        section: 'math',
        type: 'multipleChoice',
        difficulty: 'medium',
        source: 'manual',
        status: 'draft',
        userId: user.id,
        passageId: passage.id,
      } as any);
      items.push(it);
    }

    console.log('Seed completed:', { user: user.get('id'), user2: user2.get('id'), passage: passage.get('id'), items: items.length });
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
})();
