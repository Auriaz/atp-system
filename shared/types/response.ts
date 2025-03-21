type ResponseStatus = 'success' | 'error' | 'warning' | 'info';

interface ResponseObject<T = any> {
    status: ResponseStatus | boolean;
    payload?: T;
    message?: ReturnType<typeof createApiMessage> | undefined;
}