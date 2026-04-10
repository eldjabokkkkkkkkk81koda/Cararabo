import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

interface Student {
  id: string;
  name: string;
  email: string;
  timestamp: string;
}

// In-memory database
let students: Student[] = [];
let clients: express.Response[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to handle new logins
  app.post("/api/login", (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const newStudent: Student = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      timestamp: new Date().toISOString()
    };
    
    // Add to the top of the list
    students.unshift(newStudent);
    
    // Notify all connected TV clients via Server-Sent Events
    clients.forEach(client => {
      client.write(`data: ${JSON.stringify(students)}\n\n`);
    });
    
    res.json({ success: true, student: newStudent });
  });

  // API Route for the TV to subscribe to real-time updates (SSE)
  app.get("/api/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send the current list immediately upon connection
    res.write(`data: ${JSON.stringify(students)}\n\n`);

    // Add this client to our list of active connections
    clients.push(res);

    // Remove client when they disconnect
    req.on("close", () => {
      clients = clients.filter(client => client !== res);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
