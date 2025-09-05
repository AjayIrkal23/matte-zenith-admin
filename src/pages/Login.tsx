import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Send, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  sendOtp,
  verifyOtp,
  selectAuthStatus,
  selectAuthError,
  selectPendingEmpId,
  selectIsAuthenticated,
  clearError,
  selectDevOtp, // <- optional dev helper (EXPOSE_OTP=true)
} from "@/store/slices/authSlice";

export default function LoginPage() {
  const [empId, setEmpId] = useState("");
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const pendingEmpId = useAppSelector(selectPendingEmpId);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const devOtp = useAppSelector(selectDevOtp); // shows only if backend returns it

  const isLoading = status === "loading";
  const showOtpField = !!pendingEmpId;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from =
        (location.state as any)?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSendOtp = async () => {
    if (!empId.trim()) {
      toast({
        title: "Missing EMP ID",
        description: "Please enter your employee ID",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(sendOtp(empId)).unwrap();
      toast({
        title: "OTP Sent",
        description: "Enter the OTP sent to your registered email",
      });
    } catch {
      // Error handled by slice
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast({
        title: "Missing OTP",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(verifyOtp({ empid: pendingEmpId!, otp })).unwrap();
      toast({
        title: "Login Successful",
        description: "Welcome to Adani Safety Dashboard",
      });
      // Navigation handled by useEffect
    } catch {
      // Error handled by slice
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerifyOtp();
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-panel-bg border border-panel-border rounded-xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-adani-primary rounded-xl flex items-center justify-center mx-auto mb-4"
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Adani Safety
            </h1>
            <p className="text-text-muted">Admin Dashboard Login</p>
          </div>

          <div className="space-y-4">
            {/* EMP ID Field */}
            <div>
              <Label htmlFor="empid" className="text-text-secondary">
                Employee ID
              </Label>
              <Input
                id="empid"
                type="text"
                placeholder="Enter your EMP ID"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                autoComplete="username"
                disabled={isLoading || showOtpField}
                className="mt-1"
              />
            </div>

            {/* Send/Resend OTP */}
            {!showOtpField ? (
              <Button
                onClick={handleSendOtp}
                disabled={isLoading || !empId.trim()}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Sending..." : "Resend OTP"}
              </Button>
            )}

            {/* OTP Field - Animated */}
            <AnimatePresence>
              {showOtpField && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="otp" className="text-text-secondary">
                        OTP
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onKeyDown={handleOtpKeyDown}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        aria-describedby="otp-help"
                        className="mt-1 text-center tracking-widest"
                        autoFocus
                      />
                      <p id="otp-help" className="text-xs text-text-muted mt-1">
                        Enter the 6-digit OTP sent to your email
                      </p>
                      {devOtp && (
                        <p className="text-xs text-adani-primary mt-1">
                          Dev OTP:{" "}
                          <code className="font-semibold">{devOtp}</code>
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || !otp.trim()}
                      className="w-full"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {isLoading ? "Verifying..." : "Login"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
