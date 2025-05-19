import { RequestHandler } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import HttpException from "@exceptions/http-exception";

const validationMiddleware = (
    type: any,
    value: 'body' | 'query' | 'params' = 'body',
    skipMissingProperties: boolean = false,
    whitelist: boolean = true,
    forbidNonWhitelisted: boolean = false
): RequestHandler => {
    return async (req, res, next) => {
        try {
            // ✅ Guard against undefined or invalid DTOs
            if (!type || typeof type !== 'function') {
                return next(new HttpException(500, 'Invalid DTO passed to validation middleware'));
            }

            // Transform request data to an instance of the provided type
            const transformed = plainToInstance(type, req[value]);

            // Validate the transformed data
            const errors = await validate(transformed, {
                skipMissingProperties,
                whitelist,
                forbidNonWhitelisted,
            });

            if (errors.length > 0) {
                const message = errors
                    .map((error: ValidationError) =>
                        error.constraints ? Object.values(error.constraints).join(', ') : 'Invalid input'
                    )
                    .join(', ');

                return next(new HttpException(400, message));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default validationMiddleware