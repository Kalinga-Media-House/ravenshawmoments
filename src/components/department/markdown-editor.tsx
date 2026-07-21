'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, LinkIcon, List, Code, Quote, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MarkdownEditor({ value, onChange, placeholder = 'Write markdown here...', className }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertSyntax = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className={cn("border border-[#2D1F23] rounded-md bg-[#1A1214] overflow-hidden flex flex-col", className)}>
      <div className="flex items-center justify-between p-2 border-b border-[#2D1F23] bg-[#0F0A0B]">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => insertSyntax('**', '**')} className="h-8 w-8 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"><Bold className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertSyntax('_', '_')} className="h-8 w-8 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"><Italic className="h-4 w-4" /></Button>
          <div className="w-px h-4 bg-[#2D1F23] mx-1" />
          <Button variant="ghost" size="icon" onClick={() => insertSyntax('[', '](url)')} className="h-8 w-8 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"><LinkIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertSyntax('![alt](', ')')} className="h-8 w-8 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"><ImageIcon className="h-4 w-4" /></Button>
          <div className="w-px h-4 bg-[#2D1F23] mx-1" />
          <Button variant="ghost" size="icon" onClick={() => insertSyntax('- ')} className="h-8 w-8 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"><List className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertSyntax('> ')} className="h-8 w-8 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"><Quote className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertSyntax('```\n', '\n```')} className="h-8 w-8 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"><Code className="h-4 w-4" /></Button>
        </div>
        <div className="flex bg-[#1A1214] rounded border border-[#2D1F23] p-0.5">
          <Button size="sm" variant="ghost" className={cn("h-7 px-3 text-xs", mode === 'edit' ? "bg-[#2D1F23] text-white" : "text-[#8B7078]")} onClick={() => setMode('edit')}>Edit</Button>
          <Button size="sm" variant="ghost" className={cn("h-7 px-3 text-xs", mode === 'split' ? "bg-[#2D1F23] text-white" : "text-[#8B7078]")} onClick={() => setMode('split')}>Split</Button>
          <Button size="sm" variant="ghost" className={cn("h-7 px-3 text-xs", mode === 'preview' ? "bg-[#2D1F23] text-white" : "text-[#8B7078]")} onClick={() => setMode('preview')}>Preview</Button>
        </div>
      </div>
      
      <div className={cn("flex flex-1 min-h-[300px]", mode === 'split' && "flex-row")}>
        {(mode === 'edit' || mode === 'split') && (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "flex-1 min-h-[300px] bg-transparent border-0 resize-none rounded-none focus-visible:ring-0 text-[#F5E6EA] font-mono text-sm p-4",
              mode === 'split' && "border-r border-[#2D1F23]"
            )}
          />
        )}
        {(mode === 'preview' || mode === 'split') && (
          <div className={cn("flex-1 p-4 bg-[#0F0A0B] overflow-auto prose prose-invert prose-p:text-[#F5E6EA] prose-a:text-[#9B3A4D]")}>
             {/* Note: In a real app, use react-markdown to render. Here we render simple text placeholder */}
             {value ? (
               <div className="whitespace-pre-wrap text-[#F5E6EA]">{value}</div>
             ) : (
               <div className="text-[#8B7078] italic">Preview will appear here...</div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
