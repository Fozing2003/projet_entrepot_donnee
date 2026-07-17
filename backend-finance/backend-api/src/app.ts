import express from "express";
import cors from "cors";
import queryRoutes from "./routes/query.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    status: "OK",
    service: "Finance BI Backend"
  });
});

app.use("/api/query", queryRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;