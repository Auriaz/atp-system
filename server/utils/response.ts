
import { setMessage } from "./message";

type ResponseStatus = 'success' | 'error' | 'warning' | 'info';

interface ResponseObject<T = any> {
    status: ResponseStatus | boolean;
    data?: T;
    message?: ReturnType<typeof setMessage> | undefined;
}

export function createApiResponse<T = any>(
    data?: T | null,
    message: { title: string; description: string } | null = null,
    status: ResponseStatus = 'success',
): ResponseObject<T> {
    // Determine toast type based on status
    return {
        ...(data !== undefined && data !== null && { data }),
        message: message ?
            setMessage(message.title as string, message.description as string, status) :
            undefined,
        status,
    };
}