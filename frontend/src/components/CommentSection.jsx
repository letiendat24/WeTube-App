// src/components/Comments/CommentSection.jsx
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { ThumbsUp, ThumbsDown, User, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/utils/formatDateTime";

// Import API & Context
import commentApi from "@/api/commentApi";
import { useAuth } from "@/context/AuthContext";

// URL của Comment Service (Port 3001) - Tốt nhất nên đưa vào file .env
const COMMENT_SERVICE_URL = "http://127.0.0.1:3001";

function CommentSection({ videoId }) {
  const { user: currentUser, isAuthenticated } = useAuth();
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Comments & Setup Socket
  useEffect(() => {
    if (!videoId) return;

    // A. Lấy danh sách comment ban đầu
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const res = await commentApi.getComments(videoId);
        setComments(res.data);
      } catch (error) {
        console.error("Lỗi tải comment:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();

    // B. Kết nối Socket.IO
    const newSocket = io(COMMENT_SERVICE_URL);
    setSocket(newSocket);

    // Join vào room của video này
    newSocket.emit("join_video", videoId);

    // Lắng nghe sự kiện có comment mới từ server
    newSocket.on("receive_comment", (data) => {
      setComments((prev) => [data, ...prev]); // Thêm comment mới lên đầu
    });

    // Cleanup khi rời component
    return () => {
      newSocket.disconnect();
    };
  }, [videoId]);

  // 2. Xử lý gửi Comment
  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    if (!isAuthenticated) return alert("Vui lòng đăng nhập để bình luận");

    try {
      // Gọi API (Gateway sẽ forward sang Service, Service sẽ emit socket lại cho ta)
      await commentApi.addComment(videoId, newComment);
      setNewComment(""); // Xóa ô nhập
    } catch (error) {
      console.error("Gửi comment thất bại:", error);
      alert("Không thể gửi bình luận.");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-8 mb-6">
        <h2 className="text-xl font-bold">
          {comments.length} Bình luận
        </h2>
        {/* <div className="flex items-center gap-2 text-sm font-medium cursor-pointer">
             <ListFilter className="w-5 h-5" /> Sắp xếp theo
        </div> */}
      </div>

      {/* Comment Input */}
      <div className="flex gap-4 mb-8">
        <Avatar className="w-10 h-10">
          <AvatarImage src={currentUser?.avatarUrl} />
          <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 gap-2">
          <Input
            placeholder="Viết bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            className="px-0 py-1 transition-colors bg-transparent border-0 border-b rounded-none border-muted-foreground/30 focus-visible:ring-0 focus-visible:border-foreground placeholder:text-sm"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full hover:bg-secondary"
                onClick={() => setNewComment("")}
            >
                Hủy
            </Button>
            <Button 
                size="sm" 
                className="text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-secondary disabled:text-muted-foreground"
                disabled={!newComment.trim()}
                onClick={handleSendComment}
            >
                Bình luận
            </Button>
          </div>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-6">
        {isLoading ? (
            <p className="text-sm text-center text-muted-foreground">Đang tải bình luận...</p>
        ) : (
            comments.map((comment) => (
            <div key={comment._id || Math.random()} className="flex gap-4 group">
                <Avatar className="w-10 h-10 cursor-pointer">
                    <AvatarImage src={comment.user?.avatarUrl} />
                    <AvatarFallback>{comment.user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full gap-1">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-sm font-semibold cursor-pointer text-foreground hover:text-foreground/80">
                            @{comment.user?.username || "Unknown"}
                        </span>
                        <span className="text-muted-foreground">
                            {formatDateTime(comment.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm leading-normal text-foreground">{comment.content}</p>
                    
                    {/* Action nhỏ (Like/Reply) */}
                    <div className="flex items-center gap-4 mt-1">
                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" /> 
                            {/* <span className="text-xs">12</span> */}
                        </button>
                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary transition-colors">
                            <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                        <button className="px-2 py-1 text-xs font-medium transition-colors rounded-full hover:text-blue-400 hover:bg-secondary">
                            Phản hồi
                        </button>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;