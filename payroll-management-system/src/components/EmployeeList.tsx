import React from "react";
import { Employee } from "../types";
import { calculateGross, calculateNet } from "../utils/calculations";

interface EmployeeListProps {
  employees: Employee[];
  onDeleteEmployee: (id: number) => void;
  onEditEmployee: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onDeleteEmployee,
  onEditEmployee,
}) => {
  if (employees.length === 0) {
    return (
      <div className="empty">
        No employees yet. Add your first employee using the form.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Type</th>
            <th>Gross</th>
            <th>Advance</th>
            <th>Net</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const gross = calculateGross(employee);
            const net = calculateNet(gross, employee.advance);
            return (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>
                  <span className="badge">{employee.payrollType}</span>
                </td>
                <td className="money">${gross.toFixed(2)}</td>
                <td className="money">${employee.advance.toFixed(2)}</td>
                <td className="money">${net.toFixed(2)}</td>
                <td>
                  <div className="row-actions">
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => onEditEmployee(employee)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => onDeleteEmployee(employee.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
