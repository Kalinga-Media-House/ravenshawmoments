import { getPublicationDetailsAction } from '@/features/news/actions/magazine.actions';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { BookOpen, Download } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const publication = await getPublicationDetailsAction(slug);
  
  if (!publication) return { title: 'Not Found' };

  return {
    title: `${publication.title} | Ravenshaw Publications`,
    description: publication.description,
  };
}

export default async function PublicationDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const publication = await getPublicationDetailsAction(slug);

  if (!publication) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="bg-muted aspect-[3/4] rounded-lg shadow-xl relative overflow-hidden border">
             {publication.cover_media_id ? (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${(publication as any).media_files?.url})` }} />
             ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary">
                  <BookOpen className="w-16 h-16 opacity-20" />
                </div>
             )}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="default" className="capitalize text-lg py-1 px-3">
              {publication.type}
            </Badge>
            {publication.issn && (
              <Badge variant="outline" className="text-lg py-1 px-3">ISSN {publication.issn}</Badge>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            {publication.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {publication.description}
          </p>
          
          <div className="flex gap-4">
            <Button size="lg" disabled>Subscribe</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </div>

      <div className="border-t pt-12">
        <h2 className="text-3xl font-bold mb-8">Issues & Editions</h2>
        
        {publication.editions.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg border border-dashed">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No editions published yet.</h3>
            <p className="text-muted-foreground">Check back later for new releases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publication.editions.map((edition: any) => (
              <Card key={edition.id} className="flex flex-col group overflow-hidden">
                <div className="aspect-[3/4] bg-muted relative border-b">
                   {edition.cover_media_id ? (
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${edition.media_files?.url})` }} />
                   ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary">
                        <BookOpen className="w-8 h-8 opacity-20" />
                      </div>
                   )}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link href={`/magazine/${publication.id}/${edition.slug}`} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
                        Read Online
                      </Link>
                      {edition.document?.url && (
                        <Button variant="outline" size="icon" title="Download PDF" className="bg-background/50 hover:bg-background">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                   </div>
                </div>
                <CardHeader className="flex-1">
                  <div className="text-sm font-medium text-primary mb-1">
                    {edition.volume_number ? `Vol. ${edition.volume_number} ` : ''}
                    {edition.issue_number ? `Issue ${edition.issue_number}` : ''}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{edition.title}</CardTitle>
                  <CardDescription>
                    {edition.publish_date ? format(new Date(edition.publish_date), 'MMM yyyy') : 'Upcoming'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {publication.editorialBoard && publication.editorialBoard.length > 0 && (
        <div className="mt-16 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-6">Editorial Board</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {publication.editorialBoard.map((member: any) => (
               <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                 <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0"></div>
                 <div>
                   <div className="font-semibold">{member.profiles.full_name}</div>
                   <div className="text-sm text-muted-foreground capitalize">{member.role.replace('_', ' ')}</div>
                 </div>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
