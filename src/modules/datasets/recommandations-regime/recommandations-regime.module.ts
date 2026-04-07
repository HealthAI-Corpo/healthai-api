import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommandationsRegimeService } from './recommandations-regime.service';
import { RecommandationsRegimeController } from './recommandations-regime.controller';
import { RecommandationsRegime } from './entities/recommandations-regime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecommandationsRegime])],
  controllers: [RecommandationsRegimeController],
  providers: [RecommandationsRegimeService],
  exports: [RecommandationsRegimeService],
})
export class RecommandationsRegimeModule {}
