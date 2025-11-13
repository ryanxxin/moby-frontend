// components/EnhancedDashboard.jsx
import { useWebSocket } from '../hooks/useWebSocket';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedEquipmentDashboard = () => {
  const { sensorData, alerts } = useWebSocket();
  
  return (
    <div className="dashboard-container">
      {/* 상태별 색상 인디케이터 */}
      <StatusBadge 
        status={getEquipmentStatus(sensorData)}
        pulse={alerts.length > 0}
      />
      
      {/* 실시간 게이지 애니메이션 */}
      <div className="gauges-grid">
        {['temperature', 'humidity', 'vibration', 'noise'].map(metric => (
          <AnimatedGauge
            key={metric}
            value={sensorData[metric]}
            threshold={THRESHOLDS[metric]}
            label={LABELS[metric]}
          />
        ))}
      </div>

      {/* 트렌드 차트 with 이상치 마커 */}
      <TrendChart 
        data={sensorData.history}
        anomalies={sensorData.anomalies}
        selectedMetric={selectedMetric}
      />
      
      {/* 미니 알람 피드 */}
      <AlertFeed alerts={alerts.slice(0, 3)} />
    </div>
  );
};