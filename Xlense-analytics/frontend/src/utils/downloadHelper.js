import axios from '../api/config';

export async function downloadFileById(fileId) {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/files/${fileId}/download`, {
    responseType: 'blob',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Try to infer filename from content-disposition; fallback to generic
  const disposition = response.headers['content-disposition'] || '';
  const fileNameMatch = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/);
  const fileName = decodeURIComponent((fileNameMatch && (fileNameMatch[1] || fileNameMatch[2])) || 'downloaded-file');
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}


