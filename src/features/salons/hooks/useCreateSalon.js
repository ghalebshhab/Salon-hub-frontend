import { toSalonPayload } from "../model/salonForm.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";
import { createSalonApi } from "../api/salonApi.js";

export default function useCreateSalon() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    openTime: "09:00:00",
    closeTime: "18:00:00",
    city: "",
    state: "OPEN",
    maxNumOfEmployees: 5,
    Images: "",
    employees: [],
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const addEmployeeCard = () => {
    const maxEmployees = Number(form.maxNumOfEmployees || 0);

    if (maxEmployees <= 0) {
      showWarningToast("Set max employees first.", "Employees limit");
      return;
    }

    if (form.employees.length >= maxEmployees) {
      showWarningToast(
        "You cannot add more employees than the max number.",
        "Employees limit",
      );
      return;
    }

    setForm({
      ...form,
      employees: [
        ...form.employees,
        {
          fullName: "",
          email: "",
          phoneNumber: "",
          imageUrl: "",
          specialty: "",
          startTime: form.openTime,
          endTime: form.closeTime,
        },
      ],
    });
  };

  const removeEmployeeCard = (index) => {
    setForm({
      ...form,
      employees: form.employees.filter((_, i) => i !== index),
    });
  };

  const updateEmployee = (index, field, value) => {
    const updatedEmployees = [...form.employees];

    updatedEmployees[index] = {
      ...updatedEmployees[index],
      [field]: value,
    };

    setForm({
      ...form,
      employees: updatedEmployees,
    });
  };

  const validateForm = () => {
    const maxEmployees = Number(form.maxNumOfEmployees || 0);

    if (maxEmployees <= 0) {
      showWarningToast(
        "Max employees must be greater than 0.",
        "Invalid employees",
      );
      return false;
    }

    if (form.employees.length > maxEmployees) {
      showWarningToast(
        "Employees list cannot be greater than max employees.",
        "Invalid employees",
      );
      return false;
    }

    for (let i = 0; i < form.employees.length; i++) {
      const employee = form.employees[i];

      if (!employee.fullName.trim()) {
        showWarningToast(
          `Employee #${i + 1} name is required.`,
          "Missing employee",
        );
        return false;
      }

      if (!employee.email.trim()) {
        showWarningToast(
          `Employee #${i + 1} email is required.`,
          "Missing employee",
        );
        return false;
      }

      if (!employee.phoneNumber.trim()) {
        showWarningToast(
          `Employee #${i + 1} phone is required.`,
          "Missing employee",
        );
        return false;
      }

      if (!employee.startTime || !employee.endTime) {
        showWarningToast(
          `Employee #${i + 1} working time is required.`,
          "Missing time",
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await createSalonApi(toSalonPayload(form));

      if (!response.success) {
        showErrorToast(
          response.message || "Failed to create salon",
          "Create failed",
        );
        return;
      }

      showSuccessToast(
        "Salon created and employee invitations were sent.",
        "Salon created",
      );

      navigate("/owner/my-salon");
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message || "Failed to create salon",
        "Create failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    loading,
    handleChange,
    addEmployeeCard,
    removeEmployeeCard,
    updateEmployee,
    handleSubmit,
  };
}
