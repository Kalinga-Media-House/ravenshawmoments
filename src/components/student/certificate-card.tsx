import React from 'react';
import { FileText, Calendar, ExternalLink } from 'lucide-react';

export interface CertificateCardProps {
  title: string;
  issuer: string;
  date: string;
  documentUrl?: string | null;
  thumbnailUrl?: string | null;
}

export function CertificateCard({
  title,
  issuer,
  date,
  documentUrl,
  thumbnailUrl,
}: CertificateCardProps) {
  const CardWrapper = documentUrl ? 'a' : 'div';
  const wrapperProps = documentUrl 
    ? { href: documentUrl, target: '_blank', rel: 'noopener noreferrer' } 
    : {};

  return (
    <CardWrapper 
      {...wrapperProps}
      className={`block bg-[#1A1214] border border-[#2D1F23] rounded-xl overflow-hidden transition-colors ${
        documentUrl ? 'hover:border-[#7C2D3E] group cursor-pointer' : ''
      }`}
    >
      <div className="flex p-4 gap-4 items-center">
        <div className="w-16 h-16 rounded-lg bg-[#2D1F23] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#2D1F23]">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <FileText size={24} className="text-[#8B7078]" />
          )}
        </div>
        
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-base font-semibold truncate ${documentUrl ? 'group-hover:text-[#9B3A4D] text-[#F5E6EA] transition-colors' : 'text-[#F5E6EA]'}`}>
              {title}
            </h3>
            {documentUrl && (
              <ExternalLink size={14} className="text-[#8B7078] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            )}
          </div>
          
          <p className="text-sm text-[#8B7078] truncate mt-0.5">{issuer}</p>
          
          <div className="flex items-center gap-1.5 text-xs text-[#8B7078] mt-2">
            <Calendar size={12} />
            <span>Issued {date}</span>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
