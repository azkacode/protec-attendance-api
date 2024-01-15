import moment from "moment-timezone";

interface GroupedData {
  date: any;
  employee_id: number;
  data: ItemAttendance[];
}


interface ItemAttendance {
  id: number;
  date: string | any;
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

export class AttendanceLib {
  getMockList(list: any) {
    const groupedData: GroupedData[] = [];
    list.forEach((item: any) => {
      item.date = moment(item.date).format("Y-MM-D")
      if (item.date !== null) {
        const existingGroup = groupedData.find(
          (group) => moment(group.date).format("Y-MM-D") === moment(item.date).format("Y-MM-D") && group.employee_id === item.employee_id
        );
        if (existingGroup) {
          existingGroup.data.push(item);
        } else {
          groupedData.push({
            date: moment(item.date).format("Y-MM-D"),
            employee_id: item.employee_id,
            data: [item],
          });
        }
      }
    });
    return groupedData
  }
}