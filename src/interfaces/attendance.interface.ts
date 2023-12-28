export interface AttendanceFilterInterface {
    start_date: Date | null;
    end_date: Date | null;
    employee_id : Number;
}

export interface CheckInInterface {
    employee_id : number;
    check_in : string;
    time_in : string;
    map_in : string;
    reason : string | null;
}

export interface CheckOutInterface {
    employee_id : number;
    check_out : string;
    time_out : string;
    map_out : string;
    attendance_id : number;
}