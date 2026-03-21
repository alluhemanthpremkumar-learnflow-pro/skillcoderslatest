import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ChatbotButton from "@/components/ChatbotButton";
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
import About from "./pages/About";
import Cart from "./pages/Cart";
import Certificate from "./pages/Certificate";
import SchoolRegistration from "./pages/SchoolRegistration";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorApply from "./pages/InstructorApply";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected Routes */}
            <Route path="/labs" element={<ProtectedRoute><Labs /></ProtectedRoute>} />
            <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
            <Route path="/career" element={<ProtectedRoute><Career /></ProtectedRoute>} />
            <Route path="/gadgets" element={<ProtectedRoute><Gadgets /></ProtectedRoute>} />
            <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
            <Route path="/school-registration" element={<ProtectedRoute><SchoolRegistration /></ProtectedRoute>} />
            <Route path="/instructor/dashboard" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
            <Route path="/instructor-apply" element={<ProtectedRoute><InstructorApply /></ProtectedRoute>} />
            
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatbotButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
