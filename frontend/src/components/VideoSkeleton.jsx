export function VideoSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Khung chữ nhật cho Thumbnail Video */}
      <div className={`w-full aspect-video bg-gray-300 rounded-lg`} />

      {/* Phần thông tin bên dưới (Avatar và Text) */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {/* Avatar (hình tròn) */}
        <div
          className={`w-10 h-10 rounded-full bg-gray-300 flex-shrink-0`}
        />

        {/* Các dòng text (Tiêu đề và kênh) */}
        <div className="items-center justify-center flex-grow pt-1 space-y-2">
          {/* Dòng tiêu đề (dài) */}
          <div className={`h-4 bg-gray-300 rounded w-full`} />
          {/* Dòng kênh (ngắn hơn) */}
          <div className={`h-4 bg-gray-300 rounded w-3/4 mt-4`} />
        </div>
      </div>
    </div>
  );
}

export function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <VideoSkeleton key={i} />
      ))}
    </div>
  );
}
