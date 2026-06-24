import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// ─── PALETTE ───────────────────────────────────────────────
const SAG = "#5FA87D", SLDARK = "#3D7A5A", SLITE = "#E8F5EE";
const PCH = "#F4956B", PCHLITE = "#FEF0E8";
const TEL = "#4BBDAA";
const BG = "#F6FAF8", DARK = "#1E2A3A", MUT = "#6B7A8D", BRD = "#E5EBF0";

// ─── TASK DATABASE (52 tasks, 13 weeks, 3 phases) ──────────
const TASKS = [
  // ── PHASE 1: FOUNDATION (Weeks 1–4) ──
  {id:1,d:1,w:1,ph:1,cat:"marketplace",dur:"60m",pri:"high",
   title:"Amazon listing audit — all 3 packs",
   desc:"Score title, bullets, images, A+, reviews, Q&A for each pack. Note all gaps vs. top 3 competitors.",
   tip:"Use Amazon Search on mobile to see exactly what buyers see. Benchmark CVR vs. category average."},
  {id:2,d:2,w:1,ph:1,cat:"marketplace",dur:"45m",pri:"high",
   title:"Keyword research — cloth nappy India",
   desc:"Find 50+ keywords: cloth nappy, reusable nappy, muslin nappy, baby nappy pack, cotton nappy 0-3m.",
   tip:"Amazon Search Suggest is free and gold. Also try: Helium10 free tier, Google Keyword Planner."},
  {id:3,d:3,w:1,ph:1,cat:"marketplace",dur:"45m",pri:"high",
   title:"Rewrite all 3 Amazon titles (keyword-rich)",
   desc:"Format: [Brand] [Primary KW] — Pack of [N] | [Material] | [Benefit] | [Prints]. Under 200 chars.",
   tip:'"MiniBeanz Cloth Nappy Pack of 12 | 100% Soft Cotton | Reusable | Dinosaur + 5 Fun Prints for Baby"'},
  {id:4,d:4,w:1,ph:1,cat:"marketplace",dur:"45m",pri:"high",
   title:"Rewrite 5 bullet points per listing",
   desc:"Format: BENEFIT IN CAPS → feature detail → proof/specificity. Cover: softness, prints, wash-ease, eco, size.",
   tip:'"🌿 100% SOFT COTTON — Free from synthetic irritants. Dermatologist-tested for newborn skin safety."'},
  {id:5,d:5,w:1,ph:1,cat:"marketplace",dur:"30m",pri:"high",
   title:"Mirror listing updates on Flipkart",
   desc:"Apply same title/bullet improvements. Flipkart buyers are more price-sensitive — lead with ₹/nappy value.",
   tip:'"Pack of 12 @ ₹599 = just ₹50/nappy. Washes 300+ times. Zero recurring cost." — Use this angle.'},
  {id:6,d:6,w:1,ph:1,cat:"social",dur:"30m",pri:"high",
   title:"Set up Instagram Business account",
   desc:"Mascot as profile pic, keyword bio, Beacons/Linktree, set up 5 Highlights: Products, Reviews, Care, FAQ, Prints.",
   tip:'Bio: "🫘 Soft. Stylish. Sustainable. | Premium cloth nappies | 100% cotton | Shop 👇"'},
  {id:7,d:7,w:1,ph:1,cat:"social",dur:"60m",pri:"medium",
   title:"Post #1: Color reveal Reel",
   desc:"Flatlay of all 7 prints. Trending audio. 15 seconds. Quick cuts (1s/print). End with pack shot.",
   tip:"Film in natural light on white surface. Add text: 'Which one is your baby's vibe? 🦕🎵🅰️🐠'"},

  {id:8,d:8,w:2,ph:1,cat:"paid",dur:"45m",pri:"high",
   title:"Launch Amazon Auto SP — Pack of 6",
   desc:"₹200/day auto campaign. Default bids. Do NOT optimize for first 7 days — let Amazon learn.",
   tip:"Auto campaigns discover your converting search terms organically. Patience here pays off."},
  {id:9,d:9,w:2,ph:1,cat:"paid",dur:"30m",pri:"high",
   title:"Launch Amazon SP — Pack of 12 & Pack of 18",
   desc:"Clone Pack 6 structure. ₹150/day each. Target ACOS <40% in Month 1. Pack 18 = highest margin.",
   tip:"Pack 12 usually has best CVR. Pack 18 best margin. Watch both closely before scaling."},
  {id:10,d:10,w:2,ph:1,cat:"paid",dur:"45m",pri:"high",
   title:"Set up Facebook Business Manager",
   desc:"FB Business → Add IG → Create Ad Account → Install Meta Pixel → Add payment method.",
   tip:"Pixel on landing page + Amazon Attribution link = complete cross-channel tracking."},
  {id:11,d:11,w:2,ph:1,cat:"paid",dur:"60m",pri:"high",
   title:"Design 3 Meta ad creatives in Canva",
   desc:"Creative A: 6-color flatlay. B: Single print + benefit overlay. C: Pack 12 + price comparison vs. disposables.",
   tip:"1080×1080 for feed. 1080×1920 for Stories. Text under 20% of image. Show all prints on A."},
  {id:12,d:12,w:2,ph:1,cat:"paid",dur:"45m",pri:"high",
   title:"Launch Meta Awareness Campaign",
   desc:"Target: Women 22–35, new parents, India Tier 1+2. Objective: Traffic to Amazon. ₹300/day.",
   tip:"Interests: parenting, baby care, eco-friendly, new mom groups. No lookalike yet — build data first."},
  {id:13,d:13,w:2,ph:1,cat:"paid",dur:"30m",pri:"medium",
   title:"Launch Flipkart Product Listing Ads",
   desc:"All 3 packs. ₹100/day each. Search ads using top keywords from Amazon research.",
   tip:"ads.flipkart.com → Search Ads. Prioritize Pack 12 — best price-value fit for Flipkart buyers."},
  {id:14,d:14,w:2,ph:1,cat:"social",dur:"60m",pri:"medium",
   title:"Post #2: 'Real cost of disposables' Reel",
   desc:"Show the math: ₹8/diaper × 8/day × 30 days = ₹1,920/month. MiniBeanz Pack 12: ₹599 one-time.",
   tip:"Hook: 'You're spending ₹1,920/month on diapers. There's a smarter way 👀'"},

  {id:15,d:15,w:3,ph:1,cat:"analytics",dur:"45m",pri:"high",
   title:"Amazon campaign audit — Week 1 data",
   desc:"Review auto campaign search terms. Add top converters to manual list. Negative irrelevant terms.",
   tip:"Pause terms with >10 clicks, 0 sales. High-CTR terms → manual exact match campaign."},
  {id:16,d:16,w:3,ph:1,cat:"paid",dur:"45m",pri:"high",
   title:"Launch Amazon Manual SP campaigns",
   desc:"Take top 10–15 keywords from auto data. Manual exact + phrase targeting. ₹200/day total.",
   tip:"Set manual bids 20–30% above suggested. Review weekly, not daily. Patience."},
  {id:17,d:17,w:3,ph:1,cat:"social",dur:"45m",pri:"medium",
   title:"Post #3: Size guide carousel (8 slides)",
   desc:"Age vs. weight vs. nappy size guide. Educational, save-worthy. Saves = algorithm signal.",
   tip:"Reduces DM questions and returns. Pin as Instagram Highlight: 'Size Guide'."},
  {id:18,d:18,w:3,ph:1,cat:"partnerships",dur:"60m",pri:"medium",
   title:"Influencer outreach — 20 DMs",
   desc:"New mom micro-influencers, 2K–20K followers, 4%+ engagement. Barter: product for honest Reel.",
   tip:"Template: 'Hi [name]! Loved your post on [topic]. We'd love to send you our MiniBeanz pack 🫘'"},
  {id:19,d:19,w:3,ph:1,cat:"paid",dur:"45m",pri:"medium",
   title:"Set up Google Search Ads",
   desc:"Campaigns: 'cloth nappy india', 'reusable baby nappy', 'cotton nappy pack'. ₹200/day total.",
   tip:"Max Clicks bidding to start. India only. Sitelinks to all 3 pack sizes."},
  {id:20,d:20,w:3,ph:1,cat:"content",dur:"60m",pri:"high",
   title:"Landing page wireframe + content plan",
   desc:"Plan 8 sections: Hero, Trust Bar, Problem, Products, How-to-Wash, Reviews, FAQ, Final CTA.",
   tip:"Carrd (free) or Webflow (more control). Mobile-first. LP enables Meta Conversion tracking."},
  {id:21,d:21,w:3,ph:1,cat:"social",dur:"60m",pri:"medium",
   title:"Post #4: 3-minute washing tutorial Reel",
   desc:"Show complete wash routine: soak → rinse → machine wash → air dry. 30 seconds.",
   tip:"Hook: 'This took me 3 minutes total 😮 (cloth nappy wash routine)' — kills the #1 objection."},

  {id:22,d:22,w:4,ph:1,cat:"analytics",dur:"30m",pri:"high",
   title:"Amazon ACOS analysis by pack size",
   desc:"Check ACOS per SKU. Targets: Pack 6 <45%, Pack 12 <35%, Pack 18 <30%.",
   tip:"Pack 18 should be most efficient (highest order value). Scale winners, pause underperformers."},
  {id:23,d:23,w:4,ph:1,cat:"paid",dur:"30m",pri:"medium",
   title:"Launch Sponsored Display — competitor targeting",
   desc:"Target top 5 competitor cloth nappy ASINs. Show MiniBeanz on their product pages. ₹100/day.",
   tip:"Visual hook: your 7 print variety vs. their plain options. Capture competitor consideration traffic."},
  {id:24,d:24,w:4,ph:1,cat:"content",dur:"180m",pri:"high",
   title:"Build landing page (Carrd / Webflow)",
   desc:"Hero with all 7 prints, product grid, wash guide, reviews section, Amazon + Flipkart CTAs.",
   tip:"Above fold must have: product image, headline, 'Shop on Amazon' button. Keep it fast."},
  {id:25,d:25,w:4,ph:1,cat:"paid",dur:"30m",pri:"medium",
   title:"Meta retargeting campaign",
   desc:"Custom Audience: LP visitors (last 30 days). Objective: Conversion. ₹150/day.",
   tip:"Copy: 'Still thinking about MiniBeanz? 🫘 Your baby's favorite print is waiting.'"},
  {id:26,d:26,w:4,ph:1,cat:"marketplace",dur:"20m",pri:"high",
   title:"Request reviews via Amazon buyer-seller messaging",
   desc:"Use 'Request a Review' button on all orders 4–30 days old. Do this every single day.",
   tip:"Never incentivize reviews. First 10 reviews are the highest-impact growth milestone."},
  {id:27,d:27,w:4,ph:1,cat:"analytics",dur:"45m",pri:"high",
   title:"Phase 1 performance report",
   desc:"Snapshot all channels: Amazon revenue + ACOS, Flipkart, Meta ROAS, IG followers, reviews count.",
   tip:"Create a Google Sheet tracker now. This weekly ritual will save you from spending blindly."},

  // ── PHASE 2: GROWTH (Weeks 5–8) ──
  {id:28,d:29,w:5,ph:2,cat:"paid",dur:"20m",pri:"high",
   title:"Scale best Amazon campaign +30%",
   desc:"If ACOS <35% on best campaign, increase daily budget by 30%. Monitor 5 days before next move.",
   tip:"Change one variable at a time. Budget up first. Then bid adjustments. Never both simultaneously."},
  {id:29,d:30,w:5,ph:2,cat:"content",dur:"30m",pri:"medium",
   title:"Set up WhatsApp Business account",
   desc:"WA Business app, product catalog, quick replies, green check verification. Add to LP and IG bio.",
   tip:"WhatsApp: 65–70% open rate for baby brands vs. 15% email. Build this list obsessively."},
  {id:30,d:31,w:5,ph:2,cat:"social",dur:"60m",pri:"high",
   title:"Post #5: Price comparison Reel",
   desc:"₹1,920/month (disposables) vs. ₹599 one-time (MiniBeanz Pack 12). Let the math do the selling.",
   tip:"Show a receipt or calculator dramatically. Strong save-and-share mechanic."},
  {id:31,d:33,w:5,ph:2,cat:"paid",dur:"30m",pri:"high",
   title:"Upgrade Meta to Conversion objective",
   desc:"Switch from Traffic to Conversion (Purchase/Add to Cart via Amazon Attribution). ₹300/day.",
   tip:"This requires both Meta Pixel and Amazon Attribution active. Major ROAS unlock."},
  {id:32,d:34,w:5,ph:2,cat:"paid",dur:"45m",pri:"medium",
   title:"Launch Google Shopping campaign",
   desc:"Google Merchant Center feed → Shopping campaign for all 3 packs. ₹150/day.",
   tip:"Shopping ads show product image + price. Very high purchase intent. Outperforms Search for baby."},
  {id:33,d:35,w:5,ph:2,cat:"analytics",dur:"60m",pri:"high",
   title:"Month 1 full performance audit",
   desc:"Deep-dive: actual vs. projected revenue, ROAS by channel, top SKU, review count, follower growth.",
   tip:"Key question: which channel has the best ROAS? Double it. Redirect budget from bottom channel."},
  {id:34,d:36,w:6,ph:2,cat:"content",dur:"60m",pri:"medium",
   title:"Landing page CRO pass",
   desc:"Add: star rating above fold, '3,200+ happy babies' social proof, shipping info, review screenshots.",
   tip:"Trust signals above fold = single biggest LP conversion lift. Real parent photos > stock images."},
  {id:35,d:38,w:6,ph:2,cat:"marketplace",dur:"120m",pri:"high",
   title:"A+ Content for all Amazon listings",
   desc:"Print showcase grid, material story, care guide infographic, pack size comparison chart.",
   tip:"Requires Brand Registry. A+ Content boosts CVR 5–10% on average. Worth the time investment."},
  {id:36,d:39,w:6,ph:2,cat:"social",dur:"60m",pri:"medium",
   title:"Launch YouTube Shorts channel",
   desc:"Repurpose top 3 Instagram Reels as YouTube Shorts. Keyword-rich titles and descriptions.",
   tip:"YouTube Shorts can rank organically for 'cloth nappy' searches for months. Free evergreen traffic."},
  {id:37,d:41,w:6,ph:2,cat:"partnerships",dur:"60m",pri:"medium",
   title:"Negotiate paid influencer deals",
   desc:"From outreach batch: 2 confirmed responders. Offer ₹2,000–5,000 + product for 1 Reel + 3 Stories.",
   tip:"Micro-influencers (10K–50K) in parenting: 3–5x better ROI than macro for baby products."},
  {id:38,d:43,w:7,ph:2,cat:"paid",dur:"20m",pri:"high",
   title:"Scale top Meta ad set +30%",
   desc:"If Meta ROAS >2x for 7 days, increase budget 30%. Keep creative and audience unchanged.",
   tip:"Creative fatigue starts ~Day 7–10. Prepare new creative when frequency hits 3.0."},
  {id:39,d:45,w:7,ph:2,cat:"content",dur:"60m",pri:"medium",
   title:"UGC creative collection",
   desc:"Request video testimonials from confirmed buyers. Offer a free pack of your choice as incentive.",
   tip:"UGC ads outperform brand ads 4–6x on Meta. Shaky phone footage converts better than polished ads."},
  {id:40,d:47,w:7,ph:2,cat:"marketplace",dur:"90m",pri:"medium",
   title:"Amazon Brand Store creation",
   desc:"Brand Store: Home page, All Products, Our Story. Use mascot in hero banner. Feature all prints.",
   tip:"Brand Store enables Sponsored Brand (Headline) ads with better ROAS than SP alone."},
  {id:41,d:49,w:7,ph:2,cat:"social",dur:"45m",pri:"medium",
   title:"Post #8: '5 things I wish I knew' carousel",
   desc:"Educational carousel about switching to cloth nappies. Max shareability, save-worthy format.",
   tip:"Title: '5 Things I Wish I Knew Before Switching to Cloth Nappies 🧺' — drives saves + DMs."},
  {id:42,d:50,w:8,ph:2,cat:"analytics",dur:"90m",pri:"high",
   title:"Month 2 full audit",
   desc:"Channel P&L: revenue minus ad spend per channel. Identify profitable vs. cash-burning channels.",
   tip:"If any channel shows negative return after 45 days with real effort — cut it. Redirect budget."},
  {id:43,d:53,w:8,ph:2,cat:"paid",dur:"30m",pri:"high",
   title:"Meta Lookalike Audience campaign",
   desc:"1% Lookalike from Amazon Attribution purchase events. ₹300/day. Conversion objective.",
   tip:"Lookalikes from actual buyers = 2–4x better ROAS than interest-based targeting."},

  // ── PHASE 3: SCALE (Weeks 9–13) ──
  {id:44,d:57,w:9,ph:3,cat:"paid",dur:"20m",pri:"high",
   title:"Scale Amazon to ₹500/day total",
   desc:"If ACOS <30% consistently for 2 weeks, scale total Amazon budget to ₹500/day.",
   tip:"Amazon flywheel: more paid sales → better BSR → more organic discovery → more sales."},
  {id:45,d:58,w:9,ph:3,cat:"marketplace",dur:"30m",pri:"high",
   title:"Enable Subscribe & Save — Pack 12 + Pack 18",
   desc:"Amazon Subscribe & Save gives buyers 5–15% discount on recurring orders.",
   tip:"Families buying new prints repeatedly = perfect Subscribe & Save customers. Builds predictable LTV."},
  {id:46,d:60,w:9,ph:3,cat:"marketplace",dur:"60m",pri:"medium",
   title:"FirstCry marketplace onboarding",
   desc:"Apply to FirstCry.com — India's largest dedicated baby products marketplace.",
   tip:"FirstCry buyers are specifically shopping for baby products. Premium intent, lower CAC than Meta."},
  {id:47,d:63,w:9,ph:3,cat:"partnerships",dur:"60m",pri:"medium",
   title:"Hospital partnership outreach",
   desc:"Contact 5 maternity hospitals/clinics. Propose: MiniBeanz sample in new mom discharge kit.",
   tip:"Discharge kits reach parents at peak intent moment. 2–5% conversion on samples = strong ROI."},
  {id:48,d:69,w:10,ph:3,cat:"paid",dur:"45m",pri:"high",
   title:"Meta price-comparison creative",
   desc:"Split-screen: ₹1,920/month (disposables) vs. ₹599 one-time (Pack 12). Mascot in graphic.",
   tip:"Price-comparison creatives have the highest CTR in baby category. A/B vs. lifestyle creative."},
  {id:49,d:72,w:11,ph:3,cat:"marketplace",dur:"30m",pri:"high",
   title:"BSR sprint — Lightning Deal or coupon",
   desc:"Run a 7-day coupon (10–15% off) on Pack 12 to spike sales velocity and improve BSR.",
   tip:"Target: break into top 5,000 BSR in Baby category for better organic discovery."},
  {id:50,d:76,w:12,ph:3,cat:"analytics",dur:"90m",pri:"high",
   title:"90-day performance report",
   desc:"Full analysis: revenue growth, ROAS by channel, reviews gained, follower growth, key learnings.",
   tip:"This becomes your Q2 playbook. Document what worked, what didn't, and your #1 hypothesis."},
  {id:51,d:79,w:12,ph:3,cat:"content",dur:"60m",pri:"medium",
   title:"6-month scale roadmap",
   desc:"Plan months 4–6: Myntra/Nykaa Baby expansion, new SKU ideas, offline pilot, PR strategy.",
   tip:"By month 3 you'll know your most profitable customer type and channel. Plan from real data."},
  {id:52,d:82,w:13,ph:3,cat:"social",dur:"30m",pri:"medium",
   title:"Milestone: 90-day journey post",
   desc:"Authentic founder post: where you started, what happened, real numbers, key lessons.",
   tip:"Founders sharing real journey data builds massive brand trust. Buyers love the origin story."},
];

// ─── SOCIAL CALENDAR ───────────────────────────────────────
const SOCIAL = [
  {w:1,type:"Reel",title:"Color reveal — all 7 prints",hook:'"Which one is your baby\'s vibe? 🦕🎵🅰️🐠"',tips:"15s, trending audio, quick cuts 1s/print. End: pack shot + 'link in bio'."},
  {w:1,type:"Story",title:"Brand intro — meet MiniBeanz",hook:'"Soft. Stylish. Sustainable. 🫘"',tips:"5-slide story: mascot reveal → product → mission → reviews → shop link."},
  {w:2,type:"Reel",title:"Real cost of disposables calculator",hook:'"₹1,920/month on diapers? Watch this 👀"',tips:"Show the math dramatically. End with Pack 12 shot. Strong share mechanic."},
  {w:3,type:"Carousel",title:"Size guide — which pack is right?",hook:'"New to cloth nappies? Start here 👇"',tips:"8 slides, educational, save-worthy. Pin as Highlight 'Size Guide'."},
  {w:3,type:"Reel",title:"3-minute washing tutorial",hook:'"This took me 3 minutes total 😮"',tips:"Soak → rinse → machine → air dry. Kills the #1 objection. Strong saves."},
  {w:4,type:"Poll Story",title:"Your biggest concern about cloth?",hook:'"Be honest — what\'s stopping you?"',tips:"Options: 'Too much washing' vs 'Comfort'. DM all responders personally."},
  {w:5,type:"Reel",title:"Before vs. after: our diaper spend",hook:'"I spent ₹23,000 on diapers in 1 year."',tips:"Emotional storytelling + MiniBeanz solution. Real numbers build trust."},
  {w:5,type:"Carousel",title:"5 prints for 5 moods",hook:'"Because babies deserve cute nappies too 🎵🦕🅰️🐠🌈"',tips:"1 print per slide with fun character description. End with shop CTA."},
  {w:6,type:"UGC Post",title:"Customer review spotlight",hook:'"Real mom. Real review. 💚"',tips:"Screenshot Amazon review + flatlay. DM for permission first always."},
  {w:6,type:"Reel",title:"Why we started MiniBeanz",hook:'"We made this for our niece. Now 3,000+ babies wear it."',tips:"Raw, real founder story. No polish needed. Authenticity wins."},
  {w:7,type:"Carousel",title:"5 things I wish I knew before switching",hook:'"Switching to cloth? Read this first. 🧺"',tips:"Educational, save-worthy. High shares → algorithm push. Tag in community groups."},
  {w:8,type:"Reel",title:"90-day journey milestone",hook:'"0 reviews → 100+ reviews in 90 days. Here\'s how."',tips:"Real numbers, real journey. Milestone posts drive follower growth."},
];

// ─── LANDING PAGE SECTIONS ─────────────────────────────────
const LP_SECTIONS = [
  {n:1,title:"Hero Section",color:SAG,items:["Headline: 'The Cloth Nappy Your Baby Will Actually Love'","All 7 prints in flatlay image (above fold)","Primary CTA button: 'Shop Pack of 12 — ₹599'","Trust anchor: '3,200+ happy babies | 4.8★ | Cotton-soft guarantee'"]},
  {n:2,title:"Social Proof Bar",color:TEL,items:["⭐ 4.8/5 (320 reviews) displayed prominently","Marketplace logos: Amazon • Flipkart • FirstCry","Parent count: 'Trusted by 3,200+ families across India'"]},
  {n:3,title:"Problem Block",color:PCH,items:["Headline: 'What If Diapers Didn\\'t Have to Be This Expensive?'","₹1,920/month cost calculation shown visually","4 common irritants in disposables (illustrated)","Transition line: 'There\\'s a softer, smarter choice.' ↓"]},
  {n:4,title:"Product Showcase",color:"#8B5CF6",items:["Pack 6, 12, 18 comparison (price, contents, best for)","All 7 prints named and individually photographed","Price-per-nappy math: 'Just ₹50/nappy. Washes 300+ times.'","Direct 'Buy Now' buttons → Amazon + Flipkart per pack"]},
  {n:5,title:"How It Works",color:"#F59E0B",items:["3-step visual: Buy → Wash → Reuse","Machine wash 30°C, air dry. No soaking required.","Expected lifespan: 2–3 years with proper care","Embedded or linked: 3-minute washing tutorial Reel"]},
  {n:6,title:"Reviews Section",color:SAG,items:["5 named reviews with parent photos (permission required)","Star rating summary: '320 reviews, 4.8★ average'","1 UGC video testimonial embedded","Badge: 'Verified purchases on Amazon'"]},
  {n:7,title:"FAQ Block",color:TEL,items:["Q: Aren't cloth nappies hard to clean? → 3 mins, machine washable","Q: Will my baby be comfortable? → 100% cotton, no irritants","Q: How many do I need? → 12 minimum for full daily rotation","Q: What size fits my baby? → Size guide (link to Highlight)"]},
  {n:8,title:"Final CTA",color:PCH,items:["Headline: 'Start Your Cloth Nappy Journey Today'","Pack 12 as primary recommendation ('Most Popular' badge)","Amazon + Flipkart buttons (large, high contrast, bright)","WhatsApp chat link: 'Got questions? Chat with us ↗'"]},
];

// ─── PAID MARKETING GUIDES ─────────────────────────────────
const PAID_GUIDES = [
  {platform:"Amazon Ads",col:"#FF9900",icon:"AMZ",steps:[
    {s:"Step 1: Auto SP Campaign",d:"₹200/day per pack. Default bids. Run 7 days untouched. Let Amazon discover converting search terms organically."},
    {s:"Step 2: Manual SP Campaign",d:"After 7 days: take top converting terms from auto. Manual exact+phrase targeting. Bids 20–30% above suggested."},
    {s:"Step 3: Sponsored Display",d:"Target top 5 competitor cloth nappy ASINs. ₹100/day. Show MiniBeanz on their product pages as a visual upgrade."},
    {s:"Step 4: Sponsored Brand (Brand Registry)",d:"Headline + Logo + 3 products. Drive to Brand Store. Better ROAS than SP alone for brand + category searches."},
    {s:"Step 5: ACOS Targets",d:"Pack 6: <45% | Pack 12: <35% | Pack 18: <30%. Scale campaigns hitting targets. Pause after 14 days with no sales."},
  ]},
  {platform:"Meta Ads",col:"#1877F2",icon:"META",steps:[
    {s:"Step 1: Account Setup",d:"FB Business Manager → Create Ad Account → Install Meta Pixel on LP → Connect Instagram → Set payment."},
    {s:"Step 2: Month 1 — Awareness",d:"Objective: Traffic to Amazon. Women 22–35, new parents, India Tier 1+2. Interests: parenting, eco. ₹300/day."},
    {s:"Step 3: Month 2 — Conversion",d:"Switch to Conversion objective (requires Amazon Attribution). Retargeting: LP visitors 30 days. ₹300+/day."},
    {s:"Step 4: Month 3 — Lookalike",d:"1% Lookalike from Amazon Attribution purchase events. ₹400+/day. This channel 2–4x better ROAS than interest."},
    {s:"Step 5: Creative Rotation",d:"Rotate every 7–10 days when frequency hits 3.0. Always test: flatlay vs. UGC vs. price-comparison vs. tutorial."},
  ]},
  {platform:"Google Ads",col:"#4285F4",icon:"GOOG",steps:[
    {s:"Step 1: Search Campaign",d:"Keywords: 'cloth nappy india', 'reusable baby nappy', 'cotton nappy pack'. ₹200/day. Max Clicks bidding."},
    {s:"Step 2: Shopping Campaign",d:"Google Merchant Center → Shopping campaign for all 3 packs. ₹150/day. Very high-intent buyers."},
    {s:"Step 3: Brand Protection",d:"Bid on 'MiniBeanz' brand keywords. Very low cost. Prevents competitors from appearing on branded searches."},
    {s:"Step 4: Sitelink Extensions",d:"Add sitelinks to all 3 pack sizes + Size Guide + Care Instructions. Increases CTR and Quality Score."},
    {s:"Step 5: ROAS Targets",d:"Month 1: 1.5x+ | Month 2: 2.2x+ | Month 3: 3.0x+. Shopping usually outperforms Search for baby products."},
  ]},
  {platform:"Flipkart Ads",col:"#2874F0",icon:"FKRT",steps:[
    {s:"Step 1: Product Listing Ads",d:"ads.flipkart.com → Search Ads. All 3 packs. ₹100/day each. Keyword-targeted using Amazon research."},
    {s:"Step 2: Value Messaging",d:"Flipkart buyers are price-sensitive. Lead with '₹50/nappy' and 'washes 300+ times' in ad copy."},
    {s:"Step 3: Optimization",d:"Target ACOS <40%. Flipkart ROAS is typically lower than Amazon. Give it 21 days before judging performance."},
    {s:"Step 4: Seasonal Spikes",d:"Flipkart Big Billion Days + Baby Week = 3–5x normal traffic. Plan ₹500/day budget for those weeks."},
  ]},
];

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function MiniBeanzOS() {
  const [wizDone, setWizDone]   = useState(false);
  const [wizStep, setWizStep]   = useState(0);
  const [form, setForm]         = useState({
    brandName:"MiniBeanz", amazonUrl:"", flipkartUrl:"",
    p6Price:349, p6Cost:120, p12Price:599, p12Cost:200, p18Price:799, p18Cost:280,
    curAmzUnits:50, curFlkUnits:20, reviews:12, igFollowers:200,
    budget:15000, amzPct:50, metaPct:30, gPct:20,
    targetRev:200000, focus:"volume",
  });
  const [tab,          setTab]         = useState(0);
  const [completed,    setCompleted]   = useState({});
  const [wkFilter,     setWkFilter]    = useState("all");
  const [catFilter,    setCatFilter]   = useState("all");
  const [phFilter,     setPhFilter]    = useState("all");
  const [expanded,     setExpanded]    = useState({});
  const [ctype,        setCtype]       = useState("amazon_title");
  const [extraCtx,     setExtraCtx]    = useState("");
  const [copyText,     setCopyText]    = useState("");
  const [generating,   setGenerating]  = useState(false);

  useEffect(() => {
    const el = document.createElement("link");
    el.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Inter:wght@400;500;600&display=swap";
    el.rel  = "stylesheet";
    document.head.appendChild(el);
  }, []);

  const upd = (k, v) =>
    setForm(f => ({ ...f, [k]: v !== "" && !isNaN(v) && typeof v !== "boolean" ? Number(v) : v }));

  // ── Revenue projections ───
  const rev = useMemo(() => {
    const avg   = form.p6Price * 0.3 + form.p12Price * 0.5 + form.p18Price * 0.2;
    const cur   = (form.curAmzUnits + form.curFlkUnits) * avg;
    const aB    = form.budget * form.amzPct / 100;
    const mB    = form.budget * form.metaPct / 100;
    const gB    = form.budget * form.gPct  / 100;
    const mk    = (oF, aR, mR, gR) => {
      const o = Math.round(cur * oF);
      const a = Math.round(aB  * aR);
      const m = Math.round(mB  * mR);
      const g = Math.round(gB  * gR);
      return { organic: o, amazon: a, meta: m, google: g, total: o + a + m + g };
    };
    const m = [mk(1.2,3.0,1.3,1.5), mk(1.5,4.0,2.5,2.2), mk(1.8,5.0,3.2,3.0)];
    const spends = [form.budget, Math.round(form.budget*1.3), Math.round(form.budget*1.6)];
    const monthly = m.map((mx, i) => ({
      ...mx,
      label: `Month ${i+1}`,
      spend:  spends[i],
      profit: mx.total - spends[i],
      roas:   (mx.total / spends[i]).toFixed(1),
    }));
    const weekly = Array.from({ length: 13 }, (_, i) => {
      const w = i + 1;
      const f = w <= 4 ? 0.5 + w*0.12 : w <= 8 ? 0.98 + (w-4)*0.08 : 1.32 + (w-8)*0.05;
      return {
        week:    `W${w}`,
        revenue: Math.round(m[2].total / 13 * f),
        spend:   Math.round(spends[2] / 13),
      };
    });
    const units = [
      { pack:"Pack 6",  price:form.p6Price,  cost:form.p6Cost,  margin:form.p6Price -form.p6Cost,  pct:Math.round((form.p6Price -form.p6Cost)/form.p6Price *100) },
      { pack:"Pack 12", price:form.p12Price, cost:form.p12Cost, margin:form.p12Price-form.p12Cost, pct:Math.round((form.p12Price-form.p12Cost)/form.p12Price*100) },
      { pack:"Pack 18", price:form.p18Price, cost:form.p18Cost, margin:form.p18Price-form.p18Cost, pct:Math.round((form.p18Price-form.p18Cost)/form.p18Price*100) },
    ];
    return { monthly, weekly, units, avg, cur };
  }, [form]);

  const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}`;

  // ── AI copy ───
  const genCopy = async () => {
    setGenerating(true); setCopyText("");
    const prompts = {
      amazon_title:    `Write an Amazon India product title for MiniBeanz cloth nappies (Pack of 12, ₹${form.p12Price}). Include: cloth nappy, 100% cotton, reusable, 12 packs, fun prints (dinosaurs, fish, alphabets, music). Under 200 characters. Optimize for search. ${extraCtx}`,
      amazon_bullets:  `Write 5 Amazon bullet points for MiniBeanz cloth nappies (Pack of 12, ₹${form.p12Price}). Format: BENEFIT IN CAPS — feature detail — proof/specificity. Topics: cotton softness, print variety, machine-washable, eco-friendly, size fit. Indian market context. ${extraCtx}`,
      meta_ad:         `Write Meta ad copy for MiniBeanz cloth nappies (brand: ${form.brandName}). Target: new Indian moms. Headline (30 chars) + Primary Text (125 chars) + CTA. Problem: ₹1,920/month on disposables. Solution: Pack 12 at ₹${form.p12Price} one-time. Warm, relatable tone. ${extraCtx}`,
      instagram_caption:`Write an Instagram caption for MiniBeanz cloth nappies. Include: strong emotional hook, product benefit, print mention (dinosaurs/music/alphabets/fish), 10–12 relevant hashtags. Casual, warm, Indian-parent friendly. Pack 12 at ₹${form.p12Price}. ${extraCtx}`,
      lp_hero:         `Write landing page hero copy for MiniBeanz cloth nappies. Include: main headline (under 10 words), 2-line subheadline, CTA button text, 3 trust badge copy. Audience: Indian parents considering cloth nappies. Pack 12 at ₹${form.p12Price}. ${extraCtx}`,
      whatsapp:        `Write a WhatsApp Business post-purchase follow-up message for MiniBeanz cloth nappies. Include: thank you, care tip, washing reminder, soft review request. Under 150 words. Warm and personal. No hard sell. ${extraCtx}`,
    };
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompts[ctype] }],
        }),
      });
      const d = await r.json();
      setCopyText(d.content?.map(b => b.text || "").join("") || "No output.");
    } catch {
      setCopyText("Error generating copy. Please check your connection and try again.");
    }
    setGenerating(false);
  };

  // ── Helpers ───
  const cardStyle = { background:"white", borderRadius:12, padding:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", border:`1px solid ${BRD}` };
  const h1Style   = { fontFamily:"Nunito", fontWeight:800, color:DARK, margin:0 };
  const labelStyle= { display:"block", fontSize:11, fontWeight:700, color:MUT, marginBottom:4, textTransform:"uppercase", letterSpacing:.6 };
  const inputStyle= { width:"100%", padding:"8px 12px", borderRadius:8, border:`1.5px solid ${BRD}`, fontFamily:"Inter", fontSize:14, color:DARK, outline:"none", boxSizing:"border-box" };
  const btnStyle  = (bg) => ({ background:bg, color:"white", border:"none", borderRadius:8, padding:"10px 22px", fontFamily:"Inter", fontWeight:600, fontSize:14, cursor:"pointer" });

  const doneCnt  = Object.values(completed).filter(Boolean).length;
  const ph1Done  = TASKS.filter(t => t.ph===1 && completed[t.id]).length;
  const ph2Done  = TASKS.filter(t => t.ph===2 && completed[t.id]).length;
  const ph3Done  = TASKS.filter(t => t.ph===3 && completed[t.id]).length;
  const ph1Tot   = TASKS.filter(t => t.ph===1).length;
  const ph2Tot   = TASKS.filter(t => t.ph===2).length;
  const ph3Tot   = TASKS.filter(t => t.ph===3).length;

  const weeks = [...new Set(TASKS.map(t => t.w))].sort((a,b) => a-b);
  const cats  = [...new Set(TASKS.map(t => t.cat))].sort();
  const filtered = TASKS.filter(t =>
    (wkFilter==="all" || t.w===Number(wkFilter)) &&
    (catFilter==="all" || t.cat===catFilter) &&
    (phFilter==="all"  || t.ph===Number(phFilter))
  );

  const catColors = {
    marketplace:"#3B82F6", paid:PCH, social:"#8B5CF6", content:TEL,
    partnerships:"#F59E0B", analytics:"#6B7280", email:"#EF4444",
  };

  // ══════════════════════════════════════════════════════════
  // WIZARD
  // ══════════════════════════════════════════════════════════
  if (!wizDone) {
    const STEP_LABELS = ["Brand Info","Product Pricing","Current Sales","Ad Budget","Goals"];
    return (
      <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Inter", padding:20 }}>
        <div style={{ width:"100%", maxWidth:560 }}>
          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🫘</div>
            <h1 style={{ fontFamily:"Nunito", fontWeight:900, fontSize:30, color:DARK, margin:"0 0 8px" }}>MiniBeanz PM OS</h1>
            <p style={{ color:MUT, fontSize:15, margin:0 }}>Performance Marketing Setup · 90-Day Plan · Revenue Projections</p>
          </div>
          {/* Step bar */}
          <div style={{ display:"flex", gap:5, marginBottom:24 }}>
            {STEP_LABELS.map((_, i) => (
              <div key={i} style={{ flex:1, height:4, borderRadius:4, background:i<=wizStep ? SAG : "#E5EBF0", transition:"background 0.3s" }}/>
            ))}
          </div>
          <div style={{ ...cardStyle }}>
            <h2 style={{ ...h1Style, fontSize:18, marginBottom:4 }}>Step {wizStep+1}: {STEP_LABELS[wizStep]}</h2>
            <p style={{ color:MUT, fontSize:13, marginBottom:22 }}>
              {["Tell us about your brand on Amazon and Flipkart.","Enter your selling prices and all-in cost of goods.","How are you currently performing on both platforms?","What's your monthly marketing budget and channel split?","Set your 90-day revenue and growth goal."][wizStep]}
            </p>

            {wizStep===0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div><label style={labelStyle}>Brand Name</label><input style={inputStyle} value={form.brandName} onChange={e=>upd("brandName",e.target.value)} placeholder="MiniBeanz"/></div>
                <div><label style={labelStyle}>Amazon Store URL (optional)</label><input style={inputStyle} value={form.amazonUrl} onChange={e=>upd("amazonUrl",e.target.value)} placeholder="https://amazon.in/s?me=..."/></div>
                <div><label style={labelStyle}>Flipkart Store URL (optional)</label><input style={inputStyle} value={form.flipkartUrl} onChange={e=>upd("flipkartUrl",e.target.value)} placeholder="https://www.flipkart.com/seller/..."/></div>
              </div>
            )}
            {wizStep===1 && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[["Pack of 6","p6Price","p6Cost",form.p6Price,form.p6Cost],["Pack of 12","p12Price","p12Cost",form.p12Price,form.p12Cost],["Pack of 18","p18Price","p18Cost",form.p18Price,form.p18Cost]].map(([lbl,pk,ck,pv,cv]) => (
                  <div key={lbl}>
                    <label style={labelStyle}>{lbl}</label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      <div><label style={{ ...labelStyle, marginBottom:3 }}>Selling Price ₹</label><input style={inputStyle} type="number" value={pv} onChange={e=>upd(pk,e.target.value)}/></div>
                      <div><label style={{ ...labelStyle, marginBottom:3 }}>COGS (all-in) ₹</label><input style={inputStyle} type="number" value={cv} onChange={e=>upd(ck,e.target.value)}/></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {wizStep===2 && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div><label style={labelStyle}>Amazon Units/Month</label><input style={inputStyle} type="number" value={form.curAmzUnits} onChange={e=>upd("curAmzUnits",e.target.value)}/></div>
                  <div><label style={labelStyle}>Flipkart Units/Month</label><input style={inputStyle} type="number" value={form.curFlkUnits} onChange={e=>upd("curFlkUnits",e.target.value)}/></div>
                  <div><label style={labelStyle}>Amazon Reviews Count</label><input style={inputStyle} type="number" value={form.reviews} onChange={e=>upd("reviews",e.target.value)}/></div>
                  <div><label style={labelStyle}>Instagram Followers</label><input style={inputStyle} type="number" value={form.igFollowers} onChange={e=>upd("igFollowers",e.target.value)}/></div>
                </div>
                <div style={{ background:SLITE, borderRadius:8, padding:12, fontSize:13, border:`1px solid ${SAG}30` }}>
                  📊 Estimated current monthly revenue: <strong style={{ color:DARK, fontSize:16 }}>{fmt(rev.cur)}</strong>
                  <div style={{ color:MUT, fontSize:11, marginTop:2 }}>Avg price ₹{Math.round(rev.avg)} × {form.curAmzUnits + form.curFlkUnits} units</div>
                </div>
              </div>
            )}
            {wizStep===3 && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div><label style={labelStyle}>Total Monthly Marketing Budget ₹</label><input style={inputStyle} type="number" value={form.budget} onChange={e=>upd("budget",e.target.value)}/></div>
                <div>
                  <label style={labelStyle}>Channel Budget Split (%)</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <div><label style={{ ...labelStyle, marginBottom:3 }}>Amazon %</label><input style={inputStyle} type="number" value={form.amzPct} onChange={e=>upd("amzPct",e.target.value)}/></div>
                    <div><label style={{ ...labelStyle, marginBottom:3 }}>Meta %</label><input style={inputStyle} type="number" value={form.metaPct} onChange={e=>upd("metaPct",e.target.value)}/></div>
                    <div><label style={{ ...labelStyle, marginBottom:3 }}>Google %</label><input style={inputStyle} type="number" value={form.gPct} onChange={e=>upd("gPct",e.target.value)}/></div>
                  </div>
                </div>
                <div style={{ background:"#F5F7FA", borderRadius:8, padding:12 }}>
                  {[["Amazon Ads",SAG,form.amzPct],["Meta Ads","#1877F2",form.metaPct],["Google Ads","#4285F4",form.gPct]].map(([l,c,p]) => (
                    <div key={l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
                      <span style={{ fontSize:13, color:DARK }}>{l}: <strong>₹{Math.round(form.budget*p/100).toLocaleString()}/mo</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {wizStep===4 && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div>
                  <label style={labelStyle}>Target Month 3 Revenue ₹</label>
                  <input style={inputStyle} type="number" value={form.targetRev} onChange={e=>upd("targetRev",e.target.value)}/>
                </div>
                <div>
                  <label style={labelStyle}>Primary Focus</label>
                  <select style={{ ...inputStyle, cursor:"pointer" }} value={form.focus} onChange={e=>upd("focus",e.target.value)}>
                    <option value="volume">Volume — Maximize units sold</option>
                    <option value="margin">Margin — Maximize profit %</option>
                    <option value="brand">Brand — Long-term awareness</option>
                  </select>
                </div>
                <div style={{ background:PCHLITE, borderRadius:8, padding:14, border:`1px solid ${PCH}40` }}>
                  <div style={{ fontWeight:700, color:DARK, marginBottom:8, fontSize:14 }}>📈 Revenue Projection Preview</div>
                  {rev.monthly.map(m => (
                    <div key={m.label} style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:13 }}>
                      <span style={{ color:MUT }}>{m.label}</span>
                      <span style={{ fontWeight:700, color:m.profit>0?SAG:PCH }}>{fmt(m.total)} <span style={{ fontSize:11, fontWeight:400, color:MUT }}>({m.roas}x ROAS)</span></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
              <button onClick={()=>setWizStep(s=>Math.max(0,s-1))} disabled={wizStep===0}
                style={{ ...btnStyle("transparent"), color:MUT, border:`1px solid ${BRD}` }}>← Back</button>
              {wizStep < 4
                ? <button onClick={()=>setWizStep(s=>s+1)} style={btnStyle(SAG)}>Next →</button>
                : <button onClick={()=>setWizDone(true)} style={btnStyle(PCH)}>🚀 Launch Dashboard</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // DASHBOARD
  // ══════════════════════════════════════════════════════════
  const TABS = ["Overview","90-Day Plan","Paid Marketing","Social","Landing Page","Revenue","AI Copy"];
  const ICONS = ["📊","📅","💰","📱","🖥️","📈","✨"];

  return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", fontFamily:"Inter" }}>
      {/* ── SIDEBAR ── */}
      <div style={{ width:210, background:DARK, flexShrink:0, display:"flex", flexDirection:"column", gap:2, padding:"20px 12px" }}>
        <div style={{ textAlign:"center", paddingBottom:16, borderBottom:"1px solid rgba(255,255,255,0.1)", marginBottom:12 }}>
          <div style={{ fontSize:32, marginBottom:4 }}>🫘</div>
          <div style={{ fontFamily:"Nunito", fontWeight:900, color:"white", fontSize:16 }}>{form.brandName}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>Performance OS</div>
        </div>
        {TABS.map((t, i) => (
          <button key={i} onClick={()=>setTab(i)} style={{
            textAlign:"left", padding:"8px 10px", borderRadius:8, border:"none", cursor:"pointer",
            fontFamily:"Inter", fontSize:13, fontWeight:tab===i ? 600 : 400,
            background:tab===i ? SAG : "transparent",
            color:tab===i ? "white" : "rgba(255,255,255,0.55)",
            transition:"all 0.15s",
          }}>
            {ICONS[i]} {t}
          </button>
        ))}
        <div style={{ marginTop:"auto", paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.1)", fontSize:11, color:"rgba(255,255,255,0.4)" }}>
          <div style={{ marginBottom:5 }}>{doneCnt}/{TASKS.length} tasks done</div>
          <div style={{ height:4, borderRadius:4, background:"rgba(255,255,255,0.15)" }}>
            <div style={{ height:"100%", borderRadius:4, background:SAG, width:`${doneCnt/TASKS.length*100}%`, transition:"width 0.3s" }}/>
          </div>
          <button onClick={()=>setWizDone(false)} style={{ marginTop:10, fontSize:10, color:"rgba(255,255,255,0.3)", background:"none", border:"none", cursor:"pointer", padding:0 }}>← Edit setup</button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, padding:"24px 28px", overflow:"auto" }}>

        {/* ── TAB 0: OVERVIEW ── */}
        {tab===0 && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
              <h1 style={{ ...h1Style, fontSize:22 }}>Performance Dashboard</h1>
              <span style={{ background:SLITE, color:SAG, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>90-Day Sprint</span>
            </div>

            {/* KPIs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
              {[
                { label:"Current Monthly Rev",  val:fmt(rev.cur),               sub:"Your baseline",         col:SAG },
                { label:"Month 3 Projection",   val:fmt(rev.monthly[2].total),   sub:`${Math.round(rev.monthly[2].total/Math.max(rev.cur,1))}× growth potential`, col:PCH },
                { label:"Target Blended ROAS",  val:`${rev.monthly[2].roas}×`,   sub:"Month 3 blended",      col:TEL },
                { label:"Tasks Completed",       val:`${doneCnt}/${TASKS.length}`,sub:`${Math.round(doneCnt/TASKS.length*100)}% done`, col:"#8B5CF6" },
              ].map(k => (
                <div key={k.label} style={{ ...cardStyle, borderTop:`3px solid ${k.col}` }}>
                  <div style={{ fontSize:10, color:MUT, fontWeight:700, textTransform:"uppercase", letterSpacing:.6, marginBottom:5 }}>{k.label}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:DARK, fontFamily:"Nunito" }}>{k.val}</div>
                  <div style={{ fontSize:11, color:k.col, fontWeight:600, marginTop:3 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Phase progress */}
            <div style={{ ...cardStyle, marginBottom:18 }}>
              <h3 style={{ ...h1Style, fontSize:15, marginBottom:16 }}>Phase Progress</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                {[
                  { ph:"Phase 1", lbl:"Foundation", wks:"Weeks 1–4",  done:ph1Done, tot:ph1Tot, col:SAG },
                  { ph:"Phase 2", lbl:"Growth",     wks:"Weeks 5–8",  done:ph2Done, tot:ph2Tot, col:PCH },
                  { ph:"Phase 3", lbl:"Scale",      wks:"Weeks 9–13", done:ph3Done, tot:ph3Tot, col:TEL },
                ].map(p => (
                  <div key={p.ph} style={{ background:`${p.col}10`, borderRadius:10, padding:14, border:`1px solid ${p.col}30` }}>
                    <div style={{ fontSize:12, color:p.col, fontWeight:700 }}>{p.ph}: {p.lbl}</div>
                    <div style={{ fontSize:11, color:MUT, marginBottom:8 }}>{p.wks}</div>
                    <div style={{ height:6, borderRadius:3, background:`${p.col}30`, marginBottom:6 }}>
                      <div style={{ height:"100%", borderRadius:3, background:p.col, width:`${p.done/p.tot*100}%`, transition:"width 0.3s" }}/>
                    </div>
                    <div style={{ fontSize:12, fontWeight:600, color:DARK }}>{p.done}/{p.tot} tasks</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick wins */}
            <div style={{ ...cardStyle, marginBottom:18 }}>
              <h3 style={{ ...h1Style, fontSize:15, marginBottom:14 }}>🎯 Top Quick Wins This Week</h3>
              {[
                "Request reviews via Amazon's 'Request a Review' button on all eligible orders (4–30 days old)",
                "Add '₹50/nappy' value anchor text to all Flipkart listings — biggest conversion lever there",
                "Post your first Instagram Reel (color reveal) — even 500 views builds the algorithm signal",
                "Set up Instagram Business account with mascot profile pic and keyword bio today",
              ].map((w,i) => (
                <div key={i} style={{ display:"flex", gap:10, padding:"9px 0", borderBottom:i<3?"1px solid #F5F7FA":"none", alignItems:"flex-start" }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:SLITE, color:SAG, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{i+1}</div>
                  <span style={{ fontSize:13, color:DARK, lineHeight:1.5 }}>{w}</span>
                </div>
              ))}
            </div>

            {/* Revenue chart */}
            <div style={cardStyle}>
              <h3 style={{ ...h1Style, fontSize:15, marginBottom:16 }}>13-Week Revenue Trajectory</h3>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={rev.weekly}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={SAG} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={SAG} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8"/>
                  <XAxis dataKey="week" tick={{ fontSize:10, fill:MUT }}/>
                  <YAxis tick={{ fontSize:10, fill:MUT }} tickFormatter={fmt}/>
                  <Tooltip formatter={v=>[fmt(v),"Revenue"]} contentStyle={{ borderRadius:8, border:"none", boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }}/>
                  <Area type="monotone" dataKey="revenue" stroke={SAG} strokeWidth={2.5} fill="url(#revGrad)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── TAB 1: 90-DAY PLAN ── */}
        {tab===1 && (
          <div>
            <h1 style={{ ...h1Style, fontSize:22, marginBottom:6 }}>90-Day Task Plan</h1>
            <p style={{ color:MUT, fontSize:13, marginBottom:18 }}>{TASKS.length} tasks across 13 weeks. Click any task to mark complete.</p>

            {/* Filters */}
            <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
              <select style={{ ...inputStyle, width:"auto", padding:"6px 10px", cursor:"pointer" }} value={phFilter} onChange={e=>setPhFilter(e.target.value)}>
                <option value="all">All Phases</option>
                <option value="1">Phase 1: Foundation</option>
                <option value="2">Phase 2: Growth</option>
                <option value="3">Phase 3: Scale</option>
              </select>
              <select style={{ ...inputStyle, width:"auto", padding:"6px 10px", cursor:"pointer" }} value={wkFilter} onChange={e=>setWkFilter(e.target.value)}>
                <option value="all">All Weeks</option>
                {weeks.map(w=><option key={w} value={w}>Week {w}</option>)}
              </select>
              <select style={{ ...inputStyle, width:"auto", padding:"6px 10px", cursor:"pointer" }} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {cats.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
              <div style={{ marginLeft:"auto", fontSize:12, color:MUT }}>{filtered.length} shown · {doneCnt} done · {Math.round(doneCnt/TASKS.length*100)}%</div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {filtered.map(t => {
                const isDone = !!completed[t.id];
                const cc = catColors[t.cat] || SAG;
                return (
                  <div key={t.id} onClick={()=>setCompleted(c=>({...c,[t.id]:!c[t.id]}))}
                    style={{ ...cardStyle, padding:14, cursor:"pointer", borderLeft:`3px solid ${isDone?"#C4D6C8":cc}`, opacity:isDone?0.55:1, transition:"all 0.2s" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${isDone?SAG:"#D1D9E0"}`, background:isDone?SAG:"white", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                        {isDone && <span style={{ color:"white", fontSize:10 }}>✓</span>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:4 }}>
                          <span style={{ fontSize:13, fontWeight:600, color:isDone?MUT:DARK, textDecoration:isDone?"line-through":"none" }}>{t.title}</span>
                          <span style={{ background:`${cc}18`, color:cc, padding:"1px 7px", borderRadius:10, fontSize:10, fontWeight:700 }}>{t.cat}</span>
                          <span style={{ background:"#F0F4F8", color:MUT, padding:"1px 7px", borderRadius:10, fontSize:10 }}>W{t.w} · D{t.d} · {t.dur}</span>
                          {t.pri==="high" && <span style={{ background:PCHLITE, color:PCH, padding:"1px 7px", borderRadius:10, fontSize:10, fontWeight:700 }}>HIGH</span>}
                        </div>
                        <p style={{ fontSize:12, color:MUT, margin:"0 0 3px", lineHeight:1.4 }}>{t.desc}</p>
                        <p style={{ fontSize:11, color:TEL, margin:0 }}>💡 {t.tip}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: PAID MARKETING ── */}
        {tab===2 && (
          <div>
            <h1 style={{ ...h1Style, fontSize:22, marginBottom:6 }}>Paid Marketing Setup Guides</h1>
            <p style={{ color:MUT, fontSize:13, marginBottom:20 }}>Step-by-step for each channel. Click to expand.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {PAID_GUIDES.map((g, gi) => (
                <div key={gi} style={cardStyle}>
                  <div onClick={()=>setExpanded(e=>({...e,[gi]:!e[gi]}))}
                    style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                    <div style={{ width:42, height:42, borderRadius:10, background:g.col, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:11, flexShrink:0 }}>{g.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:700, color:DARK }}>{g.platform}</div>
                      <div style={{ fontSize:12, color:MUT }}>{g.steps.length} setup steps</div>
                    </div>
                    <span style={{ color:MUT, fontSize:14 }}>{expanded[gi]?"▲":"▼"}</span>
                  </div>
                  {expanded[gi] && (
                    <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${BRD}`, display:"flex", flexDirection:"column", gap:12 }}>
                      {g.steps.map((st, si) => (
                        <div key={si} style={{ display:"flex", gap:10 }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", background:`${g.col}18`, color:g.col, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0 }}>{si+1}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:DARK, marginBottom:2 }}>{st.s}</div>
                            <div style={{ fontSize:12, color:MUT, lineHeight:1.6 }}>{st.d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: SOCIAL MEDIA ── */}
        {tab===3 && (
          <div>
            <h1 style={{ ...h1Style, fontSize:22, marginBottom:6 }}>Social Media Content Calendar</h1>
            <p style={{ color:MUT, fontSize:13, marginBottom:20 }}>12 planned posts for Weeks 1–8. Hook-first format for maximum reach.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
              {SOCIAL.map((p, i) => {
                const tCol = { Reel:SAG, Carousel:TEL, Story:PCH, "Poll Story":"#F59E0B", "UGC Post":"#8B5CF6" }[p.type] || SAG;
                return (
                  <div key={i} style={{ ...cardStyle, borderTop:`3px solid ${tCol}` }}>
                    <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                      <span style={{ background:`${tCol}20`, color:tCol, padding:"2px 8px", borderRadius:8, fontSize:11, fontWeight:700 }}>{p.type}</span>
                      <span style={{ background:"#F0F4F8", color:MUT, padding:"2px 8px", borderRadius:8, fontSize:11 }}>Week {p.w}</span>
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:5 }}>{p.title}</div>
                    <div style={{ fontSize:12, color:PCH, fontStyle:"italic", marginBottom:7 }}>🪝 {p.hook}</div>
                    <div style={{ fontSize:11, color:MUT, lineHeight:1.5 }}>💡 {p.tips}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: LANDING PAGE ── */}
        {tab===4 && (
          <div>
            <h1 style={{ ...h1Style, fontSize:22, marginBottom:6 }}>Landing Page Blueprint</h1>
            <p style={{ color:MUT, fontSize:13, marginBottom:18 }}>8-section structure for your MiniBeanz LP. Build on Carrd (free) or Webflow.</p>
            <div style={{ ...cardStyle, background:PCHLITE, border:`1px solid ${PCH}40`, marginBottom:16 }}>
              <div style={{ fontWeight:700, color:DARK, marginBottom:8, fontSize:14 }}>🎯 LP Essentials Checklist</div>
              {["Mobile-first design — 80%+ of traffic will be mobile","One primary CTA per section (no competing buttons)","All 7 prints visible in hero section above fold","Amazon Attribution link for tracking Meta → Amazon conversion","Page speed < 3 seconds — use Carrd for simplicity and speed","WhatsApp chat widget for instant customer questions"].map((c,i)=>(
                <div key={i} style={{ fontSize:12, color:MUT, marginTop:4, display:"flex", gap:6 }}>
                  <span style={{ color:SAG }}>✓</span>{c}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {LP_SECTIONS.map(sec => (
                <div key={sec.n} style={cardStyle}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:sec.color, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800 }}>{sec.n}</div>
                    <h3 style={{ ...h1Style, fontSize:15 }}>{sec.title}</h3>
                  </div>
                  {sec.items.map((item,i) => (
                    <div key={i} style={{ fontSize:12, color:MUT, padding:"4px 0", borderBottom:i<sec.items.length-1?`1px solid #F5F7FA`:"none", display:"flex", gap:6 }}>
                      <span style={{ color:sec.color }}>→</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: REVENUE MODEL ── */}
        {tab===5 && (
          <div>
            <h1 style={{ ...h1Style, fontSize:22, marginBottom:6 }}>Revenue Model & Projections</h1>
            <p style={{ color:MUT, fontSize:13, marginBottom:18 }}>Based on your setup data. ROAS assumptions: Amazon 3→5×, Meta 1.3→3.2×, Google 1.5→3×.</p>

            {/* Unit economics */}
            <div style={{ ...cardStyle, marginBottom:16 }}>
              <h3 style={{ ...h1Style, fontSize:15, marginBottom:14 }}>Unit Economics by Pack</h3>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid #F0F4F8` }}>
                      {["Pack","Selling Price","COGS","Gross Margin","Margin %"].map(h=>(
                        <th key={h} style={{ padding:"6px 10px", textAlign:"left", color:MUT, fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:.4 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rev.units.map(u => (
                      <tr key={u.pack} style={{ borderBottom:`1px solid #F5F7FA` }}>
                        <td style={{ padding:"9px 10px", fontWeight:600, color:DARK }}>{u.pack}</td>
                        <td style={{ padding:"9px 10px", color:DARK }}>₹{u.price}</td>
                        <td style={{ padding:"9px 10px", color:MUT }}>₹{u.cost}</td>
                        <td style={{ padding:"9px 10px", fontWeight:700, color:SAG, fontSize:15 }}>₹{u.margin}</td>
                        <td style={{ padding:"9px 10px" }}>
                          <span style={{ background:u.pct>50?SLITE:PCHLITE, color:u.pct>50?SAG:PCH, padding:"2px 8px", borderRadius:6, fontSize:12, fontWeight:700 }}>{u.pct}%</span>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background:"#F7FAF8" }}>
                      <td colSpan={2} style={{ padding:"9px 10px", fontWeight:700, color:DARK }}>Weighted Avg Price</td>
                      <td colSpan={3} style={{ padding:"9px 10px", fontWeight:800, color:SAG, fontSize:16 }}>₹{Math.round(rev.avg)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monthly P&L */}
            <div style={{ ...cardStyle, marginBottom:16 }}>
              <h3 style={{ ...h1Style, fontSize:15, marginBottom:14 }}>3-Month Revenue & P&L Projection</h3>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid #F0F4F8` }}>
                      {["Channel","Month 1","Month 2","Month 3"].map(h=>(
                        <th key={h} style={{ padding:"6px 10px", textAlign:"left", color:MUT, fontWeight:700, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label:"Organic / Direct", key:"organic", col:SAG },
                      { label:"Amazon Ads Revenue", key:"amazon", col:"#FF9900" },
                      { label:"Meta Ads Revenue",   key:"meta",   col:"#1877F2" },
                      { label:"Google Ads Revenue", key:"google", col:"#4285F4" },
                    ].map(row => (
                      <tr key={row.label} style={{ borderBottom:`1px solid #F5F7FA` }}>
                        <td style={{ padding:"8px 10px", color:MUT, fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:6, height:6, borderRadius:"50%", background:row.col, flexShrink:0 }}/>{row.label}
                        </td>
                        {rev.monthly.map((m,i)=><td key={i} style={{ padding:"8px 10px", color:DARK, fontWeight:500 }}>{fmt(m[row.key])}</td>)}
                      </tr>
                    ))}
                    <tr style={{ borderTop:`2px solid ${BRD}` }}>
                      <td style={{ padding:"9px 10px", fontWeight:700, color:DARK }}>Total Revenue</td>
                      {rev.monthly.map((m,i)=><td key={i} style={{ padding:"9px 10px", fontWeight:800, color:SAG, fontSize:15 }}>{fmt(m.total)}</td>)}
                    </tr>
                    <tr>
                      <td style={{ padding:"8px 10px", color:MUT }}>Ad Spend</td>
                      {rev.monthly.map((m,i)=><td key={i} style={{ padding:"8px 10px", color:PCH, fontWeight:500 }}>-{fmt(m.spend)}</td>)}
                    </tr>
                    <tr style={{ background:"#F7FAF8" }}>
                      <td style={{ padding:"9px 10px", fontWeight:700, color:DARK }}>Estimated Profit</td>
                      {rev.monthly.map((m,i)=><td key={i} style={{ padding:"9px 10px", fontWeight:800, color:m.profit>0?SAG:PCH, fontSize:15 }}>{m.profit>0?"+"":""}{fmt(m.profit)}</td>)}
                    </tr>
                    <tr>
                      <td style={{ padding:"8px 10px", color:MUT }}>Blended ROAS</td>
                      {rev.monthly.map((m,i)=><td key={i} style={{ padding:"8px 10px", fontWeight:700, color:DARK }}>{m.roas}×</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weekly chart */}
            <div style={cardStyle}>
              <h3 style={{ ...h1Style, fontSize:15, marginBottom:16 }}>Weekly Revenue vs. Ad Spend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={rev.weekly} barGap={2} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8"/>
                  <XAxis dataKey="week" tick={{ fontSize:10, fill:MUT }}/>
                  <YAxis tick={{ fontSize:10, fill:MUT }} tickFormatter={fmt}/>
                  <Tooltip formatter={(v,n)=>[fmt(v),n==="revenue"?"Revenue":"Ad Spend"]} contentStyle={{ borderRadius:8, border:"none", boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }}/>
                  <Bar dataKey="revenue" fill={SAG}         radius={[4,4,0,0]} name="revenue"/>
                  <Bar dataKey="spend"   fill={`${PCH}80`} radius={[4,4,0,0]} name="spend"/>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:11, color:MUT, marginTop:8 }}>
                🟢 Green = Revenue projection &nbsp;|&nbsp; 🍑 Peach = Ad spend &nbsp;|&nbsp; Gap = Estimated contribution profit
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: AI COPY ── */}
        {tab===6 && (
          <div>
            <h1 style={{ ...h1Style, fontSize:22, marginBottom:6 }}>AI Copy Generator</h1>
            <p style={{ color:MUT, fontSize:13, marginBottom:20 }}>Generate platform-optimized copy for {form.brandName} using Claude AI — powered by your product data.</p>
            <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:16 }}>
              {/* Left panel */}
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div style={cardStyle}>
                  <h3 style={{ ...h1Style, fontSize:14, marginBottom:12 }}>Copy Type</h3>
                  {[
                    ["amazon_title",    "Amazon Title",          "Keyword-rich 200-char title"],
                    ["amazon_bullets",  "Amazon Bullets",        "5 benefit-led bullet points"],
                    ["meta_ad",         "Meta Ad Copy",          "Headline + text + CTA"],
                    ["instagram_caption","Instagram Caption",    "Hook + body + hashtags"],
                    ["lp_hero",         "Landing Page Hero",     "Headline + subhead + CTA"],
                    ["whatsapp",        "WhatsApp Message",      "Post-purchase follow-up"],
                  ].map(([val,label,desc]) => (
                    <div key={val} onClick={()=>setCtype(val)} style={{
                      padding:"8px 10px", borderRadius:8, marginBottom:4, cursor:"pointer",
                      background:ctype===val?`${SAG}15`:"transparent",
                      border:`1px solid ${ctype===val?SAG:"transparent"}`,
                      transition:"all 0.15s",
                    }}>
                      <div style={{ fontSize:13, fontWeight:600, color:ctype===val?SAG:DARK }}>{label}</div>
                      <div style={{ fontSize:11, color:MUT }}>{desc}</div>
                    </div>
                  ))}
                </div>
                <div style={cardStyle}>
                  <label style={labelStyle}>Extra Context (optional)</label>
                  <textarea value={extraCtx} onChange={e=>setExtraCtx(e.target.value)}
                    placeholder={'e.g. "emphasize the dinosaur print" or "holiday sale tone"'}
                    style={{ ...inputStyle, height:76, resize:"vertical", lineHeight:1.5, paddingTop:8 }}/>
                  <button onClick={genCopy} disabled={generating}
                    style={{ ...btnStyle(PCH), width:"100%", marginTop:10, opacity:generating?0.7:1, transition:"opacity 0.2s" }}>
                    {generating ? "✨ Writing..." : "✨ Generate Copy"}
                  </button>
                  {copyText && (
                    <button onClick={()=>navigator.clipboard?.writeText(copyText)}
                      style={{ ...btnStyle(SAG), width:"100%", marginTop:8, fontSize:13 }}>
                      📋 Copy to Clipboard
                    </button>
                  )}
                </div>
              </div>

              {/* Right panel — output */}
              <div style={{ ...cardStyle, minHeight:400 }}>
                <h3 style={{ ...h1Style, fontSize:14, marginBottom:14 }}>Generated Copy</h3>
                {!copyText && !generating && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10, height:300, color:MUT }}>
                    <span style={{ fontSize:40 }}>✨</span>
                    <span style={{ fontSize:14 }}>Select a copy type and click Generate</span>
                    <span style={{ fontSize:12 }}>Uses your brand name, pricing, and product details</span>
                  </div>
                )}
                {generating && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10, height:300, color:SAG }}>
                    <span style={{ fontSize:40 }}>🫘</span>
                    <span style={{ fontSize:14 }}>Claude is writing your copy...</span>
                  </div>
                )}
                {copyText && (
                  <pre style={{ whiteSpace:"pre-wrap", fontSize:13, color:DARK, lineHeight:1.8, margin:0, fontFamily:"Inter" }}>
                    {copyText}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
