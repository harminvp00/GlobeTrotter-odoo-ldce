import { Request, Response } from 'express';
import { cityService } from '../services/city.service';
import { CityQueryInput } from '../schemas/city.schema';

export class CityController {
  async getCities(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as CityQueryInput;
    const result = await cityService.getCities(query);

    res.status(200).json({
      data: result.cities,
      meta: result.pagination,
    });
  }
}

export const cityController = new CityController();
