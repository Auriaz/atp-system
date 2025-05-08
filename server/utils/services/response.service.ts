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
    messageOptions: {
        description: string,
        statusCode?: HttpStatusCode,
        details?: any
    } | null = null,
): ResponseObject<T> {
    const body = {
        status: getResponseCategory(messageOptions?.statusCode || HTTP_STATUS.OK) as ResponseStatus,
        statusCode: messageOptions?.statusCode || HTTP_STATUS.OK,
        ...(payload !== undefined && payload !== null && { payload }),
        message: messageOptions ?
            createApiMessage(
                messageOptions.statusCode || HTTP_STATUS.OK,
                messageOptions.description || DEFAULT_STATUS_MESSAGES[messageOptions.statusCode || HTTP_STATUS.OK],
            ) :
            undefined,
        ...(messageOptions?.details ? { details: messageOptions.details } : {})
    };

    return body;
}
