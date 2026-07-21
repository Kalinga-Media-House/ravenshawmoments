import { getNewsArticleAction, getCommentsAction } from '@/features/news/actions/news.actions';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, Bookmark, Share2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsArticleAction(slug);
  
  if (!article) return { title: 'Not Found' };

  return {
    title: `${article.title} | Ravenshaw News`,
    description: article.summary || article.subtitle,
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsArticleAction(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-muted w-full h-[40vh] relative overflow-hidden flex items-center justify-center">
        {article.banner_media_id ? (
           <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${(article as any).banner?.url})` }} />
        ) : (
          <div className="text-muted-foreground/30 font-bold text-4xl uppercase tracking-widest">Ravenshaw News</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-32 relative z-10">
        <div className="bg-background rounded-xl p-8 md:p-12 shadow-xl border">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="default" className="capitalize">
              {article.content_type.replace('_', ' ')}
            </Badge>
            <span className="text-muted-foreground text-sm">
              {article.published_at ? format(new Date(article.published_at), 'MMMM dd, yyyy') : 'Unpublished'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-xl text-muted-foreground mb-8">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center gap-4 py-6 border-y mb-8">
            <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden">
               {/* Avatar */}
            </div>
            <div>
              <div className="font-semibold text-lg">
                {(article as any).profiles?.full_name || 'University Desk'}
              </div>
              <div className="text-muted-foreground text-sm">Author</div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" title="Like">
                <ThumbsUp className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" title="Bookmark">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" title="Share">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content Body */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            {/* If body is HTML or Markdown, render accordingly. For now, simple text or dangerouslySetInnerHTML */}
            <div dangerouslySetInnerHTML={{ __html: article.body }} />
          </div>

          {/* AI / Metadata Tags section (Architecture Ready) */}
          {article.ai_metadata && Object.keys(article.ai_metadata).length > 0 && (
             <div className="bg-muted/50 p-4 rounded-lg mb-8 text-sm">
               <span className="font-semibold mr-2">AI Summary:</span>
               {(article.ai_metadata as any).summary || 'Available soon.'}
             </div>
          )}

          {/* Comments Section */}
          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <MessageSquare className="w-6 h-6" />
              Discussion
            </h3>
            
            <div className="bg-muted rounded-lg p-6 text-center text-muted-foreground">
              Comments are currently being moderated. Sign in to join the discussion.
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
