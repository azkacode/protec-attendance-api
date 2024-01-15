interface GroupedData {
  date: Date;
  employee_id: number;
  data: itemAttendance[];
}


interface itemAttendance {
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
      if (item.date !== null) {
        const existingGroup = groupedData.find(
          (group) => group.date.getTime() === new Date(item.date).getTime() && group.employee_id === item.employee_id
        );

        if (existingGroup) {
          existingGroup.data.push(item);
        } else {
          groupedData.push({
            date: new Date(item.date),
            employee_id: item.employee_id,
            data: [item],
          });
        }
      }
    });
    return groupedData
  }
}