import React, { useEffect, useState } from "react";
import {
  Users,
  Video,
  Eye,
  Activity,
  Trash2,
  Search,
  ShieldAlert,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import adminApi from "@/api/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime } from "@/utils/formatDateTime";

// Đăng ký các thành phần của ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalViews: 0,
    systemStatus: "Checking...",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State phân trang đơn giản
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Fetch Dữ liệu khi vào trang
  useEffect(() => {
    fetchDashboardData();
  }, [currentPage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Gọi song song 2 API: Thống kê & Danh sách User
      const [statsRes, usersRes] = await Promise.all([
        adminApi.getSystemStats(),
        adminApi.getUsers(currentPage, 10), // Page hiện tại, 10 user/trang
      ]);

      setStats(statsRes.data || statsRes);
      
      // Xử lý dữ liệu user trả về từ API phân trang
      const userData = usersRes.data || usersRes;
      setUsers(userData.users || []);
      setTotalPages(userData.totalPages || 1);

    } catch (error) {
      console.error("Lỗi tải Admin Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý Ban User
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "CẢNH BÁO: Bạn có chắc chắn muốn xóa user này? Hành động này sẽ xóa toàn bộ video của họ và không thể hoàn tác!"
      )
    )
      return;

    try {
      await adminApi.deleteUser(userId);
      alert("Đã xóa người dùng thành công.");
      // Refresh lại danh sách
      fetchDashboardData();
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      alert("Xóa thất bại.");
    }
  };

  // 3. Cấu hình Biểu đồ (Chart Data)
  const chartData = {
    labels: ["Người dùng", "Video"],
    datasets: [
      {
        label: "Số lượng hệ thống",
        data: [stats.totalUsers, stats.totalVideos],
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)", // Xanh dương (Users)
          "rgba(239, 68, 68, 0.6)",  // Đỏ (Videos)
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Tỷ lệ tăng trưởng nội dung" },
    },
  };

  if (loading && stats.totalUsers === 0) 
    return <div className="p-10 text-center">Đang tải dữ liệu hệ thống...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50/50">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">
            Tổng quan hệ thống & Quản lý người dùng
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
          <Activity className="w-4 h-4" />
          System: {stats.systemStatus || "Healthy"}
        </div>
      </div>

      {/* --- PHẦN 1: THỐNG KÊ (STATS CARDS) --- */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        {/* Card Users */}
        <div className="p-6 transition-shadow bg-white border shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng User</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalUsers.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 text-blue-600 bg-blue-100 rounded-full">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="flex items-center gap-1 mt-2 text-xs text-green-600">
             Đang hoạt động
          </p>
        </div>

        {/* Card Videos */}
        <div className="p-6 transition-shadow bg-white border shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng Video</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalVideos.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 text-red-600 bg-red-100 rounded-full">
              <Video className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Nội dung toàn server</p>
        </div>

        {/* Card Views */}
        <div className="p-6 transition-shadow bg-white border shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng Lượt Xem</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalViews.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 text-green-600 bg-green-100 rounded-full">
              <Eye className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Tương tác hệ thống</p>
        </div>
      </div>

      {/* --- PHẦN 2: BIỂU ĐỒ & DANH SÁCH (GRID LAYOUT) --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Cột trái: Biểu đồ (Chiếm 1 phần) */}
        <div className="p-6 bg-white border shadow-sm rounded-xl lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Biểu đồ hệ thống
          </h3>
          <div className="flex items-center justify-center w-full h-64">
             {/* Chart Component */}
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* Cột phải: Danh sách User (Chiếm 2 phần) */}
        <div className="p-6 bg-white border shadow-sm rounded-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Quản lý người dùng
            </h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm user (Demo)..."
                className="pl-9 w-[200px] h-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Người dùng</th>
                  <th className="px-6 py-3">Vai trò</th>
                  <th className="px-6 py-3">Ngày tham gia</th>
                  <th className="px-6 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user, index) => {
                    // --- ĐOẠN DEBUG: In ra dữ liệu user để kiểm tra ---
                    // Bạn nhấn F12 -> Console để xem nó in ra gì nhé
                    console.log(`User thứ ${index}:`, user);
                    
                    // Lấy ID an toàn: Ưu tiên _id, nếu không có thì lấy id
                    const userId = user._id || user.id; 

                    return (
                      <tr key={userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatarUrl} />
                              <AvatarFallback>
                                {user.username?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {user.username}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {formatDateTime(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user.role !== "admin" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 gap-1 text-red-600 border border-red-200 shadow-none bg-red-50 hover:bg-red-100 hover:text-red-700"
                              // SỬA LẠI: Truyền biến userId đã check kỹ ở trên
                              onClick={() => {
                                console.log("Chuẩn bị xóa ID:", userId); // Log check khi bấm nút
                                if (!userId) alert("Lỗi: Không tìm thấy ID người dùng!");
                                else handleDeleteUser(userId);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t">
             <span className="text-sm text-gray-500">Trang {currentPage} / {totalPages}</span>
             <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                >
                    Trước
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                >
                    Sau
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;