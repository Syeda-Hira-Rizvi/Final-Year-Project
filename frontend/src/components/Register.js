import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
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

  //   @media (max-width: 768px) {
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

  &:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 15px;
    // max-width: 100%;
    box-sizing:border-box;

  }
`;

const Title = styled.h2`
  text-align: center;
  color: #b00000;
  margin-bottom: 20px;
`;

const FormField = styled.div`
  margin-bottom: 20px;
  margin-right: 20px;
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
    color: white;
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  accent-color: #b00000;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
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


const Register = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);  // Added state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // State for confirm password visibility


  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm Password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Registration fields validation
    if (!name.trim()) newErrors.name = "Name is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!address.trim()) newErrors.address = "Address is required";

    // Contact Number validation
    if (contactNumber && !contactNumber.match(/^\d{11}$/)) {
      newErrors.contactNumber = "Contact number must be a 11-digit number";
    }
    if (!agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submission started");

    if (!validate()) {
      console.log("Validation failed. Errors:", errors);
      return;
    }


    console.log("Validation successful. Proceeding with registration...");

    const donorData = {
      name,
      email,
      password,
      confirmPassword,
      gender,
      dateOfBirth,
      address,
      contactNumber,
    };

    try {
      // const response = await axios.post(`${BASE_URL}/api/v1/register`, donorData);
      const response = await axios.post('http://localhost:8000/api/v1/register', donorData);
      console.log("Registration successful:", response.data);

      //RECENTLY ADDED
      // Save the new user to localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to donor dashboard on successful registration
      navigate("/donorhome");
    } catch (error) {
      // Handle "Email already registered" error
      if (error.response?.data?.message === "Email already registered") {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Email is already registered" }));
      } else {
        setErrors({ apiError: "Registration failed. Please try again." });
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

        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}
        </FormField>

        <FormField>
          <Label htmlFor="gender">Gender</Label>
          <Select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
          {errors.gender && <ErrorText>{errors.gender}</ErrorText>}
        </FormField>

        <FormField>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          {errors.dateOfBirth && <ErrorText>{errors.dateOfBirth}</ErrorText>}
        </FormField>

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
        <FormField>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);

              // Clear custom error message when user starts typing
              e.target.setCustomValidity("");
            }}
            onInvalid={(e) => {
              if (!address.trim()) {
                e.target.setCustomValidity("Please fill out this field.");
              }
            }}
            placeholder="Your Address"
            required
          />
        </FormField>


        {/* <FormField>
          <Label htmlFor="contactNumber">Contact Number </Label>
          <Input
            type="tel"
            id="contactNumber"
            value={contactNumber}
            onChange={(e) => {
              const newContactNumber = e.target.value;
              setContactNumber(newContactNumber);
        
              // Hide error message when the contact number reaches 11 digits
              if (newContactNumber.length === 11) {
                setErrors((prevErrors) => ({ ...prevErrors, contactNumber: "" }));
              }
            }}     
           placeholder="Your Contact Number"
          />
                    {errors.contactNumber && <ErrorText>{errors.contactNumber}</ErrorText>}

        </FormField> */}

        <FormField>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            type="tel"
            id="contactNumber"
            value={contactNumber}
            onChange={(e) => {
              const newContactNumber = e.target.value;
              setContactNumber(newContactNumber);

              // Clear custom validity when user types
              e.target.setCustomValidity("");

              // Hide error message when the contact number reaches 11 digits
              if (newContactNumber.length === 11) {
                setErrors((prevErrors) => ({ ...prevErrors, contactNumber: "" }));
              }
            }}
            onInvalid={(e) => {
              if (!contactNumber) {
                e.target.setCustomValidity("Please fill out this field.");
              } else if (!/^\d{11}$/.test(contactNumber)) {
                e.target.setCustomValidity("Contact number must be an 11-digit number.");
              }
            }}
            placeholder="Your Contact Number"
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

        <ToggleLink onClick={() => navigate("/login")}>
          Already have an account? Login
        </ToggleLink>
      </AuthForm>
    </AuthContainer>
  );
};

export default Register;
