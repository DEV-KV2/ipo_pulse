"use client";

import { createChart, ColorType, IChartApi, CrosshairMode, CandlestickSeries, HistogramSeries, UTCTimestamp } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

// Generate realistic looking OHLC data
function generateData() {
  const data = [];
  let time = Math.floor(Date.now() / 1000) - 86400 * 30; // 30 days ago
  let close = 24000;

  for (let i = 0; i < 300; i++) {
    time += 3600; // hourly
    const open = close + (Math.random() - 0.5) * 50;
    const high = Math.max(open, close) + Math.random() * 50;
    const low = Math.min(open, close) - Math.random() * 50;
    close = open + (Math.random() - 0.5) * 100;
    
    // add some trend
    close += 5;

    data.push({ time: time as UTCTimestamp, open, high, low, close });
  }
  return data;
}

export function TradingChart({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0e1117' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#1f222d', style: 1 },
        horzLines: { color: '#1f222d', style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { width: 1, color: '#758696', style: 3 },
        horzLine: { width: 1, color: '#758696', style: 3 },
      },
      rightPriceScale: {
        borderColor: '#2b2b43',
        autoScale: true,
      },
      timeScale: {
        borderColor: '#2b2b43',
        timeVisible: true,
        secondsVisible: false,
      },
      autoSize: true,
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeries.setData(generateData());
    
    // Add volume
    const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: '', // set as an overlay
    });
    
    volumeSeries.priceScale().applyOptions({
        scaleMargins: {
            top: 0.8, // highest point of the series will be at 80% from the top
            bottom: 0,
        },
    });

    const volumeData = generateData().map(d => ({
        time: d.time,
        value: Math.random() * 10000 + 5000,
        color: d.close >= d.open ? '#26a69a80' : '#ef535080'
    }));
    
    volumeSeries.setData(volumeData);

    return () => {
      chart.remove();
    };
  }, [symbol]);

  return (
    <div className="absolute inset-0 p-1">
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
