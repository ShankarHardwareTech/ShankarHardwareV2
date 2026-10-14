import React, { useState } from 'react';
import { X, Check, Copy, Globe, Terminal, Github, ExternalLink } from 'lucide-react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({ isOpen, onClose }) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const actionYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build site
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                GitHub Pages Hosting Ready
              </h3>
              <p className="text-xs text-stone-500">
                100% Client-Side Compatible · Relative Base Path Configured · Zero Backend Dependencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-[#bb948d]/15 rounded-xl border border-[#bb948d]/40 text-xs text-stone-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[#5c241b]">
            <Check className="w-4 h-4 text-[#8c4b3f]" />
            <span>Already Configured for GitHub Pages:</span>
          </div>
          <p>
            • <code>vite.config.ts</code> has <code>base: './'</code> so assets load properly in any repository subpath (e.g. <code>username.github.io/shankar-hardware-agro/</code>).
          </p>
          <p>
            • All maps use OpenStreetMap & Leaflet with zero private server keys or billing restrictions.
          </p>
          <p>
            • Delivery bookings and cart are preserved using browser local persistence.
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4 text-xs">
          <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
            Option 1: Deploy Automatically with GitHub Actions (Recommended)
          </h4>

          <div className="space-y-3">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <div className="font-semibold text-stone-900">Step 1: Push codebase to GitHub</div>
              <p className="text-stone-600">
                Initialize a Git repository and push your project to a new GitHub repository (e.g. <code>shankar-hardware-agro</code>).
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">
                  Step 2: Workflow file (.github/workflows/deploy.yml)
                </span>
                <button
                  onClick={() => handleCopy(actionYaml, 'yaml')}
                  className="px-2.5 py-1 bg-white border border-stone-200 rounded-md text-[11px] font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1"
                >
                  {copiedStep === 'yaml' ? (
                    <>
                      <Check className="w-3 h-3 text-[#8c4b3f]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-stone-500" />
                      <span>Copy YAML</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 bg-stone-900 text-stone-200 rounded-lg text-[10px] font-mono overflow-x-auto max-h-36">
                {actionYaml}
              </pre>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <div className="font-semibold text-stone-900">Step 3: Enable Pages in GitHub Repository</div>
              <p className="text-stone-600">
                Go to <strong>Settings</strong> → <strong>Pages</strong> in your GitHub repo. Under <em>Build and deployment</em>, set Source to <strong>GitHub Actions</strong>. Every push will deploy live in ~45 seconds!
              </p>
            </div>
          </div>

          <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] pt-2">
            Option 2: Quick Command Line Build
          </h4>

          <div className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] flex items-center justify-between">
            <code>npm run build</code>
            <button
              onClick={() => handleCopy('npm run build', 'build_cmd')}
              className="text-stone-400 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-stone-500 text-[11px]">
            The <code>dist/</code> folder contains static HTML, CSS, and JS that can be hosted on GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any traditional web server.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
