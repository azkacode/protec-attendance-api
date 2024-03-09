export interface AttendanceFilterInterface {
    start_date: Date | null;
    end_date: Date | null;
    employee_id : number;
}

export enum CheckInType {
    In = 'in',
    Out = 'out',
}

export enum AttendanceType {
    Start = "start",
    End = "end",
}

export enum AttendanceStatus {
    OK = 'ok',
    DT = 'dt',
    PC = 'pc'
}

export interface CheckInInterface {
    type : CheckInType;
    employee_id : number;
    evidence : string;
    time : string;
    map : string;
    reason : string | null;
    attendance_status : AttendanceStatus | null,
}

export interface CheckOutInterface {
    type : CheckInType;
    employee_id : number;
    evidence : string;
    time : string;
    map : string;
    reason : string | null;
    attendance_status : AttendanceStatus | null,
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

export interface GroupedData {
    date: any;
    employee_id: number;
    data: ItemAttendance[];
}
interface ItemAttendance {
    id: number;
    date: any;
    type: 'in' | 'out';
    employee_id: number;
    evidence: string;
    time: string;
    map: string;
    reason: string | null;
    approved_by: number | null;
    rejected_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface AttendanceLogInterface {
    attendance_id : number,
    employee_id : number,
    type : CheckInType,
    evidence : string,
    time : string,
    map : string,
    reason : string | null,
    attendance_status : AttendanceStatus,
    approved_by : number | null,
    rejected_by : number | null,
    actioned_by : number,
    working_hour_id : number,
    name : string,
    working_hour_item_id : number,
    day : string,
    start : string,
    end : string,
    status : number
}