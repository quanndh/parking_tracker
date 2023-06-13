import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object') {
      return response.status(status).json({
        ...exceptionResponse,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    return response.status(status).json({
      statusCode: status,
      erorr: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
