import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { Eye, EyeOff, Zap } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { authService, type RegisterCredentials } from "../utils/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { departments } from "@/constants/constants"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [phoneError, setPhoneError] = useState<string>("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: "",
    emailId: "",
    phoneNumber: "",
    department: "",
    password: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Handle password strength for password field
    if (name === 'password') {
      // checkPasswordStrength(value)
    }
    
    // Clear errors when user starts typing
    if (error) setError("")
    if (passwordError) setPasswordError("")
    if (phoneError) setPhoneError("")
  }

  // Check if phone number is valid
  const isValidPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    // Check if it's exactly 10 digits
    return cleaned.length === 10
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow digits and limit to 10 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
    setFormData(prev => ({ ...prev, phoneNumber: digitsOnly }))
    
    // Clear error when user starts typing
    if (phoneError) setPhoneError("")
  }

  // const checkPasswordStrength = (password: string) => {
  //   let strength = 0
  //   if (password.length >= 8) strength++
  //   if (/[A-Z]/.test(password)) strength++
  //   if (/[a-z]/.test(password)) strength++
  //   if (/[0-9]/.test(password)) strength++
  //   if (/[^A-Za-z0-9]/.test(password)) strength++
  //   setPasswordStrength(strength)
  // }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setFormData(prev => ({ ...prev, password: newPassword }))
    // checkPasswordStrength(newPassword)
    
    // Clear error when user starts typing
    if (passwordError) setPasswordError("")
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)
    
    // Check if passwords match
    if (newConfirmPassword && formData.password !== newConfirmPassword) {
      setPasswordError("Passwords do not match")
    } else {
      setPasswordError("")
    }
  }

  // const getStrengthColor = () => {
  //   if (passwordStrength <= 2) return "bg-red-500"
  //   if (passwordStrength <= 3) return "bg-yellow-500"
  //   return "bg-green-500"
  // }

  // const getStrengthText = () => {
  //   if (passwordStrength <= 2) return "Weak"
  //   if (passwordStrength <= 3) return "Medium"
  //   return "Strong"
  // }

  const isFormValid = () => {
    return formData.username && 
           formData.emailId && 
           formData.phoneNumber && 
           formData.department && 
           formData.password && 
           confirmPassword && 
           formData.password === confirmPassword && 
           isValidPhoneNumber(formData.phoneNumber) 
          //  && passwordStrength >= 3
  }


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Form submitted, preventing default...");
    
      // Clear previous errors
      if (error) setError("");
      if (passwordError) setPasswordError("");
      if (phoneError) setPhoneError("");
    
      // Validate all fields
      if (!formData.username.trim()) {
        setError("Username is required");
        return;
      }
      
      if (!formData.emailId.trim()) {
        setError("Email is required");
        return;
      }
      
      if (!isValidPhoneNumber(formData.phoneNumber)) {
        setPhoneError("Please enter a valid 10-digit phone number");
        return;
      }
      
      if (!formData.department) {
        setError("Please select a department");
        return;
      }
      
      // if (formData.password.length < 8) {
      //   setPasswordError("Password must be at least 8 characters long");
      //   return;
      // }
      
      // if (passwordStrength < 3) {
      //   setPasswordError("Password is too weak. Please use a stronger password");
      //   return;
      // }
      
      if (formData.password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
    
      if (!isLoading) setIsLoading(true);
    
      try {
        console.log("Attempting registration with:", formData);
        const response = await authService.register(formData);
    
        console.log("Registration successful:", response.data.emailId, response.data.username);
    
        // Navigate to dashboard after successful registration
        navigate("/dashboard");
      } catch (error: any) {
        console.error("Registration error: ehy", error);
        setError(error.message || "Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
         	  <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                  Query Track
                </h1>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Sign up to get started with QueryTrack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Display */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2 text-left">
                <Label htmlFor="username" className="ml-2 font-semibold">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="emailId" className="ml-2 font-semibold">Email Address</Label>
                <Input
                  id="emailId"
                  name="emailId"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="phoneNumber" className="ml-2 font-semibold">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  required
                  className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${phoneError ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {phoneError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {phoneError}
                  </p>
                )}
              </div>


              <div className="space-y-2 text-left">
                 <Label htmlFor="department" className="ml-2 font-semibold">Department</Label>
                 <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                   <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                     <SelectValue placeholder="Select your department" />
                   </SelectTrigger>
                   <SelectContent>
                      {
                        departments.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                        ))
                      }
                   </SelectContent>
                 </Select>
               </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="password" className="ml-2 font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    required
                    className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {/* {passwordStrength > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                      <span
                        className={`font-medium ${passwordStrength <= 2 ? "text-red-500" : passwordStrength <= 3 ? "text-yellow-500" : "text-green-500"}`}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )} */}
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="confirmPassword" className="font-semibold ml-2">Confirm Password</Label>
                <div className="relative">
                    <Input
                     id="confirmPassword"
                     type={showConfirmPassword ? "text" : "password"}
                     placeholder="Re-enter your password to confirm"
                     value={confirmPassword}
                     required
                     className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`}
                     onChange={handleConfirmPasswordChange}
                   />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the terms and conditions
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all duration-200"
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
