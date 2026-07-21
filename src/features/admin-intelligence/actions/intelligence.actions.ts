'use server'

import { createClient } from '@/lib/supabase/server';
import { IntelligenceRepository } from '../repositories/intelligence.repository';
import { IntelligenceService } from '../services/intelligence.service';
import { ReportRepository } from '../repositories/report.repository';
import { ReportGenerationService } from '../services/report.service';
import { SystemHealthRepository } from '../repositories/system-health.repository';
import { SystemHealthService } from '../services/system-health.service';

// Service Locator Pattern
async function getServices() {
  const supabase = await createClient();
  const intelligenceRepo = new IntelligenceRepository(supabase);
  const intelligenceService = new IntelligenceService(intelligenceRepo);
  const reportRepo = new ReportRepository(supabase);
  const reportService = new ReportGenerationService(reportRepo);
  const healthRepo = new SystemHealthRepository(supabase);
  const healthService = new SystemHealthService(healthRepo);
  
  return { supabase, intelligenceService, reportService, healthService };
}

export async function getPlatformOverviewAction() {
  try {
    const { intelligenceService } = await getServices();
    const data = await intelligenceService.getPlatformOverview();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserGrowthAction(days: number = 30) {
  try {
    const { intelligenceService } = await getServices();
    const data = await intelligenceService.getUserGrowthTrend(days);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getDonationTrendsAction() {
  try {
    const { intelligenceService } = await getServices();
    const data = await intelligenceService.getDonationTrends();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getDashboardsAction() {
  try {
    const { intelligenceService } = await getServices();
    const { data } = await intelligenceService.getDashboards();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getDashboardWidgetsAction(dashboardId: string) {
  try {
    const { intelligenceService } = await getServices();
    const { data } = await intelligenceService.getDashboardWidgets(dashboardId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function generateReportAction(name: string, format: 'csv' | 'pdf' | 'excel', parameters: any) {
  try {
    const { supabase, reportService } = await getServices();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');
    
    // Assumes profile mapping to user ID
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
    
    const data = await reportService.generateReport(name, format, parameters, (profile as any).id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReportsAction() {
  try {
    const { reportService } = await getServices();
    const data = await reportService.getReports();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSystemHealthAction() {
  try {
    const { healthService } = await getServices();
    const data = await healthService.getDashboardHealthSummary();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAuditEventsAction(limit: number = 100) {
  try {
    const { healthService } = await getServices();
    const data = await healthService.getRecentAuditEvents(limit);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
