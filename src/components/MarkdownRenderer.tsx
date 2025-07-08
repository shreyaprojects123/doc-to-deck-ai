import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  children: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        components={{
          table: ({node, ...props}) => (
            <table className="min-w-full border border-blue-800 rounded-lg bg-blue-900 text-white my-4">{props.children}</table>
          ),
          thead: ({node, ...props}) => (
            <thead className="bg-blue-800">{props.children}</thead>
          ),
          th: ({node, ...props}) => (
            <th className="border border-blue-700 px-3 py-2 text-white font-semibold">{props.children}</th>
          ),
          td: ({node, ...props}) => (
            <td className="border border-blue-700 px-3 py-2">{props.children}</td>
          ),
          tr: ({node, ...props}) => (
            <tr className="even:bg-blue-950/40">{props.children}</tr>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};