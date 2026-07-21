import { getLatestNewsAction, getCategoriesAction, getFeaturedNewsAction } from '@/features/news/actions/news.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Campus News | Ravenshaw University',
  description: 'Stay updated with the latest news, announcements, and press releases from Ravenshaw University.',
};

export default async function NewsIndexPage() {
  const [news, featured, categories] = await Promise.all([
    getLatestNewsAction(undefined, undefined, 20),
    getFeaturedNewsAction(3),
    getCategoriesAction()
  ]);

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Campus News</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Official news, announcements, press releases, and stories from across the university.
        </p>
      </div>

      {featured.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((item) => (
              <Link href={`/news/${item.slug}`} key={item.id} className="group">
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="h-48 bg-muted relative">
                    {item.banner_media_id ? (
                      // Replace with proper Next/Image if media fetching is fully implemented
                      <div className="absolute inset-0 bg-secondary flex items-center justify-center">Cover Image</div>
                    ) : (
                      <div className="absolute inset-0 bg-secondary flex items-center justify-center text-muted-foreground">
                        <Search className="h-8 w-8 opacity-20" />
                      </div>
                    )}
                    <Badge className="absolute top-4 left-4 capitalize">
                      {item.content_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <CardDescription>
                      {item.published_at ? format(new Date(item.published_at), 'MMMM dd, yyyy') : 'Recently'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {item.summary || item.subtitle || 'Read more about this story...'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
          <div className="space-y-6">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-64 bg-muted flex-shrink-0 flex items-center justify-center min-h-[160px]">
                    <span className="text-muted-foreground/50">Thumbnail</span>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize">{item.content_type.replace('_', ' ')}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.published_at ? format(new Date(item.published_at), 'MMM dd, yyyy') : ''}
                      </span>
                    </div>
                    <Link href={`/news/${item.slug}`} className="group">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    </Link>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {item.summary || item.subtitle || 'Read full article...'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-sm font-medium">
                        {/* TypeScript safety: we know author is joined */}
                        By {(item as any).profiles?.full_name || 'University Desk'}
                      </div>
                      <Link href={`/news/${item.slug}`} className="text-sm text-primary font-medium hover:underline">
                        Read More &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/news?category=${category.slug}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-between">
                      <span>{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
