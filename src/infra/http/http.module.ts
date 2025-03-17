import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { CreateTasksController } from './controllers/tasks/create-tasks.controller'
import { ListTasksController } from './controllers/tasks/list-tasks.controller'
import { DeleteTasksController } from './controllers/tasks/delete-task.controller'
import { AuthenticateController } from './controllers/authenticate/authenticate.controller'
import { CreateAccountController } from './controllers/users/create-account.controller'
import { DatabaseModule } from '@/database/database.module'
import { UpdateTasksController } from './controllers/tasks/update-task.controller'
import { UpdateAccountController } from './controllers/users/update-account.controller'
import { UploadFileAccountController } from './controllers/users/uploadFile-account.controller'

@Module({
  imports: [
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // Caminho absoluto correto
      serveStaticOptions: {
        index: false, // Impede busca por index.html
      },
    }),
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateTasksController,
    ListTasksController,
    DeleteTasksController,
    UpdateTasksController,
    UpdateAccountController,
    UploadFileAccountController,
  ],
})
export class HttpModule {}
