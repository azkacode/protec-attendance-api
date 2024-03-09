import LeaveModel from '../models/leave.model';

export class LeaveLib {
  async getRemainingLeave(employeeId: number, leaveId: any): Promise<any> {
    const leaveModel = new LeaveModel;
    const leaves: any = await leaveModel.getLeaves(employeeId, leaveId);
    
    if(leaves.length > 0){
      for (const l of leaves) {
        l.logs = await leaveModel.getLeaveLogs(employeeId, l.id);
        l.remaining_leaves = l.logs.length > 0 ? l.total - l.logs.length : l.total || 0
      }
    }
    return leaves;
  }
  countDays(startDate: Date, endDate: Date): number {
    // Calculate the time difference in milliseconds
    const timeDifference = endDate.getTime() - startDate.getTime();
  
    // Convert the time difference from milliseconds to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
    return daysDifference;
  }
  createDateRange(startDate: Date, endDate: Date): Date[] {
    const dateRange: Date[] = [];
    const currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dateRange;
  }
}