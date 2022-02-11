export enum LogoutResultStatus {
    success = "success",
    fail = "fail",
}

export class LogoutResult {
    status: LogoutResultStatus;
}