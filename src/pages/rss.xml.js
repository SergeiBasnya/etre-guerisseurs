import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, ROUTES } from '../consts';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.date - a.data.date);

  return rss({
    title: `${SITE.name} — Blog`,
    description:
      'Articles et réflexions sur la voie toltèque, les accords, le magnétisme et l’art de vivre.',
    site: context.site ?? SITE.url,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: [post.data.category],
      author: post.data.author,
      link: `${ROUTES.blog}${post.id}/`,
    })),
    customData: '<language>fr-fr</language>',
  });
}
