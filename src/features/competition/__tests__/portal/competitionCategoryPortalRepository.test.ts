import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompetitionCategoryPortalRepository } from '../../data/competitionCategoryPortalRepository';
import { SupabaseClient } from '@supabase/supabase-js';

describe('CompetitionCategoryPortalRepository', () => {
  let repository: CompetitionCategoryPortalRepository;
  let supabaseMock: unknown;
  let queryBuilder: any;

  beforeEach(() => {
    queryBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    };
    supabaseMock = {
      rpc: vi.fn(),
      from: vi.fn().mockReturnValue(queryBuilder),
    };
    repository = new CompetitionCategoryPortalRepository(supabaseMock as SupabaseClient<any>);
  });

  describe('getActiveCategories', () => {
    it('queries competition_categories with explicit projection, applies is_active filter, and orders by display_order then name', async () => {
      const mockData = [{ id: '1', name: 'A', slug: 'a', description: null, display_order: 10, is_active: true }];
      
      const order2 = {
        then: vi.fn((cb) => cb({ data: mockData, error: null }))
      };
      const order1 = {
        order: vi.fn().mockReturnValue(order2)
      };
      queryBuilder.order.mockReturnValueOnce(order1);

      const result = await repository.getActiveCategories();

      expect((supabaseMock as any).from).toHaveBeenCalledWith('competition_categories');
      expect(queryBuilder.select).toHaveBeenCalledWith('id, name, slug, description, display_order, is_active');
      expect(queryBuilder.eq).toHaveBeenCalledWith('is_active', true);
      expect(queryBuilder.order).toHaveBeenCalledWith('display_order', { ascending: true });
      expect(order1.order).toHaveBeenCalledWith('name', { ascending: true });
      expect(result).toEqual(mockData);
    });

    it('returns an empty array when the query succeeds with zero rows', async () => {
      const order2 = {
        then: vi.fn((cb) => cb({ data: [], error: null }))
      };
      const order1 = { order: vi.fn().mockReturnValue(order2) };
      queryBuilder.order.mockReturnValueOnce(order1);

      const result = await repository.getActiveCategories();
      expect(result).toEqual([]);
    });

    it('throws a contextual error with original cause when the query fails', async () => {
      const dbError = { message: 'Network failure' };
      const order2 = {
        then: vi.fn((cb) => cb({ data: null, error: dbError }))
      };
      const order1 = { order: vi.fn().mockReturnValue(order2) };
      queryBuilder.order.mockReturnValueOnce(order1);

      await expect(repository.getActiveCategories()).rejects.toThrow('Database error fetching active categories: Network failure');
      
      try {
        await repository.getActiveCategories();
      } catch (e: any) {
        expect(e.cause).toBe(dbError);
      }
    });
  });

  describe('getLatestCategoryWinners', () => {
    it('returns an empty array when the RPC succeeds with no rows', async () => {
      (supabaseMock as any).rpc.mockResolvedValue({ data: [], error: null });

      const result = await repository.getLatestCategoryWinners('cat-1');
      expect(result).toEqual([]);
      expect((supabaseMock as any).rpc).toHaveBeenCalledWith('get_latest_category_winners', { p_category_id: 'cat-1' });
    });

    it('throws an error when the RPC fails', async () => {
      (supabaseMock as any).rpc.mockResolvedValue({ data: null, error: { message: 'DB Timeout' } });

      await expect(repository.getLatestCategoryWinners('cat-1')).rejects.toThrow('Database error fetching latest winners: DB Timeout');
    });
  });

  describe('getCategoryWinnersArchive', () => {
    it('returns an empty array when the RPC succeeds with no rows', async () => {
      (supabaseMock as any).rpc.mockResolvedValue({ data: [], error: null });

      const result = await repository.getCategoryWinnersArchive('cat-1', 2026, 7);
      expect(result).toEqual([]);
    });

    it('throws an error when the RPC fails', async () => {
      (supabaseMock as any).rpc.mockResolvedValue({ data: null, error: { message: 'Permission Denied' } });

      await expect(repository.getCategoryWinnersArchive('cat-1', 2026, 7)).rejects.toThrow('Database error fetching archive winners: Permission Denied');
    });
  });
});
