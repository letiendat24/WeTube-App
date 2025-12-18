import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import channelApi from "@/api/channelApi";

function SubscribeButton({ channelId, initialIsSubscribed, onToggle }) {
  const { isAuthenticated } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);

  // Đồng bộ state khi props từ cha thay đổi (quan trọng khi data load async)
  useEffect(() => {
    setIsSubscribed(initialIsSubscribed);
  }, [initialIsSubscribed]);

  const handleSubscribe = async (e) => {
    // Ngăn chặn sự kiện click lan ra ngoài (nếu nút đặt trong thẻ Link)
    e.preventDefault(); 
    e.stopPropagation();

    if (!isAuthenticated) return alert("Vui lòng đăng nhập để đăng ký kênh!");

    // 1. Optimistic Update (Cập nhật UI trước)
    const previousState = isSubscribed;
    const newState = !previousState;
    
    setIsSubscribed(newState);
    
    // Gọi callback để báo cho cha biết (để cha tăng/giảm số sub hiển thị)
    if (onToggle) {
        onToggle(newState); 
    }

    // 2. Gọi API
    try {
      if (!channelId) throw new Error("Thiếu Channel ID");

      if (previousState) {
        // Đang sub -> Hủy sub
        await channelApi.unsubscribe(channelId);
      } else {
        // Chưa sub -> Đăng ký
        await channelApi.subscribe(channelId);
      }
    } catch (error) {
      console.error("Lỗi subscribe:", error);
      // 3. Revert nếu lỗi
      setIsSubscribed(previousState);
      if (onToggle) onToggle(previousState); // Revert số sub ở cha
      alert("Thao tác thất bại.");
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      className={`rounded-full h-9 px-4 font-medium text-sm transition-colors ${
        isSubscribed
          ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
          : "bg-foreground text-background hover:bg-foreground/90"
      }`}
    >
      {isSubscribed ? "Đã đăng ký" : "Đăng ký"}
    </Button>
  );
}

export default SubscribeButton;