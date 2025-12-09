import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../src/models/user.model';
import { Passage } from '../src/models/passage.model';
import { Item } from '../src/models/item.model';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize-typescript';

(async function seed() {
  // Use a temporary SQLite DB file for seeding to avoid touching user's MySQL
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const sqliteFile = path.join(dataDir, 'dev.sqlite');
  process.env.DB_DIALECT = 'sqlite';
  process.env.DB_NAME = sqliteFile;
  // also set DB_STORAGE to be explicit
  process.env.DB_STORAGE = sqliteFile;

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    // Get Sequelize instance and access registered models directly to avoid relying on module-scoped providers
    const sequelizeInstance = app.get<Sequelize>(Sequelize as any);
    const userModel = sequelizeInstance.models.User || sequelizeInstance.model && sequelizeInstance.model('User');
    const passageModel = sequelizeInstance.models.Passage || sequelizeInstance.model && sequelizeInstance.model('Passage');
    const itemModel = sequelizeInstance.models.Item || sequelizeInstance.model && sequelizeInstance.model('Item');

    const password = bcrypt.hashSync('secret', 10);
    const user = await userModel.create({ email: 'user@example.com', username: 'user1', password } as any);
    const user2 = await userModel.create({ email: 'other@example.com', username: 'user2', password: bcrypt.hashSync('secret2', 10) } as any);

    const passage = await passageModel.create({ title: 'Sample passage', content: 'Lorem ipsum dolor sit amet', genre: 'general', wordCount: 100 } as any);

    const items: any[] = [];
    for (let i = 1; i <= 5; i++) {
      const it = await itemModel.create({
        stem: `Sample stem ${i}`,
        choices: [{ text: 'A' }, { text: 'B' }, { text: 'C' }, { text: 'D' }],
        answerIdx: 0,
        solution: 'Answer is A',
        section: 'math',
        type: 'multipleChoice',
        difficulty: 'medium',
        source: 'manual',
        status: 'draft',
        userId: (user as any).id,
        passageId: (passage as any).id,
      });
      items.push(it);
    }

    console.log('Seed completed:', { user: (user as any).id, user2: (user2 as any).id, passage: (passage as any).id, items: items.length });
  } catch (err) {
    console.error('Seed failed', err);
  } finally {
    await app.close();
    process.exit(0);
  }
})();
