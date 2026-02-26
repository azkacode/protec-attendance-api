import moment from "moment-timezone";
import {
  CheckInInterface,
  AttendanceStatus,
  AttendanceType,
  GroupedData,
  AttendanceLogInterface,
  CheckInType,
} from '../interfaces/attendance.interface';
import AttendanceModel from '../models/attendance.model';
import EmployeeModel from '../models/employee.model';
import haversine from "haversine-distance";
import e from "express";

const timezone = 'Asia/Jakarta';

export class AttendanceLib {
  getMockList(list: any): GroupedData[] {
    const groupedData: GroupedData[] = [];
    list.forEach((item: any) => {
      item.date = moment(item.date).format("Y-MM-DD")
      item.time = moment.utc(item.time).format("HH:mm:ss")
      item.attendance_status = this.getIdnStatus(item.attendance_status);
      if (item.date !== null) {
        const existingGroup = groupedData.find(
          (group) => moment(group.date).format("Y-MM-DD") === moment(item.date).format("Y-MM-DD") && group.employee_id === item.employee_id
        );
        if (existingGroup) {
          existingGroup.data.push(item);
        } else {
          groupedData.push({
            date: moment(item.date).format("Y-MM-DD"),
            employee_id: item.employee_id,
            data: [item],
          });
        }
      }
    });
    return groupedData
  }

  getIdnStatus(status: string): string {
    let newStatus = null;
    switch (status) {
      case 'ok':
        newStatus = "On Time";
        break;
      case 'dt':
        newStatus = "Datang Terlambat";
        break;
      case 'pc':
        newStatus = "Pulang Cepat";
        break;
      default:
        newStatus = null;
        break;
    }
    return newStatus;
  }

  getFullStringDay(date: Date | null): string {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const d = date == null ? new Date : new Date(date);
    const currentDay = days[d.getDay()];
    return currentDay;
  }

  async getCurrentWorkingHour(userId: number) {
    const attModel = new AttendanceModel();
    const employeeWh = await attModel.getWorkingHour(userId);
    const wH = employeeWh.find(i => i.day == this.getFullStringDay(null));
    return wH;
  }

  async getAttendanceStatus(userId: number, type: AttendanceType): Promise<AttendanceStatus> {
    const wH = await this.getCurrentWorkingHour(userId)
    const targetTime = type == AttendanceType.Start ? wH.start : wH.end;
    const currentTime = moment().tz(timezone).format('HH:mm');
    console.log("target Time", targetTime, currentTime);
    return (type == AttendanceType.Start)
      ? (currentTime > targetTime) ? AttendanceStatus.DT : AttendanceStatus.OK
      : (currentTime < targetTime) ? AttendanceStatus.PC : AttendanceStatus.OK
  }

  async submitAttendance(req, wH, type: CheckInType) {
    console.log("type", type);

    const attendanceModel = new AttendanceModel;
    const employeeModel = new EmployeeModel;
    const props: CheckInInterface = {
      type: type,
      employee_id: req.data.id,
      evidence: type == CheckInType.In ? req.body.check_in : req.body.check_out,
      map: type == CheckInType.In ? req.body.map_in : req.body.map_out,
      time: moment().tz(timezone).format("Y-MM-DD HH:mm:ss"),
      reason: req.body.reason,
      attendance_status: null,
      radius: null,
    };

    if (!props.evidence || !props.map || !props.time) {
      throw new Error("Item Required");
    }
    const columnType = type == CheckInType.In ? AttendanceType.Start : AttendanceType.End
    props.attendance_status = await this.getAttendanceStatus(req.data.id, columnType);

    // get employee warehouse location
    const employeeWarehouse = await employeeModel.warehouseDetail(req.data.warehouse_id);
    console.log("employeeWarehouse", employeeWarehouse);

    // calculate the distance between employee warehouse location and check in location
    const latlong: any = props.map.split(",");
    const radius = Math.round(haversine({
      latitude: employeeWarehouse.lat,
      longitude: employeeWarehouse.long
    }, {
      latitude: parseFloat(latlong[0]),
      longitude: parseFloat(latlong[1])
    }));
    console.log("radius", radius);
    props.radius = radius;

    // submit attendance
    const attd = await attendanceModel.submitCheck(props);

    const logData: AttendanceLogInterface = {
      attendance_id: attd.insertId,
      employee_id: props.employee_id,
      type: props.type,
      evidence: props.evidence,
      time: props.time,
      map: props.map,
      reason: props.reason,
      attendance_status: props.attendance_status,
      approved_by: null,
      rejected_by: props.attendance_status == AttendanceStatus.OK ? null : 0,
      actioned_by: props.employee_id,
      working_hour_id: wH.working_hour_id,
      name: wH.name,
      working_hour_item_id: wH.id,
      day: wH.day,
      start: wH.start,
      end: wH.end,
      status: wH.status,
    }
    await attendanceModel.submitAttendanceLog(logData);
    return
  }
}