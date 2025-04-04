import Link from "next/link";
import { Instagram, Twitter, Facebook, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-fuchsia-200 bg-white/80 backdrop-blur py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-fuchsia-900">
                🐿️ MindfulMe
              </span>
            </div>
            <p className="text-emerald-700 text-sm">
              Your personal mindfulness companion for tracking moods, journaling
              thoughts, and connecting with others on their wellness journey.
            </p>
          </div>

          {/* Links section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-fuchsia-900">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-emerald-700 hover:text-fuchsia-700"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-emerald-700 hover:text-fuchsia-700"
                  >
                    Mood Tracking
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-emerald-700 hover:text-fuchsia-700"
                  >
                    Journal
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-emerald-700 hover:text-fuchsia-700"
                  >
                    Discover
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-fuchsia-900">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-emerald-700 hover:text-fuchsia-700"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-emerald-700 hover:text-fuchsia-700"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-emerald-700 hover:text-fuchsia-700"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-emerald-700 hover:text-fuchsia-700"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social links and newsletter */}
          <div className="space-y-4">
            <h3 className="font-medium text-fuchsia-900">Connect with us</h3>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-emerald-700 hover:text-fuchsia-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-emerald-700 hover:text-fuchsia-700 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-emerald-700 hover:text-fuchsia-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-emerald-700 hover:text-fuchsia-700 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
            <p className="text-sm text-emerald-700">
              Subscribe to our newsletter for mindfulness tips and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-400 rounded-l-md border bg-white/60 px-3 py-2 text-sm flex-1"
              />
              <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-r-md px-3 py-2 text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-fuchsia-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-emerald-700">
          <p>Designed by Saketh, Anish, Khushi, Matt & Sathvika</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-fuchsia-600" /> for
            mindfulness
          </p>
        </div>
      </div>
    </footer>
  );
}
