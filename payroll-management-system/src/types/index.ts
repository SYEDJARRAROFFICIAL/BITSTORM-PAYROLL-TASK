export type PayrollType = "monthly" | "hourly" | "daily";

export interface Employee {
  id: number;
  name: string;
  position: string;
  payrollType: PayrollType;
  monthlySalary?: number;
  hourlyRate?: number;
  hoursWorked?: number;
  dailyWage?: number;
  daysWorked?: number;
  advance: number;
}
