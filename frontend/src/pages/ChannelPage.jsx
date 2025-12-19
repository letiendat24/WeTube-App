import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import SubscribeButton from '@/components/SubscribeButton'; 
import axiosClient from '@/api/axiosClient';
import channelApi from "@/api/channelApi"; // Import channelApi để dùng hàm getMySubscriptions giống WatchPage
import { useAuth } from "@/context/AuthContext"; 

const ChannelPage = () => {
    const { channelId } = useParams();
    const { user: currentUser, isAuthenticated } = useAuth();

    const [channelData, setChannelData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State trạng thái Sub (Giống WatchPage)
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchChannelAndVideos = async () => {
            try {
                setLoading(true);
                setError(null);

                // --- 1. LẤY THÔNG TIN KÊNH ---
                const response = await axiosClient.get(`/channels/${channelId}`);
                const dataRaw = response.data || response; 
                const channel = dataRaw.data || dataRaw.channel || dataRaw;

                setChannelData({
                    _id: channel._id || channelId,
                    name: channel.channelName || channel.name || 'Kênh YouTube',
                    handle: channel.handle || `@channel${channelId.slice(-6)}`,
                    banner: channel.bannerUrl || channel.banner,
                    subscribers: channel.subscribersCount || channel.subscribers || 0,
                    description: channel.description || '',
                    verified: channel.verified === true,
                    avatarUrl: channel.avatarUrl
                });

                // --- 2. QUAN TRỌNG: KIỂM TRA SUB (LOGIC TỪ WATCHPAGE) ---
                // Chỉ kiểm tra khi đã đăng nhập
                if (isAuthenticated) {
                    await checkUserInteractions(channel._id || channelId);
                } else {
                    setIsSubscribed(false);
                }

                // --- 3. LẤY VIDEO ---
                let videoList = [];
                try {
                    const vidRes = await axiosClient.get(`/videos`, {
                        params: { channelId: channelId, limit: 50 }
                    });
                    const vidData = vidRes.data || vidRes;
                    videoList = vidData.data || vidData.videos || vidData || [];
                } catch (err) {
                    // Fallback
                    try {
                        const altRes = await axiosClient.get(`/channels/${channelId}/videos`);
                        const altData = altRes.data || altRes;
                        videoList = altData.videos || altData.data || [];
                    } catch (e) {}
                }

                const enrichedVideos = videoList.map(video => ({
                    ...video,
                    channelInfo: {
                        _id: channelId,
                        channelName: channel.channelName || channel.name || 'Kênh YouTube',
                        avatarUrl: channel.avatarUrl || null
                    }
                }));

                setVideos(enrichedVideos);
            } catch (err) {
                console.error("Lỗi tải trang kênh:", err);
                setError("Không thể tải thông tin kênh hoặc kênh không tồn tại.");
            } finally {
                setLoading(false);
            }
        };

        if (channelId) fetchChannelAndVideos();
    }, [channelId, isAuthenticated]);

    // --- HÀM CHECK SUB (COPY TỪ WATCHPAGE SANG) ---
    const checkUserInteractions = async (targetChannelId) => {
        try {
            // Gọi API lấy danh sách đã đăng ký
            const subRes = await channelApi.getMySubscriptions();
            const mySubs = Array.isArray(subRes) ? subRes : (subRes.data || []);
            
            // So sánh ID chuẩn xác (xử lý cả objectId và string)
            const isSub = mySubs.some((sub) => {
                const subId = sub.channelId?._id || sub.channelId?.id || sub._id;
                return subId?.toString() === targetChannelId?.toString();
            });
            
            console.log("ChannelPage Check Sub:", isSub); // Log để debug
            setIsSubscribed(isSub);
        } catch (error) {
            console.warn("Lỗi kiểm tra tương tác:", error);
        }
    };

    // Callback cập nhật UI khi bấm nút (Optimistic Update)
    const handleSubToggle = (newStatus) => {
        setIsSubscribed(newStatus);
        setChannelData(prev => ({
            ...prev,
            subscribers: newStatus ? (prev.subscribers + 1) : (prev.subscribers - 1)
        }));
    };

    // Helper Components
    const formatNumber = (n) => {
        if (!n) return '0';
        if (n >= 1e9) return (n / 1e9).toFixed(1) + ' tỷ';
        if (n >= 1e6) return (n / 1e6).toFixed(1) + ' triệu';
        if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
        return n.toString();
    };

    const LetterAvatar = ({ name, large = false }) => {
        const initials = name ? name.trim().charAt(0).toUpperCase() : 'K';
        return (
            <div className={`${large ? 'w-32 h-32 md:w-40 md:h-40 text-6xl md:text-8xl border-4' : 'w-9 h-9 text-sm'} rounded-full bg-gray-500 flex items-center justify-center text-white font-bold shadow-2xl border-white`}>
                {initials}
            </div>
        );
    };

    // --- RENDER ---
    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-black rounded-full"></div></div>;
    if (error) return <div className="min-h-screen flex justify-center items-center text-red-600 font-bold">{error}</div>;

    // Logic kiểm tra chủ kênh
    const currentUserId = currentUser?._id || currentUser?.id;
    const isOwner = currentUserId && channelData._id && (currentUserId.toString() === channelData._id.toString());

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Banner */}
            <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-gray-300">
                {channelData.banner ? (
                    <img src={channelData.banner} alt="banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-400" />
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Kênh */}
                <div className="relative -mt-16 md:-mt-20 flex flex-col md:flex-row gap-8 pb-8">
                    <div className="flex items-end gap-6">
                        {channelData.avatarUrl ? (
                            <img 
                                src={channelData.avatarUrl} 
                                alt={channelData.name}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-2xl border-white border-4 bg-white"
                            />
                        ) : (
                            <LetterAvatar name={channelData.name} large />
                        )}

                        <div className="pb-3">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-5xl font-bold">{channelData.name}</h1>
                                {channelData.verified && <CheckCircle size={28} className="text-blue-600" />}
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <p className="text-gray-600 text-sm md:text-base">
                                    {channelData.handle} · {formatNumber(channelData.subscribers)} người đăng ký · {videos.length} video
                                </p>

                                {/* SỬ DỤNG COMPONENT NÚT ĐĂNG KÝ */}
                                {!isOwner && (
                                    <SubscribeButton 
                                        channelId={channelData._id}
                                        initialIsSubscribed={isSubscribed} // Truyền state chuẩn từ hàm checkUserInteractions
                                        onToggle={handleSubToggle}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-300 mb-10">
                    <button className="py-4 px-2 border-b-4 border-blue-600 text-blue-600 font-medium">
                        VIDEO
                    </button>
                </div>

                {/* Mô tả & Video Grid */}
                {channelData.description && (
                    <div className="max-w-4xl mb-10">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                            {channelData.description}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 p-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
                    {videos.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500">Chưa có video nào.</div>
                    ) : (
                        videos.map((video) => (
                            <VideoCard key={video._id} video={video} variant="grid" />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChannelPage;