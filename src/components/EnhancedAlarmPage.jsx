// components/EnhancedAlarmPage.jsx
const EnhancedAlarmPage = () => {
    return (
      <div className="alarm-page">
        {/* 필터 & 검색 */}
        <AlarmFilters 
          onFilterChange={handleFilter}
          filters={{
            severity: ['critical', 'warning', 'info'],
            equipment: equipmentList,
            dateRange: [startDate, endDate],
            status: ['resolved', 'pending', 'acknowledged']
          }}
        />
  
        {/* 타임라인 뷰 */}
        <AlarmTimeline 
          alerts={filteredAlerts}
          groupBy="equipment"
          showAIAnalysis={true}
        />
  
        {/* 통계 대시보드 */}
        <AlarmStatistics 
          metrics={{
            totalAlerts: stats.total,
            avgResponseTime: stats.avgResponse,
            resolutionRate: stats.resolved / stats.total
          }}
        />
      </div>
    );
  };