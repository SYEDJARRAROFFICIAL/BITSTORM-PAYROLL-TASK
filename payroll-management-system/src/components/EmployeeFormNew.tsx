import React, { useState, useEffect } from "react";
import { Employee, PayrollType } from "../types";
import "../styles/EmployeeForm.css";

interface EmployeeFormProps {
  onAddEmployee: (employee: Employee) => void;
  onUpdateEmployee?: (employee: Employee) => void;
  editingEmployee?: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onAddEmployee,
  onUpdateEmployee,
  editingEmployee,
}) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [payrollType, setPayrollType] = useState<PayrollType>("monthly");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [dailyWage, setDailyWage] = useState("");
  const [daysWorked, setDaysWorked] = useState("");
  const [advance, setAdvance] = useState("");
  const [error, setError] = useState("");

  const handlePayrollTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "monthly" || value === "hourly" || value === "daily") {
      setPayrollType(value);
    }
  };

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name);
      setPosition(editingEmployee.position);
      setPayrollType(editingEmployee.payrollType);
      setMonthlySalary(editingEmployee.monthlySalary?.toString() || "");
      setHourlyRate(editingEmployee.hourlyRate?.toString() || "");
      setHoursWorked(editingEmployee.hoursWorked?.toString() || "");
      setDailyWage(editingEmployee.dailyWage?.toString() || "");
      setDaysWorked(editingEmployee.daysWorked?.toString() || "");
      setAdvance(editingEmployee.advance.toString());
    } else {
      setName("");
      setPosition("");
      setPayrollType("monthly");
      setMonthlySalary("");
      setHourlyRate("");
      setHoursWorked("");
      setDailyWage("");
      setDaysWorked("");
      setAdvance("");
      setError("");
    }
  }, [editingEmployee]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !position) {
      setError("Name and Position are required.");
      return;
    }

    // Validation: Prevent negative values
    const numFields = [
      monthlySalary,
      hourlyRate,
      hoursWorked,
      dailyWage,
      daysWorked,
      advance,
    ];
    for (let field of numFields) {
      if (field && parseFloat(field) < 0) {
        setError("Values cannot be negative.");
        return;
      }
    }

    const employee: Employee = {
      id: editingEmployee ? editingEmployee.id : Date.now(),
      name,
      position,
      payrollType,
      monthlySalary:
        payrollType === "monthly" ? parseFloat(monthlySalary) : undefined,
      hourlyRate: payrollType === "hourly" ? parseFloat(hourlyRate) : undefined,
      hoursWorked:
        payrollType === "hourly" ? parseFloat(hoursWorked) : undefined,
      dailyWage: payrollType === "daily" ? parseFloat(dailyWage) : undefined,
      daysWorked: payrollType === "daily" ? parseFloat(daysWorked) : undefined,
      advance: parseFloat(advance) || 0,
    };

    // Calculate gross to validate advance
    const gross =
      employee.payrollType === "hourly"
        ? (employee.hourlyRate || 0) * (employee.hoursWorked || 0)
        : employee.payrollType === "daily"
        ? (employee.dailyWage || 0) * (employee.daysWorked || 0)
        : employee.monthlySalary || 0;

    if (employee.advance > gross) {
      setError(
        `Advance ($${employee.advance.toFixed(
          2
        )}) cannot exceed Gross Salary ($${gross.toFixed(2)}).`
      );
      return;
    }

    if (editingEmployee && onUpdateEmployee) {
      onUpdateEmployee(employee);
    } else {
      onAddEmployee(employee);
    }

    // Reset form if not editing
    if (!editingEmployee) {
      setName("");
      setPosition("");
      setMonthlySalary("");
      setHourlyRate("");
      setHoursWorked("");
      setDailyWage("");
      setDaysWorked("");
      setAdvance("");
      setPayrollType("monthly");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {editingEmployee ? "✏️ Edit Employee" : "➕ Add New Employee"}
      </h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              id="position"
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Software Developer"
              required
            />
          </div>
          <div className="form-group payroll-type-section">
            <label htmlFor="payrollType">Payroll Type</label>
            <select
              id="payrollType"
              value={payrollType}
              onChange={handlePayrollTypeChange}
            >
              <option value="monthly">Monthly Salary</option>
              <option value="hourly">Hourly Wages</option>
              <option value="daily">Daily Wages</option>
            </select>
          </div>
        </div>

        {payrollType === "monthly" && (
          <div className="conditional-fields">
            <div className="form-group">
              <label htmlFor="monthlySalary">Monthly Salary</label>
              <input
                id="monthlySalary"
                type="number"
                step="0.01"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                placeholder="50000"
                required
              />
            </div>
          </div>
        )}

        {payrollType === "hourly" && (
          <div className="conditional-fields">
            <div className="form-group">
              <label htmlFor="hourlyRate">Hourly Rate</label>
              <input
                id="hourlyRate"
                type="number"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="25.50"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="hoursWorked">Hours Worked</label>
              <input
                id="hoursWorked"
                type="number"
                step="0.5"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                placeholder="160"
                required
              />
            </div>
          </div>
        )}

        {payrollType === "daily" && (
          <div className="conditional-fields">
            <div className="form-group">
              <label htmlFor="dailyWage">Daily Wage</label>
              <input
                id="dailyWage"
                type="number"
                step="0.01"
                value={dailyWage}
                onChange={(e) => setDailyWage(e.target.value)}
                placeholder="500"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="daysWorked">Days Worked</label>
              <input
                id="daysWorked"
                type="number"
                value={daysWorked}
                onChange={(e) => setDaysWorked(e.target.value)}
                placeholder="22"
                required
              />
            </div>
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="advance">Advance Taken</label>
            <input
              id="advance"
              type="number"
              step="0.01"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingEmployee ? "💾 Update Employee" : "➕ Add Employee"}
          </button>
          {editingEmployee && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setName("");
                setPosition("");
                setMonthlySalary("");
                setHourlyRate("");
                setHoursWorked("");
                setDailyWage("");
                setDaysWorked("");
                setAdvance("");
                setPayrollType("monthly");
                setError("");
              }}
            >
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
