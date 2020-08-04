
type AuthenticateChallenge = string | string[];

export const errorFromCode = newErrorFromHttpStatusCode;

export function newErrorFromHttpStatusCode(httpStatus: number | string): HttpError | null {
  if (typeof httpStatus === 'string') {
    httpStatus = Number.parseInt(httpStatus);
  }
  if (httpStatus == null || httpStatus === NaN || httpStatus < 400) {
    return null;
  }
  if (httpStatus > 511) {
    throw new Error('Invalid status code');
  }

  switch (httpStatus) {
    case 400:
      return new BadRequestError();
    case 401:
      return new UnauthorizedError();
    case 402:
      return new PaymentRequiredError();
    case 403:
      return new ForbiddenError();
    case 404:
      return new NotFoundError();
    case 405:
      return new MethodNotAllowedError();
    case 406:
      return new NotAcceptableError();
    case 407:
      return new ProxyAuthenticationRequiredError();
    case 408:
      return new RequestTimeoutError();
    case 409:
      return new ConflictError();
    case 410:
      return new GoneError();
    case 411:
      return new LengthRequiredError();
    case 412:
      return new PreconditionFailedError();
    case 413:
      return new PayloadTooLargeError();
    case 414:
      return new UriTooLongError();
    case 415:
      return new UnsupportedMediaTypeError();
    case 416:
      return new RangeNotSatisfiableError();
    case 417:
      return new ExpectationFailedError();
    case 418:
      return new IAmATeapotError();
    case 421:
      return new MisdirectedRequestError();
    case 422:
      return new UnprocessableEntityError();
    case 423:
      return new LockedError();
    case 424:
      return new FailedDependencyError();
    case 425:
      return new TooEarlyError();
    case 426:
      return new UpgradeRequiredError();
    case 428:
      return new PreconditionRequiredError();
    case 429:
      return new TooManyRequestsError();
    case 431:
      return new RequestHeaderFieldsTooLargeError();
    case 451:
      return new UnavailableForLegalReasonsError();
    case 500:
      return new InternalServerError();
    case 501:
      return new NotImplementedError();
    case 502:
      return new BadGatewayError();
    case 503:
      return new ServiceUnavailableError();
    case 504:
      return new GatewayTimeoutError();
    case 505:
      return new HttpVersionNotSupportedError();
    case 506:
      return new VariantAlsoNegotiatesError();
    case 507:
      return new InsufficientStorageError();
    case 508:
      return new LoopDetectedError();
    case 510:
      return new NotExtendedError();
    case 511:
      return new NetworkAuthenticationRequiredError();
    default:
      return null;
  }
}

export interface HttpError extends Error {
  httpStatus: number;
}

export interface HttpProblem extends HttpError {
  type: string | null;
  title: string;
  detail: string | null;
  instance: string | null;
}
export function isHttpError(e: Error | undefined): e is HttpError {
  if (!e) {
    return false;
  }
  return Number.isInteger((<HttpError>e).httpStatus);
}
export function isHttpProblem(e: Error): e is HttpProblem {
  return (<HttpProblem>e).title !== undefined && isHttpError(e);
}

export class HttpErrorBase extends Error implements HttpProblem {
  type: string | null = null;
  httpStatus: number = HttpStatusCode.InternalServerError; // 500
  title: string = 'Internal Server Error';
  detail: string | null = null;
  instance: string | null = null;

  constructor(detail: string | null = null) {
    super(detail || 'HTTP error');
    this.detail = detail;
  }
}

export function isClientError(e: Error): boolean {
  return isHttpError(e) && e.httpStatus >= 400 && e.httpStatus <= 499;
}

export function isServerError(e: Error): boolean {
  return isHttpError(e) && e.httpStatus >= 500 && e.httpStatus <= 599;
}

/**
 * 400 BadRequerst.
 *
 * The server cannot or will not process the request due to an apparent client error
 * (e.g., malformed request syntax, too large size, invalid request message framing, or
 * deceptive request routing).
 *
 */
export class BadRequestError extends HttpErrorBase {
  httpStatus = HttpStatusCode.BadRequest;
  title = 'Bad Request';
}

export function isBadRequestError(e: Error): e is BadRequestError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.BadRequest;
}

/**
 * 401 Unauthorized.
 *
 * This response must come with a WWW-Authenticate header. This challenge can
 * optionally be provided via the constructor.
 *
 * Similar to 403 Forbidden, but specifically for use when authentication is required 
 * and has failed or has not yet been provided. The response must include a 
 * WWW-Authenticate header field containing a challenge applicable to the requested 
 * resource. See Basic access authentication and Digest access authentication. 
 * 401 semantically means "unauthenticated",i.e. the user does not have the necessary 
 * credentials.

 * examples:
 *    new UnauthorizedError('Login failed', 'Basic');
 *    new UnauthorizedError('Login failed', 'Basic; realm="secret area"');
 *    new UnauthorizedError('Login failed', ['Basic; realm="secret area', 'Bearer']);
 */
export class UnauthorizedError extends HttpErrorBase {
  httpStatus = HttpStatusCode.Unauthorized; //401
  title = 'Unauthorized';

  wwwAuthenticate?: AuthenticateChallenge;

  constructor(detail: string | null = null, wwwAuthenticate?: AuthenticateChallenge) {
    super(detail);
    this.wwwAuthenticate = wwwAuthenticate;
  }
}

export function isUnauthorizedError(e: Error): e is UnauthorizedError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.Unauthorized;
}

/**
 * 402 Payment Required
 *
 * Reserved for future use. The original intention was that this code might be used as
 * part of some form of digital cash or micro payment scheme, but that has not happened,
 * and this code is not usually used.
 * Google Developers API uses this status if a particular developer has exceeded the daily
 * limit on requests.
 */
export class PaymentRequiredError extends HttpErrorBase {
  httpStatus = HttpStatusCode.PaymentRequired; // 402
  title = 'Payment Required';
}

export function isPaymentRequiredError(e: Error): e is PaymentRequiredError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.PaymentRequired;
}

/**
 * 403 Forbidden
 *
 * The request was valid, but the server is refusing action.
 * The user might not have the necessary permissions for a resource.
 */

export class ForbiddenError extends HttpErrorBase {
  httpStatus = HttpStatusCode.Forbidden; // 403
  title = 'Forbiddden';
}
export function isForbiddenError(e: Error): e is ForbiddenError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.Forbidden;
}

/**
 * 404 Not Found
 *
 * The requested resource could not be found but may be available in the future.
 * Subsequent requests by the client are permissible.
 *
 */

export class NotFoundError extends HttpErrorBase {
  httpStatus = 404;
  title = 'Not Found';
}

export function isNotFoundError(e: Error): e is NotFoundError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.NotFound;
}

/**
 * 405 Method Not Allowed.
 *
 * The 405 Method Not Allowed HTTP response requires an Allow header.
 * You can optionally use the second argument to provide this.
 *
 * A request method is not supported for the requested resource;
 * for example, a GET request on a form that requires data to be presented 
 * via POST, or a PUT request on a read-only resource.

 * Example:
 *   new MethodNotAllowedError('This resource is read-only', ['GET', 'HEAD', 'OPTIONS']);
 * 
 */
export class MethodNotAllowedError extends HttpErrorBase {
  httpStatus = HttpStatusCode.MethodNotAllowed;
  title = 'Method Not Allowed';
  allow?: string[];

  constructor(detail: string | null = null, allow?: string[]) {
    super(detail);
    this.allow = allow;
  }
}
export function isMethodNotAllowedError(e: Error): e is MethodNotAllowedError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.MethodNotAllowed;
}

/**
 * 406 Not Acceptable
 *
 * The requested resource is capable of generating only content not acceptable
 * according to the Accept headers sent in the request.
 *
 */
export class NotAcceptableError extends HttpErrorBase {
  httpStatus = HttpStatusCode.NotAcceptable; //406
  title = 'Not Acceptable';
}
export function isNotAcceptableError(e: Error): e is NotAcceptableError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.NotAcceptable;
}

/**
 * 407 Proxy Autentication Required
 *
 * This response must come with a Proxy-Authenticate header. This challenge can
 * optionally be provided via the constructor.
 *
 * The client must first authenticate itself with the proxy.
 *
 * Examples:
 *   new ProxyAuthenticationRequiredError('Login failed', 'Basic');
 *   new ProxyAuthenticationRequiredError('Login failed', 'Basic; realm="secret area"');
 *   new ProxyAuthenticationRequiredError('Login failed', ['Basic; realm="secret area', 'Bearer']);
 */
export class ProxyAuthenticationRequiredError extends HttpErrorBase {
  httpStatus = HttpStatusCode.ProxyAuthenticationRequired; //407
  title = 'Proxy Authentication Required';

  proxyAuthenticate?: AuthenticateChallenge;

  constructor(detail: string | null = null, proxyAuthenticate?: AuthenticateChallenge) {
    super(detail);
    this.proxyAuthenticate = proxyAuthenticate;
  }
}

export function isProxyAuthenticationRequiredError(
  e: Error
): e is ProxyAuthenticationRequiredError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.ProxyAuthenticationRequired;
}

/**
 * 408 Request Timeout
 *
 *
 */
export class RequestTimeoutError extends HttpErrorBase {
  httpStatus = HttpStatusCode.RequestTimeout; //408
  title = 'Request Timeout';
}
export function isRequestTimeoutError(e: Error): e is RequestTimeoutError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.RequestTimeout;
}

/**
 * 409 Conflict
 *
 * Indicates that the request could not be processed because of conflict in the request,
 * such as an edit conflict between multiple simultaneous updates.
 *
 */
export class ConflictError extends HttpErrorBase {
  httpStatus = HttpStatusCode.Conflict; // 409
  title = 'Conflict';
}
export function isConflictError(e: Error): e is ConflictError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.Conflict;
}

/**
 * 410 Gone
 *
 * Indicates that the resource requested is no longer available and will not be
 * available again. This should be used when a resource has been intentionally
 * removed and the resource should be purged. Upon receiving a 410 status code,
 * the client should not request the resource in the future. Clients such as search
 * engines should remove the resource from their indices.
 *
 * Most use cases do not require clients and search engines to purge the resource,
 * and a "404 Not Found" may be used instead.
 *
 */
export class GoneError extends HttpErrorBase {
  httpStatus = HttpStatusCode.Gone; //410
  title = 'Gone';
}
export function isGoneError(e: Error): e is GoneError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.Gone;
}

/**
 * 411 Length Required
 *
 * The request did not specify the length of its content, which is required by the
 * requested resource.
 *
 */
export class LengthRequiredError extends HttpErrorBase {
  httpStatus = HttpStatusCode.LengthRequired; //411;
  title = 'LengthRequired';
}

export function isLengthRequiredError(e: Error): e is LengthRequiredError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.LengthRequired;
}

/**
 * 412 Precondition Failed
 * The server does not meet one of the preconditions that the requester put on the request.
 */
export class PreconditionFailedError extends HttpErrorBase {
  httpStatus = HttpStatusCode.PreconditionFailed; // 412;
  title = 'PreconditionFailed';
}

export function isPreconditionFailedError(e: Error): e is PreconditionFailedError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.PreconditionFailed;
}

/**
 * 413 Payload Too Large.
 *
 * If the status is temporary, it's possible for a server to send a
 * Retry-After header to try again. This value may be embeded in this
 * exception.
 *
 * Example:
 *   throw new PayloadTooLargeError('Send the large file again in 10 minutes', 600);
 */

export class PayloadTooLargeError extends HttpErrorBase {
  httpStatus = HttpStatusCode.PayloadTooLarge; //413;
  title = 'Payload Too Large';

  retryAfter: number | null;

  constructor(detail: string | null = null, retryAfter: number | null = null) {
    super(detail);
    this.retryAfter = retryAfter;
  }
}

export function isPayloadTooLargeError(e: Error): e is PayloadTooLargeError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.PayloadTooLarge;
}

/**
 * 414 URI Too Long
 *
 * The URI provided was too long for the server to process. Often the result of too much
 * data being encoded as a query-string of a GET request, in which case it should be
 * converted to a POST request.
 *
 * Called "Request-URI Too Long" previously.
 *
 */
export class UriTooLongError extends HttpErrorBase {
  httpStatus = HttpStatusCode.UriTooLong; //;
  title = 'URI Too Long';
}

export function isUriTooLongError(e: Error): e is UriTooLongError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.UriTooLong;
}

/**
 * 415 Unsupported Media Type
 * 
 * The request entity has a media type which the server or resource does not support.
 
 * For example, the client uploads an image as image/svg+xml, but the server requires 
 * that images use a different format.
 *
 */
export class UnsupportedMediaTypeError extends HttpErrorBase {
  httpStatus = HttpStatusCode.UnsupportedMediaType; // 415;
  title = 'Unsupported Media Type';
}

export function isUnsupportedMediaTypeError(e: Error): e is UnsupportedMediaTypeError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.UnsupportedMediaType;
}

/**
 * 416 Range Not Satisfiable
 *
 * The client has asked for a portion of the file (byte serving), but the server cannot
 * supply that portion.
 *
 * For example, if the client asked for a part of the file that lies beyond the end of
 * the file.
 *
 * Called "Requested Range Not Satisfiable" previously.
 *
 */
export class RangeNotSatisfiableError extends HttpErrorBase {
  httpStatus = HttpStatusCode.RangeNotSatisfiable; ////416;
  title = 'Range Not Satisfiable';
}

export function isRangeNotSatisfiableError(e: Error): e is RangeNotSatisfiableError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.RangeNotSatisfiable;
}

/**
 * 417 Expectation Failed
 *
 * The server cannot meet the requirements of the Expect request-header field.
 *
 */
export class ExpectationFailedError extends HttpErrorBase {
  httpStatus = HttpStatusCode.ExpectationFailed; // 417;
  title = 'Expectation Failed';
}

export function isExpectationFailedError(e: Error): e is ExpectationFailedError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.ExpectationFailed;
}

/**
 * The HTTP 418 I'm a teapot client error response code indicates that the server
 * refuses to brew coffee because it is, permanently, a teapot. A combined coffee/tea pot
 * that is temporarily out of coffee should instead return 503. This error is a reference
 * to Hyper Text Coffee Pot Control Protocol defined in April Fools' jokes in 1998 and 2014.
 */

export function isIAmATeapotError(e: Error): e is IAmATeapotError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.IAmATeapot;
}

export class IAmATeapotError extends HttpErrorBase {
  httpStatus = HttpStatusCode.IAmATeapot;
  title = 'I am a teapot';
}

/**
 * 421 Misdirected Request
 *
 * The request was directed at a server that is not able to produce a response
 * (for example because a connection reuse).
 *
 */
export class MisdirectedRequestError extends HttpErrorBase {
  httpStatus = HttpStatusCode.MisdirectedRequest; // 421;
  title = 'Misdirected Request';
}
export function isMisdirectedRequestError(e: Error): e is MisdirectedRequestError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.MisdirectedRequest;
}

/**
 * 422 Unprocessable Entity
 *
 * The request was well-formed but was unable to be followed due to semantic errors.
 *
 */
export class UnprocessableEntityError extends HttpErrorBase {
  httpStatus = HttpStatusCode.UnprocessableEntity;
  title = 'Unprocessable Entity';
}
export function isUnprocessableEntityError(e: Error): e is UnprocessableEntityError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.UnprocessableEntity;
}

/**
 * 423 Locked
 *
 * The resource that is being accessed is locked.
 *
 */
export class LockedError extends HttpErrorBase {
  httpStatus = HttpStatusCode.Locked; // 423;
  title = 'Locked';
}
export function isLockedError(e: Error): e is LockedError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.Locked;
}

/**
 * 424 FailedDependency
 */
export class FailedDependencyError extends HttpErrorBase {
  httpStatus = HttpStatusCode.FailedDependency; // 424;
  title = 'Failed Dependency';
}
export function isFailedDependencyError(e: Error): e is FailedDependencyError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.FailedDependency;
}

/**
 * 425 Too Early
 */
export class TooEarlyError extends HttpErrorBase {
  httpStatus = HttpStatusCode.TooEarly; // 425;
  title = 'Too Early';
}
export function isTooEarlyError(e: Error): e is TooEarlyError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.TooEarly;
}

/**
 * 426 Upgrade Required
 */
export class UpgradeRequiredError extends HttpErrorBase {
  httpStatus = HttpStatusCode.UpgradeRequired; // 426;
  title = 'Upgrade Required';
}

export function isUpgradeRequiredError(e: Error): e is UpgradeRequiredError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.UpgradeRequired;
}

/**
 * 428 Precondition Required
 */
export class PreconditionRequiredError extends HttpErrorBase {
  httpStatus = HttpStatusCode.PreconditionRequired; // 428;
  title = 'Precondition Required';
}

export function isPreconditionRequiredError(e: Error): e is PreconditionRequiredError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.PreconditionRequired;
}

/**
 * 429 Too Many Requests
 *
 * When sending this status the server may also send a Retry-After header
 * indicating when it's safe try again.
 *
 * It's possible to supply this information via the second argument.
 *
 * Example:
 *   throw new ServiceUnavailable('We\'re down temporarily', 600)
 *
 */

export class TooManyRequestsError extends HttpErrorBase {
  httpStatus = HttpStatusCode.TooManyRequests; // 429;
  title = 'Too Many Requests';
  retryAfter: number | null;

  constructor(detail: string | null = null, retryAfter: number | null = null) {
    super(detail);
    this.retryAfter = retryAfter;
  }
}
export function isTooManyRequestsError(e: Error): e is TooManyRequestsError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.TooManyRequests;
}

/**
 * 431 Request Header Fields Too Large
 */
export class RequestHeaderFieldsTooLargeError extends HttpErrorBase {
  httpStatus = HttpStatusCode.RequestHeaderFieldsTooLarge; // // 431;
  title = 'Request Header Fields Too Large';
}

export function isRequestHeaderFieldsTooLargeError(
  e: Error
): e is RequestHeaderFieldsTooLargeError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.RequestHeaderFieldsTooLarge;
}

/**
 * 451 Unavailable For Legal Reasons
 */
export class UnavailableForLegalReasonsError extends HttpErrorBase {
  httpStatus = HttpStatusCode.UnavailableForLegalReasons; // 451;
  title = 'Unavailable For Legal Reasons';
}
export function isUnavailableForLegalReasonsError(e: Error): e is UnavailableForLegalReasonsError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.UnavailableForLegalReasons;
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends HttpErrorBase {
  httpStatus = HttpStatusCode.InternalServerError; // 500;
  title = 'Internal Server Error';
}
export function isInternalServerError(e: Error): e is InternalServerError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.InternalServerError;
}

/**
 * 501 Not Implemented
 */
export class NotImplementedError extends HttpErrorBase {
  httpStatus = HttpStatusCode.NotImplemented; // //501;
  title = 'Not Implemented';
}
export function isNotImplementedError(e: Error): e is NotImplementedError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.NotImplemented;
}

/**
 * 502 Bad Gateway
 */
export class BadGatewayError extends HttpErrorBase {
  httpStatus = HttpStatusCode.BadGateway; // 502;
  title = 'Bad Gateway';
}

export function isBadGatewayError(e: Error): e is BadGatewayError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.BadGateway;
}

/**
 * 503 Service Unavailable.
 *
 * When sending this status the server may also send a Retry-After header
 * indicating when it's safe try again.
 *
 * It's possible to supply this information via the second argument.
 *
 * Example:
 *   throw new ServiceUnavailable('We\'re down temporarily', 600)
 *
 */
export class ServiceUnavailableError extends HttpErrorBase {
  httpStatus = HttpStatusCode.ServiceUnavailable; // 503;
  title = 'Service Unavailable';
  retryAfter: number | null;

  constructor(detail: string | null = null, retryAfter: number | null = null) {
    super(detail);
    this.retryAfter = retryAfter;
  }
}
export function isServiceUnavailableError(e: Error): e is ServiceUnavailableError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.ServiceUnavailable;
}

/**
 * 504 Gateway Timeout
 */
export class GatewayTimeoutError extends HttpErrorBase {
  httpStatus = HttpStatusCode.GatewayTimeout; // 504;
  title = 'Gateway Timeout';
}

export function isGatewayTimeoutError(e: Error): e is GatewayTimeoutError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.GatewayTimeout;
}

/**
 * 505 HTTP Version Not Supported
 */
export class HttpVersionNotSupportedError extends HttpErrorBase {
  httpStatus = HttpStatusCode.HttpVersionNotSupported; // 505;
  title = 'HTTP Version Not Supported';
}
export function isHttpVersionNotSupportedError(e: Error): e is HttpVersionNotSupportedError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.HttpVersionNotSupported;
}

/**
 * 506 Variant Also Negotiates
 */
export class VariantAlsoNegotiatesError extends HttpErrorBase {
  httpStatus = HttpStatusCode.VariantAlsoNegotiates; // 506;
  title = 'Variant Also Negotiates';
}
export function isVariantAlsoNegotiatesError(e: Error): e is VariantAlsoNegotiatesError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.VariantAlsoNegotiates;
}

/**
 * 507 Insufficient Storage
 */
export class InsufficientStorageError extends HttpErrorBase {
  httpStatus = HttpStatusCode.InsufficientStorage; // 507;
  title = 'Insufficient Storage';
}

export function isInsufficientStorageError(e: Error): e is InsufficientStorageError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.InsufficientStorage;
}

/**
 * 508 Loop Detected
 */
export class LoopDetectedError extends HttpErrorBase {
  httpStatus = HttpStatusCode.LoopDetected; // 508;
  title = 'Loop Detected';
}

export function isLoopDetectedError(e: Error): e is LoopDetectedError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.LoopDetected;
}

/**
 * 510 Not Extended
 */
export class NotExtendedError extends HttpErrorBase {
  httpStatus = HttpStatusCode.NotExtended; // 510;
  title = 'Not Extended';
}

export function isNotExtendedError(e: Error): e is NotExtendedError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.NotExtended;
}

/**
 * 511 Network Authentication Required
 */
export class NetworkAuthenticationRequiredError extends HttpErrorBase {
  httpStatus = HttpStatusCode.NetworkAuthenticationRequired; // 511;
  title = 'Network Authentication Required';
}

export function isNetworkAuthenticationRequiredError(
  e: Error
): e is NetworkAuthenticationRequiredError {
  return isHttpError(e) && e.httpStatus === HttpStatusCode.NetworkAuthenticationRequired;
}
