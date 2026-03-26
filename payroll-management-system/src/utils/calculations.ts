import { Employee } from "../types";

export const calculateGross = (employee: Employee): number => {
  switch (employee.payrollType) {
    case "hourly":
      return (employee.hourlyRate || 0) * (employee.hoursWorked || 0);
    case "daily":
      return (employee.dailyWage || 0) * (employee.daysWorked || 0);
    case "monthly":
      return employee.monthlySalary || 0;
    default:
      return 0;
  }
};

export const calculateNet = (grossSalary: number, advance: number): number => {
  return grossSalary - advance;
};
