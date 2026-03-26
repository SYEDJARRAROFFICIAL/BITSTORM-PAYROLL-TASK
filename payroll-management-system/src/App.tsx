import React, { useMemo, useState } from "react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import useLocalStorage from "./hooks/useLocalStorage";
import { Employee } from "./types";
import { calculateGross, calculateNet } from "./utils/calculations";

const formatMoney = (value: number) =>
  value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const App: React.FC = () => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>(
    "employees",
    []
  );
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);

  const totals = useMemo(() => {
    return employees.reduce(
      (acc, employee) => {
        const gross = calculateGross(employee);
        acc.gross += gross;
        acc.advance += employee.advance || 0;
        acc.net += calculateNet(gross, employee.advance || 0);
        return acc;
      },
      { gross: 0, advance: 0, net: 0 }
    );
  }, [employees]);

  const handleAddEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
    setShowForm(false);
  };

  const handleDeleteEmployee = (id: number) => {
    const employee = employees.find((e) => e.id === id);
    const label = employee
      ? `${employee.name} (${employee.position})`
      : "this employee";
    if (window.confirm(`Delete ${label}?`)) {
      setEmployees(employees.filter((emp) => emp.id !== id));
      if (editingEmployee?.id === id) setEditingEmployee(null);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handleStartAdd = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingEmployee(null);
    setShowForm(false);
  };

  const isFormOpen = showForm || Boolean(editingEmployee);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Payroll Management System</h1>
        <p className="app-subtitle">Add employees, calculate gross/net pay.</p>
      </header>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Employees</div>
          <div className="stat-value">{employees.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total Gross</div>
          <div className="stat-value">{formatMoney(totals.gross)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total Net Payable</div>
          <div className="stat-value">{formatMoney(totals.net)}</div>
        </div>
      </div>

      <div className="app-grid">
        {isFormOpen ? (
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                {editingEmployee ? "Edit Employee" : "Add Employee"}
              </h2>
              <div className="card-header-actions">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={handleCloseForm}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="card-body">
              <EmployeeForm
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                editingEmployee={editingEmployee}
                onCancelEdit={handleCloseForm}
              />
            </div>
          </section>
        ) : (
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Add Employee</h2>
            </div>
            <div className="card-body">
              <p className="app-subtitle" style={{ marginBottom: 12 }}>
                Click below to add a new employee.
              </p>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleStartAdd}
              >
                Add Employee
              </button>
            </div>
          </section>
        )}

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Employees</h2>
            <div className="card-header-actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleStartAdd}
              >
                Add Employee
              </button>
            </div>
          </div>
          <div className="card-body">
            <EmployeeList
              employees={employees}
              onDeleteEmployee={handleDeleteEmployee}
              onEditEmployee={handleEditEmployee}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
