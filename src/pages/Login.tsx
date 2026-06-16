import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

type Role = "student" | "teacher" | "hod" | "principal";

type SignupUser = {
  email: string;
  password: string;
  role: Role;
  hodBranch?: string;
};

const demoCredentials: Record<Role, { email: string; password: string }> = {
  student: { email: "student@demo.com", password: "student123" },
  teacher: { email: "teacher@demo.com", password: "teacher123" },
  hod: { email: "hod@demo.com", password: "hod123" },
  principal: { email: "principal@demo.com", password: "principal123" },
};

const roleColors: Record<Role, string> = {
  student: "from-[#2563EB] to-[#1E3A8A]",     // Blue
  teacher: "from-[#10B981] to-[#047857]",     // Green
  hod: "from-[#0D9488] to-[#0F766E]",         // Teal
  principal: "from-[#8B5CF6] to-[#5B21B6]",    // Purple
};

export default function Login() {
  const [role, setRoleState] = useState<Role>("student");
  const [hodBranch, setHodBranch] = useState("cse");

  const [email, setEmail] = useState(demoCredentials.student.email);
  const [password, setPassword] = useState(demoCredentials.student.password);
  const [showPassword, setShowPassword] = useState(false);

  const { loginWithGoogle, loginAsDemo, setRole, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole: Role) => {
    setRoleState(selectedRole);
    setEmail(demoCredentials[selectedRole].email);
    setPassword(demoCredentials[selectedRole].password);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    setRole(role);
    if (role === "hod") localStorage.setItem("hodBranch", hodBranch);
    navigate(`/${role}`);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDemo = demoCredentials[role];
    let signupUser: SignupUser | null = null;

    try {
      signupUser = JSON.parse(
        localStorage.getItem("signupUser") || "null"
      ) as SignupUser | null;
    } catch {
      localStorage.removeItem("signupUser");
    }

    const isDemoLogin =
      email === currentDemo.email && password === currentDemo.password;
    const isRegisteredLogin =
      signupUser?.role === role &&
      signupUser.email === email &&
      signupUser.password === password;

    if (!isDemoLogin && !isRegisteredLogin) {
      alert(`Please use the demo credentials or your registered ${role} account.`);
      return;
    }

    loginAsDemo(role);
    if (role === "hod") {
      localStorage.setItem("hodBranch", signupUser?.hodBranch || hodBranch);
    }
    alert("Login successful!");
    navigate(`/${role}`);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      await resetPassword(email);
      alert(`Password reset link sent to ${email}. Please check your Spam/Junk folder.`);
    } catch {
      alert("Failed to send reset email.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0B1121] p-4 font-sans transition-colors duration-300">
      <div className="flex w-full max-w-[1000px] flex-col overflow-hidden rounded-[2rem] bg-white dark:bg-[#111827] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:flex-row border border-slate-200 dark:border-white/5">
        
        {/* LEFT PANEL */}
        <div className={`relative flex w-full flex-col items-center justify-between bg-gradient-to-br ${roleColors[role]} p-8 transition-all duration-700 md:w-5/12`}>
          
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          {/* Top Logo Area (Big, Centered, No Box) */}
          <div className="mt-4 flex flex-col items-center justify-center">
            <img src="/logo.jpg" alt="Logo" className="h-20 w-20 object-contain" />
            <span className="mt-3 font-display text-2xl font-black text-white tracking-wide">AI Classroom</span>
          </div>

          {/* Floating Role Card */}
          <div className="relative z-10 my-6 flex w-full max-w-[280px] flex-col items-center rounded-2xl bg-white/10 backdrop-blur-md p-6 text-center shadow-2xl transition-transform duration-500 hover:scale-105 border border-white/20">
            <div className="mb-4 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white/20 text-3xl shadow-inner border border-white/30">
              {role === 'student' && '🎓'}
              {role === 'teacher' && '👨‍🏫'}
              {role === 'hod' && '🏛️'}
              {role === 'principal' && '👑'}
            </div>
            <h3 className="text-xl font-bold text-white">
              {role === 'student' && 'Candidate/Student'}
              {role === 'teacher' && 'Teacher'}
              {role === 'hod' && 'HOD'}
              {role === 'principal' && 'Principal'}
            </h3>
            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              {role === 'student' && 'Explore courses, track progress, and complete AI assessments.'}
              {role === 'teacher' && 'Organise classes, manage assessments and track student progress.'}
              {role === 'hod' && 'Oversee department performance, manage leaves and schedules.'}
              {role === 'principal' && 'Monitor institutional metrics, approve decisions and review analytics.'}
            </p>
          </div>

          {/* Bottom Indicators */}
          <div className="mb-2 flex w-full max-w-[280px] items-start gap-3 rounded-lg bg-black/20 p-3 text-left text-sm backdrop-blur-md border border-white/10">
            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-emerald-500 text-[10px] text-white">
              ✓
            </div>
            <div>
              <p className="font-bold text-white italic">Why AI Classroom?</p>
              <p className="mt-1 text-xs text-white/80">
                - Smart analytics, AI exams, seamless learning.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full bg-white dark:bg-[#111827] p-8 md:w-7/12 flex flex-col justify-center transition-colors duration-300">
          <button onClick={() => navigate('/')} className="absolute right-6 top-6 text-slate-400 hover:text-slate-800 dark:hover:text-white transition">✕</button>

          <h2 className="text-center font-display text-3xl font-black text-slate-900 dark:text-white transition-colors">Sign In to Continue</h2>
          <p className="mt-2 text-center text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">Welcome back! Choose your role to sign in</p>

          <div className="mx-auto mt-6 w-full max-w-[420px]">
            {/* Google Sign In */}
            <button onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-3 rounded-lg bg-slate-100 dark:bg-[#1F2937] py-2.5 font-semibold text-slate-800 dark:text-white transition hover:bg-slate-200 dark:hover:bg-[#374151] border border-slate-200 dark:border-slate-700">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4" />
              </div>
              Sign in with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Or Continue With</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
            </div>

            {/* Role Selection (Dashboard to select) */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              {Object.keys(demoCredentials).map((r) => (
                <div 
                  key={r}
                  onClick={() => handleRoleChange(r as Role)}
                  className={`cursor-pointer rounded-lg border p-2 flex items-center gap-3 transition-all duration-300 ${
                    role === r 
                      ? 'border-[#2563EB] bg-[#2563EB]/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] scale-[1.02]' 
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1F2937] hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-colors ${role === r ? 'bg-[#2563EB] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                    {r === 'student' && '🎓'}
                    {r === 'teacher' && '👨‍🏫'}
                    {r === 'hod' && '🏛️'}
                    {r === 'principal' && '👑'}
                  </div>
                  <p className={`text-sm font-bold capitalize transition-colors ${role === r ? 'text-[#2563EB]' : 'text-slate-600 dark:text-slate-300'}`}>{r}</p>
                </div>
              ))}
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {role === "hod" && (
                <select
                  value={hodBranch}
                  onChange={(e) => setHodBranch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1F2937] p-3 text-slate-900 dark:text-white outline-none focus:border-[#2563EB] dark:focus:border-[#2563EB] transition"
                >
                  <option value="cse">CSE Department</option>
                  <option value="ece">ECE Department</option>
                  <option value="eee">EEE Department</option>
                  <option value="mech">MECH Department</option>
                </select>
              )}
              
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1F2937] px-4 py-3 pr-10 text-slate-900 dark:text-white outline-none focus:border-[#2563EB] dark:focus:border-[#2563EB] transition"
                />
                <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1F2937] px-4 py-3 pr-10 text-slate-900 dark:text-white outline-none focus:border-[#2563EB] dark:focus:border-[#2563EB] transition"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end pt-1">
                <p onClick={handleForgotPassword} className="cursor-pointer text-xs font-semibold text-[#2563EB] transition hover:text-blue-700">
                  🔒 Forgot Password?
                </p>
              </div>

              <button type="submit" className="mt-2 w-full rounded-lg bg-[#2563EB] py-3.5 font-bold text-white transition hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                Login
              </button>
            </form>

            <div className="mt-6">
              <Link to="/signup" className="flex w-full items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1F2937] py-3.5 font-semibold text-slate-900 dark:text-white transition hover:bg-slate-100 dark:hover:bg-slate-800">
                Don't have an Account? <span className="ml-1 text-[#2563EB]">Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
