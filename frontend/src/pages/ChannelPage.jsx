// src/pages/ChannelPage.jsx – ĐÃ TỐI ƯU VỚI VideoCard + GIỮ NGUYÊN GIAO DIỆN ĐẸP
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Bell } from 'lucide-react';
import VideoCard from '@/components/VideoCard'; // Đường dẫn đúng của bạn

const ChannelPage = () => {
    const { channelId } = useParams();
    const [channelData, setChannelData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showMoreDesc, setShowMoreDesc] = useState(false);

    useEffect(() => {
        const fetchChannelAndVideos = async () => {
            try {
                setLoading(true);
                setError(null);

                const channelRes = await fetch(`http://localhost:3000/api/channels/${channelId}`);
                if (!channelRes.ok) throw new Error('Không tìm thấy kênh');

                const channelJson = await channelRes.json();
                const channel = channelJson.data || channelJson.channel || channelJson;

                setChannelData({
                    name: channel.channelName || channel.name || 'Kênh YouTube',
                    handle: channel.handle || `@channel${channelId.slice(-6)}`,
                    banner: channel.bannerUrl || channel.banner,
                    subscribers: channel.subscribersCount || channel.subscribers || 0,
                    description: channel.description || '',
                    verified: channel.verified === true,
                });

                let videoList = [];
                try {
                    const videosRes = await fetch(`http://localhost:3000/api/videos?channelId=${channelId}&limit=50`);
                    if (videosRes.ok) {
                        const videosJson = await videosRes.json();
                        videoList = videosJson.data || videosJson.videos || videosJson || [];
                    }
                } catch (err) { }

                if (videoList.length === 0) {
                    try {
                        const altRes = await fetch(`http://localhost:3000/api/channels/${channelId}/videos`);
                        if (altRes.ok) {
                            const altJson = await altRes.json();
                            videoList = altJson.videos || altJson.data || altJson || [];
                        }
                    } catch (err) { }
                }

                // QUAN TRỌNG: Đảm bảo mỗi video có channelInfo để VideoCard hoạt động đúng
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
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (channelId) fetchChannelAndVideos();
    }, [channelId]);

    const formatNumber = (n) => {
        if (!n) return '0';
        if (n >= 1e9) return (n / 1e9).toFixed(1) + ' tỷ';
        if (n >= 1e6) return (n / 1e6).toFixed(1) + ' triệu';
        if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
        return n.toString();
    };

    // Avatar chữ cái đầu + xám đậm
    const LetterAvatar = ({ name, large = false }) => {
        const initials = name ? name.trim().charAt(0).toUpperCase() : 'K';
        if (large) {
            return (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 flex items-center justify-center text-black text-6xl md:text-8xl shadow-2xl border-white border-4">
                    {initials}
                </div>
            );
        }
        return (
            <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                {initials}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-min bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-800 text-lg">Đang tải kênh...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-min bg-white flex items-center justify-center text-center px-4">
                <p className="text-2xl font-bold text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-min bg-white text-gray-900">
            {/* Banner xám basic */}
            <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-gray-300">
                {channelData.banner ? (
                    <img src={channelData.banner} alt="banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-white via-gray-300 to-gray-400" />
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Thông tin kênh */}
                <div className="relative -mt-16 md:-mt-20 flex flex-col md:flex-row gap-8 pb-8">
                    <div className="flex items-end gap-6">
                        <LetterAvatar name={channelData.name} large />

                        <div className="pb-3">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-5xl font-bold">{channelData.name}</h1>
                                {channelData.verified && <CheckCircle size={28} className="text-blue-600" />}
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <p className="text-gray-600 text-sm md:text-base">
                                    {channelData.handle} · {formatNumber(channelData.subscribers)} người đăng ký · {videos.length} video
                                </p>

                                <button
                                    onClick={() => setIsSubscribed(!isSubscribed)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${isSubscribed
                                        ? 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                        }`}
                                >
                                    {isSubscribed ? (
                                        <>
                                            <Bell size={18} />
                                            Đã đăng ký
                                        </>
                                    ) : (
                                        'Đăng ký'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab VIDEO */}
                <div className="border-b border-gray-300 mb-10">
                    <button className="py-4 px-2 border-b-4 border-blue-600 text-blue-600 font-medium">
                        VIDEO
                    </button>
                </div>

                {/* Mô tả */}
                {channelData.description && (
                    <div className="max-w-4xl mb-10">
                        <p className={`text-sm text-gray-700 leading-relaxed ${!showMoreDesc ? 'line-clamp-3' : ''}`}>
                            {channelData.description}
                        </p>
                        {channelData.description.length > 200 && (
                            <button
                                onClick={() => setShowMoreDesc(!showMoreDesc)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2"
                            >
                                {showMoreDesc ? 'Ẩn bớt' : 'Xem thêm'}
                            </button>
                        )}
                    </div>
                )}

                {/* DANH SÁCH VIDEO – DÙNG VideoCard CHUẨN 100% */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                    {videos.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500 text-lg">
                            Chưa có video nào được đăng tải.
                        </div>
                    ) : (
                        videos.map((video) => (
                            <VideoCard
                                key={video._id}
                                video={video}
                                variant="grid" // Dùng kiểu grid đẹp nhất
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChannelPage;