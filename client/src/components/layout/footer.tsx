import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Github,
  Instagram,
  Facebook,
  Twitter,
  Send,
} from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="PinyinHub" className="w-[75px] h-[75px] mr-2" />
              <span className="text-xl font-semibold">PinyinHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Learn Chinese through music with pinyin transliteration and English translations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-gray-400 hover:text-white transition-colors">
                  Browse Songs
                </Link>
              </li>
              <li>
                <Link href="/add-song" className="text-gray-400 hover:text-white transition-colors">
                  Add a Song
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Learning Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Chinese Dictionary
                </a>
              </li>
              <li>
                <a href="/pronunciation-guide" className="text-gray-400 hover:text-white transition-colors">
                  Pronunciation Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for new songs and features.
            </p>
            <form className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-l-md rounded-r-none bg-gray-800 border-gray-700 text-white focus:border-primary"
              />
              <Button className="rounded-l-none bg-primary hover:bg-primary-600">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PinyinHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}