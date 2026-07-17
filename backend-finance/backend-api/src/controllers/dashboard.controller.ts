import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

const service = new DashboardService();

export async function overview(req: Request, res: Response) {
  try {
    const data = await service.getOverviewData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Erreur serveur" });
  }
}

export async function temporal(req: Request, res: Response) {
  try {
    const data = await service.getTemporalData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Erreur serveur" });
  }
}

export async function geographic(req: Request, res: Response) {
  try {
    const data = await service.getGeographicData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Erreur serveur" });
  }
}

export async function agency(req: Request, res: Response) {
  try {
    const data = await service.getAgencyData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Erreur serveur" });
  }
}

export async function channels(req: Request, res: Response) {
  try {
    const data = await service.getChannelsData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Erreur serveur" });
  }
}

export async function strategy(req: Request, res: Response) {
  try {
    const data = await service.getStrategyData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Erreur serveur" });
  }
}
