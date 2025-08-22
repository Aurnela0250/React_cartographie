export class AuthenticationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class UnauthenticatedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class GoogleAuthError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class GoogleAuthCancelledError extends Error {
  constructor(message: string = "Authentification Google annulée", options?: ErrorOptions) {
    super(message, options);
  }
}

export class GoogleAuthTimeoutError extends Error {
  constructor(message: string = "Timeout d'authentification Google", options?: ErrorOptions) {
    super(message, options);
  }
}

export class GoogleAuthPopupBlockedError extends Error {
  constructor(message: string = "Popup bloquée. Veuillez autoriser les popups pour ce site", options?: ErrorOptions) {
    super(message, options);
  }
}
