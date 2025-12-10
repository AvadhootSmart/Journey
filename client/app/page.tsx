"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { ArrowRight, Book, Globe, Sparkles, Users, Zap } from "lucide-react";
import Link from "next/link";
import { AuthPopup } from "@/components/auth-popup";
import useUser from "@/store/user-store";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { token } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("journey-user");
  };
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center space-y-8"
          >
            <motion.div variants={item}>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm rounded-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
              >
                <Sparkles className="w-3 h-3 mr-2 inline-block" />
                Reimagining Digital Journaling
              </Badge>
            </motion.div>

            <motion.div variants={item} className="max-w-3xl space-y-4">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
                onDoubleClick={handleLogout}
              >
                Capture Your Journey, <br />
                <span className="text-primary">Together.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A collaborative space for your thoughts, memories, and shared
                experiences. Minimalist design meets powerful features for the
                modern storyteller.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              {token ? (
                <Link href="/profile">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base rounded-full group"
                  >
                    Start Journaling
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <AuthPopup>
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base rounded-full group"
                  >
                    Start Journaling
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </AuthPopup>
              )}
            </motion.div>

            {/* Abstract UI Preview */}
            <motion.div
              variants={item}
              className="w-full max-w-5xl mt-16 relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-xl blur opacity-30"></div>
              <div className="relative rounded-xl border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
                <div className="text-muted-foreground/50 flex flex-col items-center gap-2">
                  <Book className="w-12 h-12" />
                  <p>App Interface Preview</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to write
            </h2>
            <p className="text-muted-foreground text-lg">
              Focus on your content with our distraction-free editor and
              powerful organization tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-amber-500" />,
                title: "Lightning Fast",
                description:
                  "Built for speed. Instant sync and offline support ensure you never lose a thought.",
              },
              {
                icon: <Users className="w-6 h-6 text-blue-500" />,
                title: "Real-time Collaboration",
                description:
                  "Write together with friends or family. Share journals and create memories collectively.",
              },
              {
                icon: <Globe className="w-6 h-6 text-emerald-500" />,
                title: "Publish to Web",
                description:
                  "Turn your journal entries into a beautiful blog with just one click. Share your story.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-primary/5"></div>
        <div className="container px-4 md:px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl font-bold tracking-tight">
              Ready to start your journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of writers who have found their perfect digital
              sanctuary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthPopup>
                <Button size="lg" className="h-12 px-8 text-base rounded-full">
                  Get Started for Free
                </Button>
              </AuthPopup>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Book className="w-6 h-6 text-primary" />
            <span>Journey</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Journey App. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
