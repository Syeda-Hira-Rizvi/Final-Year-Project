import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Import the eye icon


// Styled Components
const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: white;
  font-family: Arial, sans-serif;
  padding: 20px;

  //     @media (max-width: 768px) {
  // align-items: unset;
  // }
`;

const AuthForm = styled.form`
  background-color: #eae1e1;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  transition: box-shadow 0.3s;
  @media (max-width: 768px) {
    padding: 15px;
    box-sizing:border-box;
  }

  &:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #b00000;
  margin-bottom: 20px;
  font-size: 24px;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const FormField = styled.div`
  margin-bottom: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #b00000;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #b00000;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #b00000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: rgb(158, 25, 18);
    transform: scale(1.005);
  }
`;

const ToggleLink = styled.p`
  text-align: center;
  color: #b00000;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const SelectTime = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
  transition: border-color 0.3s;

  &:focus {
    border-color: #b00000;
    outline: none;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    justify-content: left;
  }
`;

const Checkbox = styled.input`
  margin-right: 10px;
  accent-color: #b00000;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const CheckboxInput = styled.input`
  margin-right: 8px;
  accent-color: #b00000;
`;

const PasswordToggleIcon = styled.span`
  cursor: pointer;
  position: absolute;
  right: 0px;
  top: 70%;
  transform: translateY(-50%);
`;

const FormFieldWithIcon = styled(FormField)`
  position: relative;
`;

const RegisterHospital = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalType, setHospitalType] = useState("");
  const [donationType, setDonationType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState(""); // Contact Number
  const [operationalDays, setOperationalDays] = useState("");
  const [operationalHours, setOperationalHours] = useState({
    openingTime: "",
    closingTime: "",
  });
  const [slotDuration, setSlotDuration] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);  // Added state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // State for confirm password visibility


  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!hospitalName.trim())
      newErrors.hospitalName = "Hospital Name is required";
    if (!hospitalType) newErrors.hospitalType = "Hospital Type is required";
    if (!donationType) newErrors.donationType = "Donation Type is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Enter a valid email address";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!address.trim()) newErrors.address = "Address is required";
    if (contactNumber && !contactNumber.match(/^\d{11}$/)) {
      newErrors.contactNumber = "Contact number must be a 11-digit number";
    }
    // if (!operationalDays)
    //   newErrors.operationalDays = "Please select operational days";
    if (!Array.isArray(operationalDays) || operationalDays.length === 0)
      newErrors.operationalDays = "Please select operational days";

    if (!operationalHours.openingTime || !operationalHours.closingTime)
      newErrors.operationalHours = "Operational hours are required";
    if (!slotDuration || isNaN(slotDuration) || slotDuration <= 0)
      newErrors.slotDuration = "Slot duration must be a positive number";
    if (!agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      const formattedHour = `${hour}`;
      times.push(`${formattedHour}:00 AM`);
      times.push(`${formattedHour}:30 AM`);
    }
    for (let hour = 1; hour <= 12; hour++) {
      const formattedHour = `${hour}`;
      times.push(`${formattedHour}:00 PM`);
      times.push(`${formattedHour}:30 PM`);
    }
    return times;
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setOperationalDays((prev) => [...prev, value]);
    } else {
      setOperationalDays((prev) => prev.filter((day) => day !== value));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const hospitalData = {
      name: hospitalName,
      email,
      password,
      confirmPassword,
      address,
      contactNumber,
      hospitalType,
      donationType,
      operationalDays,
      operationalHours,
      slotDuration,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/register-hospital`,
        hospitalData
      );

      //RECENTLY ADDED
      // Save the new user to localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("Registration successful:", response.data);
      navigate("/hospitalhome");
    } catch (error) {
      // console.error(
      //   "Error registering hospital:",
      //   error.response?.data || error.message
      // );
      // setErrors({
      //   apiError: "An error occurred during registration. Please try again.",
      // });


      // Check if the error has a response with a message
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("Email already registered")) {
          setErrors({
            email: "Email is already registered", // Set the error message for email
          });
        } else {
          setErrors({
            apiError: error.response.data.message, // Other errors
          });
        }
      } else {
        setErrors({
          apiError: "An error occurred during registration. Please try again.",
        });
      }
    }
  };

  // Handle confirm password real-time validation (clear error if passwords match)
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);

    // Check if passwords match, clear error if they do
    if (password === e.target.value) {
      setErrors((prevErrors) => {
        const { confirmPassword, ...rest } = prevErrors; // Remove confirmPassword error
        return rest;
      });
    }
  };

  return (
    <AuthContainer>
      <AuthForm onSubmit={handleRegisterSubmit}>
        <Title>Create an Account</Title>

        {/* Hospital Name */}
        <FormField>
          <Label htmlFor="hospitalName">Hospital Name</Label>
          <Input
            type="text"
            id="hospitalName"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            placeholder="Hospital Name"
            required
          />
          {errors.hospitalName && <ErrorText>{errors.hospitalName}</ErrorText>}
        </FormField>

        {/* Hospital Type */}
        <FormField>
          <Label htmlFor="hospitalType">Hospital Type</Label>
          <Select
            id="hospitalType"
            value={hospitalType}
            onChange={(e) => setHospitalType(e.target.value)}
            required
          >
            <option value="">Select Hospital Type</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </Select>
          {errors.hospitalType && <ErrorText>{errors.hospitalType}</ErrorText>}
        </FormField>

        {/* Donation Type */}
        <FormField>
          <Label htmlFor="donationType">Donation Type</Label>
          <Select
            id="donationType"
            value={donationType}
            onChange={(e) => setDonationType(e.target.value)}
            required
          >
            <option value="">Select Donation Type</option>
            <option value="Blood Donation">Blood Donation</option>
            <option value="Stem Cell Donation">Stem Cell Donation</option>
            <option value="Both">Both</option>
          </Select>
          {errors.donationType && <ErrorText>{errors.donationType}</ErrorText>}
        </FormField>

        {/* Operational Days */}
        <FormField>
          <Label htmlFor="operationalDays">Operational Days</Label>
          <CheckboxContainer id="operationalDays">
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => (
              <CheckboxLabel key={day}>
                <CheckboxInput
                  type="checkbox"
                  value={day}
                  checked={operationalDays.includes(day)}
                  onChange={handleCheckboxChange}
                />
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </CheckboxLabel>
            ))}
          </CheckboxContainer>
          {errors.operationalDays && (
            <ErrorText>{errors.operationalDays}</ErrorText>
          )}
        </FormField>

        {/* Operational Hours */}
        <FormField>
          <Label>Operational Hours</Label>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 2 }}>
              <SelectTime
                id="openingTime"
                value={operationalHours.openingTime}
                onChange={(e) =>
                  setOperationalHours({
                    ...operationalHours,
                    openingTime: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Opening Time</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </SelectTime>
            </div>
            <div style={{ flex: 2 }}>
              <SelectTime
                id="closingTime"
                value={operationalHours.closingTime}
                onChange={(e) =>
                  setOperationalHours({
                    ...operationalHours,
                    closingTime: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Closing Time</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </SelectTime>
            </div>
          </div>
          {errors.operationalHours && (
            <ErrorText>{errors.operationalHours}</ErrorText>
          )}
        </FormField>

        {/* Slot Duration */}
        <FormField>
          <Label htmlFor="slotDuration">Slot Duration</Label>
          <Input
            type="number"
            id="slotDuration"
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
            placeholder="Slot Duration"
            required
          />
          {errors.slotDuration && <ErrorText>{errors.slotDuration}</ErrorText>}
        </FormField>

        {/* Email */}
        <FormField>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              const newEmail = e.target.value;
              setEmail(newEmail);

              // Clear error message for email when the user starts typing a new email
              setErrors((prevErrors) => ({
                ...prevErrors,
                email: newEmail ? "" : prevErrors.email,
              }));
            }} placeholder="Your Email"
            required
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </FormField>

        {/* Password */}
        <FormFieldWithIcon>
          <Label htmlFor="password">Password</Label>
          <Input
            type={showPassword ? "text" : "password"}  // Toggle password visibility
            id="password"
            value={password}
            // onChange={(e) => setPassword(e.target.value)}
            onChange={(e) => {
              const newPassword = e.target.value;
              setPassword(newPassword);

              // Hide error message when the contact number reaches 11 digits
              if (newPassword.length === 8) {
                setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
              }
            }}

            placeholder="Your Password"
            required
          />
          <PasswordToggleIcon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </PasswordToggleIcon>
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </FormFieldWithIcon>

        <FormFieldWithIcon>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type={showPassword ? "text" : "password"}  // Toggle password visibility
            id="confirmPassword"
            value={confirmPassword}
            // onChange={(e) => setConfirmPassword(e.target.value)}
            onChange={handleConfirmPasswordChange}

            placeholder="Confirm Your Password"
            required
          />
          <PasswordToggleIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </PasswordToggleIcon>
          {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
        </FormFieldWithIcon>

        {/* Address */}
        <FormField>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your Address"
            required
          />
          {errors.address && <ErrorText>{errors.address}</ErrorText>}
        </FormField>

        {/* Contact Number */}
        <FormField>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            type="text"
            id="contactNumber"
            value={contactNumber}
            // onChange={(e) => setContactNumber(e.target.value)}
            onChange={(e) => {
              const newcontactNumber = e.target.value;
              setContactNumber(newcontactNumber);

              // Hide error message when the contact number reaches 11 digits
              if (newcontactNumber.length === 11) {
                setErrors((prevErrors) => ({ ...prevErrors, contactNumber: "" }));
              }
            }}
            placeholder="Contact Number"
            required
          />
          {errors.contactNumber && <ErrorText>{errors.contactNumber}</ErrorText>}
        </FormField>
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            required
          />
          <Label htmlFor="agreeToTerms">I agree to the terms and policy</Label>
        </CheckboxContainer>
        {errors.agreeToTerms && <ErrorText>{errors.agreeToTerms}</ErrorText>}

        {errors.apiError && <ErrorText>{errors.apiError}</ErrorText>}

        <SubmitButton type="submit">Register</SubmitButton>
        <ToggleLink onClick={() => navigate("/loginHospital")}>
          Already have an account? Login
        </ToggleLink>
      </AuthForm>
    </AuthContainer>
  );
};

export default RegisterHospital;
