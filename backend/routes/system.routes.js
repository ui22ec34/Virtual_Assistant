// routes/system.routes.js
import express from 'express';
import si from 'systeminformation';

export const getSystemSummary = async () => {
  try {
    const [cpu, mem, osInfo, gpu] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.graphics(),
    ]);

    const summary = `
OS: ${osInfo.distro} ${osInfo.arch}
CPU: ${cpu.manufacturer} ${cpu.brand}
Cores: ${cpu.cores}
RAM: ${(mem.total / 1024 ** 3).toFixed(2)} GB
GPU: ${gpu.controllers[0]?.model || 'Not detected'}
    `.trim();

    return { summary };
  } catch (err) {
    console.error("System Info Error:", err);
    return { summary: "Unable to fetch system configuration." };
  }
};

const router = express.Router();

// Optional API endpoint for direct testing
router.get('/', async (req, res) => {
  const data = await getSystemSummary();
  res.json(data);
});

export default router;
