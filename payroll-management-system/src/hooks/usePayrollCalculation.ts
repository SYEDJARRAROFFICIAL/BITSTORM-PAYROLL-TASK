import { useState } from "react";
import { Employee } from "../types";
import { calculateGross, calculateNet } from "../utils/calculations";

const usePayrollCalculation = (employees: Employee[]) => {
  const [grossSalaries, setGrossSalaries] = useState<number[]>([]);
  const [netSalaries, setNetSalaries] = useState<number[]>([]);

  const calculateGrossSalary = (employee: Employee): number => {
    return calculateGross(employee);
  };

  const calculateNetSalary = (employee: Employee): number => {
    const gross = calculateGrossSalary(employee);
    return calculateNet(gross, employee.advance || 0);
  };

  const calculateSalaries = () => {
    const gross = employees.map(calculateGrossSalary);
    const net = employees.map(calculateNetSalary);
    setGrossSalaries(gross);
    setNetSalaries(net);
  };

  return { grossSalaries, netSalaries, calculateSalaries };
};

export default usePayrollCalculation;
