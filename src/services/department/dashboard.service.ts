import { AnalyticsService } from "./analytics.service";
import { VerificationService } from "./verification.service";
import { ContentService } from "./content.service";
import { FacultyService } from "./faculty.service";

export class DashboardService {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly verificationService: VerificationService,
    private readonly contentService: ContentService,
    private readonly facultyService: FacultyService
  ) {}

  async getDepartmentDashboard(departmentId: string, slug: string) {
    // Execute independently in parallel for maximum performance
    const [stats, sections, faculty] = await Promise.all([
      this.analyticsService.getDepartmentStats(slug),
      this.contentService.getSectionsByDepartmentSlug(slug),
      this.facultyService.listFaculty(slug)
    ]);

    return {
      statistics: stats,
      recentContent: sections,
      facultyOverview: faculty,
      // In a real scenario, we'd also pull pending verifications from the verificationService
    };
  }
}
