import React, { useEffect, useState } from "react";

function SystemConfig() {
  const [systemInfo, setSystemInfo] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/system")
      .then((res) => res.json())
      .then((data) => setSystemInfo(data))
      .catch((err) => console.error("Error fetching system info:", err));
  }, []);

  if (!systemInfo) return <div>Loading system configuration...</div>;

  const { cpu, mem, osInfo, gpu } = systemInfo;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md w-fit">
      <h2 className="text-2xl font-bold mb-4">System Configuration</h2>
      <p><strong>OS:</strong> {osInfo.distro} {osInfo.arch}</p>
      <p><strong>CPU:</strong> {cpu.manufacturer} {cpu.brand}</p>
      <p><strong>Cores:</strong> {cpu.cores}</p>
      <p><strong>RAM:</strong> {(mem.total / (1024 ** 3)).toFixed(2)} GB</p>
      <p><strong>GPU:</strong> {gpu.controllers[0]?.model}</p>
    </div>
  );
}

export default SystemConfig;
