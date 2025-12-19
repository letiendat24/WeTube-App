import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  useSubscribeChannelMutation, 
  useUnsubscribeChannelMutation 
} from "@/features/videos/videoSlice";

function SubscribeButton({ channelId, initialIsSubscribed, onToggle }) {
  const { isAuthenticated } = useAuth();

  // 1. Khai báo Mutation Hooks
  const [subscribeChannel, { isLoading: isSubLoading }] = useSubscribeChannelMutation();
  const [unsubscribeChannel, { isLoading: isUnsubLoading }] = useUnsubscribeChannelMutation();

  // 2. Local State để làm Optimistic UI (Hiển thị ngay lập tức không cần chờ API)
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);

  // Đồng bộ state khi props từ cha thay đổi (Rất quan trọng khi chuyển video)
  useEffect(() => {
    setIsSubscribed(initialIsSubscribed);
  }, [initialIsSubscribed]);

  const handleSubscribe = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!isAuthenticated) return alert("Vui lòng đăng nhập để đăng ký kênh!");
    const previousState = isSubscribed;
    const newState = !previousState;
    
    setIsSubscribed(newState); 
    // Báo cho cha biết để tăng/giảm số lượng sub (nếu cha cần hiển thị số)
    if (onToggle) {
        onToggle(newState); 
    }
    try {
      if (!channelId) throw new Error("Thiếu Channel ID");

      if (previousState) {
        await unsubscribeChannel(channelId).unwrap();
      } else {
        await subscribeChannel(channelId).unwrap();
      }
    
    } catch (error) {
      console.error("Lỗi thao tác:", error);
      
      
      setIsSubscribed(previousState);
      if (onToggle) onToggle(previousState);
      
      alert("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  const isLoading = isSubLoading || isUnsubLoading;

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading} 
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