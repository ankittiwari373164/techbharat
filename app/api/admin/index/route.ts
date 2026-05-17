// app/api/admin/index/route.ts
// =====================================================================
//  ADMIN TOOLBOX INDEX
// ---------------------------------------------------------------------
//  Single source-of-truth listing of every admin endpoint, what it
//  does, and the recommended sequence to run them in for an AdSense
//  reapplication. Hit GET /api/admin/index for the menu.
// =====================================================================
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    note: 'All endpoints below require admin login (cookie __tb_admin).',
    recommendedSequence: [
      {
        step: 1,
        op:   'AUDIT',
        url:  '/api/admin/bulk-quality-gate?op=analyze',
        does: 'Read-only audit. Returns per-article report: word count, filler verdict status, speculation count, fabricated-claim count, current noindex state.',
      },
      {
        step: 2,
        op:   'DRY-RUN SCRUB',
        url:  '/api/admin/scrub-content?dry=1',
        does: 'Preview which AI-tic phrases, fabricated claims, banned vocabulary, and boilerplate paragraphs would be removed. No changes saved.',
      },
      {
        step: 3,
        op:   'APPLY SCRUB',
        url:  '/api/admin/scrub-content',
        does: 'Strip AI-tic openers, fabricated experience claims, banned vocab, boilerplate paragraphs, and emoji nav bars from all article bodies. Idempotent.',
      },
      {
        step: 4,
        op:   'NOINDEX THIN',
        url:  '/api/admin/bulk-quality-gate?op=noindex-thin',
        does: 'Set noindex:true on articles that fail the quality gate (thin / filler verdict / heavily speculative / has fabricated claims). Articles passing the gate stay indexed.',
      },
      {
        step: 5,
        op:   'CLEAN VERDICTS',
        url:  '/api/fix-verdict',
        does: 'Delete remaining auto-generated filler verdicts from Redis.',
      },
      {
        step: 6,
        op:   'RE-AUDIT',
        url:  '/api/admin/bulk-quality-gate?op=analyze',
        does: 'Confirm final state. currentlyNoindexed should equal failingQualityGate.',
      },
      {
        step: 7,
        op:   'PING SITEMAP',
        url:  'Submit https://thetechbharat.com/sitemap.xml in Google Search Console',
        does: 'Tell Google about the cleaned sitemap so the noindexed articles drop out of the index.',
      },
    ],
    allEndpoints: [
      {
        path:        '/api/admin/bulk-quality-gate',
        ops:         ['analyze', 'noindex-all', 'noindex-thin', 'restore', 'restore-all'],
        description: 'Bulk article quality gate. Reads, flags, and restores noindex state.',
      },
      {
        path:        '/api/admin/scrub-content',
        ops:         ['default', '?dry=1'],
        description: 'Scrubs AI-tic phrases, fabricated claims, banned vocab, and boilerplate from article bodies.',
      },
      {
        path:        '/api/fix-verdict',
        description: 'Deletes auto-generated filler verdicts from Redis.',
      },
      {
        path:        '/api/admin/generate-evergreen',
        description: 'Generate a new evergreen pillar/comparison article from a topic id.',
      },
      {
        path:        '/api/admin/rewrite-thin',
        description: 'Trigger LLM rewrites for thin articles (uses ANTHROPIC_API_KEY).',
      },
      {
        path:        '/api/admin/articles',
        description: 'List/edit articles directly.',
      },
    ],
  }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
