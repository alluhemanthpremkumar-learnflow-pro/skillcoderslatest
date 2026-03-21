/**
 * Component Migration Examples - How to update existing components to use API
 * 
 * This file shows before/after examples of common components
 * migrated from static data to API calls
 */

// ==================== EXAMPLE 1: Courses List Page ====================

// BEFORE - Using static data
/*
import { sampleCourses } from '@/lib/sampleCourses';

function Courses() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {sampleCourses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
*/

// AFTER - Using API
import { useState } from 'react';
import { useGetCourses, useGetCoursesByDomain } from '@/services/hooks';

function CoursesUpdated() {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [page, setPage] = useState(1);

  // Fetch courses - automatically cached by React Query
  const { data, isLoading, error } = 
    selectedDomain === 'all' 
      ? useGetCourses(page, 12)
      : useGetCoursesByDomain(selectedDomain);

  if (isLoading) return <div className="text-center py-12">Loading courses...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Failed to load courses</div>;

  return (
    <div>
      {/* Domain filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'web', 'security', 'devops'].map(domain => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={selectedDomain === domain ? 'active' : ''}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Courses grid */}
      <div className="grid grid-cols-3 gap-4">
        {data?.data?.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}

// ==================== EXAMPLE 2: Quiz Page with Level Selection ====================

// BEFORE - Using static data
/*
import { quizDomains, getLevelQuestions } from '@/data/quizQuestions';

function Quizzes() {
  const [selectedLevel, setSelectedLevel] = useState(1);

  const questions = getLevelQuestions(selectedLevel);

  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setSelectedLevel(i + 1)}
            className={selectedLevel === i + 1 ? 'active' : ''}
          >
            Level {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
*/

// AFTER - Using API
import { useGetQuizzesByLevel, useGetDomains } from '@/services/hooks';

function QuizzesUpdated() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('');

  // Fetch domains
  const { data: domainsData } = useGetDomains();

  // Fetch quizzes by level (and optionally by domain)
  const { data: quizzesData, isLoading } = useGetQuizzesByLevel(selectedLevel);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Domain selector */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Select Domain</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDomain('')}
            className={!selectedDomain ? 'active' : ''}
          >
            All
          </button>
          {domainsData?.data?.map(domain => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain.name)}
              className={selectedDomain === domain.name ? 'active' : ''}
            >
              {domain.name}
            </button>
          ))}
        </div>
      </div>

      {/* Level selector */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Select Level</h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setSelectedLevel(i + 1)}
              className={`
                py-2 rounded
                ${selectedLevel === i + 1 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
                }
              `}
            >
              L{i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes list */}
      <div className="space-y-4">
        {quizzesData?.data?.map(quiz => (
          <div key={quiz.id} className="p-4 border rounded">
            <h4 className="font-semibold">{quiz.title}</h4>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== EXAMPLE 3: Admin Dashboard ====================

// BEFORE - Using hardcoded state
/*
function AdminDashboard() {
  const [users, setUsers] = useState(initialUsers);
  const [payments, setPayments] = useState(initialPayments);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      [Display static data would go here]
    </div>
  );
}
*/

// AFTER - Using API with real data
import { 
  useGetAdminDashboard, 
  useGetAllUsers, 
  useGetAllPayments 
} from '@/services/hooks';

function AdminDashboardUpdated() {
  const [userPage, setUserPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);

  // Fetch dashboard stats
  const { data: dashboardData } = useGetAdminDashboard();

  // Fetch users list
  const { data: usersData } = useGetAllUsers(userPage, 10);

  // Fetch payments list
  const { data: paymentsData } = useGetAllPayments(paymentPage, 10);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      {dashboardData?.data && (
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-gray-600">Total Users</p>
            <p className="text-3xl font-bold">{dashboardData.data.totalUsers}</p>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold">₹{dashboardData.data.totalRevenue}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded">
            <p className="text-gray-600">Active Courses</p>
            <p className="text-3xl font-bold">{dashboardData.data.activeCourses}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded">
            <p className="text-gray-600">Enrollments</p>
            <p className="text-3xl font-bold">{dashboardData.data.enrollments}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Users</h3>
        <table className="w-full border">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.data?.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payments Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Payments</h3>
        <table className="w-full border">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {paymentsData?.data?.map(payment => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{payment.user}</td>
                <td className="p-2">{payment.amount}</td>
                <td className="p-2">{payment.status}</td>
                <td className="p-2">{new Date(payment.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== EXAMPLE 4: Profile Page ====================

// BEFORE
/*
function Profile() {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState(userProfile || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
    toast({ title: 'Profile updated!' });
  };

  return (
    <form onSubmit={handleSubmit}>
      [form fields would go here]
    </form>
  );
}
*/

// AFTER
import { useGetProfile, useUpdateProfile } from '@/services/hooks';
import { useToast } from '@/hooks/use-toast';

function ProfileUpdated() {
  const { toast } = useToast();
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfile();
  const updateProfile = useUpdateProfile({
    onSuccess: (response) => {
      if (response.success) {
        toast({ title: 'Profile updated successfully!' });
      } else {
        toast({ 
          title: 'Error', 
          description: response.error,
          variant: 'destructive'
        });
      }
    },
  });

  if (isLoadingProfile) return <div>Loading...</div>;

  const profile = profileData?.data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    await updateProfile.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          defaultValue={profile?.name || ''}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={profile?.email || ''}
          disabled
          className="w-full border p-2 rounded bg-gray-50"
        />
      </div>

      <div>
        <label className="block mb-2">Phone</label>
        <input
          type="tel"
          name="phone"
          defaultValue={profile?.phone || ''}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={updateProfile.isPending}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}

// ==================== MIGRATION CHECKLIST ====================
/**
 * When migrating a component from static to API:
 * 
 * ✓ 1. Import needed hooks from @/services/hooks
 * ✓ 2. Remove imports of static data files (sampleCourses, etc.)
 * ✓ 3. Replace useState with useQuery/useMutation hooks
 * ✓ 4. Handle loading and error states
 * ✓ 5. Update form submissions to use mutation hooks
 * ✓ 6. Add success/error notifications with useToast
 * ✓ 7. Test with real backend API
 * ✓ 8. Remove console.log() statements
 * ✓ 9. Add proper error handling
 * ✓ 10. Document any custom API logic
 */

export { CoursesUpdated, QuizzesUpdated, AdminDashboardUpdated, ProfileUpdated };
