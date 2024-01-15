export interface AttendanceFilterInterface {
    start_date: Date | null;
    end_date: Date | null;
    employee_id : Number;
}

export enum CheckInType {
    In = 'in',
    Out = 'out',
}

export interface CheckInInterface {
    type : CheckInType;
    employee_id : number;
    evidence : string;
    time : string;
    map : string;
    reason : string | null;
}

export interface CheckOutInterface {
    type : CheckInType;
    employee_id : number;
    evidence : string;
    time : string;
    map : string;
    reason : string | null;
}

export interface MockDataAttendance {
    id : number;
    date : Date | null;
    employee_id : number;
    check_id : string | null;
    check_out : string | null;
    time_in : Date | null;
    time_out : Date | null;
    map_in : string | null;
    map_out : string | null;
    reason_in : string | null; 
    reason_out : string | null;
    approved_by_in : number | null;
    rejected_by_in : number | null;
    approved_at_in : Date | null;
    rejected_at_in : Date | null;
    approved_by_out : number | null;
    rejected_by_out : number | null;
    approved_at_out : Date | null;
    rejected_at_out : Date | null;
    created_at : Date;
    updated_at : Date;
}