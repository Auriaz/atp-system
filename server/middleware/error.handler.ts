export default defineEventHandler((event) => {
  // Rejestracja globalnego handlera błędów
  event.context._onError = (error: any) => {
    // Logowanie błędu
    console.error('Server error:', error);

    // Określenie kodu statusu i komunikatu
    // H3Error ma właściwość statusCode, zwykłe błędy nie
    const statusCode = error.statusCode || error.status || 500;
    const statusMessage = error.statusMessage || error.message || 'Internal Server Error';

    // Utworzenie ustrukturyzowanej odpowiedzi
    return {
      statusCode,
      statusMessage,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      // Dodatkowe informacje z pola data, jeśli istnieją
      ...(error.data ? { data: error.data } : {})
    };
  };
});