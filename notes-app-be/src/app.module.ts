import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { NotesGateway } from './notes/gateway/notes.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_HOST),
    UserModule,
    AuthModule,
    NotesModule,
  ],
  controllers: [],
  providers: [NotesGateway],
})
export class AppModule {}
