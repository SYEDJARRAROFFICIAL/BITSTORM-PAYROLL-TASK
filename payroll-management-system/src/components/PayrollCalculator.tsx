import React from "react";
import { Employee } from "../types";
import { calculateGross, calculateNet } from "../utils/calculations";

interface PayrollCalculatorProps {
  employee: Employee;
}

const PayrollCalculator: React.FC<PayrollCalculatorProps> = ({ employee }) => {
  const grossSalary = calculateGross(employee);
  const netSalary = calculateNet(grossSalary, employee.advance);

  return (
    <div>
      <h3>Payroll Details for {employee.name}</h3>
      <p>Gross Salary: ${grossSalary.toFixed(2)}</p>
      <p>Advance: ${employee.advance.toFixed(2)}</p>
      <p>Net Salary: ${netSalary.toFixed(2)}</p>
    </div>
  );
};

export default PayrollCalculator;
