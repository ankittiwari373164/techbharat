// Browser Console Script - Paste into any article page
// Checks if article is index-worthy

(function() {
  console.clear();
  console.log('%c🔍 TheTechBharat SEO Content Audit', 'font-size: 16px; font-weight: bold; color: #d4220a;');
  console.log('%c=' + '='.repeat(50), 'color: #d4220a;');

  const audit = {
    passed: [],
    warnings: [],
    failed: []
  };

  // 1. Word Count
  const text = document.body.innerText;
  const wordCount = text.trim().split(/\s+/).length;
  console.log(`\n📝 Word Count: ${wordCount}`);
  if (wordCount >= 1000) {
    audit.passed.push(`✅ Word count (${wordCount}) meets minimum 1000`);
  } else if (wordCount >= 600) {
    audit.warnings.push(`⚠️ Word count (${wordCount}) is below recommended 1000`);
  } else {
    audit.failed.push(`❌ Word count (${wordCount}) is too low (need 1000+)`);
  }

  // 2. Internal Links
  const internalLinks = Array.from(document.querySelectorAll('a[href^="/"]:not([href*="#"])'))
    .filter(a => !a.href.includes('facebook') && !a.href.includes('twitter') && !a.href.includes('whatsapp'));
  console.log(`\n🔗 Internal Links: ${internalLinks.length}`);
  if (internalLinks.length >= 3) {
    audit.passed.push(`✅ Internal links (${internalLinks.length}) meets minimum 3`);
  } else {
    audit.failed.push(`❌ Only ${internalLinks.length} internal links (need 3+)`);
  }

  // 3. Headings Structure
  const h2s = document.querySelectorAll('h2').length;
  const h3s = document.querySelectorAll('h3').length;
  console.log(`\n📊 Headings: H2 (${h2s}), H3 (${h3s})`);
  if (h2s >= 3) {
    audit.passed.push(`✅ Heading structure (${h2s} H2s) is good`);
  } else {
    audit.warnings.push(`⚠️ Only ${h2s} H2 headings (recommend 3+)`);
  }

  // 4. Images
  const images = document.querySelectorAll('img[alt]').length;
  console.log(`\n🖼️  Images with alt text: ${images}`);
  if (images >= 2) {
    audit.passed.push(`✅ Images with alt text (${images})`);
  } else {
    audit.warnings.push(`⚠️ Only ${images} images with alt text (recommend 2+)`);
  }

  // 5. Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  const descLength = metaDesc?.getAttribute('content')?.length || 0;
  console.log(`\n📌 Meta Description: ${descLength} characters`);
  if (descLength >= 120 && descLength <= 160) {
    audit.passed.push(`✅ Meta description (${descLength}ch) is optimal`);
  } else {
    audit.warnings.push(`⚠️ Meta description (${descLength}ch) should be 120-160ch`);
  }

  // 6. Schema Markup
  const jsonLd = document.querySelectorAll('script[type="application/ld+json"]').length;
  console.log(`\n🏗️  Schema Markup: ${jsonLd} scripts`);
  if (jsonLd >= 2) {
    audit.passed.push(`✅ Schema markup (${jsonLd} JSON-LD scripts) is present`);
  } else {
    audit.warnings.push(`⚠️ Only ${jsonLd} schema scripts (recommend 2+)`);
  }

  // 7. Unique Content Check
  const paragraphs = document.querySelectorAll('p, li');
  let uniqueText = new Set();
  paragraphs.forEach(p => {
    const text = p.innerText.trim().substring(0, 50);
    if (text.length > 20) uniqueText.add(text);
  });
  const uniquePercentage = (uniqueText.size / paragraphs.length) * 100;
  console.log(`\n🔄 Content Uniqueness: ${uniquePercentage.toFixed(0)}%`);
  if (uniquePercentage > 80) {
    audit.passed.push(`✅ Content is unique (${uniquePercentage.toFixed(0)}%)`);
  } else {
    audit.warnings.push(`⚠️ Content uniqueness (${uniquePercentage.toFixed(0)}%) could be higher`);
  }

  // Print Results
  console.log('\n%c' + '='.repeat(50), 'color: #d4220a;');
  console.log('%c✅ PASSED', 'color: #2a6b3c; font-weight: bold;');
  audit.passed.forEach(msg => console.log('  ' + msg));
  
  console.log('%c⚠️  WARNINGS', 'color: #ff9800; font-weight: bold;');
  audit.warnings.forEach(msg => console.log('  ' + msg));
  
  console.log('%c❌ FAILED', 'color: #d4220a; font-weight: bold;');
  audit.failed.forEach(msg => console.log('  ' + msg));

  // Score Calculation
  const score = (audit.passed.length / (audit.passed.length + audit.failed.length)) * 100 || 0;
  console.log(`\n%c📈 Overall Score: ${score.toFixed(0)}/100`, 'font-size: 14px; font-weight: bold; color: ' + (score >= 80 ? '#2a6b3c' : score >= 60 ? '#ff9800' : '#d4220a') + ';');

  if (score >= 80) {
    console.log('%c✅ This article is READY FOR INDEXING', 'background: #2a6b3c; color: white; padding: 8px; border-radius: 4px; font-weight: bold;');
  } else if (score >= 60) {
    console.log('%c⚠️  This article needs improvements', 'background: #ff9800; color: white; padding: 8px; border-radius: 4px; font-weight: bold;');
  } else {
    console.log('%c❌ This article is NOT READY', 'background: #d4220a; color: white; padding: 8px; border-radius: 4px; font-weight: bold;');
  }

  console.log('%c' + '='.repeat(50), 'color: #d4220a;');
  console.log('\n💡 Quick Fixes:\n1. Ensure 1000+ words\n2. Add 3+ internal links\n3. Use 3+ H2 headings\n4. Add alt text to images\n5. Write unique content\n');
})();