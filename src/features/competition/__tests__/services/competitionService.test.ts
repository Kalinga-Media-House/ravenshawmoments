import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCompetitionBySlug, getPreviousCompetition, getNextCompetition, getRelatedCompetitions } from '../../services/competitionService';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn(),
  }),
}));

describe('competitionService - Results & Capacity Semantics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries competition_results with result_status = published', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockNeq = vi.fn().mockReturnThis();

    
    // Competitions Mock
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 'comp-1', max_participants: 10, result_date: '2026-07-01T00:00:00Z' },
      error: null,
    });

    const compQueryBuilder = {
      select: mockSelect,
      eq: mockEq,
      neq: mockNeq,
      in: mockEq,
      not: mockEq,
      lte: mockEq,
      or: mockEq,
      single: mockSingle,
    };

    // Results Mock
    const mockLimitResults = vi.fn().mockResolvedValue({
      data: [{ id: 'result-1' }],
      error: null,
    });
    const resultsQueryBuilder = {
      select: mockSelect,
      eq: mockEq,
      limit: mockLimitResults,
    };

    // Registration Mock
    const mockEqReg = vi.fn().mockResolvedValue({
      count: 5,
      error: null,
    });
    const regQueryBuilder = {
      select: mockSelect,
      eq: mockEq,
      in: mockEqReg,
    };

    const { createClient } = await import('@/lib/supabase/server');
    const mockSupabase = await createClient();
    (mockSupabase.from as any).mockImplementation((table: string) => {
      if (table === 'competitions') return compQueryBuilder;
      if (table === 'competition_results') return resultsQueryBuilder;
      if (table === 'competition_registrations') return regQueryBuilder;
      return { select: mockSelect };
    });

    await getCompetitionBySlug('test-comp');

    // Verify Results Query (Auth Published status)
    expect(mockSupabase.from).toHaveBeenCalledWith('competition_results');
    expect(mockEq).toHaveBeenCalledWith('competition_id', 'comp-1');
    expect(mockEq).toHaveBeenCalledWith('result_status', 'published');
    expect(mockLimitResults).toHaveBeenCalledWith(1);

    // Verify Capacity Query (Auth Registration Statuses)
    expect(mockSupabase.from).toHaveBeenCalledWith('competition_registrations');
    expect(mockEq).toHaveBeenCalledWith('competition_id', 'comp-1');
    expect(mockEqReg).toHaveBeenCalledWith('registration_status', ['registered', 'submitted']);
  });
});

describe('competitionService - Previous/Next Navigation Bounding', () => {
  let mockSupabase: any;
  let queryBuilder: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    queryBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: null, error: null }),
    };

    const { createClient } = await import('@/lib/supabase/server');
    mockSupabase = await createClient();
    (mockSupabase.from as any).mockImplementation((table: string) => {
      if (table === 'competitions') return queryBuilder;
      return {};
    });
  });

  it('Previous: Same timestamp with lower ID', async () => {
    queryBuilder.limit.mockResolvedValueOnce({ data: [{ id: 'comp-1' }] });
    
    await getPreviousCompetition('2026-07-01T10:00:00Z', 'comp-2');
    
    expect(queryBuilder.eq).toHaveBeenCalledWith('starts_at', '2026-07-01T10:00:00Z');
    expect(queryBuilder.lt).toHaveBeenCalledWith('id', 'comp-2');
    expect(queryBuilder.order).toHaveBeenCalledWith('starts_at', { ascending: false });
    expect(queryBuilder.order).toHaveBeenCalledWith('id', { ascending: false });
  });

  it('Previous: Earlier timestamp fallback', async () => {
    queryBuilder.limit
      .mockResolvedValueOnce({ data: [] }) // First same-date query returns empty
      .mockResolvedValueOnce({ data: [{ id: 'comp-0' }] }); // Older date returns data
    
    await getPreviousCompetition('2026-07-01T10:00:00Z', 'comp-2');
    
    expect(queryBuilder.lt).toHaveBeenCalledWith('starts_at', '2026-07-01T10:00:00Z');
    // Ensure both calls use descending order
    expect(queryBuilder.order).toHaveBeenCalledWith('starts_at', { ascending: false });
  });

  it('Previous: No neighbor (hidden)', async () => {
    queryBuilder.limit
      .mockResolvedValueOnce({ data: [] }) 
      .mockResolvedValueOnce({ data: [] }); 
    
    const result = await getPreviousCompetition('2026-07-01T10:00:00Z', 'comp-2');
    expect(result).toBeNull();
  });

  it('Next: Same timestamp with higher ID', async () => {
    queryBuilder.limit.mockResolvedValueOnce({ data: [{ id: 'comp-3' }] });
    
    await getNextCompetition('2026-07-01T10:00:00Z', 'comp-2');
    
    expect(queryBuilder.eq).toHaveBeenCalledWith('starts_at', '2026-07-01T10:00:00Z');
    expect(queryBuilder.gt).toHaveBeenCalledWith('id', 'comp-2');
    expect(queryBuilder.order).toHaveBeenCalledWith('starts_at', { ascending: true });
    expect(queryBuilder.order).toHaveBeenCalledWith('id', { ascending: true });
  });

  it('Next: Later timestamp fallback', async () => {
    queryBuilder.limit
      .mockResolvedValueOnce({ data: [] }) 
      .mockResolvedValueOnce({ data: [{ id: 'comp-4' }] }); 
    
    await getNextCompetition('2026-07-01T10:00:00Z', 'comp-2');
    
    expect(queryBuilder.gt).toHaveBeenCalledWith('starts_at', '2026-07-01T10:00:00Z');
    expect(queryBuilder.order).toHaveBeenCalledWith('starts_at', { ascending: true });
  });

  it('Next: No neighbor (hidden)', async () => {
    queryBuilder.limit
      .mockResolvedValueOnce({ data: [] }) 
      .mockResolvedValueOnce({ data: [] }); 
    
    const result = await getNextCompetition('2026-07-01T10:00:00Z', 'comp-2');
    expect(result).toBeNull();
  });
});

describe('competitionService - Related Competitions Fallback Hierarchy', () => {
  let mockSupabase: any;
  let queryBuilder: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    queryBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: null, error: null }),
    };

    const { createClient } = await import('@/lib/supabase/server');
    mockSupabase = await createClient();
    (mockSupabase.from as any).mockImplementation((table: string) => {
      if (table === 'competitions') return queryBuilder;
      return {};
    });
  });

  it('Related: Returns same-category priority first', async () => {
    queryBuilder.limit.mockResolvedValueOnce({ data: [{ id: 'comp-cat-1' }] });
    
    const results = await getRelatedCompetitions('cat-1', 'comp-1', 'national', 3);
    
    expect(queryBuilder.eq).toHaveBeenCalledWith('category_id', 'cat-1');
    expect(queryBuilder.neq).toHaveBeenCalledWith('id', 'comp-1');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('comp-cat-1');
  });

  it('Related: Falls back to same-level if capacity allows', async () => {
    queryBuilder.limit
      .mockResolvedValueOnce({ data: [{ id: 'comp-cat-1' }] }) // category query
      .mockResolvedValueOnce({ data: [{ id: 'comp-level-1' }] }); // level query
      
    const results = await getRelatedCompetitions('cat-1', 'comp-1', 'national', 3);
    
    expect(queryBuilder.eq).toHaveBeenCalledWith('competition_level', 'national');
    expect(results.length).toBe(2);
    expect(results[1].id).toBe('comp-level-1');
  });

  it('Related: Removes duplicate IDs across fallbacks', async () => {
    queryBuilder.limit
      .mockResolvedValueOnce({ data: [{ id: 'comp-cat-1' }] }) 
      .mockResolvedValueOnce({ data: [{ id: 'comp-cat-1' }, { id: 'comp-level-1' }] }); // returns duplicate
      
    const results = await getRelatedCompetitions('cat-1', 'comp-1', 'national', 3);
    
    expect(queryBuilder.not).toHaveBeenCalledWith('id', 'in', expect.arrayContaining(['comp-1', 'comp-cat-1']));
    expect(results.length).toBe(2);
  });

  it('Related: Falls back to upcoming public competitions', async () => {
    queryBuilder.limit
      .mockResolvedValueOnce({ data: [] }) 
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [{ id: 'comp-up-1' }] }); 
      
    const results = await getRelatedCompetitions('cat-1', 'comp-1', 'national', 3);
    
    expect(queryBuilder.gt).toHaveBeenCalledWith('starts_at', expect.any(String));
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('comp-up-1');
  });

  it('Related: Falls back to other public competitions', async () => {
    queryBuilder.limit
      .mockResolvedValueOnce({ data: [] }) 
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [{ id: 'comp-other-1' }] }); 
      
    const results = await getRelatedCompetitions('cat-1', 'comp-1', 'national', 3);
    
    expect(queryBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('comp-other-1');
  });

  it('Related: Empty result returns empty array', async () => {
    queryBuilder.limit.mockResolvedValue({ data: [] });
    const results = await getRelatedCompetitions('cat-1', 'comp-1', 'national', 3);
    expect(results).toEqual([]);
  });
});
