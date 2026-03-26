import React, { useState, useEffect, useRef } from "react";
import { Employee, PayrollType } from "../types";
import { calculateGross, calculateNet } from "../utils/calculations";

interface EmployeeFormProps {
  onAddEmployee: (employee: Employee) => void;
  onUpdateEmployee?: (employee: Employee) => void;
  editingEmployee?: Employee | null;
  onCancelEdit?: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onAddEmployee,
  onUpdateEmployee,
  editingEmployee,
  onCancelEdit,
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
  const [error, setError] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handlePayrollTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "monthly" || value === "hourly" || value === "daily") {
      setPayrollType(value);
      setError("");
    }
  };

  const draftEmployee: Employee = {
    id: editingEmployee ? editingEmployee.id : 0,
    name,
    position,
    payrollType,
    monthlySalary:
      payrollType === "monthly" && monthlySalary !== ""
        ? Number(monthlySalary)
        : undefined,
    hourlyRate:
      payrollType === "hourly" && hourlyRate !== ""
        ? Number(hourlyRate)
        : undefined,
    hoursWorked:
      payrollType === "hourly" && hoursWorked !== ""
        ? Number(hoursWorked)
        : undefined,
    dailyWage:
      payrollType === "daily" && dailyWage !== ""
        ? Number(dailyWage)
        : undefined,
    daysWorked:
      payrollType === "daily" && daysWorked !== ""
        ? Number(daysWorked)
        : undefined,
    advance: advance !== "" ? Number(advance) : 0,
  };

  const grossPreview = calculateGross(draftEmployee);
  const netPreview = calculateNet(grossPreview, draftEmployee.advance || 0);

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
      setError("");
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
    // Focus on name input when form is shown
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  }, [editingEmployee]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && position) {
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

      if (payrollType === "monthly" && monthlySalary === "") {
        setError("Monthly salary is required.");
        return;
      }

      if (
        payrollType === "hourly" &&
        (hourlyRate === "" || hoursWorked === "")
      ) {
        setError("Hourly rate and hours worked are required.");
        return;
      }

      if (payrollType === "daily" && (dailyWage === "" || daysWorked === "")) {
        setError("Daily wage and days worked are required.");
        return;
      }

      const employee: Employee = {
        id: editingEmployee ? editingEmployee.id : Date.now(),
        name,
        position,
        payrollType,
        monthlySalary:
          payrollType === "monthly" ? parseFloat(monthlySalary) : undefined,
        hourlyRate:
          payrollType === "hourly" ? parseFloat(hourlyRate) : undefined,
        hoursWorked:
          payrollType === "hourly" ? parseFloat(hoursWorked) : undefined,
        dailyWage: payrollType === "daily" ? parseFloat(dailyWage) : undefined,
        daysWorked:
          payrollType === "daily" ? parseFloat(daysWorked) : undefined,
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
          `Advance (${employee.advance}) cannot exceed Gross Salary (${gross}).`
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert">{error}</div>}

      <div className="form-grid">
        <div className="field">
          <label>Name</label>
          <input
            ref={nameInputRef}
            className="input"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="e.g. Jane Doe"
            required
          />
        </div>

        <div className="field">
          <label>Position</label>
          <input
            className="input"
            type="text"
            value={position}
            onChange={(e) => {
              setPosition(e.target.value);
              setError("");
            }}
            placeholder="e.g. Developer"
            required
          />
        </div>

        <div className="field form-full">
          <label>Payroll Type</label>
          <select
            className="select"
            value={payrollType}
            onChange={handlePayrollTypeChange}
          >
            <option value="monthly">Monthly</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        {payrollType === "monthly" && (
          <div className="field form-full">
            <label>Monthly Salary</label>
            <input
              className="input"
              type="number"
              min={0}
              step={0.01}
              value={monthlySalary}
              onChange={(e) => {
                setMonthlySalary(e.target.value);
                setError("");
              }}
              placeholder="e.g. 50000"
              required
            />
          </div>
        )}

        {payrollType === "hourly" && (
          <>
            <div className="field">
              <label>Hourly Rate</label>
              <input
                className="input"
                type="number"
                min={0}
                step={0.01}
                value={hourlyRate}
                onChange={(e) => {
                  setHourlyRate(e.target.value);
                  setError("");
                }}
                placeholder="e.g. 25"
                required
              />
            </div>
            <div className="field">
              <label>Hours Worked</label>
              <input
                className="input"
                type="number"
                min={0}
                step={0.1}
                value={hoursWorked}
                onChange={(e) => {
                  setHoursWorked(e.target.value);
                  setError("");
                }}
                placeholder="e.g. 160"
                required
              />
            </div>
          </>
        )}

        {payrollType === "daily" && (
          <>
            <div className="field">
              <label>Daily Wage</label>
              <input
                className="input"
                type="number"
                min={0}
                step={0.01}
                value={dailyWage}
                onChange={(e) => {
                  setDailyWage(e.target.value);
                  setError("");
                }}
                placeholder="e.g. 120"
                required
              />
            </div>
            <div className="field">
              <label>Days Worked</label>
              <input
                className="input"
                type="number"
                min={0}
                step={1}
                value={daysWorked}
                onChange={(e) => {
                  setDaysWorked(e.target.value);
                  setError("");
                }}
                placeholder="e.g. 22"
                required
              />
            </div>
          </>
        )}

        <div className="field form-full">
          <label>Advance Taken</label>
          <input
            className="input"
            type="number"
            min={0}
            step={0.01}
            value={advance}
            onChange={(e) => {
              setAdvance(e.target.value);
              setError("");
            }}
            placeholder="e.g. 500"
          />
          <div className="help">
            Preview: Gross{" "}
            <span className="money">${grossPreview.toFixed(2)}</span> · Net{" "}
            <span className="money">${netPreview.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" type="submit">
          {editingEmployee ? "Update Employee" : "Add Employee"}
        </button>
        {editingEmployee && (
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => {
              setError("");
              onCancelEdit?.();
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;
