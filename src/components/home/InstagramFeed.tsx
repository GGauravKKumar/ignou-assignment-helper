import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const INSTAGRAM_URL = "https://www.instagram.com/vishi_ignou_services/";

export function InstagramFeed() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Follow Us on Instagram
          </h2>
          <p className="text-muted-foreground mb-6">
            Check out our latest updates, success stories, and student testimonials
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="gap-2">
              <Instagram className="h-5 w-5" />
              @vishi_ignou_services
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>

        {/* Instagram-like grid preview */}
        <div className="max-w-4xl mx-auto">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 rounded-lg flex items-center justify-center group hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="text-center p-2">
                    <Instagram className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/50 mx-auto group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Click to view our Instagram feed →
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}