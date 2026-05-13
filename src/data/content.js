/**
 * Goodie Glow Guide — 30-Day Skincare Content
 * Complete routine data for all 30 days, organised into 4 weeks.
 *
 * Structure per day:
 *   day, week, phase, title, morning[], night[], tip, avoid[],
 *   specialNote?, naturalRemedy?, hasPhotoPrompt?, imageKey
 */

const content = {

  // ─────────────────────────────────────────────
  // WEEKS OVERVIEW
  // ─────────────────────────────────────────────
  weeks: [
    {
      week: 1,
      title: "Foundation Week",
      phase: "Foundation",
      focus: "Build Your Base Routine",
      description: "Keep it simple. Three steps, twice a day: cleanse, moisturise, protect. By Day 7 this will feel as natural as brushing your teeth.",
      goal: "Establish consistency and let your skin adjust to a clean, protected baseline.",
      days: [1, 2, 3, 4, 5, 6, 7]
    },
    {
      week: 2,
      title: "Enhancement Week",
      phase: "Enhancement",
      focus: "Boost Hydration & Add Actives",
      description: "Your skin has found its footing. Now we layer in toner and serums to target uneven tone, dullness, and dehydration.",
      goal: "Increase skin hydration and introduce ingredients that do the real brightening work.",
      days: [8, 9, 10, 11, 12, 13, 14]
    },
    {
      week: 3,
      title: "Optimisation Week",
      phase: "Optimisation",
      focus: "Natural Treatments & Targeted Care",
      description: "Time for the good stuff. Turmeric masks, ginger shots, ice therapy — powerful natural tools your grandmother knew about, now backed by science.",
      goal: "Brightening, anti-inflammation, and tackling specific skin concerns.",
      days: [15, 16, 17, 18, 19, 20, 21]
    },
    {
      week: 4,
      title: "Mastery Week",
      phase: "Mastery",
      focus: "Maintenance & Your Personalised Routine",
      description: "The final stretch. You're building something that lasts beyond Day 30. This week is about mastering what works for YOUR skin.",
      goal: "Create a sustainable, personalised routine you can maintain long after this guide ends.",
      days: [22, 23, 24, 25, 26, 27, 28, 29, 30]
    }
  ],

  // ─────────────────────────────────────────────
  // PRODUCTS REFERENCE
  // ─────────────────────────────────────────────
  products: {
    facewash:         { id: "facewash",         name: "Vitamin C Face Wash",            use: "Cleanser" },
    moisturizer:      { id: "moisturizer",      name: "Moisturising Lotion",            use: "Moisturiser (AM + PM)" },
    sunscreen:        { id: "sunscreen",         name: "Sunscreen SPF 50",              use: "Sun protection (AM only)" },
    toner:            { id: "toner",             name: "Hydrating Toner",              use: "After cleanse, before serum" },
    vitaminCSerum:    { id: "vitaminCSerum",     name: "Vitamin C Serum",   use: "AM serum" },
    niacinamideSerum: { id: "niacinamideSerum",  name: "Niacinamide Serum",             use: "PM serum" },
    eyeCream:         { id: "eyeCream",          name: "Eye Cream",                     use: "Under-eye area, AM + PM" },
    lipBalm:          { id: "lipBalm",           name: "Shea Lip Balm",                 use: "Lips, last step PM" }
  },

  // ─────────────────────────────────────────────
  // 30 DAYS
  // ─────────────────────────────────────────────
  days: [

    // ═══════════════════════════════════════════
    // WEEK 1 — FOUNDATION (Days 1–7)
    // ═══════════════════════════════════════════

    {
      day: 1,
      week: 1,
      phase: "Foundation",
      title: "Fresh Start",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Splash your face with cool water — not hot, never hot. Apply a small pump of face wash. Massage in gentle circles for 30 seconds, focusing on your nose, forehead, and chin. Rinse until your skin feels clean but not squeaky. Pat dry with a clean, soft towel."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "While your face is still slightly damp, take a pea-sized amount. Apply in upward strokes — always up, never down. Work from chin to forehead. Don't forget your neck — it shows age just as much as your face!"
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "This step is non-negotiable. Two-finger length of sunscreen for your face and neck. Apply 10–15 minutes before stepping outside. Yes, even on cloudy days in Lagos — UV rays don't take days off."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "After a long day of Lagos heat, dust, and hustle — your face deserves a proper wash. Same technique as morning. Take your time, don't rush this step."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Apply 3–4 drops onto clean skin. Press gently with your palms — don't rub. Niacinamide works through the night to even your skin tone. Let it absorb for 30 seconds before moving to moisturiser."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock in that serum! Use a slightly more generous amount than morning — night-time is when your skin does its repair work and needs the extra nourishment. Same upward strokes."
        }
      ],
      tip: "Don't overthink it. Two minutes in the morning, two minutes at night — that's all Week 1 asks of you. The magic isn't in the products alone, it's in the consistency. Show up for your skin every single day this week.",
      avoid: [
        "Scrubbing your face hard — your skin is delicate, not a saucepan",
        "Using hot water — it strips your skin's natural oils",
        "Adding extra products you already own — stick to the plan this week",
        "Picking at spots with your fingernails"
      ],
      specialNote: "BEFORE PHOTOS! Take three shots in natural light: front view, left side, right side. Save them somewhere you won't accidentally delete. You will want these on Day 30 — trust us.",
      hasPhotoPrompt: true,
      imageKey: "morning"
    },

    {
      day: 2,
      week: 1,
      phase: "Foundation",
      title: "Showing Up",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Wet face with cool water. Two pumps of face wash. Gentle circular massage, 30 seconds. Rinse clean. Pat dry — your skin should feel fresh, not tight."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Damp face, pea-sized amount, upward strokes from chin to forehead. Neck too!"
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Two-finger length, applied after moisturiser. Let it sit for a minute before applying makeup if you wear it."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Wash away everything the day brought — dust, sweat, pollution. Be thorough but gentle around the eyes."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "3–4 drops, press into skin with palms. Let it sink in for 30 seconds."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Seal in the serum. Upward strokes, don't forget the neck."
        }
      ],
      tip: "Your skin might not look different yet — and that's completely normal. It takes 28 days for your skin cells to fully renew. What you're doing right now is building the foundation. Keep going.",
      avoid: [
        "Expecting overnight results — skin takes time",
        "Skipping night routine because you're tired — set a reminder if needed",
        "Over-washing (more than twice a day strips your skin)",
        "Using your phone screen as a mirror while applying products"
      ],
      imageKey: "morning"
    },

    {
      day: 3,
      week: 1,
      phase: "Foundation",
      title: "SPF is Your Best Friend",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Cool water, gentle circles, thorough rinse. Starting to feel like second nature already?"
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Pea-sized amount on damp skin. Upward strokes, include neck."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Today, really pay attention to this step. Apply to face, neck, and the backs of your hands. Your hands are exposed to sun all day and most people forget them completely."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Cleanse properly — sunscreen needs to be fully removed at night or it can clog pores."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "3–4 drops, press in, wait 30 seconds."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock it all in. Sleep is when your skin heals — give it the moisture it needs."
        }
      ],
      tip: "SPF is the single most proven anti-ageing and anti-darkening product that exists. Hyperpigmentation, dark spots, uneven tone — sun exposure makes all of these worse. Your Sunscreen SPF 50 is doing more work than you realise.",
      avoid: [
        "Skipping sunscreen on cool or cloudy days",
        "Applying sunscreen only to your face but not your neck",
        "Reusing a towel that hasn't been washed recently — bacteria is real",
        "Applying moisturiser to a completely dry face"
      ],
      imageKey: "morning"
    },

    {
      day: 4,
      week: 1,
      phase: "Foundation",
      title: "The Routine Settles In",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning wash — your face has been on a pillow all night collecting oils. Cleanse gently and thoroughly."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Damp skin, upward strokes. Take 10 extra seconds to massage it into your hairline and jawline."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Don't mix it with your moisturiser — apply separately and let each product do its job."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Two minutes, cool water, gentle circles. If you wore sunscreen today, cleanse a little more thoroughly."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Press into skin — forehead, cheeks, chin, and down the neck."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Night moisturiser — be generous. Your skin is going to do a lot of healing in the next 7 hours."
        }
      ],
      tip: "Four days in! You might notice your skin feeling softer or looking a little more even — that's the Vitamin C Face Wash doing its work. These small changes are the beginning of bigger ones. Notice them, celebrate them.",
      avoid: [
        "Skipping moisturiser because your skin feels oily — oily skin needs moisture too",
        "Applying products in the wrong order — cleanse, moisturise, sunscreen always in that order",
        "Washing your face more than twice daily unless you've been sweating heavily",
        "Using a face towel that's been hanging in the bathroom for a week"
      ],
      imageKey: "natural"
    },

    {
      day: 5,
      week: 1,
      phase: "Foundation",
      title: "Halfway Through Week One",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "You know the drill. Cool water, gentle circles, thorough rinse, pat dry."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Upward strokes on damp skin. Add a tiny dot to the outer corners of your eyes today — the skin there is extra thin and delicate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Every morning. No exceptions. This is the product that protects all the progress you're making."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "End the day clean. Wash off the Lagos sun, the Kampala dust, everything the day brought."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "3–4 drops pressed gently into skin. Working through the night to even your tone."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Seal it all in. Sleep well — your skin is working even when you're not."
        }
      ],
      tip: "By now the routine should feel less like a chore and more like self-care. That mental shift matters. You're not doing this because something is wrong with your skin — you're doing it because you deserve to show up for yourself every day.",
      avoid: [
        "Comparing your skin to anyone else's — everyone's journey is different",
        "Touching your face throughout the day with unwashed hands",
        "Sleeping in your makeup or sunscreen",
        "Drinking very little water — skincare works from the inside out too"
      ],
      imageKey: "hydration"
    },

    {
      day: 6,
      week: 1,
      phase: "Foundation",
      title: "Weekend Refresh",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Weekend morning — you might have more time. Take an extra 30 seconds and really enjoy the massage. This improves circulation and helps the cleanser do its job."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Damp skin, upward strokes. If you're staying indoors most of the day, use a slightly lighter amount."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Still applies on weekends! Even by a window indoors, UVA rays (the ageing ones) come through glass."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Even on days you didn't go out much — cleanse before bed. Pillow oil and indoor air still build up."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "3–4 drops. Press and hold your palms on your face for 5 seconds — the warmth helps absorption."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock in your weekend rest. Generous application — your skin is relaxed tonight."
        }
      ],
      tip: "A skincare tip that goes beyond products: change your pillowcase today. Your face spends 7–8 hours pressed against it. A clean pillowcase makes a real difference to breakouts and skin texture.",
      avoid: [
        "Skipping routine because it's the weekend",
        "Going to bed with a dirty or old pillowcase",
        "Binge-drinking alcohol — it dehydrates skin dramatically",
        "Over-exfoliating with harsh scrubs"
      ],
      imageKey: "natural"
    },

    {
      day: 7,
      week: 1,
      phase: "Foundation",
      title: "Week One Complete!",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Your Week 1 completion morning cleanse. Same gentle technique, but today take a moment and really look at your skin. Notice anything different?"
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Damp face, upward strokes. You've done this every day this week — it's already a habit."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Seven days of SPF. Your skin is already more protected from the darkening effects of sun exposure."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "End Week 1 clean. You showed up every single day — that's not small."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Seven nights of niacinamide working on your tone. Keep it going."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Well done. Rest up — Week 2 brings exciting additions to your routine."
        }
      ],
      tip: "WEEK 1 DONE! This is the hardest part — starting and staying consistent through the first week. Everything from here gets more interesting. Look at your Day 1 photos and compare. Even subtle changes are real changes.",
      avoid: [
        "Judging your results against anyone else's timeline",
        "Adding products impulsively because you want faster results",
        "Stopping because you haven't seen dramatic changes — 28-day cell turnover is real",
        "Sleeping on a dirty pillowcase tonight of all nights"
      ],
      specialNote: "WEEK 1 CHECK-IN! Compare to your Day 1 photos. Rate your skin on a scale of 1–10 for: hydration, evenness of tone, and softness. Write it down somewhere — you'll compare again at Day 14.",
      imageKey: "natural"
    },

    // ═══════════════════════════════════════════
    // WEEK 2 — ENHANCEMENT (Days 8–14)
    // ═══════════════════════════════════════════

    {
      day: 8,
      week: 2,
      phase: "Enhancement",
      title: "Welcome to Week Two",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Same foundation routine. Cool water, gentle circles, pat dry. This never changes."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "NEW STEP! After cleansing, soak a cotton pad with toner. Swipe gently from the centre of your face outward — cheeks, forehead, chin, neck. It removes any last traces of cleanser and preps your skin to absorb the moisturiser better. It should feel cool and refreshing."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Apply immediately after toning while skin is slightly damp from the toner."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Last step. Always."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Thorough evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Cotton pad, swipe outward from centre. This also helps balance your skin's pH after cleansing."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "3–4 drops, pressed in gently."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Seal everything in."
        }
      ],
      tip: "The toner is the first upgrade. It does two things: removes the invisible residue your cleanser leaves behind, and gets your skin into the ideal state to absorb everything that comes after. You might notice your moisturiser feels like it sinks in faster — that's the toner working.",
      avoid: [
        "Using a toner with alcohol — it burns and dries your skin. The Hydrating Toner is alcohol-free",
        "Rubbing the cotton pad back and forth — always swipe in one direction",
        "Skipping toner and going straight to moisturiser — order matters",
        "Using too much — the cotton pad should be damp, not dripping"
      ],
      imageKey: "products"
    },

    {
      day: 9,
      week: 2,
      phase: "Enhancement",
      title: "Getting the Toner Right",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Foundation routine — cool water, gentle circles, pat dry."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Today, try applying the toner with your fingertips instead of a cotton pad. Pour 5–6 drops into your palm and press gently all over your face. Some people prefer this — it's less wasteful and feels more nourishing."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Immediately after toner. Upward strokes."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Two-finger length. Face and neck."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse. Take your time."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Use whichever method you preferred today — cotton pad or palms. Stick with what feels right for your skin."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Press in gently after toner."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock it in. Good night."
        }
      ],
      tip: "If your skin feels tight or dry after toning, it might mean you're using too much product or the cotton pad is too rough. Ease off. The toner should feel like a drink of water for your skin — refreshing and comfortable.",
      avoid: [
        "Rubbing too hard with the cotton pad — especially around the nose and eye area",
        "Using toner on broken skin or active spots",
        "Applying toner and waiting more than a minute before moisturiser",
        "Using an old, rough cotton pad"
      ],
      imageKey: "products"
    },

    {
      day: 10,
      week: 2,
      phase: "Enhancement",
      title: "Vitamin C Joins the Party",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Cool water, gentle circles, thorough rinse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Cotton pad or palms — whichever you chose on Day 9."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "NEW PRODUCT! 2–3 drops onto your fingertips. Press gently over your entire face — forehead, cheeks, nose, chin. Vitamin C works best in the morning because it also boosts your sunscreen's effectiveness against UV damage. It might tingle slightly on the first few uses — that's normal."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Wait 30 seconds for the serum to absorb, then apply moisturiser on top."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Your Vitamin C + SPF combo is now working together to protect and brighten. Powerful."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Remove everything — Vitamin C serum, sunscreen, the day."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep and balance the skin."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Night serum. Niacinamide at night, Vitamin C in the morning — this is the winning combination."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Seal everything in for overnight repair."
        }
      ],
      tip: "You now have a proper morning serum routine: Vitamin C in the AM, Niacinamide in the PM. These two ingredients work beautifully together across the day — Vitamin C brightens and protects, niacinamide evens tone and reduces pores. The glow is coming.",
      avoid: [
        "Applying Vitamin C and Niacinamide at the same time — use them separately",
        "Storing your Vitamin C serum in sunlight or heat — it degrades and turns orange",
        "Using more than 3 drops — more is not better with active serums",
        "Skipping sunscreen when using Vitamin C — it makes your skin more sun-sensitive"
      ],
      hasPhotoPrompt: true,
      specialNote: "Day 10 photo! One week plus into your journey. Compare to Day 1 and look for subtle changes in skin texture and evenness.",
      imageKey: "morning"
    },

    {
      day: 11,
      week: 2,
      phase: "Enhancement",
      title: "Layering Like a Pro",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Gentle circles, cool water, thorough rinse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep the skin."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "2–3 drops, press in gently. Remember: thinnest products go first — serum before moisturiser."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "After 30 seconds, seal in the serum."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Always last in your morning routine."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Balance and prep."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Night serum — press in, let absorb."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Night moisturiser. Sleep well."
        }
      ],
      tip: "The rule of product layering: thinnest to thickest. Water-based toner, light serum, heavier moisturiser, then the thickest product (sunscreen) last. This ensures each product can penetrate where it needs to go.",
      avoid: [
        "Applying moisturiser before serum — it blocks the serum from reaching your skin",
        "Mixing products in your palm before applying — apply each one separately",
        "Rushing between steps — give each product 30 seconds to absorb",
        "Using eye cream on your lips or lip balm around your eyes"
      ],
      imageKey: "products"
    },

    {
      day: 12,
      week: 2,
      phase: "Enhancement",
      title: "Deep Hydration Day",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Gentle circles, cool rinse, pat dry."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep your skin."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Today, after the Vitamin C serum absorbs, splash a very light mist of water over your face before applying moisturiser. This moisture-sandwich technique locks in serious hydration."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Apply quickly after the mist while skin is still damp. You might need a touch more product today — that's fine."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect all that hydration."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep and balance."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Press in gently. Working on tone while you sleep."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Use a slightly more generous amount tonight — overnight hydration boost."
        }
      ],
      tip: "Hydration is different from moisture. Hydration is water in your skin. Moisture is oils that lock that water in. You need both. Drinking 6–8 glasses of water daily powers the whole system from inside.",
      avoid: [
        "Skipping water intake and expecting products alone to hydrate you",
        "Using a heating fan directly on your face — it pulls moisture out of skin",
        "Over-moisturising oily zones while under-moisturising dry zones",
        "Air conditioning all day without drinking water — AC strips humidity from air and your skin"
      ],
      imageKey: "hydration"
    },

    {
      day: 13,
      week: 2,
      phase: "Enhancement",
      title: "Ice Water Therapy — Day 1",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Regular cleanse with cool water. Then do the ice water therapy (see natural remedy below) before continuing."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "After ice therapy."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "2–3 drops, pressed in."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Seal everything in."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Last step."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep and balance."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Press in gently."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock in for overnight repair."
        }
      ],
      tip: "Ice water therapy is one of the oldest and most effective skin treatments — Korean beauty swears by it, and your grandmother probably knew it too. The cold constricts pores, reduces puffiness, and gives your skin a temporary but real tightening and brightening effect.",
      avoid: [
        "Submerging your face for more than 10 seconds — 5–8 seconds is enough",
        "Using ice directly on skin if it's very cold — the water is the treatment, not the ice",
        "Doing ice therapy on broken, irritated, or inflamed skin",
        "Rushing through it — slow, deliberate rounds work better"
      ],
      naturalRemedy: {
        name: "Ice Water Face Dip",
        timing: "After morning cleanse, before toner",
        ingredients: [
          "A large bowl",
          "Cold water",
          "Ice cubes (6–8)",
          "Optional: 2 slices of cucumber or a cooled green tea bag"
        ],
        instructions: [
          "Fill a large bowl with cold water and add ice cubes until very cold.",
          "Optionally add cucumber slices or a cooled green tea bag for added antioxidants.",
          "Take a deep breath and submerge your face for 5–8 seconds.",
          "Lift out, breathe, and repeat 3–5 times.",
          "Pat dry gently and continue with your toner immediately.",
          "Repeat on Days 14 and 15."
        ],
        benefits: "Reduces morning puffiness, tightens pores, improves circulation, gives an immediate glow"
      },
      imageKey: "morning"
    },

    {
      day: 14,
      week: 2,
      phase: "Enhancement",
      title: "Midpoint — How Far You've Come",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Your halfway cleanse. Do the ice water dip after this — it's Day 2 of 3."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "After ice therapy."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Morning serum. You've had this in your routine for 5 days now."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Upward strokes. Halfway through — your skin has had two weeks of daily care."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "14 days of sun protection. Your dark spots are fighting a losing battle."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "End of Week 2 cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep and balance."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "14 nights of niacinamide. Your skin tone is evening out steadily."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Rest and repair. Week 3 tomorrow — it gets exciting."
        }
      ],
      tip: "Halfway! Take your Day 14 photos and compare honestly with Day 1. Look for: Is your skin less dull? Are dark spots slightly lighter? Does your skin look more even? Every product you've applied, every night you showed up — it's compounding.",
      avoid: [
        "Dismissing subtle progress — skin changes gradually, not overnight",
        "Adding new products in frustration — trust the programme",
        "Forgetting to drink water — internal hydration powers everything",
        "Missing sleep — skin regenerates almost entirely during sleep"
      ],
      naturalRemedy: {
        name: "Ice Water Face Dip",
        timing: "After morning cleanse, before toner",
        ingredients: ["Large bowl", "Cold water", "Ice cubes (6–8)"],
        instructions: [
          "Cold water + ice in a bowl.",
          "Submerge face 5–8 seconds, 3–5 rounds.",
          "Pat dry, continue with toner.",
          "Day 2 of 3."
        ],
        benefits: "Day 2 of 3 — your skin should be responding with better tone and reduced puffiness"
      },
      specialNote: "MIDPOINT ASSESSMENT: Rate your skin today on hydration, evenness, and softness (1–10). Compare to your Day 7 check-in scores. Pull up Day 1 and Day 10 photos side by side.",
      hasPhotoPrompt: true,
      imageKey: "natural"
    },

    // ═══════════════════════════════════════════
    // WEEK 3 — OPTIMISATION (Days 15–21)
    // ═══════════════════════════════════════════

    {
      day: 15,
      week: 3,
      phase: "Optimisation",
      title: "Ice Therapy Finale + Week 3 Begins",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning cleanse — then the final ice water dip (Day 3 of 3)."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "After ice therapy."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Vitamin C in the morning."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Seal in and prep for the day."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Night serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock it in. Tomorrow: turmeric time."
        }
      ],
      tip: "Week 3 is about natural power treatments. Your routine is solid now — the treatments you'll add this week work on top of a well-prepared skin base. That's why we waited until now. Great skin is built in layers.",
      avoid: [
        "Skipping today's ice therapy — finish the 3-day series",
        "Starting the turmeric mask before Day 16",
        "Layering multiple treatments at once — one special treatment at a time",
        "Impatience — you are over halfway and the glow is building"
      ],
      naturalRemedy: {
        name: "Ice Water Face Dip",
        timing: "After morning cleanse, before toner",
        ingredients: ["Large bowl", "Cold water", "Ice cubes (6–8)", "Optional: a splash of rose water"],
        instructions: [
          "Final day of ice therapy — treat it like a ritual.",
          "Add a splash of rose water to the bowl for an extra calming boost.",
          "Submerge face 5–8 seconds, 3–5 rounds.",
          "Pat dry, proceed with toner.",
          "Notice how your skin feels and looks after completing all 3 days."
        ],
        benefits: "Completing the 3-day series maximises the pore-tightening and circulation benefits"
      },
      imageKey: "morning"
    },

    {
      day: 16,
      week: 3,
      phase: "Optimisation",
      title: "Turmeric Mask — Day 1",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Gentle morning cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Morning serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Moisturise and protect."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Always."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Cleanse thoroughly — especially important tonight as you're about to do a mask."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep your skin for the mask."
        },
        {
          step: "mask",
          product: "Turmeric Brightening Mask (homemade — see below)",
          duration: "15–20 minutes",
          instructions: "Apply an even layer to your face and neck, avoiding the eye area and lips. Leave for 15–20 minutes. Rinse with cool water then pat dry with an old towel — turmeric stains! Follow immediately with serum and moisturiser."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Apply immediately after rinsing the mask."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock in the mask benefits overnight."
        }
      ],
      tip: "Turmeric has been used for skin brightening across West Africa, East Africa, India, and the Middle East for centuries — and science confirms why. Curcumin (the active compound) is anti-inflammatory, anti-bacterial, and inhibits melanin production. Your grandmothers were scientists.",
      avoid: [
        "Using pure turmeric powder without a carrier — it will stain your skin yellow",
        "Leaving the mask on for more than 20 minutes",
        "Using your best white towel to rinse — use an old one",
        "Applying on broken or irritated skin"
      ],
      naturalRemedy: {
        name: "Turmeric Brightening Mask",
        timing: "Evening, after toning, before serum",
        ingredients: [
          "Half teaspoon turmeric powder",
          "1 tablespoon plain yoghurt (or raw honey for dry skin)",
          "1 teaspoon gram flour / chickpea flour (optional — helps reduce staining)",
          "3–4 drops of lemon juice (optional — skip if skin is sensitive)"
        ],
        instructions: [
          "Mix all ingredients in a small bowl to a smooth paste.",
          "Apply an even layer to clean, toned face and neck.",
          "Avoid the eye area and lips completely.",
          "Leave on for 15–20 minutes.",
          "Rinse thoroughly with cool water.",
          "If skin looks slightly yellow after rinsing, use a small amount of cleanser and rinse again.",
          "Apply serum and moisturiser immediately."
        ],
        benefits: "Brightening, anti-inflammatory, evens skin tone, targets hyperpigmentation"
      },
      imageKey: "natural"
    },

    {
      day: 17,
      week: 3,
      phase: "Optimisation",
      title: "Turmeric Mask — Day 2",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning cleanse — check if any turmeric tint remains. One more cleanse usually removes it completely."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep and balance."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Your brightening serum works even harder after a turmeric mask night."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect the progress."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep for mask."
        },
        {
          step: "mask",
          product: "Turmeric Brightening Mask (same recipe as Day 16)",
          duration: "15–20 minutes",
          instructions: "Second application. Your skin is already familiar with the mask — it should feel more comfortable this time."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Post-mask serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Seal it in overnight."
        }
      ],
      tip: "By morning after your second mask, you should start noticing something different in the mirror. Skin should look brighter, more even, and have a subtle warmth to it. This isn't a filter — this is what nourished skin looks like.",
      avoid: [
        "Increasing turmeric quantity thinking more is better — it will just stain more",
        "Skipping moisturiser after the mask",
        "Doing the mask in the morning — turmeric can temporarily increase photosensitivity",
        "Rushing the rinsing step"
      ],
      naturalRemedy: {
        name: "Turmeric Brightening Mask",
        timing: "Evening, after toning",
        ingredients: ["Half tsp turmeric", "1 tbsp yoghurt or honey", "1 tsp gram flour"],
        instructions: [
          "Mix to smooth paste.",
          "Apply evenly to face and neck, avoid eye area and lips.",
          "15–20 minutes.",
          "Rinse with cool water.",
          "Serum and moisturiser immediately after."
        ],
        benefits: "Day 2 — cumulative brightening and anti-inflammatory effects are building"
      },
      imageKey: "natural"
    },

    {
      day: 18,
      week: 3,
      phase: "Optimisation",
      title: "Turmeric Mask — Day 3 (Final)",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Vitamin C in the morning."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate and protect."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Always last."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Final turmeric mask night. Thorough cleanse first."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "mask",
          product: "Turmeric Brightening Mask (same recipe)",
          duration: "15–20 minutes",
          instructions: "Final application. You've earned this ritual. Apply, relax, let it work."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Post-mask serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Generous application after the final mask. Rest well."
        }
      ],
      tip: "Three nights of turmeric masks is a micro-course of treatment. The cumulative effect is significantly more powerful than a single application. Some people do 3-night turmeric courses monthly as part of their ongoing routine — you now have the knowledge to do the same.",
      avoid: [
        "Doing a fourth consecutive night — your skin needs a recovery day",
        "Skipping your regular routine products after the mask",
        "Going outdoors immediately after the mask without fully rinsing",
        "Introducing any other new active products on mask nights"
      ],
      naturalRemedy: {
        name: "Turmeric Brightening Mask",
        timing: "Evening, after toning",
        ingredients: ["Half tsp turmeric", "1 tbsp yoghurt or honey", "1 tsp gram flour"],
        instructions: [
          "Final night — make it count.",
          "Apply evenly, avoid eyes and lips.",
          "15–20 minutes.",
          "Rinse thoroughly.",
          "Serum and moisturiser to seal in results."
        ],
        benefits: "Completing the 3-day course maximises brightening, anti-inflammatory, and pigmentation-reducing benefits"
      },
      imageKey: "natural"
    },

    {
      day: 19,
      week: 3,
      phase: "Optimisation",
      title: "Ginger Wellness Shot — Day 1",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning cleanse — after your ginger shot (take the shot first thing, then do skincare)."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Vitamin C serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Night serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock in for overnight repair."
        }
      ],
      tip: "Good skin is built from the inside out. The ginger and turmeric shot is a powerful anti-inflammatory drink that helps reduce the internal inflammation behind dullness, breakouts, and uneven tone. Your skin is an organ — what you put in your body shows on your face.",
      avoid: [
        "Drinking the shot on a completely empty stomach if you have a sensitive stomach — eat something small first",
        "Adding sugar to improve the taste — it defeats the anti-inflammatory benefit",
        "Skipping it because it tastes strong — chase with water immediately",
        "High-sugar or high-salt foods today — they counteract the anti-inflammatory effect"
      ],
      naturalRemedy: {
        name: "Ginger Turmeric Wellness Shot",
        timing: "Morning, first thing before breakfast — then do your skincare routine",
        ingredients: [
          "1 inch fresh ginger root (or half teaspoon ginger powder)",
          "Quarter teaspoon ground turmeric (or a small piece of fresh turmeric)",
          "Juice of half a lemon",
          "1 teaspoon raw honey",
          "A pinch of black pepper — makes turmeric 2000% more bioavailable",
          "60–80ml warm water"
        ],
        instructions: [
          "Peel and finely grate the fresh ginger.",
          "Combine ginger, turmeric, lemon juice, honey, black pepper, and warm water.",
          "Stir well or blend briefly.",
          "Strain if using fresh ginger, or leave the pulp in for extra benefit.",
          "Drink in one or two sips like a shot.",
          "Chase with a full glass of water immediately.",
          "Repeat for Days 20 and 21."
        ],
        benefits: "Anti-inflammatory, antioxidant, supports gut health (gut health = skin health), boosts circulation and natural glow from within"
      },
      imageKey: "hydration"
    },

    {
      day: 20,
      week: 3,
      phase: "Optimisation",
      title: "Ginger Shot — Day 2",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Ginger shot first, then morning cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Morning serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Night serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock in for overnight repair."
        }
      ],
      tip: "Day 20 — two-thirds through your journey. The ginger shot may still taste like a challenge, but it's working. Ginger increases circulation, which is why people who drink it regularly have noticeably better skin radiance.",
      avoid: [
        "Skipping the shot — 3 days is the minimum to feel the full effect",
        "Going overboard with processed food today",
        "Sleeping less than 7 hours — your body does most of its anti-inflammatory repair during deep sleep",
        "Skipping water — the shot works best when you're well-hydrated"
      ],
      naturalRemedy: {
        name: "Ginger Turmeric Wellness Shot",
        timing: "Morning, before breakfast",
        ingredients: ["1 inch fresh ginger or half tsp powder", "Quarter tsp turmeric", "Half lemon juice", "1 tsp honey", "Pinch black pepper", "60ml warm water"],
        instructions: [
          "Combine, stir, and drink as a shot.",
          "Chase with a glass of water.",
          "Day 2 — your body is adapting."
        ],
        benefits: "Cumulative anti-inflammatory and circulation-boosting effect building — your face may look noticeably brighter this morning"
      },
      hasPhotoPrompt: true,
      specialNote: "Day 20 photo! Two-thirds through your 30-day journey. Compare to Day 10 and Day 1 photos.",
      imageKey: "hydration"
    },

    {
      day: 21,
      week: 3,
      phase: "Optimisation",
      title: "Ginger Shot — Day 3 + Week 3 Complete",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Final ginger shot morning — take the shot, then cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Vitamin C serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate and protect."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Always."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "End of Week 3 cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Week 3 final night serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Rest and repair. Week 4 is about mastery."
        }
      ],
      tip: "Three weeks done. You've built a full skincare routine, added targeted serums, completed ice therapy, a 3-day turmeric mask course, and a 3-day internal glow programme. You're not a beginner anymore. Week 4 is about owning this for life.",
      avoid: [
        "Stopping the ginger shot entirely — consider it as a weekly or bi-weekly practice going forward",
        "Slacking in Week 4 because you feel almost done",
        "Introducing new products this close to the end",
        "Not sleeping enough — the last week is when results compound"
      ],
      naturalRemedy: {
        name: "Ginger Turmeric Wellness Shot",
        timing: "Morning, before breakfast",
        ingredients: ["1 inch fresh ginger or half tsp powder", "Quarter tsp turmeric", "Half lemon juice", "1 tsp honey", "Pinch black pepper", "60ml warm water"],
        instructions: [
          "Final shot — make it a good one.",
          "Drink, chase with a full glass of water.",
          "Notice how you feel compared to Day 19."
        ],
        benefits: "Completing the 3-day series — maximum anti-inflammatory and radiance benefits"
      },
      imageKey: "natural"
    },

    // ═══════════════════════════════════════════
    // WEEK 4 — MASTERY (Days 22–30)
    // ═══════════════════════════════════════════

    {
      day: 22,
      week: 4,
      phase: "Mastery",
      title: "Sheet Mask Luxury — Day 1",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning foundation cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Morning serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Thorough evening cleanse — your face needs to be completely clean before the sheet mask."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep your skin to absorb the mask essence."
        },
        {
          step: "mask",
          product: "Sheet Mask (hydrating or brightening)",
          duration: "15–20 minutes",
          instructions: "Remove sheet mask from packet. Unfold carefully. Align with your eyes, nose, and mouth. Press flat against skin. Lie back, relax, and leave for 15–20 minutes. Remove and massage remaining essence into your face and neck — do not rinse."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Apply lightly on top of the sheet mask essence to lock in all that concentrated hydration."
        }
      ],
      tip: "Sheet masks deliver a concentrated dose of ingredients that penetrate more deeply because the mask keeps the essence pressed against your skin. This is your reward for 3 weeks of showing up. Relax and enjoy it.",
      avoid: [
        "Leaving the sheet mask on beyond 20 minutes — it starts to dry and pull moisture back out",
        "Rinsing your face after removing the mask — the remaining essence is part of the treatment",
        "Using a sheet mask in the morning before going out in the sun",
        "Throwing away the extra serum left in the packet — massage it into your neck and hands"
      ],
      imageKey: "natural"
    },

    {
      day: 23,
      week: 4,
      phase: "Mastery",
      title: "Sheet Mask — Day 2",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Your skin might look particularly glowy this morning — that's the sheet mask effect."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Morning serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect the glow."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "mask",
          product: "Sheet Mask (hydrating or brightening)",
          duration: "15–20 minutes",
          instructions: "Second sheet mask. Your skin is well-prepared now — it will absorb the essence deeply."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Seal over the mask essence."
        }
      ],
      tip: "Two consecutive nights of sheet masking is what K-beauty calls focused treatment. Your skin is getting a significant hydration and ingredient boost. People around you may start asking what you've been doing differently.",
      avoid: [
        "Using the same sheet mask brand if your skin reacted — rotate brands",
        "Pressing too hard when applying the mask — lay it gently",
        "Over-moisturising after the mask — the essence is rich enough, you only need a light layer",
        "Touching your face repeatedly after the mask instead of pressing gently"
      ],
      imageKey: "natural"
    },

    {
      day: 24,
      week: 4,
      phase: "Mastery",
      title: "Sheet Mask — Day 3 (Final)",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Vitamin C."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Final sheet mask night — set the mood. This is self-care."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "mask",
          product: "Sheet Mask (hydrating or brightening)",
          duration: "15–20 minutes",
          instructions: "Final mask of the series — put your phone down, lie flat, breathe. 15–20 minutes. Remove and press remaining essence in gently."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock in everything. Days 25–30 are your final push."
        }
      ],
      tip: "After 3 nights of sheet masking, your skin will be at its most hydrated and supple of the entire 30 days. This is peak preparation. The last 6 days are about maintenance and setting up your routine for life beyond Day 30.",
      avoid: [
        "Thinking sheet masks are only for special occasions — use monthly to maintain results",
        "Buying cheap masks with alcohol and parabens as main ingredients",
        "Over-treating in the next few days — your skin needs to settle",
        "Comparing yourself to filtered social media skin — your real glow is better"
      ],
      imageKey: "natural"
    },

    {
      day: 25,
      week: 4,
      phase: "Mastery",
      title: "Managing Breakouts — Know Your Skin",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "If you have active breakouts, be extra gentle in those areas. Light pressure, not scrubbing."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "The toner helps keep pores clear — important for breakout prevention."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Apply everywhere except directly over broken-skin spots."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Moisturise even oily or breakout-prone skin — skipping moisturiser makes skin produce more oil."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Especially important if you have dark spots from past breakouts — sun makes post-acne marks darker."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Extra careful cleanse around any active spots — don't press or pop."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "The clarifying effect helps overnight."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Niacinamide is excellent for breakout-prone skin — it reduces sebum production and calms inflammation."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lighter application over breakout areas, normal elsewhere."
        }
      ],
      tip: "Breakouts during a skincare programme are normal — and often a sign that skin is detoxing and adjusting. The rules: never pop, never pick, keep the area clean and moisturised. Picking creates a scar that takes months to fade. The spot alone takes days.",
      avoid: [
        "Popping or squeezing spots — the bacteria spreads, it worsens, it scars",
        "Drying out a spot with lemon juice or toothpaste — both damage skin",
        "Over-washing breakout areas — twice a day maximum",
        "Panicking and changing your whole routine because of one or two breakouts"
      ],
      imageKey: "morning"
    },

    {
      day: 26,
      week: 4,
      phase: "Mastery",
      title: "Breakout Recovery",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Gentle morning cleanse. Any breakout from yesterday should be calmer today."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Gently."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Morning Vitamin C — avoid broken-skin spots."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Keep skin balanced."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect post-spot areas — sun makes marks permanent."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Balance."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Niacinamide overnight to reduce inflammation and prevent new breakouts."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock in overnight repair."
        }
      ],
      tip: "After a breakout, the dark mark it leaves (post-inflammatory hyperpigmentation) can feel discouraging. With SPF and Vitamin C applied consistently, that mark will fade significantly faster. Your routine is the treatment.",
      avoid: [
        "Looking at the spot in a magnifying mirror 10 times a day — it creates anxiety and leads to picking",
        "Using harsh scrubs on healing skin",
        "Changing your entire routine because of one breakout",
        "Giving up on the products — breakouts during a routine overhaul are transitional"
      ],
      imageKey: "morning"
    },

    {
      day: 27,
      week: 4,
      phase: "Mastery",
      title: "Skin Recovery + Resilience",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Morning Vitamin C — 3 days until the finish line."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Final sprint — this step never stops."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "27 nights of niacinamide. Your skin tone has changed."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Three more nights. You've got this."
        }
      ],
      tip: "Your skin is resilient. It bounced back from the Lagos sun, the dust, the stress, the late nights — and it kept glowing because you kept showing up. This routine has made your skin stronger, not just prettier. That's the difference between skincare and self-care.",
      avoid: [
        "Slacking in the final stretch — these last days matter",
        "Going back to old habits",
        "Not planning what happens on Day 31 — your routine doesn't stop at 30",
        "Being too hard on yourself about any days you may have missed"
      ],
      imageKey: "natural"
    },

    {
      day: 28,
      week: 4,
      phase: "Mastery",
      title: "Build YOUR Personalised Routine",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Morning serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Protect."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Night serum."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock in for overnight repair."
        }
      ],
      tip: "Today, design YOUR routine. Which steps felt most important? What did your skin love? What can you realistically keep up on a busy morning? A routine you actually do is infinitely more powerful than a perfect routine you skip.",
      avoid: [
        "Designing a routine so complex you can't maintain it",
        "Dropping SPF from your routine — this one is non-negotiable for life",
        "Creating a 'busy day' shortcut routine that skips core steps",
        "Not writing it down — you'll forget the specifics"
      ],
      specialNote: "BUILD YOUR ROUTINE: Write down your 3 non-negotiables (must-do every day), your 3 enhancement steps (when you have time), and one monthly treatment (turmeric mask, sheet mask, or ice therapy). This is YOUR skincare recipe for life.",
      imageKey: "products"
    },

    {
      day: 29,
      week: 4,
      phase: "Mastery",
      title: "The Eve of Day 30",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Morning cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Second to last morning serum of the programme."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Hydrate."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Last full day of the programme. Make it count."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Evening cleanse."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep for one final sleep of the programme."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "Your 29th night serum. Tomorrow is Day 30."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Sleep well. Tomorrow you celebrate."
        }
      ],
      tip: "Tomorrow, take your Day 30 photos in the exact same conditions as Day 1 — same lighting, same angles, same time of day if possible. The transformation you'll see isn't just about the products. It's about showing up for yourself, consistently, for 30 days straight.",
      avoid: [
        "Trying a new product tonight — you want your skin at its very best for tomorrow's photos",
        "Late night, alcohol, or salty food — they cause puffiness and dullness",
        "Forgetting to charge your phone for the Day 30 photos",
        "Not taking a moment to feel proud of what you've accomplished"
      ],
      imageKey: "natural"
    },

    {
      day: 30,
      week: 4,
      phase: "Mastery",
      title: "Day 30 — You Glowed Up",
      morning: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Your final Day 30 morning cleanse. Same cool water, same gentle circles, same thorough rinse. You've done this 30 times. It's yours now."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep your glowing skin."
        },
        {
          step: "serum",
          product: "Vitamin C Serum",
          duration: "1 minute",
          instructions: "Morning Vitamin C — your faithful partner for 21 days."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Upward strokes. You know this by heart."
        },
        {
          step: "sunscreen",
          product: "Sunscreen SPF 50",
          duration: "1 minute",
          instructions: "Always. Forever. This step never ends — Day 31, Day 100, Day 365."
        }
      ],
      night: [
        {
          step: "cleanse",
          product: "Vitamin C Face Wash",
          duration: "2 minutes",
          instructions: "Your 30th evening cleanse. Take your time tonight."
        },
        {
          step: "tone",
          product: "Hydrating Toner",
          duration: "30 seconds",
          instructions: "Prep."
        },
        {
          step: "serum",
          product: "Niacinamide Serum",
          duration: "1 minute",
          instructions: "30 nights of this serum working on your skin tone. The results speak for themselves."
        },
        {
          step: "moisturize",
          product: "Moisturising Lotion",
          duration: "1 minute",
          instructions: "Lock it all in. Day 31 starts tomorrow — and you already know exactly what to do."
        }
      ],
      tip: "THIRTY DAYS. You did it. Look at your before and after photos. Look at what consistent, simple care does for your skin. Now the real test: Day 31. And Day 32. This routine is yours for life — not because a programme told you, but because you chose yourself every single morning and evening for 30 days straight. That habit is who you are now.",
      avoid: [
        "Stopping the routine because the programme is over — this was training, not a temporary fix",
        "Abandoning SPF because you finished the guide",
        "Going back to harsh, stripping products",
        "Forgetting to take your after photos!"
      ],
      specialNote: "CELEBRATION! Take your Day 30 photos — front, left side, right side — in the same lighting as Day 1. Share your journey with us on Instagram @_its.g.o.o.d.i.e or WhatsApp 08063214942. You earned this. The glow is real, and so is the person who earned it. Welcome to the other side.",
      hasPhotoPrompt: true,
      imageKey: "morning"
    }

  ] // end days[]

}; // end content

// Expose as global so the app can access it without ES module imports.
// This lets the app work when opened directly via file:// in the browser.
window.GoodieContent = content;
