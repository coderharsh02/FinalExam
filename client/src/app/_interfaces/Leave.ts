export interface Leave {
    Id: number;
    UserName: string;
    FromDate: Date;
    ToDate: Date;
    Reason: string;
    NumberOfDays: number;
    LeaveType: string;
}