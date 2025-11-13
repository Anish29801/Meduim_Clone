'use client';

import React, { useState } from 'react';
import HeadingSearch from '@/app/components/headingSection';
import CategoryTagSidebar from '@/app/components/CategoryTagSidebar';
import ArticleCardsGrid from './ArticleCardsGrid';
import ClientLayout from '../components/layouts/client-layout';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <ClientLayout>
      <motion.main
        className="min-h-screen bg-white-50 white:bg-white-900 py-1 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {/* Heading and Search */}
        <motion.div variants={fadeUp}>
          <HeadingSearch onSearch={(query) => setSearchQuery(query)} />
        </motion.div>

        <motion.div className="border-b border-blue-300 pb-4" variants={fadeUp}>
          <div className="max-w-7xl mx-auto mt-10 flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.div
              className="w-full lg:w-1/4 flex-shrink-0"
              variants={fadeUp}
            >
              <CategoryTagSidebar />
            </motion.div>

            {/* Articles Grid */}
            <motion.div
              className="w-full lg:w-3/4 mt-8 lg:mt-0"
              variants={fadeUp}
            >
              <ArticleCardsGrid query={searchQuery} />
            </motion.div>
          </div>
        </motion.div>
      </motion.main>
    </ClientLayout>
  );
}
