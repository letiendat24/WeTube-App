

import requests
import time
import threading
from concurrent.futures import ThreadPoolExecutor
import matplotlib.pyplot as plt
from datetime import datetime

BASE_URL = "http://localhost:3000/api"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTI5ZGI4NWRmOWUwYzliYzFkOGVmZjciLCJpYXQiOjE3NjUzNTMyMDYsImV4cCI6MTc2NTk1ODAwNn0.mxHSPKm8h41wQMW-gnpozctaa11OESuqmCLk11qbrLk"  # Thay bằng token thật từ /auth/login
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

# DANH SÁCH API
ENDPOINTS = {
    "Đăng nhập":                    ("POST", "/auth/login", {"email": "theduyethoang0105@gmail.com","password": "Duyet123456"}),
    "Lấy video ngẫu nhiên":         ("GET",  "/videos/random"),
    "Lấy video thịnh hành":         ("GET",  "/videos/trending"),
    "Tìm kiếm video":               ("GET",  "/videos/search?q=test"),
    "Xem chi tiết video":           ("GET",  "/videos/6938f89b0a0ffc6adf6d93fd"),  
    "Lấy danh sách video Studio":   ("GET",  "/videos/studio"),
    "Lấy thống kê Studio":          ("GET",  "/stats/dashboard"),
    "Lấy lịch sử xem":              ("GET",  "/history"),
    "Lấy kênh công khai":           ("GET",  "/channels/6929db85df9e0c9bc1d8eff7"),
}

results = []

def make_request(method, endpoint, data=None, params=None):
    url = BASE_URL + endpoint
    start = time.time()
    try:
        if method == "GET":
            resp = requests.get(url, headers=HEADERS, params=params, timeout=10)
        else:
            resp = requests.post(url, headers=HEADERS, json=data, timeout=10)
        latency = (time.time() - start) * 1000
        return {"name": endpoint.split('/')[-1], "latency": latency, "status": resp.status_code}
    except Exception as e:
        latency = (time.time() - start) * 1000
        return {"name": endpoint.split('/')[-1], "latency": latency, "status": "ERROR", "error": str(e)}

def stress_test(name, method, endpoint, data=None, params=None, requests_count=100):
    print(f"Đang kiểm thử {requests_count} request → {name}...")
    latencies = []
    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = [executor.submit(make_request, method, endpoint, data, params) for _ in range(requests_count)]
        for f in futures:
            r = f.result()
            latencies.append(r["latency"])
            print(f"   → {r['status']} | {r['latency']:.2f}ms")
    
    avg = sum(latencies) / len(latencies)
    max_lat = max(latencies)
    min_lat = min(latencies)
    success_rate = len([x for x in latencies if x < 5000]) / requests_count * 100
    
    results.append({
        "API": name,
        "Request": requests_count,
        "TB (ms)": round(avg, 2),
        "Max (ms)": round(max_lat, 2),
        "Min (ms)": round(min_lat, 2),
        "Thành công": f"{success_rate:.1f}%"
    })
    print(f"Hoàn thành {name}: {avg:.2f}ms trung bình\n")

# CHẠY KIỂM THỬ
if __name__ == "__main__":
    print("BẮT ĐẦU KIỂM THỬ HIỆU NĂNG HỆ THỐNG WETUBE")
    print(f"Thời gian: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
    
    for name, (method, endpoint, *extra) in ENDPOINTS.items():
        data = extra[0] if len(extra) > 0 and method == "POST" else None
        params = extra[0] if len(extra) > 0 and method == "GET" and isinstance(extra[0], dict) else None
        stress_test(name, method, endpoint, data, params, requests_count=100)
    
    # In bảng kết quả
    print("\n" + "="*90)
    print("KẾT QUẢ KIỂM THỬ HIỆU NĂNG")
    print("="*90)
    print(f"{'API':<30} {'Request':<8} {'TB (ms)':<10} {'Max (ms)':<10} {'Min (ms)':<10} {'Thành công'}")
    print("-"*90)
    for r in results:
        print(f"{r['API']:<30} {r['Request']:<8} {r['TB (ms)']:<10} {r['Max (ms)']:<10} {r['Min (ms)']:<10} {r['Thành công']}")
    
    # Vẽ biểu đồ
    apis = [r["API"] for r in results]
    avg = [r["TB (ms)"] for r in results]
    plt.figure(figsize=(12, 7))
    bars = plt.bar(apis, avg, color=['#ff0000' if x > 500 else '#00c853' for x in avg])
    plt.title('Hiệu năng các API WeTube (100 request đồng thời)', fontsize=16, fontweight='bold', color='#d32f2f')
    plt.ylabel('Thời gian phản hồi trung bình (ms)')
    plt.xticks(rotation=30, ha='right')
    plt.grid(axis='y', alpha=0.3)
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 15, f'{height}', ha='center', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('wetube_performance_result.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print("\nĐÃ LƯU BIỂU ĐỒ: wetube_performance_result.png")