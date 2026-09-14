import { Application, Response } from 'express';

const PROBE_PATHS = ['/health', '/.well-known/apollo/server-health'] as const;

export function registerProbes(app: Application): void {
  for (const path of PROBE_PATHS) {
    app.get(path, (_, res: Response) => {
      res.status(200).send('Okay!');
    });
  }
}
