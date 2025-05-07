/**
 * Tworzy ustandaryzowaną odpowiedź API
 * 
 * @param payload - Główne dane odpowiedzi
 * @param message - Obiekt wiadomości zawierający tytuł i opis
 * @param status - Status odpowiedzi (success, error, warning, info)
 * @returns Obiekt odpowiedzi API
 */
export function createApiResponse<T = any>(
    payload?: T | null,
    message: { title: string; description: string } | null = null,
    statusCode: HttpStatusCode = HTTP_STATUS.OK,
    status: ResponseStatus = 'success',
): ResponseObject<T> {
    const body = {
        ...(payload !== undefined && payload !== null && { payload }),
        message: message ?
            createApiMessage(message.title as string, message.description as string, status) :
            undefined,
        statusCode,
        status,
    };

    return body;
}