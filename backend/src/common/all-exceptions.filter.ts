import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  error: string;
  message: string | string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    const body = this.resolveBody(exception);
    const status = body.statusCode;

    if (status >= 500) {
      this.logger.error(
        this.describe(exception),
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json(body);
  }

  private resolveBody(exception: unknown): ErrorResponseBody {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      if (typeof payload === 'string') {
        return { statusCode: status, error: exception.name, message: payload };
      }
      if (this.isRecord(payload)) {
        const rawMessage = payload['message'] ?? payload['error'] ?? 'Solicitud inválida';
        const message =
          typeof rawMessage === 'string' || Array.isArray(rawMessage)
            ? rawMessage
            : 'Solicitud inválida';
        return { statusCode: status, error: exception.name, message };
      }
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.resolvePrismaError(exception);
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'InternalServerError',
      message: 'Error interno del servidor',
    };
  }

  private resolvePrismaError(exception: Prisma.PrismaClientKnownRequestError): ErrorResponseBody {
    switch (exception.code) {
      case 'P2002':
        return {
          statusCode: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: 'Ya existe un registro con los datos proporcionados',
        };
      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'NotFound',
          message: 'El registro solicitado no existe',
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'InternalServerError',
          message: 'Error interno del servidor',
        };
    }
  }

  private describe(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message;
    }
    return String(exception);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
