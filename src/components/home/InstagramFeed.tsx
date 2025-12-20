import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const INSTAGRAM_URL = "https://www.instagram.com/vishi_ignou_services/";

export function InstagramFeed() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Follow Us on Instagram
            </h2>
          </div>
          <p className="text-muted-foreground">
            Stay updated with our latest assignments, tips, and student success stories
          </p>
        </div>

        {/* Instagram Embed Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground">@vishi_ignou_services</p>
                <p className="text-sm text-muted-foreground">Vishi IGNOU Services</p>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto"
              >
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Follow
                </Button>
              </a>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {/* Placeholder cards for Instagram aesthetic */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <a
                    key={i}
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center group hover:shadow-md transition-all hover:scale-[1.02]"
                  >
                    <div className="text-center p-4">
                      <Instagram className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2 group-hover:text-primary transition-colors" />
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        View on Instagram
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-6 text-center">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="gap-2">
                    <Instagram className="h-5 w-5" />
                    View All Posts on Instagram
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Direct Link CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Check out our reels, assignment samples, and student testimonials
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              instagram.com/vishi_ignou_services
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
