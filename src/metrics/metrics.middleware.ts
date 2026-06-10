import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      // req.route n'est dispo qu'une fois le routing Express effectué (au moment
      // de "finish"), ce qui permet d'avoir le pattern de route ("/users/:id")
      // plutôt que l'URL brute et d'éviter l'explosion de cardinalité des labels.
      const route = (req.route?.path as string | undefined) ?? req.path;
      const labels = {
        method: req.method,
        route,
        status_code: String(res.statusCode),
      };
      const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;

      this.metrics.httpRequestsTotal.inc(labels);
      this.metrics.httpRequestDuration.observe(labels, durationSeconds);
    });

    next();
  }
}
