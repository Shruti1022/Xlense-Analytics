const File = require('../models/FileModel');
const Chart = require('../models/ChartModel');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const generateCharts = async (req, res) => {
  try {
    const { id } = req.params;
    const { xAxis, yAxis, zAxis, chartType } = req.body;
    
    // Find the uploaded file
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read and parse Excel file
    const filePath = path.join(__dirname, '../uploads', file.filename);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Extract data for selected axes
    const categories = jsonData.map(row => row[xAxis]);
    const seriesData = jsonData.map(row => row[yAxis]);
    const zData = zAxis ? jsonData.map(row => row[zAxis]) : null;

    res.json({
      success: true,
      data: {
        categories,
        seriesData,
        zData,
        chartType,
        xAxis,
        yAxis,
        zAxis,
        fileName: file.originalName
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const mapData = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the uploaded file
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read and parse Excel file to get columns
    const filePath = path.join(__dirname, '../uploads', file.filename);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Get available columns
    const columns = Object.keys(jsonData[0] || {});

    res.json({
      success: true,
      columns,
      fileName: file.originalName,
      fileId: id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getChartHistory = async (req, res) => {
  try {
    console.log('Fetching chart history for user:', req.user._id);

    const {
      page = 1,
      limit = 10,
      chartType,
      is3D,
      dateFrom,
      dateTo,
      fileName
    } = req.query;

    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const filter = { user: req.user._id };

    if (chartType) {
      filter.chartType = chartType;
    }

    if (typeof is3D !== 'undefined' && is3D !== '') {
      // Accept 'true'/'false' or boolean
      const is3DBool = String(is3D).toLowerCase() === 'true';
      filter.is3D = is3DBool;
    }

    if (fileName && fileName.trim().length > 0) {
      filter.fileName = { $regex: fileName.trim(), $options: 'i' };
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (!isNaN(from.getTime())) filter.createdAt.$gte = from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        if (!isNaN(to.getTime())) filter.createdAt.$lte = to;
      }
    }

    const totalItems = await Chart.countDocuments(filter);

    const charts = await Chart.find(filter)
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit)
      .populate('fileId', 'originalName size');

    const totalPages = Math.max(Math.ceil(totalItems / numericLimit), 1);

    res.json({
      success: true,
      data: charts,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        totalPages,
        totalItems
      }
    });
  } catch (error) {
    console.error('Error in getChartHistory:', error);
    res.status(400).json({ message: error.message });
  }
};

const saveChart = async (req, res) => {
  try {
    console.log('Save chart request received:', req.body);
    const { fileName, fileId, chartType, xAxis, yAxis, zAxis, is3D } = req.body;
    
    // Save chart to history
    const chart = new Chart({
      fileName,
      fileId,
      user: req.user._id,
      chartType,
      xAxis,
      yAxis,
      zAxis,
      is3D
    });

    const savedChart = await chart.save();
    console.log('Chart saved successfully:', savedChart._id);
    
    res.json({
      success: true,
      message: 'Chart saved to history successfully',
      chartId: savedChart._id
    });
  } catch (error) {
    console.error('Error saving chart:', error);
    res.status(400).json({ message: error.message });
  }
};
const deleteChart = async (req, res) => {
  try {
    const chart = await Chart.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id // ensures user can only delete their own charts
    });

    if (!chart) {
      return res.status(404).json({ message: "Chart not found" });
    }

    res.json({ message: "Chart deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  generateCharts,
  mapData,
  getChartHistory,
  saveChart,
  deleteChart 
};


