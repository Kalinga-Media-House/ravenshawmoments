import { getAllPublicationsAction } from '@/features/news/actions/magazine.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Publications | Ravenshaw University',
  description: 'Explore magazines, journals, newsletters, and annual reports from Ravenshaw University.',
};

export default async function PublicationsIndexPage() {
  const publications = await getAllPublicationsAction();

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">University Publications</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our rich legacy of magazines, research journals, newsletters, and annual reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publications.map((pub) => (
          <Link href={`/publications/${pub.slug}`} key={pub.id} className="group flex flex-col">
            <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="h-64 bg-muted relative border-b">
                {pub.cover_media_id ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${(pub as any).media_files?.url})` }} />
                ) : (
                  <div className="absolute inset-0 bg-secondary flex items-center justify-center text-muted-foreground">
                    <BookOpen className="h-12 w-12 opacity-20" />
                  </div>
                )}
                <Badge className="absolute top-4 right-4 capitalize">
                  {pub.type}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {pub.title}
                </CardTitle>
                {pub.issn && (
                  <CardDescription>ISSN: {pub.issn}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3">
                  {pub.description || 'Explore issues and volumes of this publication.'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
