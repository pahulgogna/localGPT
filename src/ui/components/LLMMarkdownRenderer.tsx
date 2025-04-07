import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // or any theme you like

type Props = {
  content: string;
};

const LLMMarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="prose prose-invert dark:prose-invert max-w-none rounded-xl">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ inline, className, children, ...props }: any) {
            if (inline) {
              return (
                <code className="px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <pre className="rounded-lg overflow-x-auto bg-zinc-800 p-4 my-4 text-sm">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default LLMMarkdownRenderer;
