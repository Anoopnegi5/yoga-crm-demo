import React, { useEffect } from 'react';
import { BlogPost } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Share2, 
  MessageCircle, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Heart,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface BlogArticleModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDemoModal: (goal?: string, program?: string) => void;
  allPosts?: BlogPost[];
  onSelectPost?: (post: BlogPost) => void;
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  post,
  isOpen,
  onClose,
  onOpenDemoModal,
  allPosts = [],
  onSelectPost
}) => {
  if (!isOpen || !post) return null;

  const articleUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/blog/${post.slug}`
    : `https://www.yoganjaliyoga.com/blog/${post.slug}`;

  useEffect(() => {
    // Lock body scroll while reading
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleShareWhatsApp = () => {
    const text = `🌿 *${post.title}*\n\nRead this insightful yoga guide by Trainer Anjali Negi:\n${articleUrl}\n\n— Yoganjali Yoga Studio`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(articleUrl);
      alert('📋 Article link copied to clipboard!');
    }
  };

  // Render markdown-like content blocks
  const renderFormattedContent = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={index} className="h-3" />;

      // H3 heading (### Heading)
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900 mt-6 mb-2 tracking-tight text-emerald-950">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // H4 heading (#### Heading)
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={index} className="font-serif font-bold text-lg text-slate-900 mt-5 mb-1.5 text-emerald-900">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }

      // Blockquote (> Quote)
      if (trimmed.startsWith('> ')) {
        const cleanQuote = trimmed.replace('> ', '').replace(/^"|"$/g, '');
        return (
          <blockquote key={index} className="p-4 sm:p-5 my-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border-l-4 border-emerald-600 text-slate-800 italic font-serif text-sm sm:text-base leading-relaxed shadow-sm">
            <span className="text-emerald-700 font-black text-lg mr-1">“</span>
            {cleanQuote}
            <span className="text-emerald-700 font-black text-lg ml-1">”</span>
          </blockquote>
        );
      }

      // Bullet points (* or -)
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const bulletText = trimmed.replace(/^[\*\-]\s+/, '');
        return (
          <div key={index} className="flex items-start gap-2.5 my-1.5 text-slate-700 text-sm leading-relaxed pl-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
          </div>
        );
      }

      // Numbered List (1. 2.)
      if (/^\d+\.\s+/.test(trimmed)) {
        const numText = trimmed.replace(/^\d+\.\s+/, '');
        return (
          <div key={index} className="flex items-start gap-2.5 my-2 text-slate-700 text-sm leading-relaxed pl-2">
            <span className="font-extrabold text-emerald-800 text-xs bg-emerald-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              {trimmed.match(/^\d+/)?.[0]}
            </span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(numText) }} />
          </div>
        );
      }

      // Horizontal Divider (---)
      if (trimmed === '---') {
        return <hr key={index} className="my-6 border-slate-200" />;
      }

      // Standard Paragraph
      return (
        <p 
          key={index} 
          className="text-slate-700 text-sm sm:text-[15px] leading-relaxed my-2.5"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
        />
      );
    });
  };

  // Helper for bold (**bold**) and italics (*italic*)
  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>');
  };

  // Other related posts
  const otherPosts = allPosts.filter(p => p.id !== post.id && p.isPublished).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col relative">
        
        {/* Sticky Header Nav */}
        <div className="px-5 py-3.5 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between z-20 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-emerald-800 transition-colors p-1.5 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors border border-emerald-200"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-50" />
              <span>Share</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              title="Copy Article Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-10 space-y-8">
          
          {/* Article Header & Title */}
          <div className="space-y-4 max-w-2xl mx-auto text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-200 uppercase tracking-wider">
                {post.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {post.readTime}
              </span>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-4xl text-slate-950 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 border-t border-slate-100">
              <img
                src={post.authorPhoto || '/anjali-hero.jpg'}
                alt={post.author}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500 bg-white"
              />
              <div className="text-left">
                <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                  <span>{post.author}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {post.authorRole} • Published on {post.date}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 max-h-[420px] bg-slate-100">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover max-h-[420px]"
            />
          </div>

          {/* Key Excerpt / Introduction Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF6EE] border border-[#E8DFC9] text-slate-800 font-medium text-sm sm:text-base leading-relaxed max-w-3xl mx-auto shadow-sm">
            <p className="font-serif italic text-slate-900">
              "{post.excerpt}"
            </p>
          </div>

          {/* Formatted Article Content */}
          <article className="max-w-3xl mx-auto font-sans leading-relaxed text-slate-800">
            {renderFormattedContent(post.content)}
          </article>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="max-w-3xl mx-auto pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-1">Topics:</span>
              {post.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* High-Converting CTA Box inside Blog Post */}
          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1B3524] via-[#2A4D3B] to-[#162D1F] text-white shadow-2xl border border-emerald-700/50 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Experience Authentic Yoga with Anjali Negi</span>
            </div>

            <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Ready to Practice These Poses with Personal Guidance?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto font-medium leading-relaxed">
              Join our personalized live online sessions or group batches designed specifically around your body flexibility, back care, and holistic wellness goals.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenDemoModal(post.category, 'Personal Yoga Session');
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Book 1-Day Free Trial Session 🌸
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-white/20 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-950" />
                <span>Share Guide with Friends</span>
              </button>
            </div>
          </div>

          {/* Recommended Other Articles */}
          {otherPosts.length > 0 && onSelectPost && (
            <div className="max-w-3xl mx-auto pt-6 border-t border-slate-200 space-y-4">
              <h4 className="font-serif font-extrabold text-xl text-slate-900">
                More Yoga & Health Insights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherPosts.map((other) => (
                  <div
                    key={other.id}
                    onClick={() => onSelectPost(other)}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all cursor-pointer group flex items-center gap-3"
                  >
                    <img
                      src={other.coverImage}
                      alt={other.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                        {other.category}
                      </span>
                      <h5 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug">
                        {other.title}
                      </h5>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
