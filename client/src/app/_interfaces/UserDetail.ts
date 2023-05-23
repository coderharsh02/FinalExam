export interface UserDetail {
    userName: string,
    password: string,
    role: number,
    userLeaveBalance: {
        userName: string,
        pl: number,
        cl: number,
        sl: number,
        userNameNavigation: string
    },
    userLeaveHistory: [
        {
            id: number,
            userName: string,
            fromDate: Date,
            toDate: Date,
            reason: string,
            leaveType: string,
            isApproved: boolean,
            userNameNavigation: string
        }
    ]
}