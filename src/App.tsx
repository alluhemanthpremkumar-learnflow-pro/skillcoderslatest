import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Labs from "./pages/Labs";
import Quizzes from "./pages/Quizzes";
import Career from "./pages/Career";
import Gadgets from "./pages/Gadgets";
import Meetings from "./pages/Meetings";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorApply from "./pages/InstructorApply";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/career" element={<Career />} />
            <Route path="/gadgets" element={<Gadgets />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor-apply" element={<InstructorApply />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
