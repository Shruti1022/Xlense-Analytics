// src/pages/History.jsx
"use client";

import React, { useEffect, useState } from "react";
import {
  IconFileSpreadsheet,
  IconChartLine,
  IconArrowLeft,
  IconEye,
  IconDownload,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import axios from '../api/config';
import { downloadFileById } from '../utils/downloadHelper';

export default function History() {
  const navigate = useNavigate();
  const [chartHistory, setChartHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartHistory = async () => {
      try {
        console.log('Fetching chart history...');
        const response = await axios.get('/analysis/chart-history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Chart history response:', response.data);
        setChartHistory(response.data.data);
      } catch (error) {
        console.error('Error fetching chart history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartHistory();
  }, []);

  const handleViewChart = (chart) => {
    navigate("/charts", {
      state: {
        fileName: chart.fileName,
        fileId: chart.fileId._id,
        xAxis: chart.xAxis,
        yAxis: chart.yAxis,
        zAxis: chart.zAxis,
        chartType: chart.chartType,
        is3D: chart.is3D
      }
    });
  };

  const handleDownload = async (chart) => {
    try {
      await downloadFileById(chart.fileId._id);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 text-white">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition"
        >
          <IconArrowLeft size={18} />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-purple-400 mb-6">
          Chart History
        </h1>

        {chartHistory.length === 0 ? (
          <p className="text-neutral-400 italic">
            No charts generated yet... Time to create some amazing visualizations! 📊
          </p>
        ) : (
          <div className="space-y-4">
            {chartHistory.map((chart) => (
              <div
                key={chart._id}
                className="flex items-center justify-between bg-[#1a1a1a] border border-neutral-800 rounded-lg px-6 py-4 shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-700 p-2 rounded-full">
                    <IconChartLine size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{chart.fileName}</p>
                    <p className="text-sm text-neutral-400">
                      {formatDate(chart.createdAt)} • {chart.chartType.toUpperCase()}
                    </p>
                    <p className="text-xs text-purple-300">
                      {chart.xAxis} vs {chart.yAxis} {chart.zAxis && `vs ${chart.zAxis}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-cyan-300 mb-1">
                    {chart.is3D ? '3D Chart' : '2D Chart'}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleDownload(chart)}
                      className="bg-neutral-700 hover:bg-neutral-600 text-sm px-3 py-1 rounded shadow flex items-center gap-2"
                    >
                      <IconDownload size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => handleViewChart(chart)}
                      className="bg-purple-600 hover:bg-purple-700 text-sm px-3 py-1 rounded shadow flex items-center gap-2"
                    >
                      <IconEye size={16} />
                      View Chart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
