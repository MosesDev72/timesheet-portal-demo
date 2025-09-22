import { useState } from "react";

export const useTimesheetValidation = () => {
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const newErrors = {};

    // Decimal validation (up to 2 places) for week1 and week2
    ["week1Hours", "week2Hours"].forEach((field) => {
      const value = formData[field];
      if (value && value.trim() !== "") {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          newErrors[field] =
            "Please enter a valid number with up to 2 decimal places.";
        } else if (numValue > 100) {
          newErrors[field] = `${field.replace(
            "Hours",
            ""
          )} Hours cannot exceed 100 hours.`;
        } else {
          // Check decimal places
          const decimalPart = value.split(".")[1];
          if (decimalPart && decimalPart.length > 2) {
            newErrors[field] =
              "Please enter a valid number with up to 2 decimal places.";
          }
        }
      }
    });

    // Period cap - total cannot exceed 168 hours
    const week1Num = parseFloat(formData.week1Hours) || 0;
    const week2Num = parseFloat(formData.week2Hours) || 0;
    const totalHours = week1Num + week2Num;
    if (totalHours > 168) {
      newErrors.total =
        "Pay Period hours entered exceeded the allowable amount.";
    }

    // Required fields validation
    if (!formData.client || formData.client.trim() === "") {
      newErrors.client = "Please select a client.";
    }
    if (!formData.state || formData.state.trim() === "") {
      newErrors.state = "Please select a state.";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Please select a start date.";
    }
    if (!formData.endDate) {
      newErrors.endDate = "Please select an end date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  return { errors, validateForm, clearError };
};
