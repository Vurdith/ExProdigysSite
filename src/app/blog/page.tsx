"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  image_url: string;
  order_index: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blogs");
        const result = await response.json();
        if (response.ok && result.data) {
          setPosts(result.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-void text-white pt-32 pb-32">
      <section className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col gap-6 mb-16">
          <p className="text-white/60 text-sm font-medium tracking-wide">
            Burgundy Ventures Journal
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Insights that <span className="text-white/40 italic font-light">move markets.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Strategy, production, and distribution breakdowns from inside the Roblox economy.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden border border-white/10 bg-white/[0.04] rounded-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="relative p-8">
                  <h3 className="text-2xl font-bold tracking-tight group-hover:text-white">
                    {post.title}
                  </h3>
                  <p className="text-white/60 text-sm mt-4">
                    Drop #{post.order_index + 1}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
