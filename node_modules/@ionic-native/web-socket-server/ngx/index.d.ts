import { IonicNativePlugin } from '@ionic-native/core';
import { Observable } from 'rxjs';
export interface WebSocketInterfaces {
    [key: string]: WebSocketInterface;
}
export interface WebSocketInterface {
    ipv4Addresses: string[];
    ipv6Addresses: string[];
}
export interface WebSocketOptions {
    origins?: string[];
    protocols?: string[];
    tcpNoDelay?: boolean;
}
export interface WebSocketIdentifier {
    uuid: string;
}
export interface WebSocketServerDetails {
    addr: string;
    port: number;
}
export interface WebSocketFailure extends WebSocketServerDetails {
    reason: string;
}
export interface WebSocketMessage {
    conn: WebSocketConnection;
    msg: string;
}
export interface WebSocketClose {
    conn: WebSocketConnection;
    code: number;
    reason: string;
    wasClean: boolean;
}
export interface WebSocketConnection extends WebSocketIdentifier {
    remoteAttr: string;
    state: 'open' | 'closed';
    httpFields: HttpFields;
    resource: string;
}
export interface HttpFields {
    'Accept-Encoding': string;
    'Accept-Language': string;
    'Cache-Control': string;
    Connection: string;
    Host: string;
    Origin: string;
    Pragma: string;
    'Sec-WebSocket-Extensions': string;
    'Sec-WebSocket-Key': string;
    'Sec-WebSocket-Version': string;
    Upgrade: string;
    'User-Agent': string;
}
/**
 * @name WebSocket Server
 * @description
 * This plugin allows you to run a single, lightweight, barebone WebSocket Server.
 *
 * @usage
 * ```typescript
 * import { WebSocketServer } from '@ionic-native/web-socket-server';
 *
 * constructor(private wsserver: WebSocketServer) { }
 *
 * ...
 *
 * // start websocket server
 * this.wsserver.start(8888, {}).subscribe({
 *   next: server => console.log(`Listening on ${server.addr}:${server.port}`),
 *   error: error => console.log(`Unexpected error`, error);
 * });
 *
 * // watch for any messages
 * this.wsserver.watchMessage().subscribe(result => {
 *   console.log(`Received message ${result.msg} from ${result.conn.uuid}`);
 * });
 *
 * // send message to connection with specified uuid
 * this.wsserver.send({ uuid: '8e7c4f48-de68-4b6f-8fca-1067a353968d' }, 'Hello World');
 *
 * // stop websocket server
 * this.wsserver.stop().then(server => {
 *   console.log(`Stop listening on ${server.addr}:${server.port}`);
 * });
 *
 * ```
 */
export declare class WebSocketServer extends IonicNativePlugin {
    /**
     * Return this device's interfaces
     * @return {Promise<WebSocketInterfaces>}
     */
    getInterfaces(): Promise<WebSocketInterfaces>;
    /**
     * Start websocket server
     * @param port {number} Local port on which the service runs. (0 means any free port)
     * @param options {WebSocketOptions} Additional options for websocket
     * @return {Observable<WebSocketServerDetails>} Returns Observable where all generic error can be catched (mostly JSONExceptions)
     */
    start(port: number, options: WebSocketOptions): Observable<WebSocketServerDetails>;
    private onFunctionToObservable;
    /**
     * Watches for new messages
     * @return {Observable<WebSocketMessage>}
     */
    watchMessage(): Observable<WebSocketMessage>;
    /**
     * Watches for new opened connections
     * @return {Observable<WebSocketConnection>}
     */
    watchOpen(): Observable<WebSocketConnection>;
    /**
     * Watches for closed connections
     * @return {Observable<WebSocketClose>}
     */
    watchClose(): Observable<WebSocketClose>;
    /**
     * Watches for any websocket failures
     * @return {Observable<WebSocketFailure>}
     */
    watchFailure(): Observable<WebSocketFailure>;
    /**
     * Stop websocket server and closes all connections
     * @return {Promise<WebSocketServerDetails>}
     */
    stop(): Promise<WebSocketServerDetails>;
    /**
     * Send Message to a connected device
     * @param conn {WebSocketIdentifier} Connection to send message to
     * @param msg {string} Message to send
     * @return {Promise<void>}
     */
    send(conn: WebSocketIdentifier, msg: string): Promise<void>;
    /**
     * Close specific connection using uuid
     * @param conn {WebSocketIdentifier} Connection to close
     * @param code {number} Close code, determines if it was clean
     * @param reason {string} Reason for closing
     * @return {Promise<void>}
     */
    close(conn: WebSocketIdentifier, code: number, reason: string): Promise<void>;
}
