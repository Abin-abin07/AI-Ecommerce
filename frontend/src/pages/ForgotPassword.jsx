import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Mail, KeyRound, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import "./ForgotPassword.css";

const API = "http://localhost:8000/api/auth";
const STEPS = { EMAIL: 1, OTP: 2, RESET: 3, SUCCESS: 4 };
const COUNTDOWN = 60;

// ── Step 1: Email ────────────────────────────────────────────────
const EmailStep = ({ initialEmail = "", initialError = "", onNext }) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    if (initialError) setError(initialError);
  }, [initialError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/password-reset/send-otp/`, { email });
      onNext({ email });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-card">
      <div className="fp-icon-wrap"><Mail size={32} /></div>
      <h1>Forgot Password?</h1>
      <p className="fp-subtitle">Enter your registered email and we will send you a 6-digit OTP.</p>
      <form onSubmit={handleSubmit} className="fp-form">
        {error && <div className="fp-error">{error}</div>}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" disabled={loading} autoFocus />
        </div>
        <button type="submit" className="fp-btn" disabled={loading}>
          {loading && <span className="fp-spinner" />}
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
      <div className="fp-footer">
        <Link to="/login"><ArrowLeft size={14} /> Back to Sign In</Link>
      </div>
    </div>
  );
};

// ── Step 2: OTP ──────────────────────────────────────────────────
const OtpStep = ({ email, devOtp, onNext, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(COUNTDOWN);
  const [resending, setResending] = useState(false);
  const refs = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(COUNTDOWN);
    intervalRef.current = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(intervalRef.current); return 0; } return t - 1; });
    }, 1000);
  };

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split("")); refs.current[5]?.focus(); }
  };

  const handleResend = async () => {
    setResending(true); setError("");
    try {
      await axios.post(`${API}/password-reset/send-otp/`, { email });
      startTimer(); setOtp(["", "", "", "", "", ""]); refs.current[0]?.focus();
    } catch { setError("Failed to resend OTP. Please try again."); }
    finally { setResending(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/password-reset/verify-otp/`, { email, otp: code });
      onNext({ resetToken: res.data.reset_token });
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fp-card">
      <div className="fp-icon-wrap"><KeyRound size={32} /></div>
      <h1>Verify OTP</h1>
      <p className="fp-subtitle">Enter the 6-digit code sent to <strong>{email}</strong></p>
      <form onSubmit={handleSubmit} className="fp-form">
        {error && <div className="fp-error">{error}</div>}
        <div className="otp-boxes" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input key={i} ref={(el) => (refs.current[i] = el)} type="text" inputMode="numeric"
              maxLength={1} value={digit} onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`otp-box${digit ? " filled" : ""}`} disabled={loading} />
          ))}
        </div>
        <div className="otp-timer">
          {timer > 0
            ? <span>Resend OTP in <strong>{timer}s</strong></span>
            : <button type="button" className="resend-btn" onClick={handleResend} disabled={resending}>
                <RefreshCw size={14} /> {resending ? "Resending..." : "Resend OTP"}
              </button>}
        </div>
        <button type="submit" className="fp-btn" disabled={loading}>
          {loading && <span className="fp-spinner" />}
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      <div className="fp-footer">
        <button type="button" className="fp-back-btn" onClick={onBack}>
          <ArrowLeft size={14} /> Change email
        </button>
      </div>
    </div>
  );
};

// ── Step 3: New Password ─────────────────────────────────────────
const ResetStep = ({ email, resetToken, onSuccess }) => {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ new: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (form.newPassword.length < 8) e.newPassword = "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(form.newPassword)) e.newPassword = (e.newPassword ? e.newPassword + " " : "") + "Must contain an uppercase letter.";
    if (!/\d/.test(form.newPassword)) e.newPassword = (e.newPassword ? e.newPassword + " " : "") + "Must contain a number.";
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiError("");
    try {
      await axios.post(`${API}/password-reset/reset/`, {
        email, reset_token: resetToken,
        new_password: form.newPassword, confirm_password: form.confirmPassword,
      });
      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.error || "Reset failed. Please start over.");
    } finally { setLoading(false); }
  };

  const p = form.newPassword;
  const strength = [p.length >= 8, /[A-Z]/.test(p), /\d/.test(p), /[^a-zA-Z0-9]/.test(p)].filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthClass = ["", "weak", "fair", "good", "strong"];

  return (
    <div className="fp-card">
      <div className="fp-icon-wrap"><Lock size={32} /></div>
      <h1>Create New Password</h1>
      <p className="fp-subtitle">Choose a strong password for your account.</p>
      <form onSubmit={handleSubmit} className="fp-form">
        {apiError && <div className="fp-error">{apiError}</div>}
        <div className="form-group">
          <label>New Password</label>
          <div className="password-input-wrap">
            <input type={show.new ? "text" : "password"} name="newPassword" value={form.newPassword}
              onChange={handleChange} placeholder="Min. 8 characters"
              className={errors.newPassword ? "invalid" : ""} disabled={loading} />
            <button type="button" className="eye-btn" onClick={() => setShow((s) => ({ ...s, new: !s.new }))}>
              {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {p && <><div className="strength-bar"><div className={`strength-fill ${strengthClass[strength]}`} style={{ width: `${strength * 25}%` }} /></div>
            <span className={`strength-label ${strengthClass[strength]}`}>{strengthLabel[strength]}</span></>}
          {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <div className="password-input-wrap">
            <input type={show.confirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword}
              onChange={handleChange} placeholder="Re-enter password"
              className={errors.confirmPassword ? "invalid" : ""} disabled={loading} />
            <button type="button" className="eye-btn" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}>
              {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>
        <ul className="password-rules">
          <li className={p.length >= 8 ? "pass" : ""}>At least 8 characters</li>
          <li className={/[A-Z]/.test(p) ? "pass" : ""}>One uppercase letter</li>
          <li className={/\d/.test(p) ? "pass" : ""}>One number</li>
        </ul>
        <button type="submit" className="fp-btn" disabled={loading}>
          {loading && <span className="fp-spinner" />}
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

// ── Step 4: Success ──────────────────────────────────────────────
const SuccessStep = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/login", { state: { message: "Password reset successfully! Please sign in." } }), 3000);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="fp-card fp-success-card">
      <CheckCircle size={64} className="fp-success-icon" />
      <h1>Password Reset!</h1>
      <p className="fp-subtitle">Your password has been updated successfully.<br />Redirecting you to sign in...</p>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────
const ForgotPassword = () => {
  const location = useLocation();
  const passedEmail = location.state?.email?.trim() || "";

  const [step, setStep] = useState(STEPS.EMAIL);
  const [data, setData] = useState({ email: passedEmail, devOtp: "", resetToken: "" });
  const [autoSending, setAutoSending] = useState(false);
  const [autoSendError, setAutoSendError] = useState("");

  const hasAutoSent = useRef(false);

  useEffect(() => {
    if (passedEmail && !hasAutoSent.current) {
      hasAutoSent.current = true;
      setAutoSending(true);
      axios
        .post(`${API}/password-reset/send-otp/`, { email: passedEmail })
        .then(() => {
          setData((d) => ({ ...d, email: passedEmail }));
          setStep(STEPS.OTP);
        })
        .catch((err) => {
          setAutoSendError(err.response?.data?.error || `Failed to send OTP to ${passedEmail}`);
        })
        .finally(() => {
          setAutoSending(false);
        });
    }
  }, [passedEmail]);

  const goToOtp = ({ email, devOtp }) => { setData((d) => ({ ...d, email, devOtp })); setStep(STEPS.OTP); };
  const goToReset = ({ resetToken }) => { setData((d) => ({ ...d, resetToken })); setStep(STEPS.RESET); };
  const goToSuccess = () => setStep(STEPS.SUCCESS);
  const backToEmail = () => setStep(STEPS.EMAIL);

  const stepLabels = ["Email", "Verify OTP", "New Password"];
  const currentIdx = Math.min(step - 1, 2);

  return (
    <div className="fp-container">
      <div className="fp-wrapper">
        {step < STEPS.SUCCESS && (
          <div className="fp-progress">
            {stepLabels.map((label, i) => (
              <React.Fragment key={label}>
                <div className={`fp-step-dot${i < step ? " done" : ""}${i === currentIdx ? " active" : ""}`}>
                  {i < currentIdx ? <CheckCircle size={14} /> : i + 1}
                  <span className="fp-step-label">{label}</span>
                </div>
                {i < stepLabels.length - 1 && <div className={`fp-step-line${i < currentIdx ? " done" : ""}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {autoSending ? (
          <div className="fp-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="fp-icon-wrap" style={{ margin: '0 auto 20px auto' }}><Mail size={32} /></div>
            <h1>Sending OTP...</h1>
            <p className="fp-subtitle">Sending 6-digit OTP code to <strong>{passedEmail}</strong></p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 10px 0' }}>
              <span className="fp-spinner" style={{ width: '36px', height: '36px', borderTopColor: '#6366f1' }} />
            </div>
          </div>
        ) : (
          <>
            {step === STEPS.EMAIL && <EmailStep initialEmail={passedEmail} initialError={autoSendError} onNext={goToOtp} />}
            {step === STEPS.OTP && <OtpStep email={data.email} devOtp={data.devOtp} onNext={goToReset} onBack={backToEmail} />}
            {step === STEPS.RESET && <ResetStep email={data.email} resetToken={data.resetToken} onSuccess={goToSuccess} />}
            {step === STEPS.SUCCESS && <SuccessStep />}
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
