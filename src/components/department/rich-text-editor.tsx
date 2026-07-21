'use client';

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, List, ListOrdered, Link as LinkIcon } from 'lucide-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Type here...', className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const ToolbarButton = ({ icon: Icon, command, arg }: { icon: any, command: string, arg?: string }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-1 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"
      onClick={(e) => {
        e.preventDefault();
        execCommand(command, arg);
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className={cn("flex flex-col border border-[#2D1F23] rounded-md bg-[#1A1214] overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-1 p-1 border-b border-[#2D1F23] bg-[#0F0A0B]">
        <ToolbarButton icon={Bold} command="bold" />
        <ToolbarButton icon={Italic} command="italic" />
        <ToolbarButton icon={Underline} command="underline" />
        <div className="w-px h-4 bg-[#2D1F23] mx-1" />
        <ToolbarButton icon={Heading1} command="formatBlock" arg="H1" />
        <ToolbarButton icon={Heading2} command="formatBlock" arg="H2" />
        <ToolbarButton icon={Heading3} command="formatBlock" arg="H3" />
        <div className="w-px h-4 bg-[#2D1F23] mx-1" />
        <ToolbarButton icon={List} command="insertUnorderedList" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" />
        <div className="w-px h-4 bg-[#2D1F23] mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-1 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"
          onClick={handleLink}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 text-[#F5E6EA] focus:outline-none prose prose-invert prose-headings:text-[#F5E6EA] prose-a:text-[#9B3A4D] max-w-none"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
      />
      <style dangerouslySetInnerHTML={{__html: `
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #8B7078;
          pointer-events: none;
          display: block;
        }
      `}} />
    </div>
  );
}
