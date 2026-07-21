import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveCompetitionAtomic } from '../competitionAdminService';
import { CompetitionDraftValues } from '../../schema/adminCompetitionSchema';

const mockRpc = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-123' } } }),
    },
    from: vi.fn((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { id: 'admin-123', role: 'super_admin' }, error: null }),
        };
      }
      return {
        insert: mockInsert,
        update: mockUpdate,
        delete: mockDelete,
        select: mockSelect,
        eq: mockEq,
      };
    }),
    rpc: mockRpc,
  })),
}));

describe('competitionAdminService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockInsert.mockReturnThis();
    mockSelect.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: { id: 'comp-123' }, error: null });

    mockUpdate.mockReturnThis();
    mockEq.mockReturnThis();
    mockDelete.mockReturnThis();
    
    mockRpc.mockResolvedValue({ error: null });
  });

  it('constructs payload and calls RPC for a new draft', async () => {
    const data: CompetitionDraftValues = {
      title: 'New Draft',
      slug: 'new-draft',
      categoryId: 'cat-1',
      mode: 'offline',
      level: 'university',
      allowTeam: false,
      publicationAction: 'draft',
    };

    const id = await saveCompetitionAtomic(data);

    expect(id).toBe('comp-123');

    // 1. Check if skeleton is inserted
    expect(mockInsert).toHaveBeenCalledWith([{
      title: 'New Draft',
      slug: 'new-draft',
      category_id: 'cat-1',
      competition_status: 'draft',
      is_public: false,
      created_by: 'admin-123',
    }]);

    // 2. Check if RPC is called
    expect(mockRpc).toHaveBeenCalledTimes(1);
    const rpcCallArgs = mockRpc.mock.calls[0];
    expect(rpcCallArgs[0]).toBe('save_competition_workflow');
    
    const rpcPayload = rpcCallArgs[1].p_payload;
    expect(rpcPayload.title).toBe('New Draft');
    expect(rpcPayload.slug).toBe('new-draft');
    expect(rpcPayload.is_public).toBe(false);
    expect(rpcPayload.scheduled_publish_at).toBeNull();
  });

  it('sets is_public=true when publishing now', async () => {
    const data: CompetitionDraftValues = {
      title: 'Pub',
      slug: 'pub',
      categoryId: 'cat-1',
      mode: 'offline',
      level: 'university',
      allowTeam: false,
      publicationAction: 'publish_now',
    };

    await saveCompetitionAtomic(data, 'comp-123'); // Existing ID

    expect(mockInsert).not.toHaveBeenCalled();

    const rpcPayload = mockRpc.mock.calls[0][1].p_payload;
    expect(rpcPayload.is_public).toBe(true);
    expect(rpcPayload.scheduled_publish_at).toBeNull();
  });

  it('sets scheduled_publish_at when scheduling', async () => {
    const data: CompetitionDraftValues = {
      title: 'Sched',
      slug: 'sched',
      categoryId: 'cat-1',
      mode: 'offline',
      level: 'university',
      allowTeam: false,
      publicationAction: 'schedule',
      scheduledPublishAt: '2026-12-31T00:00:00Z',
    };

    await saveCompetitionAtomic(data, 'comp-123');

    const rpcPayload = mockRpc.mock.calls[0][1].p_payload;
    expect(rpcPayload.is_public).toBe(true);
    expect(rpcPayload.scheduled_publish_at).toBe('2026-12-31T00:00:00Z');
  });

  it('omits is_public and scheduled_publish_at for preserve action', async () => {
    const data: CompetitionDraftValues = {
      title: 'Preserve',
      slug: 'preserve',
      categoryId: 'cat-1',
      mode: 'offline',
      level: 'university',
      allowTeam: false,
      publicationAction: 'preserve',
    };

    await saveCompetitionAtomic(data, 'comp-123');

    const rpcPayload = mockRpc.mock.calls[0][1].p_payload;
    expect(rpcPayload.is_public).toBeUndefined();
    expect(rpcPayload.scheduled_publish_at).toBeUndefined();
  });

  it('omits deferred fields from RPC payload', async () => {
    const data: CompetitionDraftValues = {
      title: 'Sec',
      slug: 'sec',
      categoryId: 'cat-1',
      mode: 'offline',
      level: 'university',
      allowTeam: false,
      publicationAction: 'preserve',
      internalNotes: 'Secret note',
    };

    await saveCompetitionAtomic(data, 'comp-123');

    const rpcPayload = mockRpc.mock.calls[0][1].p_payload;
    expect(rpcPayload.internal_notes).toBeUndefined();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
