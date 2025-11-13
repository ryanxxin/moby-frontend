// src/AppRest.jsx - REST API 버전 (5초마다 폴링)
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:8000/api/sensor/latest';
const POLLING_INTERVAL = 5000; // 5초
const MAX_DATA_POINTS = 20; // 차트에 표시할 최대 데이터 포인트 수

function AppRest() {
  const [sensorData, setSensorData] = useState(null);
  const [history, setHistory] = useState({
    timestamps: [],
    vibrationX: [],
    vibrationY: [],
    vibrationZ: [],
    magnitude: [],
    temperature: [],
    rpm: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // API에서 데이터 가져오기
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('수신된 데이터:', data);
      
      // "No data available yet" 메시지 체크
      if (data.message) {
        setError(data.message);
        setLoading(false);
        return;
      }
      
      setSensorData(data);
      setError(null);
      setLoading(false);
      setLastUpdate(new Date());

      // 히스토리 업데이트 (최근 MAX_DATA_POINTS개만 유지)
      setHistory(prev => {
        const timestamp = new Date(data.timestamp).toLocaleTimeString();
        
        return {
          timestamps: [...prev.timestamps, timestamp].slice(-MAX_DATA_POINTS),
          vibrationX: [...prev.vibrationX, data.vibration.x].slice(-MAX_DATA_POINTS),
          vibrationY: [...prev.vibrationY, data.vibration.y].slice(-MAX_DATA_POINTS),
          vibrationZ: [...prev.vibrationZ, data.vibration.z].slice(-MAX_DATA_POINTS),
          magnitude: [...prev.magnitude, data.vibration.magnitude].slice(-MAX_DATA_POINTS),
          temperature: [...prev.temperature, data.temperature].slice(-MAX_DATA_POINTS),
          rpm: [...prev.rpm, data.rpm].slice(-MAX_DATA_POINTS)
        };
      });
    } catch (err) {
      console.error('데이터 페칭 오류:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 호출 및 주기적 갱신
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLLING_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);

  // 진동 차트 데이터
  const vibrationChartData = {
    labels: history.timestamps,
    datasets: [
      {
        label: 'X축',
        data: history.vibrationX,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4
      },
      {
        label: 'Y축',
        data: history.vibrationY,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4
      },
      {
        label: 'Z축',
        data: history.vibrationZ,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      },
      {
        label: 'Magnitude',
        data: history.magnitude,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  // 온도 차트 데이터
  const temperatureChartData = {
    labels: history.timestamps,
    datasets: [
      {
        label: '온도 (°C)',
        data: history.temperature,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4
      }
    ]
  };

  // RPM 차트 데이터
  const rpmChartData = {
    labels: history.timestamps,
    datasets: [
      {
        label: 'RPM',
        data: history.rpm,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '시간'
        }
      },
      y: {
        title: {
          display: true,
          text: '값'
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>⚙️ 실시간 예지보전 모니터링 시스템 (REST API)</h1>
        <div className="connection-status">
          <span>
            {loading ? '데이터 로딩 중...' : error ? `오류: ${error}` : '데이터 수신 중 ✅'}
          </span>
          {lastUpdate && (
            <span className="last-update"> (마지막 업데이트: {lastUpdate.toLocaleTimeString()})</span>
          )}
        </div>
      </header>

      {loading ? (
        <div className="loading-container">
          <p>초기 데이터 로딩 중...</p>
        </div>
      ) : error && !sensorData ? (
        <div className="loading-container">
          <p>데이터를 가져올 수 없습니다.</p>
          <p className="help-text">
            오류: {error}
            <br />
            라즈베리 파이에서 데이터를 전송 중인지 확인하세요.
            <br />
            (rpi_sensor.py와 FastAPI 서버 실행 여부 확인)
          </p>
        </div>
      ) : sensorData ? (
        <>
          <div className="current-data">
            <h2>현재 센서 값</h2>
            <div className="data-grid">
              <div className="data-card">
                <h3>진동 X</h3>
                <p className="data-value">{sensorData.vibration.x} m/s²</p>
              </div>
              <div className="data-card">
                <h3>진동 Y</h3>
                <p className="data-value">{sensorData.vibration.y} m/s²</p>
              </div>
              <div className="data-card">
                <h3>진동 Z</h3>
                <p className="data-value">{sensorData.vibration.z} m/s²</p>
              </div>
              <div className="data-card highlight">
                <h3>Magnitude</h3>
                <p className="data-value">{sensorData.vibration.magnitude} m/s²</p>
              </div>
              <div className="data-card">
                <h3>온도</h3>
                <p className="data-value">{sensorData.temperature} °C</p>
              </div>
              <div className="data-card">
                <h3>RPM</h3>
                <p className="data-value">{sensorData.rpm}</p>
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-wrapper">
              <h2>진동 센서 데이터 (최근 {MAX_DATA_POINTS}개)</h2>
              <div className="chart">
                <Line data={vibrationChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-wrapper">
              <h2>온도 (최근 {MAX_DATA_POINTS}개)</h2>
              <div className="chart">
                <Line data={temperatureChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-wrapper">
              <h2>RPM (최근 {MAX_DATA_POINTS}개)</h2>
              <div className="chart">
                <Line data={rpmChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="device-info">
            <p>장치 ID: {sensorData.device_id}</p>
            <p>센서 타입: {sensorData.sensor_type}</p>
            <p>마지막 업데이트: {new Date(sensorData.timestamp).toLocaleString()}</p>
            <p className="polling-info">🔄 자동 갱신: {POLLING_INTERVAL / 1000}초마다</p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default AppRest;