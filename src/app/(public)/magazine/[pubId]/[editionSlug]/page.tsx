import { getEditionReaderAction, trackDownloadAction } from '@/features/news/actions/magazine.actions';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Button, buttonVariants } from '@/components/ui/button';
import { Download, ChevronLeft, ChevronRight, FileText, BookOpen } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ pubId: string; editionSlug: string }> }) {
  const { pubId, editionSlug } = await params;
  const edition = await getEditionReaderAction(pubId, editionSlug);
  
  if (!edition) return { title: 'Not Found' };

  return {
    title: `${edition.title} | Digital Magazine`,
  };
}

export default async function MagazineReaderPage({ params }: { params: Promise<{ pubId: string; editionSlug: string }> }) {
  const { pubId, editionSlug } = await params;
  const edition = await getEditionReaderAction(pubId, editionSlug);

  if (!edition) {
    notFound();
  }

  // Track page view/download (simulate read track)
  await trackDownloadAction(edition.id);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Reader Toolbar */}
      <div className="bg-background border-b h-16 flex items-center justify-between px-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/publications" className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
             <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold leading-none">{edition.title}</h1>
            <span className="text-xs text-muted-foreground">
              {edition.volume_number ? `Vol. ${edition.volume_number} ` : ''}
              {edition.issue_number ? `Issue ${edition.issue_number}` : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(edition as any).document && (
             <a href={(edition as any).document.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'gap-2' })}>
               <Download className="w-4 h-4" />
               <span className="hidden sm:inline">Download PDF</span>
             </a>
          )}
        </div>
      </div>

      {/* Reader Body */}
      <div className="flex-1 container mx-auto py-8 px-4 flex justify-center">
        {/* We're simulating a digital reader. If it's a PDF, we might just show an embed. 
            If it's interactive articles, we show the articles array. */}
        <div className="max-w-4xl w-full">
           {edition.articles && edition.articles.length > 0 ? (
             <div className="space-y-12">
               {edition.articles.map((article: any, index: number) => (
                  <div key={article.id} className="bg-background p-8 md:p-12 shadow-md rounded-xl border">
                    {/* Article Header */}
                    <div className="mb-8">
                       <h2 className="text-3xl font-bold mb-4">{article.content_items.title}</h2>
                       <div className="flex items-center gap-4 text-muted-foreground">
                         <div className="font-medium text-foreground">
                           {article.content_items.profiles?.full_name || 'Anonymous'}
                         </div>
                         {article.page_number && (
                            <div className="flex items-center gap-1 text-sm border-l pl-4">
                              <FileText className="w-4 h-4" />
                              Page {article.page_number}
                            </div>
                         )}
                       </div>
                    </div>
                    {/* Article Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                       <div dangerouslySetInnerHTML={{ __html: article.content_items.body }} />
                    </div>
                  </div>
               ))}
             </div>
           ) : (
             <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center bg-background rounded-xl border p-12 shadow-md">
                <BookOpen className="w-24 h-24 text-muted-foreground opacity-20 mb-6" />
                <h2 className="text-2xl font-bold mb-4">No Interactive Articles Available</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  This edition does not have any interactive digital articles set up yet. 
                  {(edition as any).document ? ' You can download or view the PDF version instead.' : ' Check back later.'}
                </p>
                {(edition as any).document && (
                  <a href={(edition as any).document.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: 'lg', className: 'gap-2' })}>
                    <Download className="w-5 h-5" />
                    Download PDF
                  </a>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
