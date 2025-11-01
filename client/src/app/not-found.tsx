"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { motion } from "framer-motion";
import NotFoundImage from "../../public/404.png";
import ClientLayout from "./components/layouts/client-layout";

const ErrorPage: FC = () => {
  return (
    <ClientLayout>
      <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src={NotFoundImage}
              alt="404 Not Found Illustration"
              className="w-full max-w-xs mx-auto"
              priority
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-bold mt-8 mb-2"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-500 mb-8"
          >
            Oops! The page you’re looking for doesn’t exist or has been moved.
          </motion.p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-block bg-green-600 text-white no-underline px-6 py-3 rounded-full font-medium hover:bg-green-700 transition"
            >
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </ClientLayout>
  );
};

export default ErrorPage;
