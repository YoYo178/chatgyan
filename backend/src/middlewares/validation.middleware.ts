import type { NextFunction, Request, Response } from 'express';
import { ZodType, type ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) throw result.error;
        req.body = result.data;
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) throw result.error;
        Object.assign(req.query, result.data);
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) throw result.error;
        Object.assign(req.params, result.data);
      }

      next();
      return;
    } catch (err) {
      const error = err as ZodError;

      const validationError = fromZodError(error, {
        prefix: null,
        includePath: false,
      });

      res.status(400).json({
        success: false,
        message: validationError.message || 'Validation failed',
      });
      return;
    }
  };
};
