import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightBlog from 'starlight-blog';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    worker: {
      format: 'es',
    },
  },
  integrations: [
    starlight({
      title: 'GritQL',
      description:
        'GritQL is a declarative query language for searching and modifying source code.',
      logo: {
        dark: './src/assets/grit-logo-dark.svg',
        light: './src/assets/grit-logo-light.svg',
        alt: 'GritQL',
        replacesTitle: true,
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/getgrit/gritql',
        },
        {
          icon: 'discord',
          label: 'Discord',
          href: 'https://discord.gg/ARExD4gvFB',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/getgrit/gritql/edit/main/docs/',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { slug: 'index', label: 'Overview' },
            { slug: 'cli/quickstart' },
            { slug: 'cli/reference' },
            {
              label: 'Pattern Library',
              link: '/patterns',
            },
            { slug: 'guides/config' },
          ],
        },
        {
          label: 'Language',
          items: [
            { slug: 'language/overview' },
            { slug: 'tutorials/gritql' },
            { slug: 'language/patterns' },
            { slug: 'language/conditions' },
            { slug: 'language/modifiers' },
            { slug: 'language/target-languages' },
            { slug: 'language/bubble' },
            { slug: 'guides/patterns' },
            { slug: 'language/functions' },
            { slug: 'language/idioms' },
            { slug: 'language/syntax' },
            { slug: 'guides/testing' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { slug: 'guides/ci' },
            { slug: 'guides/authoring' },
            { slug: 'guides/imports' },
            { slug: 'guides/sharing' },
            { slug: 'guides/duplicating' },
          ],
        },
        {
          label: 'Resources',
          items: [
            { label: 'Playground', link: '/playground' },
            { label: 'Blog', link: '/blog' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      plugins: [
        starlightBlog({
          title: 'Blog',
          authors: {
            morgante: {
              name: 'Morgante Pell',
              title: 'CEO, Grit',
              picture: '/morgante.jpeg',
            },
          },
        }),
      ],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon.svg',
            type: 'image/svg+xml',
          },
        },
      ],
    }),
    react(),
  ],
});
