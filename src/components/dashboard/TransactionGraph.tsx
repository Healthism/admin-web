import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionGraphData } from '../../redux/sagas/transactions/transactionsSagaAction';

Chart.register(...registerables);

type TimeFrame = 'daily' | 'monthly' | 'yearly';

interface ChartData {
  labels: string[];
  data: number[];
  backgroundColor: string[];
}

interface ChartDataMap {
  daily: ChartData;
  monthly: ChartData;
  yearly: ChartData;
}

const TransactionGraph = () => {
  const dispatch = useDispatch();
  const transactionsGraph = useSelector((state: any) => state.transactions.transactionsGraph);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);


  useEffect(() => {   
    dispatch(getTransactionGraphData({ type: timeFrame }));
  }, [timeFrame, dispatch]);



  // Generate background colors based on data length
  const generateBackgroundColors = (length: number): string[] => {
    const baseColors = [
      'rgba(239, 68, 68, 0.8)',
      'rgba(249, 115, 22, 0.8)',
      'rgba(251, 146, 60, 0.8)',
      'rgba(234, 88, 12, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(252, 211, 77, 0.8)',
      'rgba(251, 191, 36, 0.8)',
      'rgba(253, 224, 71, 0.8)',
    ];
    
    const colors: string[] = [];
    for (let i = 0; i < length; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  // Process API data into chart format
  const getChartData = (): ChartData => {
    // Check if API data exists and is an array
    if (transactionsGraph && Array.isArray(transactionsGraph) && transactionsGraph.length > 0) {
      const labels = transactionsGraph.map((item: any) => item.label || '');
      const data = transactionsGraph.map((item: any) => item.amount || 0);
      const backgroundColor = generateBackgroundColors(data.length);
      
      return {
        labels,
        data,
        backgroundColor
      };
    }
    
    return { labels: [], data: [], backgroundColor: [] };
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Destroy existing chart instance
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Get current chart data (API or default)
      const currentChartData = getChartData();

      // Create new chart
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: currentChartData.labels,
            datasets: [{
              label: 'Transactions',
              data: currentChartData.data,
              backgroundColor: currentChartData.backgroundColor,
              borderRadius: 4,
              barThickness: 40,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                  size: 14
                },
                bodyFont: {
                  size: 13
                },
                callbacks: {
                  label: function(context: any) {
                    return `Amount: ₹${context.parsed.y.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 12
                  },
                  callback: function(value: any) {
                    return '₹' + value.toLocaleString();
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                ticks: {
                  font: {
                    size: 12
                  }
                },
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [timeFrame, transactionsGraph]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      flex: 1,
      minHeight: '400px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          Transaction
        </h3>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
          style={{
            padding: '8px 32px 8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            color: '#374151',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '20px'
          }}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div style={{ height: '350px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default TransactionGraph;